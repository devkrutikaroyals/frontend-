import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from '@supabase/supabase-js';
import axios from "axios";
import {
  FaBars, FaChartPie, FaBox, FaSignOutAlt, FaTruck, 
  FaCogs, FaClipboardList, FaEdit, FaTrash, FaPlus,
  FaVideo, FaSearch, FaFilter, FaTimes, FaCheck, FaTimesCircle,
  FaInfoCircle, FaSync
} from "react-icons/fa";
import logo from "../images/logo.jpg";
import "../styles/ManufacturerDashboard.css";

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
  // Add these to your existing state declarations
const [cartItems, setCartItems] = useState([]);
const [orderTotal, setOrderTotal] = useState(0);
const [currentUserId, setCurrentUserId] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [jsonData, setJsonData] = useState(null);
  const [updatingStocks, setUpdatingStocks] = useState({});
  
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
  });

  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    totalOrders: 0,
    recentOrders: [],
  });

  const orderStatuses = ['pending', 'completed', 'cancelled', 'shipped'];
  const orderStatusColors = {
    pending: 'orange',
    completed: 'green',
    cancelled: 'red',
    shipped: 'blue'
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

  const filterProducts = () => {
    let result = [...products];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(term) ||
        product.company.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term)
      );
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
    if (!formValues.name || !formValues.price || !formValues.stock || 
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

  // Add this test function to your component
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

// Usage example:
// testProductUpdate('6811b51f1a9ee5aaacf59ede', -2)
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
          `https://newmedizon.onrender.com/api/products/update-stock/${item.product_id}`,
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
            `https://newmedizon.onrender.com/api/products/update-stock/${item.product_id}`,
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
      items: items, // Use the passed items
      total_amount: totalAmount, // Use the passed total
      customer_id: userId, // Use the passed userId
      // other required order fields...
      status: 'pending',
      payment_method: 'cash', // or get from state
      address: {}, // get from state or props
      contact_number: '', // get from state or props
      email: email // from your existing state
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
      
      const { data: currentOrder, error: fetchError } = await supabase
        .from('product_order')
        .select('*')
        .eq('id', orderId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Stock updates for completed/cancelled orders
      if (newStatus === 'cancelled') {
        // Restore stock for cancelled orders
        for (const item of currentOrder.items) {
          await axios.put(
            `https://newmedizon.onrender.com/api/products/update-stock/${item.product_id}`,
            { quantity: item.quantity },
            { 
              headers: { 
                Authorization: `Bearer ${getToken()}`,
                'Content-Type': 'application/json'
              } 
            }
          );
        }
      } else if (newStatus === 'completed' && currentOrder.status !== 'completed') {
        // Finalize stock reduction for completed orders
        for (const item of currentOrder.items) {
          await axios.put(
            `https://newmedizon.onrender.com/api/products/update-stock/${item.product_id}`,
            { quantity: -item.quantity },
            { 
              headers: { 
                Authorization: `Bearer ${getToken()}`,
                'Content-Type': 'application/json'
              } 
            }
          );
        }
      }

      // Update order status in Supabase
      const { data, error } = await supabase
        .from('product_order')
        .update({ status: newStatus })
        .eq('id', orderId);
      
      if (error) throw error;
      
      // Refresh all data
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
  const syncStockLevels = async () => {
    try {
      setIsLoading(true);
      console.log("Starting stock synchronization...");
      
      // 1. Get pending orders
      const { data: pendingOrders, error: orderError } = await supabase
        .from('product_order')
        .select('*')
        .eq('status', 'pending');
      
      if (orderError) {
        console.error("Supabase order fetch error:", orderError);
        throw orderError;
      }
  
      if (!pendingOrders?.length) {
        console.log("No pending orders found");
        alert("No pending orders to process");
        return;
      }
  
      console.log(`Found ${pendingOrders.length} pending orders`);
  
      // 2. Process each order
      for (const order of pendingOrders) {
        try {
          console.log(`Processing order ${order.id}`);
          
          if (!order.items?.length) {
            console.warn(`Order ${order.id} has no items, skipping`);
            continue;
          }
  
          // 3. Verify stock for all items
          const stockPromises = order.items.map(item => 
            axios.get(`https://newmedizon.onrender.com/api/products/${item.product_id}`, {
              headers: { Authorization: `Bearer ${getToken()}` }
            }).catch(err => {
              console.error(`Stock check failed for product ${item.product_id}:`, err);
              throw err;
            })
          );
  
          const stockResponses = await Promise.all(stockPromises);
          
          // 4. Check stock levels
          const stockIssues = order.items.filter((item, index) => {
            const product = stockResponses[index]?.data;
            if (!product) {
              console.error(`Product ${item.product_id} not found`);
              return true;
            }
            return product.stock < item.quantity;
          });
  
          if (stockIssues.length > 0) {
            console.warn(`Order ${order.id} has stock issues:`, stockIssues);
            await supabase
              .from('product_order')
              .update({ status: 'out_of_stock' })
              .eq('id', order.id);
            continue;
          }
  
          // 5. Update stock for each item
          const updatePromises = order.items.map(item =>
            axios.put(
              `https://newmedizon.onrender.com/api/products/update-stock/${item.product_id}`,
              { quantity: -item.quantity },
              { 
                headers: { 
                  Authorization: `Bearer ${getToken()}`,
                  'Content-Type': 'application/json'
                } 
              }
            ).catch(err => {
              console.error(`Stock update failed for product ${item.product_id}:`, err);
              throw err;
            })
          );
  
          await Promise.all(updatePromises);
          console.log(`Stock updated for order ${order.id}`);
  
          // 6. Mark order as processed
          const { error: updateError } = await supabase
            .from('product_order')
            .update({ status: 'processed' })
            .eq('id', order.id);
  
          if (updateError) throw updateError;
          console.log(`Order ${order.id} marked as processed`);
  
        } catch (orderError) {
          console.error(`Failed to process order ${order.id}:`, {
            error: orderError,
            response: orderError.response?.data,
            status: orderError.response?.status
          });
          
          // Mark order as failed
          await supabase
            .from('product_order')
            .update({ status: 'sync_failed' })
            .eq('id', order.id);
        }
      }
  
      alert("Stock synchronization completed!");
      fetchProducts();
      if (activePage === 'orders') fetchOrders();
  
    } catch (mainError) {
      console.error("Sync failed completely:", {
        error: mainError,
        response: mainError.response?.data,
        status: mainError.response?.status
      });
      alert(`Sync failed: ${mainError.message}`);
    } finally {
      setIsLoading(false);
    }
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
    setJsonData(product);
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
      <button 
  className="sync-btn" 
  onClick={syncStockLevels}
  disabled={isLoading}
>
  <FaSync /> Sync Stock
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
    {updatingStocks[product._id] !== undefined 
      ? updatingStocks[product._id] 
      : product.stock}
  </td>

                        <td>{product.location}</td>
                        <td>{product.size}</td>
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
                    <label>Price*</label>
                    <input
                      type="number"
                      name="price"
                      value={formValues.price}
                      onChange={handleInputChange}
                      placeholder="Product Price"
                      
                      min="0"
                      step="0.01"
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
    <h2>Orders</h2>
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((orderItem) => (
              <tr key={orderItem.id}>
                <td>{orderItem.id}</td>
                <td>{orderItem.email}</td>
                <td>{orderItem.full_name}</td>
                <td>{orderItem.contact_number}</td>
                <td>₹{orderItem.total_amount}</td>
                <td>{orderItem.payment_method}</td>
                <td>{renderStatusBadge(orderItem.status || 'pending')}</td>
                <td className="address-cell">
                  {orderItem.address && (
                    <>
                      <div>{orderItem.address.street}</div>
                      <div>{orderItem.address.city}, {orderItem.address.state}</div>
                      <div>{orderItem.address.postal_code}</div>
                    </>
                  )}
                </td>
                <td className="items-cell">
                  {orderItem.items && orderItem.items.map((item, index) => (
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
                <td>{new Date(orderItem.created_at).toLocaleDateString()}</td>
                <td className="order-actions">
                  {orderItem.status !== 'completed' && orderItem.status !== 'cancelled' && (
                    <button
                      className="complete-btn"
                      onClick={() => handleOrderStatusChange(orderItem.id, 'completed')}
                      disabled={isLoading}
                    >
                      <FaCheck /> Complete
                    </button>
                  )}
                  {orderItem.status !== 'cancelled' && (
                    <button
                      className="cancel-btn"
                      onClick={() => handleOrderStatusChange(orderItem.id, 'cancelled')}
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
              <td colSpan="11" className="no-data">No orders available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
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