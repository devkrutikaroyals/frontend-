import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from '@supabase/supabase-js';
import axios from "axios";
import { jwtDecode } from 'jwt-decode'; // ✅ Correct for named export



import {
  FaBars, FaChartPie, FaBox, FaSignOutAlt, FaTruck,
  FaCogs, FaClipboardList, FaEdit, FaTrash, FaPlus,
  FaVideo, FaSearch, FaFilter, FaTimes, FaCheck, FaTimesCircle,
  FaInfoCircle, FaFilePdf, FaFileArchive, FaReply, FaStar, FaStarHalfAlt, FaRegStar
} from "react-icons/fa";
import { FaExchangeAlt } from 'react-icons/fa';

import logo from "../images/logo.jpg";
import "../styles/ManufacturerDashboard.css";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

const SUPABASE_URL = 'https://ddnmqzlxzwiydiklqach.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkbm1xemx4endpeWRpa2xxYWNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MjYyOTgsImV4cCI6MjA2MzMwMjI5OH0.D0YMTuSU_5mpH5LlphlL25Da3b9H1TBHi9LL1FrOdm4';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ManufacturerDashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [orders, setOrders] = useState([]);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [jsonData, setJsonData] = useState(null);
  const [updatingStocks] = useState({});
  const [returns, setReturns] = useState([]);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnAction, setReturnAction] = useState('');
  const [returnNotes, setReturnNotes] = useState('');


  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    location: "",
    company: "",
    size: "",
    videoUrl: "",
    imageUrl: "",
    imageFile: null,
    videoFile: null,
    returnPolicy: "no"
  });

  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    totalOrders: 0,
    recentOrders: [],
  });

  const orderStatuses = ['Order Placed', 'processing', 'out for delivery', 'delivered', 'cancelled'];

  const orderStatusColors = {
    'Order Placed': 'orange',
    'processing': 'purple',
    'out for delivery': 'teal',
    'delivered': 'green',
    'cancelled': 'red'
  };

  const categories = [
    "Cardiac Equipment",
    "Consumables",
    "Diabetes Care",
    "Diagnostic",
    "Diagnostic Equipment",
    "Emergency Equipment",
    "Furniture",
    "ICU",
    "Imaging Equipment",
    "Infusion Devices",
    "Infusion Equipment",
    "Mobility",
    "Mobility Aids",
    "Mobility Equipment",
    "Monitoring Devices",
    "Monitoring Equipment",
    "Optho",
    "Ortho",
    "Orthopedic Equipment",
    "Physiotherapy",
    "Protective Gear",
    "Respiratory Care",
    "Respiratory Equipment",
    "Surgical",
  ];

  const locations = [
    "Nagpur",
    "Amravati",
    "Mumbai",
    "Pune",
    "Aurangabad",
    "Nashik",
    "Thane",
    "Bhopal",
    "Indore",
    "Gwalior",
    "Jabalpur",
  ];



  const renderReturnStatusBadge = (status) => {
    const statusColors = {
      requested: 'orange',
      processing: 'blue',
      approved: 'teal',
      rejected: 'red',
      refunded: 'green',
      completed: 'purple'
    };

    const color = statusColors[status] || 'gray';

    return (
      <span
        className="status-badge"
        style={{ backgroundColor: color }}
      >
        {status.toUpperCase()}
      </span>
    );
  };

  const renderStatusBadge = (status) => {
    const color = orderStatusColors[status] || 'gray';
    return (
      <span
        className="status-badge"
        style={{ backgroundColor: color }}
      >
        {status.toUpperCase()}
      </span>
    );
  };

  const navigate = useNavigate();

  useEffect(() => {
    const fetchManufacturerEmail = async () => {
      try {
        const token = getToken();
        const response = await axios.get("https://grammerly-backend.onrender.com/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmail(response.data.email || "");
      } catch (error) {
        console.error("Error fetching manufacturer email:", error);
      }
    };

    fetchManufacturerEmail();

    if (activePage === "products") {
      fetchProducts();
    } else if (activePage === "orders") {
      fetchOrders();
    } else if (activePage === "dashboard") {
      fetchDashboardData();
    } else if (activePage === "returns") {
      fetchReturns();
    }
  }, [activePage]);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, filterCategory, filterLocation]);

  const getToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      throw new Error("No authentication token found");
    }
    return token;
  };


  const fetchReturns = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('order_returns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setReturns(data || []);
    } catch (error) {
      console.error("Error fetching returns:", error);
      setReturns([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`https://grammerly-backend.onrender.com/api/products/fmanufacturer?t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setProducts(response.data.products || []);
      console.log(response.data)
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [productsResponse, { data: allOrders }] = await Promise.all([
        axios.get(`https://grammerly-backend.onrender.com/api/products/fmanufacturer?t=${Date.now()}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        }),
        supabase
          .from('product_order')
          .select('*')
          .order('created_at', { ascending: false })
      ]);

      // 🛠️ Check what actual fields exist on your products
      const products = productsResponse.data.products || [];
      console.log("Raw Products:", products);

      // ✅ Fix: use the correct key (likely 'id', not '_id')
const manufacturerProductIds = products.map(p => String(p.id).trim().toLowerCase()).filter(Boolean);      console.log("Manufacturer Product IDs:", manufacturerProductIds);
const relevantOrders = allOrders.filter(order => {
  let items = [];
  if (order.ordered_items_text) {
    try {
      const parsed = JSON.parse(order.ordered_items_text);
      items = Array.isArray(parsed.ordered_items) ? parsed.ordered_items : [];
    } catch {
      items = [];
    }
  }
  console.log("Order", order.id, "items", items);
  if (!Array.isArray(items)) return false;
  return items.some(item =>
    manufacturerProductIds.includes(String(item.product_id).trim().toLowerCase())
  );
});
      console.log("Filtered Orders:", relevantOrders);

      const recentRelevantOrders = relevantOrders.slice(0, 5);

      setDashboardData({
        totalProducts: manufacturerProductIds.length,
        totalOrders: relevantOrders.length,
        recentOrders: recentRelevantOrders,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

const fetchOrders = async () => {
  setIsLoading(true);
  try {
    const productsResponse = await axios.get(
      `https://grammerly-backend.onrender.com/api/products/fmanufacturer?t=${Date.now()}`,
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );

    const manufacturerProductIds = productsResponse.data.products
      .map(p => (p._id || p.id)?.toString().trim().toLowerCase())
      .filter(Boolean);

    const { data: rawOrders, error } = await supabase
      .from('product_order')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const filteredOrders = rawOrders.filter(order => {
      let items = [];
      if (order.ordered_items_text) {
        try {
          const parsed = JSON.parse(order.ordered_items_text);
          items = Array.isArray(parsed.ordered_items) ? parsed.ordered_items : [];
        } catch {
          items = [];
        }
      }
      if (!Array.isArray(items)) return false;
      return items.some(item =>
        manufacturerProductIds.includes(String(item.product_id).trim().toLowerCase())
      );
    });

    setOrders(filteredOrders || []);
  } catch (error) {
    console.error("Error fetching orders:", error);
    setOrders([]);
  } finally {
    setIsLoading(false);
  }
};


  const generateReturnPDF = (returnItem) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(40, 53, 147);
    doc.text('NewMedizon - Return Invoice', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`Return ID: ${returnItem.id}`, 14, 30);
    doc.text(`Order ID: ${returnItem.order_id}`, 14, 40);
    doc.text(`Customer Email: ${returnItem.user_email}`, 14, 50);
    doc.text(`Status: ${returnItem.status.toUpperCase()}`, 14, 60);
    doc.text(`Request Date: ${new Date(returnItem.created_at).toLocaleDateString()}`, 14, 70);

    if (returnItem.processed_at) {
      doc.text(`Processed Date: ${new Date(returnItem.processed_at).toLocaleDateString()}`, 14, 80);
    }

    if (returnItem.refund_amount) {
      doc.text(`Refund Amount: ₹${returnItem.refund_amount}`, 14, 90);
    }

    doc.setFontSize(14);
    doc.text('Return Reason:', 14, 100);
    doc.setFontSize(12);
    doc.text(returnItem.return_reason, 20, 110);

    if (returnItem.detailed_reason) {
      doc.text('Detailed Reason:', 14, 120);
      const splitText = doc.splitTextToSize(returnItem.detailed_reason, 180);
      doc.text(splitText, 20, 130);
    }

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(
      'Thank you for your business!',
      14,
      doc.internal.pageSize.height - 20
    );

    doc.save(`NewMedizon_Return_${returnItem.id}.pdf`);
  };

  const filterProducts = () => {
    let result = [...products];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(product => {
        const name = product.name ? product.name.toLowerCase() : '';
        const company = product.company ? product.company.toLowerCase() : '';
        const description = typeof product.description === 'string'
          ? product.description.toLowerCase()
          : '';

        return (
          name.includes(term) ||
          company.includes(term) ||
          description.includes(term)
        );
      });
    }

    if (filterCategory) {
      result = result.filter(product => product.category === filterCategory);
    }

    if (filterLocation) {
      result = result.filter(product => product.location === filterLocation);
    }

    setFilteredProducts(result);
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setFilteredProducts(sortedProducts);
  };



  // const addNewProduct = async (e) => {
  //   e.preventDefault();

  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     alert("No authentication token found. Please log in again.");
  //     navigate("/login");
  //     return;
  //   }

  //   if (
  //     !formValues.name ||
  //     !formValues.stock ||
  //     !formValues.category ||
  //     !formValues.location ||
  //     !formValues.company
  //   ) {
  //     alert("Please fill all required fields");
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append("name", formValues.name);
  //   formData.append("description", formValues.description || "");
  //   formData.append("price", formValues.price || "");
  //   formData.append("category", formValues.category);
  //   formData.append("stock", formValues.stock);
  //   formData.append("location", formValues.location);
  //   formData.append("company", formValues.company);
  //   formData.append("size", formValues.size || "");
  //   formData.append("returnPolicy", formValues.returnPolicy || "");

  //   if (formValues.imageFile instanceof File) {
  //     formData.append("imageFile", formValues.imageFile);
  //   }

  //   if (formValues.videoFile instanceof File) {
  //     formData.append("videoFile", formValues.videoFile);
  //   }

  //   try {
  //     setIsLoading(true);
  //     const response = await axios.post(
  //       "https://grammerly-backend.onrender.com/api/products/addProduct",
  //       formData,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );

  //     if (response.status === 201) {
  //       alert("Product added successfully!");
  //       fetchProducts();
  //       closeModal();
  //     }
  //   } catch (error) {
  //     console.error("Error adding product:", error.response?.data);
  //     alert(error.response?.data?.message || "Error adding product");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };


  const addNewProduct = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to add products");
      navigate("/login");
      return;
    }

    // Validate required fields
    const requiredFields = ['name', 'stock', 'category', 'location', 'company'];
    const missingFields = requiredFields.filter(field => !formValues[field]);

    if (missingFields.length > 0) {
      alert(`Please fill all required fields: ${missingFields.join(', ')}`);
      return;
    }

    const formData = new FormData();

    // Append all product data
    Object.entries(formValues).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    try {
      setIsLoading(true);
      const response = await axios.post(
        "https://grammerly-backend.onrender.com/api/products/addProduct",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        alert("Product added successfully!");
        fetchProducts();
        closeModal();
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert(error.response?.data?.message || "Error adding product");
    } finally {
      setIsLoading(false);
    }
  };


  const editExistingProduct = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("No authentication token found. Please log in again.");
      navigate("/login");
      return;
    }

    if (
      !formValues.name ||
      !formValues.stock ||
      !formValues.category ||
      !formValues.location ||
      !formValues.company
    ) {
      alert("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", formValues.name);
    formData.append("description", formValues.description || "");
    formData.append("price", formValues.price || "");
    formData.append("category", formValues.category);
    formData.append("stock", formValues.stock);
    formData.append("location", formValues.location);
    formData.append("company", formValues.company);
    formData.append("size", formValues.size || "");
    formData.append("returnPolicy", formValues.returnPolicy || "");

    if (formValues.imageFile instanceof File) {
      formData.append("imageFile", formValues.imageFile);
    }

    if (formValues.videoFile instanceof File) {
      formData.append("videoFile", formValues.videoFile);
    }

    const decoded = jwtDecode(token);
    const userId = decoded.sub || decoded.userId || decoded.id;
    formData.append("manufacturer_id", userId);

    try {
      setIsLoading(true);
      const response = await axios.put(
        `https://grammerly-backend.onrender.com/api/products/${editProduct.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        alert("Product updated successfully!");
        fetchProducts();
        closeModal();
      }
    } catch (error) {
      console.error("Error editing product:", error.response?.data);
      alert(error.response?.data?.message || "Error editing product");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!id) {
      alert("Invalid product ID!");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      setIsLoading(true);

      await axios.delete(`https://grammerly-backend.onrender.com/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      alert("Product deleted successfully!");
      await fetchProducts(); // Refresh the product list
    } catch (error) {
      console.error("Error deleting product:", error.response?.data || error.message);
      alert("Error deleting product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };



  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      setIsLoading(true);

      // Fetch current order details from Supabase
      const { data: currentOrder, error: fetchError } = await supabase
        .from('product_order')
        .select('*')
        .eq('id', orderId)
        .single();

      if (fetchError) throw fetchError;
      if (!currentOrder) throw new Error('Order not found');

      // If status is same, no need to update
      if (currentOrder.status === newStatus) {
        alert(`Order is already in "${newStatus}" status.`);
        return;
      }

      // Update stock based on status change
      if (newStatus === 'cancelled' && currentOrder.status !== 'cancelled') {
        // Restore stock - add quantities back
        await Promise.all(
          currentOrder.items.map(async (item) => {
            try {
              await axios.put(
                `https://grammerly-backend.onrender.com/api/products/update-stock/${item.product_id}`,
                { quantity: item.quantity }, // positive quantity to restore
                { headers: { Authorization: `Bearer ${getToken()}` } }
              );
            } catch (error) {
              console.error(`Failed to restore stock for product ${item.product_id}:`, error);
              // Log error but don't fail whole update
            }
          })
        );
      } else if (newStatus === 'processing' && currentOrder.status.toLowerCase() === 'order placed') {
        // Reduce stock - subtract quantities
        await Promise.all(
          currentOrder.items.map(async (item) => {
            try {
              const response = await axios.put(
                `https://grammerly-backend.onrender.com/api/products/update-stock/${item.product_id}`,
                { quantity: -item.quantity }, // negative quantity to reduce stock
                { headers: { Authorization: `Bearer ${getToken()}` } }
              );

              if (!response.data.success) {
                throw new Error(response.data.message || 'Stock update failed');
              }
            } catch (error) {
              console.error(`Failed to reduce stock for product ${item.product_id}:`, error);
              throw new Error(`Failed to process order: ${error.message}`);
            }
          })
        );
      }

      // Update order status in Supabase
      const { error } = await supabase
        .from('product_order')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      // Refresh UI data
      await fetchProducts();
      await fetchOrders();
      if (activePage === 'dashboard') await fetchDashboardData();

      alert(`Order status updated to "${newStatus}"`);
    } catch (error) {
      console.error('Status change failed:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };


  const handleReturnStatusUpdate = async (returnId, newStatus) => {
    try {
      setIsLoading(true);

      const updates = {
        status: newStatus,
        processed_at: new Date().toISOString(),
        notes: returnNotes
      };

      if (newStatus === 'refunded') {
        updates.refund_amount = selectedReturn?.refund_amount || 0;
        updates.refund_date = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('order_returns')
        .update(updates)
        .eq('id', returnId)
        .select();

      if (error) throw error;

      if (newStatus === 'approved') {
        const { data: orderData, error: orderError } = await supabase
          .from('product_order')
          .select('items')
          .eq('id', selectedReturn.order_id)
          .single();

        if (!orderError && orderData.items) {
          for (const item of orderData.items) {
            await axios.put(
              `https://grammerly-backend.onrender.com/api/products/update-stock/${item.product_id}`,
              { quantity: item.quantity },
              {
                headers: {
                  Authorization: `Bearer ${getToken()}`,
                  'Content-Type': 'application/json'
                }
              }
            );
          }
        }
      }

      alert(`Return status updated to ${newStatus}`);
      setShowReturnModal(false);
      await fetchReturns();
    } catch (error) {
      console.error('Error updating return status:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

const generateOrderPDF = (order) => {
  const doc = new jsPDF();

  // ...existing code for headers...

  // Parse items from ordered_items_text
  let items = [];
  if (order.ordered_items_text) {
    try {
      const parsed = JSON.parse(order.ordered_items_text);
      items = Array.isArray(parsed.ordered_items) ? parsed.ordered_items : [];
    } catch {
      items = [];
    }
  }

  if (items.length > 0) {
    const headers = [
      { header: 'No.', dataKey: 'index', width: 10 },
      { header: 'Product', dataKey: 'name', width: 70 },
      { header: 'Unit Price (₹)', dataKey: 'price', width: 30 },
      { header: 'Qty', dataKey: 'quantity', width: 20 },
      { header: 'Total (₹)', dataKey: 'total', width: 30 }
    ];

    const tableData = items.map((item, index) => ({
      index: index + 1,
      name: item.product_name || item.name || 'N/A',
      price: item.price ? item.price.toFixed(2) : '0.00',
      quantity: item.quantity || 0,
      total: (item.price * item.quantity).toFixed(2)
    }));

    const subtotal = order.total_amount;
    const tax = 0;
    const grandTotal = subtotal + tax;

    tableData.push({
      index: '',
      name: '',
      price: 'SUBTOTAL',
      quantity: '',
      total: subtotal.toFixed(2)
    });

    if (tax > 0) {
      tableData.push({
        index: '',
        name: '',
        price: 'TAX',
        quantity: '',
        total: tax.toFixed(2)
      });
    }

    tableData.push({
      index: '',
      name: '',
      price: 'GRAND TOTAL',
      quantity: '',
      total: grandTotal.toFixed(2)
    });

    autoTable(doc, {
      startY: 100,
      head: [headers.map(h => h.header)],
      body: tableData.map(row => headers.map(h => row[h.dataKey])),
      theme: 'grid',
      // ...existing autoTable options...
    });
  }

  // ...rest of your PDF code...
  doc.save(`Invoice_${order.id}.pdf`);
};
  const generateAllOrdersPDF = () => {
    if (orders.length === 0) {
      alert("No orders available to download");
      return;
    }

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm'
    });

    const primaryColor = [40, 53, 147];
    const secondaryColor = [100, 100, 100];
    const margin = 15;

    doc.setFontSize(18);
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text(' ORDERS REPORT', doc.internal.pageSize.width / 2, margin, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(...secondaryColor);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${new Date().toLocaleString()}`, margin, margin + 10);
    doc.text(`Total Orders: ${orders.length}`, doc.internal.pageSize.width - margin, margin + 10, { align: 'right' });

    const columns = [
      { header: 'ORDER ID', dataKey: 'id', width: 20 },
      { header: 'DATE', dataKey: 'date', width: 20 },
      { header: 'CUSTOMER', dataKey: 'customer', width: 30 },
      { header: 'EMAIL', dataKey: 'email', width: 40 },
      { header: 'STATUS', dataKey: 'status', width: 25 },
      { header: 'AMOUNT (₹)', dataKey: 'amount', width: 25 },
      { header: 'PAYMENT', dataKey: 'payment', width: 25 },
      { header: 'items', dataKey: 'items', width: 15 }
    ];

    const tableData = orders.map(order => ({
      id: order.id.toString(),
      date: new Date(order.created_at).toLocaleDateString(),
      customer: order.full_name || 'N/A',
      email: order.email || 'N/A',
      status: order.status.toUpperCase(),
      amount: order.total_amount.toFixed(2),
      payment: order.payment_method || 'N/A',
      items: order.ordered_items ? order.ordered_items.length.toString() : '0'
    }));

    autoTable(doc, {
      startY: margin + 20,
      head: [columns.map(col => col.header)],
      body: tableData.map(row => columns.map(col => row[col.dataKey])),
      theme: 'grid',
      headStyles: {
        fillColor: primaryColor,
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 9,
        cellPadding: 4,
        halign: 'center'
      },
      bodyStyles: {
        fontSize: 8,
        cellPadding: 3,
        textColor: [0, 0, 0],
        lineColor: [200, 200, 200],
        lineWidth: 0.2
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: columns.reduce((styles, col) => {
        styles[col.header] = {
          cellWidth: col.width,
          halign: col.dataKey === 'amount' ? 'right' : 'left'
        };
        return styles;
      }, {}),
      margin: { horizontal: margin },
      pageBreak: 'auto',
      styles: {
        overflow: 'linebreak',
        minCellHeight: 8
      },
      didDrawPage: function (data) {
        doc.setFontSize(8);
        doc.setTextColor(...secondaryColor);
        doc.text(
          `Page ${data.pageCount} of ${data.pageNumber}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }
    });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    doc.save(`Payment Recieved_${timestamp}.pdf`);
  };



  const openModal = (product = null) => {
    if (product) {
      // Edit mode: भरलेला फॉर्म
      setFormValues({
        name: product.name || "",
        company: product.company || "",
        description: product.description || "",
        price: product.price || "",
        category: product.category || "",
        stock: product.stock || "",
        location: product.location || "",
        size: product.size || "",
        returnPolicy: product.returnPolicy || "no",
        imageUrl: product.image_url || "",
        videoUrl: product.video_url || "",
        imageFile: null,
        videoFile: null,
      });
      setEditProduct(product);  // edit mode चालू करा
    } else {
      // Add mode: रिकामे फॉर्म
      setFormValues({
        name: "",
        company: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        location: "",
        size: "",
        returnPolicy: "no",
        imageUrl: "",
        videoUrl: "",
        imageFile: null,
        videoFile: null,
      });
      setEditProduct(null);  // add mode चालू करा
    }
    setIsModalOpen(true);
  };


  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormValues({
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "",
      location: "",
      company: "",
      size: "",
      videoUrl: "",
      imageUrl: "",
      imageFile: null,
      videoFile: null,
      returnPolicy: "no"
    });
    setEditProduct(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (e.target.name === "imageFile") {
        const previewUrl = URL.createObjectURL(file);
        setFormValues(prev => ({
          ...prev,
          imageFile: file,
          imageUrl: previewUrl
        }));
      } else if (e.target.name === "videoFile") {
        const previewUrl = URL.createObjectURL(file);
        setFormValues(prev => ({
          ...prev,
          videoFile: file,
          videoUrl: previewUrl
        }));
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("manufacturerId");
    navigate("/login");
  };

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      setIsLoading(true);
      const token = getToken();
      const response = await axios.put(
        "https://grammerly-backend.onrender.com/api/auth/update-password",
        { email, oldPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage(response.data.message);
      setTimeout(() => {
        localStorage.removeItem("token");
        navigate("/login");
      }, 2000);
    } catch (error) {
      setMessage("");
      setError(error.response?.data?.message || "Error updating password.");
    } finally {
      setIsLoading(false);
    }
  };

  const openVideoModal = (videoUrl) => {
    setCurrentVideoUrl(videoUrl);
    setShowVideoModal(true);
  };

  const closeVideoModal = () => {
    setShowVideoModal(false);
    setCurrentVideoUrl("");
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterCategory("");
    setFilterLocation("");
  };

  const showProductDetails = (product) => {
    const descriptionData = {
      description: product.description
    };
    setJsonData(descriptionData);
    setShowJsonModal(true);
  };

  const showOrderItemDetails = (item) => {
    setJsonData(item);
    setShowJsonModal(true);
  };

  return (
    <div className="dashboard-container">
      <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-logo">
          <img src={logo} alt="Company Logo" />
        </div>
        <button className="toggle-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
          <FaBars />
        </button>
        <ul>
          <li className={activePage === "dashboard" ? "active" : ""} onClick={() => setActivePage("dashboard")}>
            <FaChartPie />
            {!isCollapsed && <span>Dashboard</span>}
          </li>
          <li className={activePage === "products" ? "active" : ""} onClick={() => setActivePage("products")}>
            <FaBox />
            {!isCollapsed && <span>Products</span>}
          </li>
          <li className={activePage === "orders" ? "active" : ""} onClick={() => setActivePage("orders")}>
            <FaClipboardList />
            {!isCollapsed && <span>Orders</span>}
          </li>
          <li className={activePage === "returns" ? "active" : ""} onClick={() => setActivePage("returns")}>
            <FaReply />
            {!isCollapsed && <span>Returns</span>}
          </li>

          <li className={activePage === "settings" ? "active" : ""} onClick={() => setActivePage("settings")}>
            <FaCogs />
            {!isCollapsed && <span>Settings</span>}
          </li>
        </ul>
        <button className="logout-btn-manuf" onClick={handleLogout}>
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>

      <div className={`content ${isCollapsed ? "collapsed" : ""}`}>
        <div className="header">
          <h1>Manufacturer Dashboard</h1>
          {isLoading && <div className="loading-overlay">Loading...</div>}
        </div>

        {activePage === "dashboard" && (
          <div className="dashboard-page">
            <h2 className="page-header">Dashboard Overview</h2>
            <div className="dashboard-cards">
              <div className="card">
                <h3>Total Orders</h3>
                <p>{dashboardData.totalOrders}</p>

                <div
                  className="view-all-btn"
                  onClick={() => setActivePage("orders")}
                >
                  View All
                </div>
              </div>
              <div className="card">
                <h3>Total Products</h3>
                <p>{dashboardData.totalProducts}</p>
                <div
                  className="view-all-btn"
                  onClick={() => setActivePage("products")}
                >
                  View All
                </div>
              </div>
            </div>

            <div className="recent-orders-section">
              <h3>Recent Orders</h3>
              {dashboardData.recentOrders?.length > 0 ? (
                <table className="recent-orders-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.recentOrders.map(order => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.full_name}</td>
                        <td>₹{order.total_amount}</td>
                        <td>{renderStatusBadge(order.status || 'Order Placed')}</td>
                        <td>{new Date(order.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}

                  </tbody>
                </table>
              ) : (
                <p>No recent orders</p>
              )}
            </div>
          </div>
        )}

        {activePage === "products" && (
          <div className="products-container">
            <div className="products-header">
              <h2>Products</h2>
              <div>
                <button className="add-product-btn" onClick={() => openModal()}>
                  <FaPlus /> Add Product
                </button>
              </div>
            </div>

            <div className="products-controls">
              <div className="search-box">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <FaTimes
                    className="clear-search"
                    onClick={() => setSearchTerm("")}
                  />
                )}
              </div>

              <div className="filter-controls">
                <div className="filter-group">
                  <FaFilter className="filter-icon" />
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <FaFilter className="filter-icon" />
                  <select
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                  >
                    <option value="">All Locations</option>
                    {locations.map((location, index) => (
                      <option key={index} value={location}>{location}</option>
                    ))}
                  </select>
                </div>

                {(filterCategory || filterLocation) && (
                  <button
                    className="clear-filters-btn"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            <div className="table-responsive">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Video</th>
                    <th onClick={() => requestSort('name')}>
                      Name {sortConfig.key === 'name' && (
                        sortConfig.direction === 'asc' ? '↑' : '↓'
                      )}
                    </th>
                    <th onClick={() => requestSort('company')}>
                      Company {sortConfig.key === 'company' && (
                        sortConfig.direction === 'asc' ? '↑' : '↓'
                      )}
                    </th>
                    <th>Description</th>
                    <th onClick={() => requestSort('price')}>
                      Price {sortConfig.key === 'price' && (
                        sortConfig.direction === 'asc' ? '↑' : '↓'
                      )}
                    </th>
                    <th>Category</th>
                    <th onClick={() => requestSort('stock')}>
                      Stock {sortConfig.key === 'stock' && (
                        sortConfig.direction === 'asc' ? '↑' : '↓'
                      )}
                    </th>
                    <th>Location</th>
                    <th>Size</th>
                    <th>Return Policy</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <tr key={product._id}>
                        <td>
                          {product.image_url && (
                            <img
                              src={product.image_url || "/placeholder.png"}
                              alt="Product"
                              style={{ width: "100px", height: "100px", objectFit: "cover" }}
                            />

                          )}

                        </td>
                        <td>
                          {product.video_url ? (
                            <button onClick={() => openVideoModal(product.video_url)}>
                              <FaVideo /> View Video
                            </button>
                          ) : (
                            <span>No Video</span>
                          )}



                        </td>
                        <td>{product.name}</td>
                        <td>{product.company}</td>
                        <td
                          className="description-cell clickable"
                          onClick={() => showProductDetails(product)}
                        >
                          {product.description || "No description"}
                          <FaInfoCircle className="info-icon" />
                        </td>
                        <td>₹ {product.price}</td>
                        <td>{product.category}</td>
                        <td>
                          {updatingStocks[product._id] !== undefined ?
                            updatingStocks[product._id] :
                            product.stock}
                        </td>
                        <td>{product.location}</td>
                        <td>{product.size}</td>
                        <td>{product.returnPolicy === 'yes' ? 'Yes' : 'No'}</td>
                        <td className="action-buttons">
                          <button
                            className="action-btn edit-btn"
                            onClick={() => openModal(product)}
                          >
                            <FaEdit />
                          </button>


                          <button
                            className="action-btn delete-btn"
                            onClick={() => deleteProduct(product.id)}
                          >
                            <FaTrash />
                          </button>


                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="11" className="no-data">
                        {products.length === 0
                          ? "No products available. Click 'Add Product' to create one."
                          : "No products match your filters."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>{editProduct ? "Edit Product" : "Add New Product"}</h3>
                <button className="close-modal" onClick={closeModal}>
                  &times;
                </button>
              </div>

              <form onSubmit={editProduct ? editExistingProduct : addNewProduct}>
                {/* Product Name and Company */}
                <div className="form-row">
                  <div className="form-group">
                    <label>Name*</label>
                    <input
                      type="text"
                      name="name"
                      value={formValues.name}
                      onChange={handleInputChange}
                      placeholder="Product Name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Company*</label>
                    <input
                      type="text"
                      name="company"
                      value={formValues.company}
                      onChange={handleInputChange}
                      placeholder="Manufacturer Company"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formValues.description}
                    onChange={handleInputChange}
                    placeholder="Product Description"
                    rows="3"
                  />
                </div>

                {/* Price, Stock, and Size */}
                <div className="form-row">
                  <div className="form-group">
                    <label>Price</label>
                    <input
                      type="number"
                      name="price"
                      value={formValues.price}
                      onChange={handleInputChange}
                      placeholder="Product Price"
                    />
                  </div>
                  <div className="form-group">
                    <label>Stock*</label>
                    <input
                      type="number"
                      name="stock"
                      value={formValues.stock}
                      onChange={handleInputChange}
                      placeholder="Product Stock"
                      required
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label>Size</label>
                    <input
                      name="size"
                      value={formValues.size}
                      onChange={handleInputChange}
                      placeholder="Product Size"
                    />
                  </div>
                </div>

                {/* Category and Location */}
                <div className="form-row">
                  <div className="form-group">
                    <label>Category*</label>
                    <select
                      name="category"
                      value={formValues.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((category, index) => (
                        <option key={index} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Location*</label>
                    <select
                      name="location"
                      value={formValues.location}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select a location</option>
                      {locations.map((location, index) => (
                        <option key={index} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Return Policy */}
                <div className="form-group">
                  <label>Return Policy*</label>
                  <select
                    name="returnPolicy"
                    value={formValues.returnPolicy}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="no">No Return Policy</option>
                    <option value="yes">Has Return Policy</option>
                  </select>
                </div>

                {/* Image and Video Upload */}
                <div className="form-row">
                  {/* Image Upload */}
                  <div className="form-group">
                    <label>Product Image*</label>
                    <input
                      type="file"
                      name="imageFile"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                    {formValues.imageUrl && (
                      <div className="file-preview">
                        <img
                          src={formValues.imageUrl}
                          alt="Preview"
                          className="image-preview"
                        />
                        <button
                          type="button"
                          className="remove-file-btn"
                          onClick={() =>
                            setFormValues((prev) => ({
                              ...prev,
                              imageUrl: "",
                              imageFile: null,
                            }))
                          }
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Video Upload */}
                  <div className="form-group">
                    <label>Product Video/360 View</label>
                    <input
                      type="file"
                      name="videoFile"
                      onChange={handleFileChange}
                      accept="video/*"
                    />
                    {formValues.videoUrl && (
                      <div className="file-preview">
                        <video
                          src={formValues.videoUrl}
                          controls
                          className="video-preview"
                        />
                        <button
                          type="button"
                          className="remove-file-btn"
                          onClick={() =>
                            setFormValues((prev) => ({
                              ...prev,
                              videoUrl: "",
                              videoFile: null,
                            }))
                          }
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="modal-actions">
                  <button type="submit" className="btn-primary" disabled={isLoading}>
                    {isLoading
                      ? "Processing..."
                      : editProduct
                        ? "Save Changes"
                        : "Add Product"}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="btn-secondary"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}


        {showVideoModal && (
          <div className="video-modal-overlay">
            <div className="video-modal">
              <button className="close-video-modal" onClick={closeVideoModal}>
                &times;
              </button>
              <video
                src={currentVideoUrl}
                controls
                autoPlay
                className="fullscreen-video"
              />
            </div>
          </div>
        )}

        {showJsonModal && (
          <div className="modal-overlay">
            <div className="json-modal">
              <div className="modal-header">
                <h3>Full Product Details</h3>
                <button
                  className="close-modal"
                  onClick={() => setShowJsonModal(false)}
                >
                  &times;
                </button>
              </div>
              <div className="json-content">
                <pre>{JSON.stringify(jsonData, null, 2)}</pre>
              </div>
            </div>
          </div>
        )}

        {activePage === "orders" && (
          <div className="orders-container">
            <div className="orders-header">
              <h2>Orders</h2>
              <div>
                <button
                  className="download-all-btn"
                  onClick={generateAllOrdersPDF}
                  disabled={orders.length === 0 || isLoading}
                >
                  <FaFileArchive /> Download All Orders
                </button>
              </div>
            </div>
            <div className="table-responsive">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Full Name</th>
                    <th>Contact</th>
                    <th>Amount</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Address</th>
                    <th>items</th>
                    <th>Date</th>
                    <th>Invoice</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.email}</td>
                        <td>{order.full_name}</td>
                        <td>{order.contact_number}</td>
                        <td>₹{order.total_amount}</td>
                        <td>{order.payment_method}</td>
                        <td>{renderStatusBadge(order.status || 'Order Placed')}</td>
                        <td className="address-cell">
                          {order.address_line1 || order.landmark || order.pin_code ? (
                            <>
                              <div>{order.address_line1}</div>
                              <div>{order.landmark}</div>
                              <div>{order.pin_code}</div>
                            </>
                          ) : (
                            <span>Address not available</span>
                          )}
                        </td>

                       <td className="items-cell">
  {(() => {
    let items = [];
    if (order.ordered_items_text) {
      try {
        const parsed = JSON.parse(order.ordered_items_text);
        items = Array.isArray(parsed.ordered_items) ? parsed.ordered_items : [];
      } catch {
        items = [];
      }
    }
    return items.map((item, index) => (
      <div
        key={index}
        className="clickable-item"
        onClick={() => showOrderItemDetails(item)}
      >
        {item.product_name} (Qty: {item.quantity})
        <FaInfoCircle className="info-icon" />
      </div>
    ));
  })()}
</td>
                        <td>{new Date(order.created_at).toLocaleDateString()}</td>
                        <td>
                          <button
                            className="download-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              generateOrderPDF(order);
                            }}
                          >
                            <FaFilePdf /> PDF
                          </button>
                        </td>
                        <td className="order-actions">
                          {order.status === 'Order Placed' && (
                            <button
                              className="processing-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOrderStatusChange(order.id, 'processing');
                              }}
                              disabled={isLoading}
                            >
                              <FaCheck /> Confirm & Process
                            </button>
                          )}
                          {order.status === 'processing' && (
                            <button
                              className="shipped-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOrderStatusChange(order.id, 'shipped');
                              }}
                              disabled={isLoading}
                            >
                              <FaTruck /> Mark as Shipped
                            </button>
                          )}
                          {order.status === 'shipped' && (
                            <button
                              className="out-for-delivery-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOrderStatusChange(order.id, 'out for delivery');
                              }}
                              disabled={isLoading}
                            >
                              <FaTruck /> Out for Delivery
                            </button>
                          )}
                          {order.status === 'out for delivery' && (
                            <button
                              className="delivered-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOrderStatusChange(order.id, 'delivered');
                              }}
                              disabled={isLoading}
                            >
                              <FaCheck /> Mark as Delivered
                            </button>
                          )}
                          {order.status !== 'cancelled' && order.status !== 'delivered' && (
                            <button
                              className="cancel-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOrderStatusChange(order.id, 'cancelled');
                              }}
                              disabled={isLoading}
                            >
                              <FaTimesCircle /> Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="12" className="no-data">No orders available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}



        {activePage === "returns" && (
          <div className="returns-container">
            <div className="returns-header">
              <h2>Order Returns</h2>
            </div>

            <div className="table-responsive">
              <table className="returns-table">
                <thead>
                  <tr>
                    <th>Return ID</th>
                    <th>Order ID</th>
                    <th>Customer Email</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Request Date</th>
                    <th>Processed Date</th>
                    <th>Refund Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {returns.length > 0 ? (
                    returns.map((returnItem) => (
                      <tr key={returnItem.id}>
                        <td>{returnItem.id}</td>
                        <td
                          className="clickable"
                          onClick={() => {
                            setJsonData(returnItem);
                            setShowJsonModal(true);
                          }}
                        >
                          {returnItem.order_id}
                          <FaInfoCircle className="info-icon" />
                        </td>
                        <td>{returnItem.user_email}</td>
                        <td>{returnItem.return_reason}</td>
                        <td>{renderReturnStatusBadge(returnItem.status)}</td>
                        <td>{new Date(returnItem.created_at).toLocaleDateString()}</td>
                        <td>
                          {returnItem.processed_at ?
                            new Date(returnItem.processed_at).toLocaleDateString() :
                            'Not processed'}
                        </td>
                        <td>
                          {returnItem.refund_amount ?
                            `₹${returnItem.refund_amount}` :
                            'N/A'}
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="action-btn view-btn"
                              onClick={() => {
                                setSelectedReturn(returnItem);
                                setShowReturnModal(true);
                              }}
                            >
                              <FaExchangeAlt />
                              Process
                            </button>
                            <button
                              className="action-btn pdf-btn"
                              onClick={() => generateReturnPDF(returnItem)}
                            >
                              <FaFilePdf /> PDF
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="no-data">
                        No return requests found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {showReturnModal && selectedReturn && (
              <div className="modal-overlay">
                <div className="modal">
                  <div className="modal-header">
                    <h3>Process Return Request</h3>
                    <button
                      className="close-modal"
                      onClick={() => setShowReturnModal(false)}
                    >
                      &times;
                    </button>
                  </div>

                  <div className="return-details">
                    <p><strong>Return ID:</strong> {selectedReturn.id}</p>
                    <p><strong>Order ID:</strong> {selectedReturn.order_id}</p>
                    <p><strong>Customer Email:</strong> {selectedReturn.user_email}</p>
                    <p><strong>Reason:</strong> {selectedReturn.return_reason}</p>
                    <p><strong>Current Status:</strong> {selectedReturn.status}</p>

                    {selectedReturn.detailed_reason && (
                      <div className="detailed-reason">
                        <p><strong>Detailed Reason:</strong></p>
                        <p>{selectedReturn.detailed_reason}</p>
                      </div>
                    )}

                    {selectedReturn.images && selectedReturn.images.length > 0 && (
                      <div className="return-images">
                        <p><strong>Images:</strong></p>
                        <div className="image-grid">
                          {selectedReturn.images.map((img, index) => (
                            <img
                              key={index}
                              src={img}
                              alt={`Return evidence ${index + 1}`}
                              className="return-image"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Action</label>
                    <select
                      value={returnAction}
                      onChange={(e) => setReturnAction(e.target.value)}
                      required
                    >
                      <option value="">Select action</option>
                      <option value="approved">Approve Return</option>
                      <option value="rejected">Reject Return</option>

                    </select>
                  </div>

                  {returnAction === 'refunded' && (
                    <div className="form-group">
                      <label>Refund Amount (₹)</label>
                      <input
                        type="number"
                        value={selectedReturn.refund_amount || ''}
                        onChange={(e) => setSelectedReturn({
                          ...selectedReturn,
                          refund_amount: parseFloat(e.target.value) || 0
                        })}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  )}

                  <div className="form-group">
                    <label>Notes</label>
                    <textarea
                      value={returnNotes}
                      onChange={(e) => setReturnNotes(e.target.value)}
                      placeholder="Add any notes about this return..."
                      rows="3"
                    />
                  </div>

                  <div className="modal-actions">
                    <button
                      className="btn-primary"
                      onClick={() => handleReturnStatusUpdate(
                        selectedReturn.id,
                        returnAction
                      )}
                      disabled={!returnAction || isLoading}
                    >
                      {isLoading ? 'Processing...' : 'Submit'}
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={() => setShowReturnModal(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {activePage === "settings" && (
          <div className="settings-container">
            <h2>Account Settings</h2>
            <div className="settings-form">
              <div className="form-group">
                <label>Email ID</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Old Password</label>
                <input
                  type="password"
                  placeholder="Enter old password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength="6"
                />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength="6"
                />
              </div>
              {message && <p className="success-message">{message}</p>}
              {error && <p className="error-message">{error}</p>}
              <button
                onClick={handlePasswordUpdate}
                disabled={isLoading}
                className="update-password-btn"
              >
                {isLoading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManufacturerDashboard;