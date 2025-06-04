import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { createClient } from '@supabase/supabase-js';
import {
  FaBars,
  FaChartPie,
  FaBox,
  FaBuilding,
  FaTags,
  FaCog,
  FaSignOutAlt,
  FaBell,
  FaUser,
  FaPlay,
  FaArrowLeft,
  FaFilter,
  FaSearch,
  FaVideo,
  FaStar,
  FaTimes,
 
  FaClipboardList,
  FaFileArchive,
  FaInfoCircle,
  FaFilePdf,
  
  FaTruck,
  
} from "react-icons/fa";
import { FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import logo from "../images/logo2.png";
import "../styles/MasterDashboard.css";
import { useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import Chart from 'chart.js/auto';

const SUPABASE_URL = 'https://ddnmqzlxzwiydiklqach.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkbm1xemx4endpeWRpa2xxYWNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MjYyOTgsImV4cCI6MjA2MzMwMjI5OH0.D0YMTuSU_5mpH5LlphlL25Da3b9H1TBHi9LL1FrOdm4';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const MasterDashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalManufacturers, setTotalManufacturers] = useState(0);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [pendingManufacturers, setPendingManufacturers] = useState([]);
  const [email, setEmail] = useState("");
  const [selectedCategory, setSelectedCategory] = useState();
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [jsonData, setJsonData] = useState(null); 
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [deliveryFeedbacks, setDeliveryFeedbacks] = useState([]);
  const [feedbackSearchTerm, setFeedbackSearchTerm] = useState("");
  const [productFeedbacks, setProductFeedbacks] = useState([]);
  const [productFeedbackSearchTerm, setProductFeedbackSearchTerm] = useState("");
  

  const [timeFilter, setTimeFilter] = useState('month');
  
  const ordersChartRef = useRef(null);
  const revenueChartRef = useRef(null);
  const ordersChartInstance = useRef(null);
  const revenueChartInstance = useRef(null);

  const orderStatuses = ['pending', 'processing', 'shipped', 'out for delivery', 'delivered', 'cancelled'];
  const orderStatusColors = {
    pending: 'orange',
    processing: 'purple',
    shipped: 'blue',
    'out for delivery': 'teal',
    delivered: 'green',
    cancelled: 'red'
  };

  const navigate = useNavigate();

  // Initialize charts
  useEffect(() => {
    if (activeSection === "dashboard" && orders.length > 0) {
      initCharts();
    }
    
    return () => {
      // Clean up chart instances when component unmounts or charts are no longer needed
      if (ordersChartInstance.current) {
        ordersChartInstance.current.destroy();
      }
      if (revenueChartInstance.current) {
        revenueChartInstance.current.destroy();
      }
    };
  }, [activeSection, orders]);

  const initCharts = () => {
    // Process orders data for charts
    const ordersByDay = processOrdersByDay();
    const revenueByDay = processRevenueByDay();
    
    // Orders chart
    const ordersCtx = ordersChartRef.current.getContext('2d');
    if (ordersChartInstance.current) {
      ordersChartInstance.current.destroy();
    }
    ordersChartInstance.current = new Chart(ordersCtx, {
      type: 'bar',
      data: {
        labels: ordersByDay.labels,
        datasets: [{
          label: 'Number of Orders',
          data: ordersByDay.data,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Orders by Day'
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Orders'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Date'
            }
          }
        }
      }
    });
    
    // Revenue chart
    const revenueCtx = revenueChartRef.current.getContext('2d');
    if (revenueChartInstance.current) {
      revenueChartInstance.current.destroy();
    }
    revenueChartInstance.current = new Chart(revenueCtx, {
      type: 'line',
      data: {
        labels: revenueByDay.labels,
        datasets: [{
          label: 'Revenue (₹)',
          data: revenueByDay.data,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          tension: 0.1,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Revenue by Day'
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Revenue (₹)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Date'
            }
          }
        }
      }
    });
  };

  const processOrdersByDay = () => {
    const ordersByDate = {};
    
    orders.forEach(order => {
      const date = new Date(order.created_at).toLocaleDateString();
      if (!ordersByDate[date]) {
        ordersByDate[date] = 0;
      }
      ordersByDate[date]++;
    });
    
    const sortedDates = Object.keys(ordersByDate).sort((a, b) => new Date(a) - new Date(b));
    
    return {
      labels: sortedDates,
      data: sortedDates.map(date => ordersByDate[date])
    };
  };

  const processRevenueByDay = () => {
    const revenueByDate = {};
    
    orders.forEach(order => {
      const date = new Date(order.created_at).toLocaleDateString();
      if (!revenueByDate[date]) {
        revenueByDate[date] = 0;
      }
      revenueByDate[date] += order.total_amount;
    });
    
    const sortedDates = Object.keys(revenueByDate).sort((a, b) => new Date(a) - new Date(b));
    
    return {
      labels: sortedDates,
      data: sortedDates.map(date => revenueByDate[date])
    };
  };

  // Fetch total products and companies counts
  useEffect(() => {
    axios
      .get("https://grammerly-backend.onrender.com/api/total-products")
      .then((response) => setTotalProducts(response.data.totalProducts || 0))
      .catch((error) => console.error("Error fetching products:", error));

    axios
      .get("https://grammerly-backend.onrender.com/api/total-manufacturers")
      .then((response) => setTotalManufacturers(response.data.totalCompanies || 0))
      .catch((error) => console.error("Error fetching total manufacturers:", error));
  }, []);

  // Fetch data based on active section
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (activeSection === "products") {
      axios.get("https://grammerly-backend.onrender.com/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          setProducts(response.data);
          const uniqueLocations = [...new Set(response.data.map(product => product.location))];
          setLocations(uniqueLocations);
        })
        .catch((error) => console.error("Error fetching products:", error));
    }

    if (activeSection === "categories") {
      axios
        .get("https://grammerly-backend.onrender.com/api/categories", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setCategories(Array.isArray(response.data) ? response.data : []);
        })
        .catch((error) => console.error("Error fetching categories:", error));
    }

    if (activeSection === "companies") {
      axios
        .get("https://grammerly-backend.onrender.com/api/manufacturers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setManufacturers(Array.isArray(response.data) ? response.data : []);
        })
        .catch((error) => console.error("Error fetching manufacturers:", error));
    }

    if (activeSection === "pending-approvals") {
      fetchPendingManufacturers();
    }

    if (activeSection === "orders") {
      fetchOrders();
    }

    if (activeSection === "delivery-feedback") {
      fetchDeliveryFeedbacks();
    }

    if (activeSection === "product-feedback") {
      fetchProductFeedbacks();
    }
  }, [activeSection]);

  const fetchPendingManufacturers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://grammerly-backend.onrender.com/api/auth/pending-manufacturers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPendingManufacturers(response.data);
    } catch (error) {
      console.error("Error fetching pending manufacturers:", error);
    }
  };

  const fetchDeliveryFeedbacks = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('delivery_feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setDeliveryFeedbacks(data || []);
    } catch (error) {
      console.error("Error fetching delivery feedbacks:", error);
      setDeliveryFeedbacks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProductFeedbacks = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('product_feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProductFeedbacks(data || []);
    } catch (error) {
      console.error("Error fetching product feedbacks:", error);
      setProductFeedbacks([]);
    } finally {
      setIsLoading(false);
    }
  };

  
  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('product_order')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (email) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://grammerly-backend.onrender.com/api/auth/authorize",
        { email },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("✅ Manufacturer approved!");
      fetchPendingManufacturers();
    } catch (error) {
      alert("❌ Approval failed: " + (error.response?.data?.message || "Unknown error"));
    }
  };

  const handleDecline = async (email) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://grammerly-backend.onrender.com/api/auth/decline-manufacturer",
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("❌ Manufacturer declined!");
      fetchPendingManufacturers();
    } catch (error) {
      console.error("Decline error:", error);
      alert("❌ Decline failed! " + (error.response?.data?.message || "Please try again."));
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signup");
  };

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "https://grammerly-backend.onrender.com/api/auth/update-password",
        { email, oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEmail("");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError("");
      setMessage(response.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setMessage("");
      setError(error.response?.data?.message || "Error updating password.");
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleAccept = (id) => {
    setNotifications(notifications.filter((notification) => notification.id !== id));
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter((notification) => notification.id !== id));
  };

  const token = localStorage.getItem("token");

  const handleCategoryClick = async (categoryName) => {
    setSelectedCategory(categoryName);
    setActiveSection("category-products");

    try {
      const response = await axios.get(`https://grammerly-backend.onrender.com/api/products/by-category/${categoryName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching products by category:", error);
      setProducts([]);
    }
  };

  const handleBackToCategories = () => {
    setActiveSection("categories");
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
  };

  const resetFilters = () => {
    setSelectedLocation("all");
    setSearchQuery("");
  };

  const openVideoModal = (videoUrl) => {
    setCurrentVideoUrl(videoUrl);
    setShowVideoModal(true);
  };

  const closeVideoModal = () => {
    setShowVideoModal(false);
    setCurrentVideoUrl("");
  };

  const filteredProducts = Array.isArray(products)
    ? products.filter((product) => {
        const matchesSearch =
          product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.manufacturer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesLocation =
          selectedLocation === "all" ||
          product.location === selectedLocation;

        return matchesSearch && matchesLocation;
      })
    : [];

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

 
  const renderStarRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="star-rating">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} className="star filled" />
        ))}
        {hasHalfStar && <FaStarHalfAlt key="half" className="star half" />}
        {[...Array(emptyStars)].map((_, i) => (
          <FaRegStar key={`empty-${i}`} className="star empty" />
        ))}
        <span className="rating-text">({rating.toFixed(1)})</span>
      </div>
    );
  };

  const showOrderItemDetails = (item) => {
    setJsonData(item);
    setShowJsonModal(true);
  };

  const generateOrderPDF = (order) => {
    const doc = new jsPDF();

    // Set primary and secondary colors
    const primaryColor = [40, 53, 147]; // Dark blue
    const secondaryColor = [100, 100, 100]; // Gray

    // Add invoice title
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('ORDER INVOICE', 105, 40, { align: 'center' });

    // Add invoice details section
    doc.setFontSize(10);
    doc.setTextColor(...secondaryColor);
    doc.text('Invoice Number:', 20, 50);
    doc.text('Order Date:', 20, 55);
    doc.text('Order Status:', 20, 60);

    doc.setTextColor(0, 0, 0);
    doc.text(order.id.toString(), 50, 50);
    doc.text(new Date(order.created_at).toLocaleDateString(), 50, 55);
    doc.text(order.status.toUpperCase(), 50, 60);

    // Add customer details section
    doc.setTextColor(...secondaryColor);
    doc.text('Customer Details:', 120, 50);
    doc.text('Name:', 120, 55);
    doc.text('Email:', 120, 60);
    doc.text('Contact:', 120, 65);

    doc.setTextColor(0, 0, 0);
    doc.text(order.full_name || 'N/A', 150, 55);
    doc.text(order.email || 'N/A', 150, 60);
    doc.text(order.contact_number || 'N/A', 150, 65);

    // Add shipping address if available
    if (order.address) {
      doc.setTextColor(...secondaryColor);
      doc.text('Shipping Address:', 20, 75);

      doc.setTextColor(0, 0, 0);
      const addressLines = [
        order.address.street,
        `${order.address.city}, ${order.address.state}`,
        `Postal Code: ${order.address.postal_code}`,
        order.address.country
      ].filter(Boolean);

      addressLines.forEach((line, index) => {
        doc.text(line, 20, 80 + (index * 5));
      });
    }

    // Add items table
    if (order.items && order.items.length > 0) {
      const headers = [
        { header: 'No.', dataKey: 'index', width: 10 },
        { header: 'Product', dataKey: 'name', width: 70 },
        { header: 'Unit Price (₹)', dataKey: 'price', width: 30 },
        { header: 'Qty', dataKey: 'quantity', width: 20 },
        { header: 'Total (₹)', dataKey: 'total', width: 30 }
      ];

      const tableData = order.items.map((item, index) => ({
        index: index + 1,
        name: item.name || 'N/A',
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
        headStyles: {
          fillColor: primaryColor,
          textColor: 255,
          fontStyle: 'bold',
          fontSize: 10
        },
        bodyStyles: {
          fontSize: 10,
          cellPadding: 3,
          textColor: [0, 0, 0]
        },
        columnStyles: {
          0: { halign: 'center' },
          1: { halign: 'left' },
          2: { halign: 'right' },
          3: { halign: 'center' },
          4: { halign: 'right' }
        },
        styles: {
          overflow: 'linebreak',
          cellPadding: 2
        }
      });
    }

    doc.setFontSize(10);
    doc.setTextColor(...secondaryColor);
    doc.text('Payment Method:', 20, doc.lastAutoTable.finalY + 10);
    doc.setTextColor(0, 0, 0);
    doc.text(order.payment_method.toUpperCase() || 'N/A', 50, doc.lastAutoTable.finalY + 10);

    doc.setFontSize(12);
    doc.setTextColor(...primaryColor);
    doc.text('Thank you for your business!', 105, doc.lastAutoTable.finalY + 20, { align: 'center' });

    doc.setFontSize(8);
    doc.setTextColor(...secondaryColor);
    doc.text('For any queries, please contact support@newmedizon.com', 105, doc.internal.pageSize.height - 10, { align: 'center' });

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
      items: order.items ? order.items.length.toString() : '0'
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

  const getFilteredOrders = () => {
  const now = new Date();
  
  return orders.filter(order => {
    const orderDate = new Date(order.created_at);
    
    switch (timeFilter) {
      case 'day':
        return orderDate.toDateString() === now.toDateString();
      case 'week':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        return orderDate >= weekStart;
      case 'month':
        return orderDate.getMonth() === now.getMonth() && 
               orderDate.getFullYear() === now.getFullYear();
      case 'year':
        return orderDate.getFullYear() === now.getFullYear();
      default: // 'all'
        return true;
    }
  });
};

  const generateFeedbackPDF = (feedback, type) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor(40, 53, 147);
    doc.text(`NewMedizon - ${type === 'delivery' ? 'Delivery' : 'Product'} Feedback Report`, 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`Feedback ID: ${feedback.id}`, 14, 30);
    doc.text(`Order ID: ${feedback.order_id}`, 14, 40);
    doc.text(`Customer Email: ${feedback.user_email}`, 14, 50);
    doc.text(`Submitted Date: ${new Date(feedback.created_at).toLocaleDateString()}`, 14, 60);

    doc.setFontSize(14);
    doc.text(`${type === 'delivery' ? 'Delivery' : 'Product'} Ratings:`, 14, 75);
    
    doc.setFontSize(12);
    if (type === 'delivery') {
      doc.text(`Timeliness: ${feedback.timeliness_rating}/5`, 20, 85);
      doc.text(`Handling: ${feedback.handling_rating}/5`, 20, 95);
      doc.text(`Professionalism: ${feedback.professionalism_rating}/5`, 20, 105);
    } else {
      doc.text(`Quality: ${feedback.quality_rating}/5`, 20, 85);
      doc.text(`Functionality: ${feedback.functionality_rating}/5`, 20, 95);
      doc.text(`Ease of Use: ${feedback.ease_of_use_rating}/5`, 20, 105);
    }

    doc.setFontSize(14);
    doc.text('General Comments:', 14, 120);
    doc.setFontSize(12);
    
    if (feedback.general_comments) {
      const splitText = doc.splitTextToSize(feedback.general_comments, 180);
      doc.text(splitText, 20, 130);
    } else {
      doc.text('No comments provided', 20, 130);
    }

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(
      'Thank you for your feedback!',
      14,
      doc.internal.pageSize.height - 20
    );

    doc.save(`NewMedizon_${type === 'delivery' ? 'Delivery' : 'Product'}_Feedback_${feedback.id}.pdf`);
  };




 return (
    <div className="dashboard-container-master">
      {/* Sidebar */}
      <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img src={logo} alt="Company Logo" />
          </div>
          <button className="toggle-btn" onClick={toggleSidebar}>
            <FaBars />
          </button>
        </div>
        
        <div className="sidebar-scroll-container">
          <ul className="sidebar-menu">
            <li 
              className={activeSection === "dashboard" ? "active" : ""}
              onClick={() => setActiveSection("dashboard")}
            >
              <FaChartPie className="sidebar-icon" />
              <span className="sidebar-text">Dashboard</span>
            </li>
            <li 
              className={activeSection === "products" ? "active" : ""}
              onClick={() => setActiveSection("products")}
            >
              <FaBox className="sidebar-icon" />
              <span className="sidebar-text">Products</span>
            </li>
            <li 
              className={activeSection === "orders" ? "active" : ""}
              onClick={() => setActiveSection("orders")}
            >
              <FaClipboardList className="sidebar-icon" />
              <span className="sidebar-text">Orders</span>
            </li>
            <li 
              className={activeSection === "companies" ? "active" : ""}
              onClick={() => setActiveSection("companies")}
            >
              <FaBuilding className="sidebar-icon" />
              <span className="sidebar-text">Manufacturers</span>
            </li>
            <li 
              className={activeSection === "categories" ? "active" : ""}
              onClick={() => setActiveSection("categories")}
            >
              <FaTags className="sidebar-icon" />
              <span className="sidebar-text">Categories</span>
            </li>
            <li 
              className={activeSection === "pending-approvals" ? "active" : ""}
              onClick={() => setActiveSection("pending-approvals")}
            >
              <FaUser className="sidebar-icon" />
              <span className="sidebar-text">Pending Approvals</span>
            </li>
            <li 
              className={activeSection === "delivery-feedback" ? "active" : ""}
              onClick={() => setActiveSection("delivery-feedback")}
            >
              <FaTruck className="sidebar-icon" />
              <span className="sidebar-text">Delivery Feedback</span>
            </li>
            <li 
              className={activeSection === "product-feedback" ? "active" : ""}
              onClick={() => setActiveSection("product-feedback")}
            >
              <FaStar className="sidebar-icon" />
              <span className="sidebar-text">Product Feedback</span>
            </li>
            <li 
              className={activeSection === "settings" ? "active" : ""}
              onClick={() => setActiveSection("settings")}
            >
              <FaCog className="sidebar-icon" />
              <span className="sidebar-text">Settings</span>
            </li>
          </ul>
          
          <div className="sidebar-footer">
            <button className="logout-btn-master" onClick={handleLogout}>
              <FaSignOutAlt className="sidebar-icon" />
              <span className="sidebar-text">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`content ${isCollapsed ? "collapsed" : ""}`}>
        <div className="header">
          <h2>Welcome to the Admin Panel</h2>
          <div className="notification-container">
            <FaBell className="notification-icon" onClick={toggleNotifications} />
            {notifications.length > 0 && (
              <span className="notification-badge">{notifications.length}</span>
            )}
            {showNotifications && (
              <div className="notification-dropdown">
                {notifications.length === 0 ? (
                  <p>No new requests</p>
                ) : (
                  notifications.map((notification) => (
                    <div key={notification.id} className="notification-item">
                      <p>{notification.message}</p>
                      <button onClick={() => handleAccept(notification.id)}>Accept</button>
                      <button onClick={() => handleDelete(notification.id)}>Delete</button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {activeSection === "dashboard" && (
          <div className="dashboard-content">
            <div className="stats">
              <div className="stat-box">
                <h3>Total Products</h3>
                <p>{totalProducts}</p>
              </div>
              <div className="stat-box">
                <h3>Total Manufacturers</h3>
                <p>{totalManufacturers}</p>
              </div>
              <div className="stat-box">
                <h3>Total Orders</h3>
                <p>{orders.length}</p>
              </div>
              <div className="stat-box">
                <h3>Total Revenue</h3>
                <p>₹{orders.reduce((sum, order) => sum + (order.total_amount || 0), 0).toFixed(2)}</p>
              </div>
            </div>

            <div className="dashboard-charts">
              <div className="chart-container">
                <canvas id="ordersChart" ref={ordersChartRef} height="300"></canvas>
              </div>
              <div className="chart-container">
                <canvas id="revenueChart" ref={revenueChartRef} height="300"></canvas>
              </div>
            </div>

            <div className="recent-orders">
              <h3>Recent Orders</h3>
              {orders.slice(0, 5).length > 0 ? (
                <table className="recent-orders-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id}>
                        <td>{order.id.substring(0, 8)}...</td>
                        <td>{order.full_name || 'Guest'}</td>
                        <td>{new Date(order.created_at).toLocaleDateString()}</td>
                        <td>₹{order.total_amount.toFixed(2)}</td>
                        <td>
                          <span className={`status-badge ${order.status}`}>
                            {order.status}
                          </span>
                        </td>
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

        {activeSection === "products" && (
          <div>
            <div className="products-header">
              <h3>Products</h3>
              <div className="products-controls">
                <button className="filter-button" onClick={toggleFilters}>
                  <FaFilter /> Filters
                </button>
                {showFilters && (
                  <div className="filters-panel">
                    <div className="filter-group">
                      <label>Location:</label>
                      <select
                        value={selectedLocation}
                        onChange={handleLocationChange}
                        className="location-select"
                      >
                        <option value="all">All Locations</option>
                        {locations.map((location, index) => (
                          <option key={index} value={location}>
                            {location}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button className="reset-filters" onClick={resetFilters}>
                      Reset Filters
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="search-container">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-bar"
              />
            </div>

            <div className="product-list">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div key={product._id} className="product-card">
                       {product.image_url && (
                            <img
                              src={product.image_url || "/placeholder.png"}
                              alt="Product"
                              style={{ width: "100px", height: "100px", objectFit: "cover" }}
                            />

                          )}
                    <h4>{product.name}</h4>
                    <p>
                      <strong>Manufacturer:</strong> {product.manufacturer?.name}
                    </p>
                    <p>
                      <strong>Description:</strong> {product.description}
                    </p>
                    <p>
                      <strong>Price:</strong> ₹{product.price}
                    </p>
                    <p>
                      <strong>Category:</strong> {product.category}
                    </p>
                    <p>
                      <strong>Stock:</strong> {product.stock}
                    </p>
                    <p>
                      <strong>Location:</strong> {product.location}
                    </p>
                    <p>
                      <strong>Company Name:</strong> {product.companyName}
                    </p>
                    <p>
                      <strong>Size:</strong> {product.size}
                    </p>

                   {product.video_url ? (
   <button onClick={() => openVideoModal(product.video_url)}>
      <FaVideo /> View Video
   </button>
) : (
   <span>No Video</span>
)}
                  </div>
                ))
              ) : (
                <p className="no-products">No products found matching your criteria.</p>
              )}
            </div>
          </div>
        )}

   
{activeSection === "orders" && (
  <div className="orders-container">
    <div className="orders-header">
      <h2>Orders</h2>
    </div>

    <div className="orders-controls">
      <div className="time-filter">
        <button
          className={timeFilter === 'day' ? 'active' : ''}
          onClick={() => setTimeFilter('day')}
        >
          Today
        </button>
        <button
          className={timeFilter === 'week' ? 'active' : ''}
          onClick={() => setTimeFilter('week')}
        >
          This Week
        </button>
        <button
          className={timeFilter === 'month' ? 'active' : ''}
          onClick={() => setTimeFilter('month')}
        >
          This Month
        </button>
        <button
          className={timeFilter === 'year' ? 'active' : ''}
          onClick={() => setTimeFilter('year')}
        >
          This Year
        </button>
        <button
          className={timeFilter === 'all' ? 'active' : ''}
          onClick={() => setTimeFilter('all')}
        >
          All Time
        </button>
      </div>
    </div>

    <div className="download-btn-container-master">
      <button
        className="download-all-btn"
        onClick={generateAllOrdersPDF}
        disabled={orders.length === 0 || isLoading}
      >
        <FaFileArchive /> Download All Orders
      </button>
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
            {/* <th>Actions</th> */}
          </tr>
        </thead>
        <tbody>
          {getFilteredOrders().length > 0 ? (
            getFilteredOrders().map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.email}</td>
                <td>{order.full_name}</td>
                <td>{order.contact_number}</td>
                <td>₹{order.total_amount.toFixed(2)}</td>
                <td>{order.payment_method}</td>
                <td>{renderStatusBadge(order.status || 'pending')}</td>
                <td>{order.address_line1 || 'N/A'}</td>
                <td className="items-cell">
                  {Array.isArray(order.items) && order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="clickable-item"
                      onClick={() => showOrderItemDetails(item)}
                    >
                      {item.name} (Qty: {item.quantity}) <FaInfoCircle />
                    </div>
                  ))}
                </td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td>
                  <button 
                    className="pdf-btn"
                    onClick={() => generateOrderPDF(order)}
                  >
                    <FaFilePdf /> PDF
                  </button>
                </td>
                {/* <td>
                  <button 
                    className="view-btn"
                    onClick={() => showOrderItemDetails(order)}
                  >
                    <FaInfoCircle /> Details
                  </button>
                </td> */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="12" className="no-orders">
                No orders available for the selected period.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      
    </div>
  </div>
)}


        {activeSection === "categories" && (
          <div className="categories-section">
            <h3>Categories</h3>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-bar"
              />
            </div>
            <div className="category-list">
              {Array.isArray(categories) &&
                categories
                  .filter((category) =>
                    category.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((category, index) => (
                    <div key={index} className="category-card" onClick={() => handleCategoryClick(category.name)}>
                      <img src={category.image_url} alt={category.name} />
                      <h4>{category.name}</h4>
                      {category.videoUrl && (
                        <button
                          className="video-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openVideoModal(category.videoUrl);
                          }}
                        >
                          <FaPlay /> View Video
                        </button>
                      )}
                    </div>
                  ))}
            </div>
          </div>
        )}

        {activeSection === "category-products" && (
          <div>
            <button className="back-button" onClick={handleBackToCategories}>
              <FaArrowLeft /> Back to Categories
            </button>
            <h3>Products in {selectedCategory}</h3>
            <div className="product-list">
              {Array.isArray(products) &&
                products
                  .filter((product) => product.category === selectedCategory)
                  .map((product) => (
                    <div key={product.id} className="product-card">
                      <img
                        src={product.image_url || "/placeholder.png"}
                        alt={product.name}
                        onError={(e) => (e.target.src = "/placeholder.png")}
                      />
                      <h4>{product.name}</h4>
                      <p>
                        <strong>Manufacturer:</strong>{" "}
                        {product.manufacturer?.name || "N/A"}
                      </p>
                      <p>
                        <strong>Description:</strong> {product.description || "N/A"}
                      </p>
                      <p>
                        <strong>Price:</strong> ₹{product.price ?? "N/A"}
                      </p>
                      <p>
                        <strong>Category:</strong> {product.category || "N/A"}
                      </p>
                      <p>
                        <strong>Stock:</strong> {product.stock ?? "N/A"}
                      </p>
                      <p>
                        <strong>Location:</strong> {product.location || "N/A"}
                      </p>
                      <p>
                        <strong>Company Name:</strong> {product.companyName || "N/A"}
                      </p>
                      <p>
                        <strong>Size:</strong> {product.size || "N/A"}
                      </p>

                      {product.video_url && (
                        <div className="video-section">
                          <button
                            className="video-button"
                            onClick={() => openVideoModal(product.video_url)}
                          >
                            <FaPlay /> View Video
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
            </div>
          </div>
        )}

        {activeSection === "companies" && (
          <div className="companies-section">
            <h3>Manufacturers</h3>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search manufacturers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-bar"
              />
            </div>
            <table className="manufacturer-table">
              <thead>
                <tr>
                  <th>Manufacturer Name</th>
                  <th>Manufacturer Email</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(manufacturers) &&
                  manufacturers
                    .filter((manufacturer) =>
                      manufacturer.name?.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((manufacturer) => (
                      <tr key={manufacturer._id}>
                        <td>{manufacturer.name}</td>
                        <td>{manufacturer.email}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        )}

             {activeSection === "delivery-feedback" && (
          <div className="feedback-container">
            <div className="feedback-header">
              <h2>Delivery Feedback</h2>
            </div>
        
            <div className="feedback-search">
              <div className="search-box">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search feedback by order ID or email..."
                  value={feedbackSearchTerm}
                  onChange={(e) => setFeedbackSearchTerm(e.target.value)}
                />
                {feedbackSearchTerm && (
                  <FaTimes
                    className="clear-search"
                    onClick={() => setFeedbackSearchTerm("")}
                  />
                )}
              </div>
            </div>
        
            <div className="table-responsive">
              {deliveryFeedbacks.length > 0 ? (
                <table className="feedback-table">
                  <thead>
                    <tr>
                      <th>Order Details</th>
                      <th>Customer Email</th>
                      <th>Timeliness</th>
                      <th>Handling</th>
                      <th>Professionalism</th>
                      <th>Comments</th>
                      <th>Submitted Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deliveryFeedbacks
                      .filter(feedback => {
                        if (!feedbackSearchTerm) return true;
                        const term = feedbackSearchTerm.toLowerCase();
                        return (
                          feedback.order_id.toString().includes(term) ||
                          feedback.user_email.toLowerCase().includes(term)
                        );
                      })
                      .map((feedback) => (
                        <tr key={feedback.id}>
                          <td 
                            className="clickable"
                            onClick={() => {
                              // Fetch the full order details when clicked
                              const fetchOrderDetails = async () => {
                                try {
                                  const { data: order, error } = await supabase
                                    .from('product_order')
                                    .select('*')
                                    .eq('id', feedback.order_id)
                                    .single();
                                  
                                  if (error) throw error;
                                  
                                  if (order) {
                                    setJsonData(order);
                                    setShowJsonModal(true);
                                  } else {
                                    alert('Order details not found');
                                  }
                                } catch (err) {
                                  console.error('Error fetching order details:', err);
                                  alert('Error fetching order details');
                                }
                              };
                              
                              fetchOrderDetails();
                            }}
                          >
                            {feedback.order_id}
                            <FaInfoCircle className="info-icon" />
                          </td>
                          <td>{feedback.user_email}</td>
                          <td>{renderStarRating(feedback.timeliness_rating)}</td>
                          <td>{renderStarRating(feedback.handling_rating)}</td>
                          <td>{renderStarRating(feedback.professionalism_rating)}</td>
                          <td className="comments-cell">
                            {feedback.general_comments || "No comments"}
                          </td>
                          <td>{new Date(feedback.created_at).toLocaleDateString()}</td>
                          <td>
                            <button
                              className="action-btn pdf-btn"
                              onClick={() => generateFeedbackPDF(feedback, 'delivery')}
                            >
                              <FaFilePdf /> PDF
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              ) : (
                <div className="no-data">
                  No delivery feedback available yet.
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeSection === "product-feedback" && (
          <div className="feedback-container">
            <div className="feedback-header">
              <h2>Product Feedback</h2>
            </div>
        
            <div className="feedback-search">
              <div className="search-box">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search feedback by order ID, product ID or email..."
                  value={productFeedbackSearchTerm}
                  onChange={(e) => setProductFeedbackSearchTerm(e.target.value)}
                />
                {productFeedbackSearchTerm && (
                  <FaTimes
                    className="clear-search"
                    onClick={() => setProductFeedbackSearchTerm("")}
                  />
                )}
              </div>
            </div>
        
            <div className="table-responsive">
              {productFeedbacks.length > 0 ? (
                <table className="feedback-table">
                  <thead>
                    <tr>
                      <th>Order Details</th>
                      <th>Product Details</th>
                      <th>Customer Email</th>
                      <th>Quality</th>
                      <th>Functionality</th>
                      <th>Ease of Use</th>
                      <th>Comments</th>
                      <th>Submitted Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productFeedbacks
                      .filter(feedback => {
                        if (!productFeedbackSearchTerm) return true;
                        const term = productFeedbackSearchTerm.toLowerCase();
                        return (
                          feedback.order_id.toString().includes(term) ||
                          feedback.product_id.toString().includes(term) ||
                          feedback.user_email.toLowerCase().includes(term)
                        );
                      })
                      .map((feedback) => (
                        <tr key={feedback.id}>
                          <td 
                            className="clickable"
                            onClick={() => {
                              // Fetch the full order details when clicked
                              const fetchOrderDetails = async () => {
                                try {
                                  const { data: order, error } = await supabase
                                    .from('product_order')
                                    .select('*')
                                    .eq('id', feedback.order_id)
                                    .single();
                                  
                                  if (error) throw error;
                                  
                                  if (order) {
                                    setJsonData(order);
                                    setShowJsonModal(true);
                                  } else {
                                    alert('Order details not found');
                                  }
                                } catch (err) {
                                  console.error('Error fetching order details:', err);
                                  alert('Error fetching order details');
                                }
                              };
                              
                              fetchOrderDetails();
                            }}
                          >
                            {feedback.order_id}
                            <FaInfoCircle className="info-icon" />
                          </td>
                          <td>{feedback.product_id}</td>
                          <td>{feedback.user_email}</td>
                          <td>{renderStarRating(feedback.quality_rating)}</td>
                          <td>{renderStarRating(feedback.functionality_rating)}</td>
                          <td>{renderStarRating(feedback.ease_of_use_rating)}</td>
                          <td className="comments-cell">
                            {feedback.general_comments || "No comments"}
                          </td>
                          <td>{new Date(feedback.created_at).toLocaleDateString()}</td>
                          <td>
                            <button
                              className="action-btn pdf-btn"
                              onClick={() => generateFeedbackPDF(feedback, 'product')}
                            >
                              <FaFilePdf /> PDF
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              ) : (
                <div className="no-data">
                  No product feedback available yet.
                </div>
              )}
            </div>
          </div>
        )}
{activeSection === "pending-approvals" && (
  <div className="pending-approvals p-4">
    <h2 className="text-xl font-semibold mb-4">Pending Manufacturer Approvals</h2>

    {pendingManufacturers.length === 0 ? (
      <p className="text-gray-500">No pending manufacturers.</p>
    ) : (
      <ul className="space-y-4">
        {pendingManufacturers.map((manufacturer, index) => (
          <li
            key={index}
            className="flex justify-between items-center bg-white shadow-md p-4 rounded-lg"
          >
            <div>
              <p className="font-medium">{manufacturer.name}</p>
              <p className="text-sm text-gray-600">{manufacturer.email}</p>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleApprove(manufacturer.email)}
                className="approve-btn px-4 py-2 rounded transition"
              >
                Approve
              </button>
              <button
                onClick={() => handleDecline(manufacturer.email)}
                className="decline-btn px-4 py-2 rounded transition"
              >
                Decline
              </button>
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>
)}


        {activeSection === "settings" && (
          <div className="settings-form">
            <h3>Settings</h3>
            <div className="form-group">
              <label>Email ID</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Old Password</label>
              <input
                type="password"
                placeholder="Enter old password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
            <button onClick={handlePasswordUpdate}>Update Password</button>
          </div>
        )}

        {/* Video Modal */}
        {showVideoModal && (
          <div className="video-modal-overlay" onClick={closeVideoModal}>
            <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-modal-master" onClick={closeVideoModal}>
                &times;
              </button>
              <div className="video-player-container">
                <ReactPlayer
                  url={currentVideoUrl}
                  controls={true}
                  width="100%"
                  height="100%"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MasterDashboard;