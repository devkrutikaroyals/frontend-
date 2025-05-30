

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from '@supabase/supabase-js';
import axios from "axios";
import {
  FaBars, FaChartPie, FaBox, FaSignOutAlt, FaTruck,
  FaCogs, FaClipboardList, FaEdit, FaTrash, FaPlus,
  FaVideo, FaSearch, FaFilter, FaTimes, FaCheck, FaTimesCircle,
  FaInfoCircle, FaSync, FaFilePdf, FaFileArchive, FaReply // <-- Add this
} from "react-icons/fa";
import { FaExchangeAlt } from 'react-icons/fa';

import logo from "../images/logo.jpg";
import "../styles/ManufacturerDashboard.css";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

const SUPABASE_URL = 'https://wxcqhslupuixynbjgncf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4Y3Foc2x1cHVpeHluYmpnbmNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MjYyNjEsImV4cCI6MjA1NzAwMjI2MX0.u6vJb-zV6rFUU3HGpgNgQlmxDZfTgbpDcxTgbmEZeM0';
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
  const [updatingStocks, setUpdatingStocks] = useState({});
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
    returnPolicy: ""
  });

  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    totalOrders: 0,
    recentOrders: [],
  });

  const orderStatuses = ['pending', 'processing', 'shipped', 'out for delivery', 'delivered', 'cancelled'];
  const orderStatusColors = {
    pending: 'orange',
    processing: 'purple',
    shipped: 'blue',
    'out for delivery': 'teal',
    delivered: 'green',
    cancelled: 'red'
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
    "Mumabai",
    "Pune",
    "Aurangabad",
    "Nashik",
    "Thane",
    "Bhopal",
    "Indore",
    "Gwalior",
    "Jabalpur",
  ];


  // Add this new return status badge component
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


  const navigate = useNavigate();

  useEffect(() => {
    const fetchManufacturerEmail = async () => {
      try {
        const token = getToken();
        const response = await axios.get("https://newmedizon.onrender.com/api/auth/me", {
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
      alert("No token found. Please log in again.");
      navigate("/login");
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
      const response = await axios.get("https://newmedizon.onrender.com/api/products/manufacturer?t=${Date.now()}", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setProducts(response.data.products || []);
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
        axios.get("https://newmedizon.onrender.com/api/products/manufacturer?t=${Date.now()}", {
          headers: { Authorization: `Bearer ${getToken()}` },
        }),
        supabase.from('product_order').select('*').order('created_at', { ascending: false }).limit(5)
      ]);

      const manufacturerProductIds = productsResponse.data.products.map(p => p._id);
      const relevantOrders = allOrders.filter(order =>
        order.items && order.items.some(item =>
          manufacturerProductIds.includes(item.product_id)
        )
      );

      setDashboardData({
        totalProducts: productsResponse.data.products.length,
        totalOrders: relevantOrders.length,
        recentOrders: relevantOrders,
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
        "https://newmedizon.onrender.com/api/products/manufacturer?t=${Date.now()}",
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      const manufacturerProductIds = productsResponse.data.products.map(p => p._id);

      const { data, error } = await supabase
        .from('product_order')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const filteredOrders = data.filter(order =>
        order.items && order.items.some(item =>
          manufacturerProductIds.includes(item.product_id)
        )
      );

      setOrders(filteredOrders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };


  // Function to handle return status updates
  const handleReturnStatusUpdate = async (returnId, newStatus) => {
    try {
      setIsLoading(true);

      const updates = {
        status: newStatus,
        processed_at: new Date().toISOString()
      };

      if (newStatus === 'refunded') {
        updates.refund_amount = selectedReturn?.refund_amount || 0;
      }

      const { error } = await supabase
        .from('order_returns')
        .update(updates)
        .eq('id', returnId);

      if (error) throw error;

      // Refresh returns data
      await fetchReturns();

      alert(`Return status updated to ${newStatus}`);
      setShowReturnModal(false);
    } catch (error) {
      console.error('Error updating return status:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to generate return PDF
  const generateReturnPDF = (returnItem) => {
    const doc = new jsPDF();

    // Add logo or title
    doc.setFontSize(18);
    doc.setTextColor(40, 53, 147);
    doc.text('NewMedizon - Return Invoice', 105, 20, { align: 'center' });

    // Return details
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

    // Reason section
    doc.setFontSize(14);
    doc.text('Return Reason:', 14, 100);
    doc.setFontSize(12);
    doc.text(returnItem.return_reason, 20, 110);

    if (returnItem.detailed_reason) {
      doc.text('Detailed Reason:', 14, 120);
      const splitText = doc.splitTextToSize(returnItem.detailed_reason, 180);
      doc.text(splitText, 20, 130);
    }

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(
      'Thank you for your business!',
      14,
      doc.internal.pageSize.height - 20
    );

    // Save the PDF
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

  const saveProduct = async (e) => {
    e.preventDefault();
    if (!formValues.name || !formValues.stock ||
      !formValues.category || !formValues.location || !formValues.company) {
      alert("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", formValues.name);
    formData.append("description", formValues.description);
    formData.append("price", formValues.price);
    formData.append("category", formValues.category);
    formData.append("stock", formValues.stock);
    formData.append("location", formValues.location);
    formData.append("company", formValues.company);
    formData.append("size", formValues.size);
    formData.append("returnPolicy", formValues.returnPolicy);
    if (formValues.imageFile) {
      formData.append("imageFile", formValues.imageFile);
    }
    if (formValues.videoFile) {
      formData.append("videoFile", formValues.videoFile);
    }

    try {
      setIsLoading(true);
      const url = editProduct
        ? `https://newmedizon.onrender.com/api/products/${editProduct._id}`
        : "https://newmedizon.onrender.com/api/products";
      const method = editProduct ? "put" : "post";

      const response = await axios({
        method,
        url,
        data: formData,
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 || response.status === 201) {
        alert("Product saved successfully!");
        fetchProducts();
        closeModal();
      }
    } catch (error) {
      console.error("Error saving product:", error.response?.data);
      alert(error.response?.data?.message || "Error saving product");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!id) {
      alert("Invalid product ID!");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      setIsLoading(true);
      await axios.delete(`https://newmedizon.onrender.com/api/products/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      alert("Product deleted successfully!");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateStockInMongoDB = async (productId, quantity) => {
    try {
      const response = await axios.put(
        `https://newmedizon.onrender.com/api/products/update-stock/${productId}`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating stock:", error);
      throw error;
    }
  };

  const testProductUpdate = async (productId, quantity) => {
    try {
      console.log(`Testing update for ${productId} with quantity ${quantity}`);

      const response = await axios.put(
        `https://newmedizon.onrender.com/api/products/update-stock/${productId}`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Test successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Test failed:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  };

  const placeOrder = async (orderData) => {
    try {
      // 1. First verify stock for all items
      const stockChecks = await Promise.all(
        orderData.items.map(item =>
          axios.get(`https://newmedizon.onrender.com/api/products/${item.product_id}`, {
            headers: { Authorization: `Bearer ${getToken()}` }
          })
        )
      );

      // 2. Check if all items have sufficient stock
      const allInStock = orderData.items.every((item, index) => {
        return stockChecks[index].data.stock >= item.quantity;
      });

      if (!allInStock) {
        throw new Error("Insufficient stock for one or more items");
      }

      // 3. Reduce stock for each item
      await Promise.all(
        orderData.items.map(item =>
          axios.put(
            `https://newmedizon.onrender.com/api/products/${item.product_id}/update-stock`,
            { quantity: -item.quantity },
            { headers: { Authorization: `Bearer ${getToken()}` } }
          )
        )
      );

      // 4. Create the order in Supabase
      const { data: order, error } = await supabase
        .from('product_order')
        .insert([{
          ...orderData,
          status: 'completed', // Mark as completed since stock is updated
          stock_updated: true
        }])
        .select();

      if (error) throw error;

      return order;

    } catch (error) {
      console.error("Order placement failed:", error);

      // Revert stock updates if order creation failed
      if (orderData.items) {
        await Promise.all(
          orderData.items.map(item =>
            axios.put(
              `https://newmedizon.onrender.com/api/products/${item.product_id}/update-stock`,
              { quantity: item.quantity }, // Add back the quantity
              { headers: { Authorization: `Bearer ${getToken()}` } }
            ).catch(e => console.error("Stock revert failed:", e))
          )
        );
      }

      throw error;
    }
  };

  const handlePlaceOrder = async (items, totalAmount, userId) => {
    try {
      setIsLoading(true);

      const orderData = {
        items: items,
        total_amount: totalAmount,
        customer_id: userId,
        status: 'pending',
        payment_method: 'cash',
        address: {},
        contact_number: '',
        email: email
      };

      const order = await placeOrder(orderData);

      // Refresh data
      fetchProducts();
      fetchOrders();

      alert("Order placed successfully! Stock updated automatically.");

    } catch (error) {
      alert(`Order failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      setIsLoading(true);

      // Get current order with items
      const { data: currentOrder, error: fetchError } = await supabase
        .from('product_order')
        .select('*')
        .eq('id', orderId)
        .single();

      if (fetchError) throw fetchError;

      // Handle stock updates based on status change
      if (newStatus === 'cancelled') {
        // Restore stock for cancelled orders
        for (const item of currentOrder.items) {
          try {
            await axios.put(
              `https://newmedizon.onrender.com/api/products/update-stock/${item.product_id}`,
              { quantity: item.quantity },
              { headers: { Authorization: `Bearer ${getToken()}` } }
            );
          } catch (error) {
            console.error(`Failed to restore stock for product ${item.product_id}:`, error);
          }
        }
      }
      else if (newStatus === 'processing' && currentOrder.status === 'pending') {
        // Reduce stock when order moves from pending to processing
        for (const item of currentOrder.items) {
          try {
            const response = await axios.put(
              `https://newmedizon.onrender.com/api/products/update-stock/${item.product_id}`,
              { quantity: -item.quantity },
              { headers: { Authorization: `Bearer ${getToken()}` } }
            );

            if (!response.data.success) {
              throw new Error(response.data.message || "Stock update failed");
            }
          } catch (error) {
            console.error(`Failed to reduce stock for product ${item.product_id}:`, error);
            throw new Error(`Failed to process order: ${error.message}`);
          }
        }
      }

      // Update order status in Supabase
      const { error } = await supabase
        .from('product_order')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      // Refresh data
      fetchProducts();
      fetchOrders();
      if (activePage === 'dashboard') fetchDashboardData();

      alert(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Status change failed:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStock = async (productId, quantity) => {
    try {
      // First try the primary endpoint format
      try {
        const response = await axios.put(
          `https://newmedizon.onrender.com/api/products/update-stock/${productId}`,
          { quantity },
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        return response.data;
      } catch (firstError) {
        // If first format fails, try alternative format
        const response = await axios.put(
          `https://newmedizon.onrender.com/api/products/${productId}/update-stock`,
          { quantity },
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        return response.data;
      }
    } catch (error) {
      console.error('Stock update error:', {
        productId,
        error: error.response?.data || error.message
      });
      throw error;
    }
  };

  const verifyProductExists = async (productId) => {
    try {
      const response = await axios.get(
        `https://newmedizon.onrender.com/api/products/${productId}`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Product verification failed:', error);
      return null;
    }
  };

  const syncStockLevels = async () => {
    try {
      setIsLoading(true);
      console.log("Starting stock synchronization...");

      // 1. Get pending orders
      const { data: pendingOrders, error: orderError } = await supabase
        .from('product_order')
        .select('*')
        .eq('status', 'pending');

      if (orderError) throw orderError;

      if (!pendingOrders?.length) {
        console.log("No pending orders found");
        alert("No pending orders to process");
        return;
      }

      console.log(`Found ${pendingOrders.length} pending orders`);

      const updatedProducts = [...products];
      let hasErrors = false;

      // 2. Process each order
      for (const order of pendingOrders) {
        try {
          console.log(`Processing order ${order.id}`);

          if (!order.items?.length) {
            console.warn(`Order ${order.id} has no items, skipping`);
            continue;
          }

          // 3. Verify and update stock for each item
          for (const item of order.items) {
            try {
              // Verify product exists
              const product = await verifyProductExists(item.product_id);
              if (!product) {
                throw new Error(`Product ${item.product_id} not found in database`);
              }

              // Find product in local state
              const productIndex = updatedProducts.findIndex(p => p._id === item.product_id);
              if (productIndex === -1) {
                throw new Error(`Product ${item.product_id} not found in local state`);
              }

              // Verify sufficient stock
              if (updatedProducts[productIndex].stock < item.quantity) {
                throw new Error(`Insufficient stock for ${product.name}`);
              }

              // Update stock
              console.log(`Updating stock for ${product.name}, quantity: -${item.quantity}`);
              const updateResponse = await updateStock(item.product_id, -item.quantity);

              if (!updateResponse.success) {
                throw new Error(updateResponse.message || "Stock update failed");
              }

              // Update local state
              updatedProducts[productIndex].stock -= item.quantity;
              setUpdatingStocks(prev => ({
                ...prev,
                [item.product_id]: updatedProducts[productIndex].stock
              }));

            } catch (itemError) {
              console.error(`Failed to process item ${item.product_id}:`, itemError);
              hasErrors = true;
              continue;
            }
          }

          // Mark order as completed if no errors
          if (!hasErrors) {
            const { error: updateError } = await supabase
              .from('product_order')
              .update({ status: 'Confirm' })
              .eq('id', order.id);

            if (updateError) throw updateError;
          }

        } catch (orderError) {
          console.error(`Failed to process order ${order.id}:`, orderError);
          hasErrors = true;

          await supabase
            .from('product_order')
            .update({
              status: 'failed',
              error: orderError.message
            })
            .eq('id', order.id)
            .catch(e => console.error("Failed to update order status:", e));
        }
      }

      // Update state
      setProducts(updatedProducts);
      setUpdatingStocks({});
      await fetchOrders();

      if (hasErrors) {
        alert("Sync completed with some errors. Check console for details.");
      } else {
        alert("Stock synchronization completed successfully!");
      }

    } catch (mainError) {
      console.error("Sync failed:", mainError);
      alert(`Sync failed: ${mainError.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const generateOrderPDF = (order) => {
    const doc = new jsPDF();

    // Add logo or title
    doc.setFontSize(18);
    doc.setTextColor(40, 53, 147);
    doc.text('NewMedizon - Order Invoice', 105, 20, { align: 'center' });

    // Order details section
    doc.setFontSize(12);

    // Left column - Order info
    doc.text(`Order ID: ${order.id}`, 14, 30);
    doc.text(`Date: ${new Date(order.created_at).toLocaleDateString()}`, 14, 35);
    doc.text(`Status: ${order.status.toUpperCase()}`, 14, 40);

    // Right column - Customer info
    doc.text(`Customer: ${order.full_name || 'N/A'}`, 105, 30);
    doc.text(`Email: ${order.email || 'N/A'}`, 105, 35);
    doc.text(`Contact: ${order.contact_number || 'N/A'}`, 105, 40);

    // Payment info
    doc.text(`Payment Method: ${order.payment_method || 'N/A'}`, 14, 50);
    doc.text(`Total Amount: ₹${order.total_amount.toFixed(2)}`, 105, 50);

    // Address section
    if (order.address) {
      doc.text('Shipping Address:', 14, 60);
      const addressLines = [
        order.address.street,
        `${order.address.city}, ${order.address.state}`,
        order.address.postal_code,
        order.address.country
      ].filter(Boolean);

      addressLines.forEach((line, index) => {
        doc.text(line, 20, 65 + (index * 5));
      });
    }

    // Items table
    if (order.items && order.items.length > 0) {
      // Table headers
      const headers = [
        { header: 'Product', dataKey: 'name' },
        { header: 'Unit Price', dataKey: 'price' },
        { header: 'Quantity', dataKey: 'quantity' },
        { header: 'Total', dataKey: 'total' }
      ];

      // Prepare table data
      const tableData = order.items.map(item => ({
        name: item.name || 'N/A',
        price: `₹${item.price ? item.price.toFixed(2) : '0.00'}`,
        quantity: item.quantity || 0,
        total: `₹${(item.price * item.quantity).toFixed(2)}`
      }));

      // Add total row
      tableData.push({
        name: 'TOTAL',
        price: '',
        quantity: '',
        total: `₹${order.total_amount.toFixed(2)}`
      });

      // Generate the table
      autoTable(doc, {
        startY: 85,
        head: [headers.map(h => h.header)],
        body: tableData.map(row => headers.map(h => row[h.dataKey])),
        theme: 'grid',
        headStyles: {
          fillColor: [40, 53, 147],
          textColor: 255,
          fontStyle: 'bold'
        },
        columnStyles: {
          0: { cellWidth: 'auto' }, // Product name
          1: { cellWidth: 30 },     // Unit Price
          2: { cellWidth: 25 },     // Quantity
          3: { cellWidth: 30 }      // Total
        },
        styles: {
          fontSize: 10,
          cellPadding: 3,
          overflow: 'linebreak'
        },
        didDrawPage: function (data) {
          // Style the total row
          if (data.pageNumber === data.pageCount) {
            const lastRow = data.table.body[data.table.body.length - 1];
            doc.setFontStyle('bold');
            doc.setTextColor(40, 53, 147);
            lastRow.cells.forEach(cell => {
              cell.styles.fontStyle = 'bold';
              cell.styles.textColor = [40, 53, 147];
            });
          }
        }
      });
    }

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(
      'Thank you for your business! For any queries, please contact support@newmedizon.com',
      105,
      doc.lastAutoTable.finalY + 15,
      { align: 'center' }
    );

    // Save the PDF
    doc.save(`NewMedizon_Order_${order.id}.pdf`);
  };
  const generateAllOrdersPDF = () => {
    if (orders.length === 0) {
      alert("No orders available to download");
      return;
    }

    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.setTextColor(40, 53, 147);
    doc.text('NewMedizon - All Orders Report', 105, 20, { align: 'center' });

    // Add report details
    doc.setFontSize(12);
    doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Total Orders: ${orders.length}`, 14, 40);

    // Group orders by status for summary
    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    // Add status summary
    let yPosition = 50;
    doc.text('Order Status Summary:', 14, yPosition);
    yPosition += 10;

    Object.entries(statusCounts).forEach(([status, count]) => {
      doc.text(`${status.toUpperCase()}: ${count}`, 20, yPosition);
      yPosition += 10;
    });

    yPosition += 15;

    // Add each order as a table
    orders.forEach((order, index) => {
      // Add page break if needed (except for first order)
      if (index > 0) {
        doc.addPage();
        yPosition = 20;
      }

      // Order header
      doc.setFontSize(14);
      doc.setTextColor(40, 53, 147);
      doc.text(`Order #${order.id}`, 14, yPosition);
      yPosition += 10;

      // Order details
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`Date: ${new Date(order.created_at).toLocaleDateString()}`, 14, yPosition);
      doc.text(`Status: ${order.status.toUpperCase()}`, 100, yPosition);
      yPosition += 5;
      doc.text(`Customer: ${order.full_name || 'N/A'}`, 14, yPosition);
      doc.text(`Amount: ₹${order.total_amount.toFixed(2)}`, 100, yPosition);
      yPosition += 10;

      // Items table
      if (order.items && order.items.length > 0) {
        const headers = [
          { header: 'Product', dataKey: 'name' },
          { header: 'Unit Price', dataKey: 'price' },
          { header: 'Quantity', dataKey: 'quantity' },
          { header: 'Total', dataKey: 'total' }
        ];

        const tableData = order.items.map(item => ({
          name: item.name || 'N/A',
          price: `₹${item.price ? item.price.toFixed(2) : '0.00'}`,
          quantity: item.quantity || 0,
          total: `₹${(item.price * item.quantity).toFixed(2)}`
        }));

        // Add total row
        tableData.push({
          name: 'TOTAL',
          price: '',
          quantity: '',
          total: `₹${order.total_amount.toFixed(2)}`
        });

        autoTable(doc, {
          startY: yPosition,
          head: [headers.map(h => h.header)],
          body: tableData.map(row => headers.map(h => row[h.dataKey])),
          theme: 'grid',
          headStyles: {
            fillColor: [40, 53, 147],
            textColor: 255,
            fontStyle: 'bold'
          },
          columnStyles: {
            0: { cellWidth: 'auto' },
            1: { cellWidth: 30 },
            2: { cellWidth: 25 },
            3: { cellWidth: 30 }
          },
          styles: {
            fontSize: 9,
            cellPadding: 2
          },
          didDrawPage: function (data) {
            if (data.pageNumber === data.pageCount) {
              const lastRow = data.table.body[data.table.body.length - 1];
              doc.setFontStyle('bold');
              doc.setTextColor(40, 53, 147);
              lastRow.cells.forEach(cell => {
                cell.styles.fontStyle = 'bold';
                cell.styles.textColor = [40, 53, 147];
              });
            }
          }
        });

        yPosition = doc.lastAutoTable.finalY + 10;
      }

      // Add separator if not last order
      if (index < orders.length - 1) {
        doc.setDrawColor(200, 200, 200);
        doc.line(14, yPosition, 200, yPosition);
        yPosition += 15;
      }
    });

    // Save the PDF
    doc.save(`NewMedizon_All_Orders_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const openModal = (product = null) => {
    if (product) {
      setEditProduct(product);
      setFormValues({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        category: product.category || "",
        stock: product.stock || "",
        location: product.location || "",
        company: product.company || "",
        size: product.size || "",
        videoUrl: product.videoUrl || "",
        imageUrl: product.imageUrl || "",
        imageFile: null,
        videoFile: null,
        returnPolicy: product.returnPolicy || "",
      });
    } else {
      resetForm();
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
      returnPolicy: ""
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
        "https://newmedizon.onrender.com/api/auth/update-password",
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
          <li
            className={activePage === "dashboard" ? "active" : ""}
            onClick={() => setActivePage("dashboard")}
          >
            <FaChartPie />
            <span>Dashboard</span>
          </li>
          <li
            className={activePage === "products" ? "active" : ""}
            onClick={() => setActivePage("products")}
          >
            <FaBox />
            <span>Products</span>
          </li>
          <li
            className={activePage === "orders" ? "active" : ""}
            onClick={() => setActivePage("orders")}
          >
            <FaClipboardList />
            <span>Orders</span>
          </li>
          <li
            className={activePage === "returns" ? "active" : ""}
            onClick={() => setActivePage("returns")}
          >
            <FaReply />
            <span>Returns</span>
          </li>
          <li
            className={activePage === "settings" ? "active" : ""}
            onClick={() => setActivePage("settings")}
          >
            <FaCogs />
            <span>Settings</span>
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
                        <td>{renderStatusBadge(order.status || 'pending')}</td>
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
                          {product.imageUrl && (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="product-image"
                            />
                          )}
                        </td>
                        <td>
                          {product.videoUrl ? (
                            <button
                              className="video-preview-button"
                              onClick={() => openVideoModal(product.videoUrl)}
                            >
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
                        <td>
                          <button
                            className="action-btn edit-btn"
                            onClick={() => openModal(product)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="action-btn delete-btn"
                            onClick={() => deleteProduct(product._id)}
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
                <h3>{editProduct ? "Edit Product" : "Add Product"}</h3>
                <button className="close-modal" onClick={closeModal}>
                  &times;
                </button>
              </div>
              <form onSubmit={saveProduct}>
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
                      placeholder="Product size"
                    />
                  </div>
                </div>

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

                <div className="form-row">
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
                          onClick={() => setFormValues(prev => ({
                            ...prev,
                            imageUrl: "",
                            imageFile: null
                          }))}
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
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
                          onClick={() => setFormValues(prev => ({
                            ...prev,
                            videoUrl: "",
                            videoFile: null
                          }))}
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="submit" className="btn-primary" disabled={isLoading}>
                    {isLoading ? "Processing..." : editProduct ? "Save Changes" : "Add Product"}
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
                    <th>Items</th>
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
                        <td>{renderStatusBadge(order.status || 'pending')}</td>
                        <td className="address-cell">
                          {order.address && (
                            <>
                              <div>{order.address.street}</div>
                              <div>{order.address.city}, {order.address.state}</div>
                              <div>{order.address.postal_code}</div>
                            </>
                          )}
                        </td>
                        <td className="items-cell">
                          {order.items && order.items.map((item, index) => (
                            <div
                              key={index}
                              className="clickable-item"
                              onClick={() => showOrderItemDetails(item)}
                            >
                              {item.name} (Qty: {item.quantity})
                              <FaInfoCircle className="info-icon" />
                            </div>
                          ))}
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
                          {order.status === 'pending' && (
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

            {/* Return Action Modal */}
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
                      <option value="Return Approved">Approve Return</option>
                      <option value="rejected"> Cancel  request</option>
                      <option value="refunded">Process Refund</option>
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
        )
        };
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