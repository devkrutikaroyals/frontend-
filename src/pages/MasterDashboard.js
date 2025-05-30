
// import React, { useState, useEffect } from "react";


// import axios from "axios";
// import {
//   FaBars,
//   FaChartPie,
//   FaBox,
//   FaBuilding,
//   FaTags,
//   FaCog,
//   FaSignOutAlt,
//   FaBell,
//   FaUser,
// } from "react-icons/fa";
// import logo from "../images/logo.jpg";
// import "../styles/MasterDashboard.css";
// import { useNavigate } from "react-router-dom";
// const MasterDashboard = () => {
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [totalProducts, setTotalProducts] = useState(0);
//   const [totalManufacturers, setTotalManufacturers] = useState(0);
//   const [activeSection, setActiveSection] = useState("dashboard");
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [manufacturers, setManufacturers] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [oldPassword, setOldPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [notifications, setNotifications] = useState([]);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [pendingManufacturers, setPendingManufacturers] = useState([]);
//   const [email, setEmail] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const navigate = useNavigate();

//   // Fetch total products and companies counts
//   useEffect(() => {
//     axios
//       .get("https://newmedizon.onrender.com/api/total-products")
//       .then((response) => setTotalProducts(response.data.totalProducts || 0))
//       .catch((error) => console.error("Error fetching products:", error));

//     axios
//       .get("https://newmedizon.onrender.com/api/total-manufactures")
//       .then((response) => setTotalManufacturers(response.data.totalCompanies || 0))
//       .catch((error) => console.error("Error fetching total manufacturers:", error));
//   }, []);

//   // Fetch data based on active section
//   useEffect(() => {
//     const token = localStorage.getItem("token"); // Get stored token

//     if (activeSection === "products") {
//       axios
//         .get("https://newmedizon.onrender.com/api/products/list", {
//           headers: {
//             Authorization: `Bearer ${token}`, // Include token in headers
//           },
//         })
//         .then((response) => setProducts(response.data))
//         .catch((error) => console.error("Error fetching products:", error));
//     }

//     if (activeSection === "categories") {
//       axios
//         .get("https://newmedizon.onrender.com/api/categories", {
//           headers: {
//             Authorization: `Bearer ${token}`, // Include token in headers
//           },
//         })
//         .then((response) => {
//           setCategories(Array.isArray(response.data) ? response.data : []);
//         })
//         .catch((error) => console.error("Error fetching categories:", error));
//     }




//     if (activeSection === "companies") {
//       axios
//         .get("https://newmedizon.onrender.com/api/manufacturers", {
//           headers: {
//             Authorization: `Bearer ${token}`, // Include token in headers
//           },
//         })
//         .then((response) => {
//           setManufacturers(Array.isArray(response.data) ? response.data : []);
//         })
//         .catch((error) => console.error("Error fetching manufacturers:", error));
//     }

//     if (activeSection === "pending-approvals") {
//       fetchPendingManufacturers();
//     }
//   }, [activeSection]);

//   const fetchPendingManufacturers = async () => {
//     try {
//       const token = localStorage.getItem("token"); // Get stored token
//       const response = await axios.get("https://newmedizon.onrender.com/api/auth/pending-manufacturers", {
//         headers: {
//           Authorization: `Bearer ${token}`, // Include token in headers
//         },
//       });
//       setPendingManufacturers(response.data);
//     } catch (error) {
//       console.error("Error fetching pending manufacturers:", error);
//     }
//   };

//   const handleApprove = async (email) => {
//     try {
//       const token = localStorage.getItem("token"); // Get stored token
//       await axios.post(
//         "https://newmedizon.onrender.com/api/auth/authorize",
//         { email },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`, // Include token in headers
//           },
//         }
//       );
//       alert("✅ Manufacturer approved!");
//       fetchPendingManufacturers();
//     } catch (error) {
//       console.error("Approval error:", error);
//       alert("❌ Approval failed! " + (error.response?.data?.message || "Please try again."));
//     }
//   };

//   const handleDecline = async (email) => {
//     try {
//       const token = localStorage.getItem("token"); // Get stored token
//       await axios.post(
//         "https://newmedizon.onrender.com/api/auth/decline-manufacturer",
//         { email },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`, // Include token in headers
//           },
//         }
//       );
//       alert("❌ Manufacturer declined!");
//       fetchPendingManufacturers();
//     } catch (error) {
//       console.error("Decline error:", error);
//       alert("❌ Decline failed! " + (error.response?.data?.message || "Please try again."));
//     }
//   };

//   const toggleSidebar = () => {
//     setIsCollapsed(!isCollapsed);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/signup");
//   };

//   const handlePasswordUpdate = async () => {
//     if (newPassword !== confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token"); // Get stored token
//       const response = await axios.put(
//         "https://newmedizon.onrender.com/api/auth/update-password",
//         { email, oldPassword, newPassword },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`, // Include token in headers
//           },
//         }
//       );

//       // Clear form and show success message
//       setEmail("");
//       setOldPassword("");
//       setNewPassword("");
//       setConfirmPassword("");
//       setError("");
//       setMessage(response.data.message);

//       // Redirect to login page after 2 seconds
//       setTimeout(() => {
//         navigate("/login");
//       }, 2000);
//     } catch (error) {
//       setMessage("");
//       setError(error.response?.data?.message || "Error updating password.");
//     }
//   };

//   const toggleNotifications = () => {
//     setShowNotifications(!showNotifications);
//   };

//   const handleAccept = (id) => {
//     setNotifications(notifications.filter((notification) => notification.id !== id));
//   };

//   const handleDelete = (id) => {
//     setNotifications(notifications.filter((notification) => notification.id !== id));
//   };


//   const toggleDropdown = (category) => {
//     setSelectedCategory(selectedCategory === category ? null : category);
//   };  


//   return (
//     <div className="dashboard-container">
//       {/* Sidebar */}
//       <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
//         <div className="sidebar-logo">
//           <img src={logo} alt="Company Logo" />
//         </div>
//         <button className="toggle-btn" onClick={toggleSidebar}>
//           <FaBars />
//         </button>
//         <ul>
//           <li onClick={() => setActiveSection("dashboard")}>
//             <FaChartPie />
//             <span>Dashboard</span>
//           </li>
//           <li onClick={() => setActiveSection("products")}>
//             <FaBox />
//             <span>Products</span>
//           </li>
//           <li onClick={() => setActiveSection("companies")}>
//             <FaBuilding />
//             <span>Manufacturer</span>
//           </li>
//           <li onClick={() => setActiveSection("categories")}>
//             <FaTags />
//             <span>Category</span>
//           </li>
//           <li onClick={() => setActiveSection("pending-approvals")}>
//             <FaUser />
//             <span>Pending Approvals</span>
//           </li>
//           <li onClick={() => setActiveSection("settings")}>
//             <FaCog />
//             <span>Settings</span>
//           </li>
//         </ul>
//         <button className="logout-btn" onClick={handleLogout}>
//           <FaSignOutAlt />
//           <span>Logout</span>
//         </button>
//       </div>

//       {/* Main Content */}
//       <div className={`content ${isCollapsed ? "collapsed" : ""}`}>
//         <div className="header">
//           <h2>Welcome to the Admin Panel</h2>
//           <div className="notification-container">
//             <FaBell className="notification-icon" onClick={toggleNotifications} />
//             {notifications.length > 0 && (
//               <span className="notification-badge">{notifications.length}</span>
//             )}
//             {showNotifications && (
//               <div className="notification-dropdown">
//                 {notifications.length === 0 ? (
//                   <p>No new requests</p>
//                 ) : (
//                   notifications.map((notification) => (
//                     <div key={notification.id} className="notification-item">
//                       <p>{notification.message}</p>
//                       <button onClick={() => handleAccept(notification.id)}>Accept</button>
//                       <button onClick={() => handleDelete(notification.id)}>Delete</button>
//                     </div>
//                   ))
//                 )}
//               </div>
//             )}
//           </div>
//         </div>

//         {activeSection === "dashboard" && (
//           <div className="stats">
//             <div className="stat-box">
//               <h3>Total Products</h3>
//               <p>{totalProducts}</p>
//             </div>
//             <div className="stat-box">
//               <h3>Total Manufacturers</h3>
//               <p>{totalManufacturers}</p>
//             </div>
//           </div>
//         )}

//         {activeSection === "products" && (
//           <div>
//             <h3>Products</h3>
//             <input
//               type="text"
//               placeholder="Search products..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="search-bar"
//             />
//             <div className="product-list">
//               {Array.isArray(products) &&
//                 products
//                   .filter((product) =>
//                     product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                     product.manufacturer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                     product.category?.toLowerCase().includes(searchQuery.toLowerCase())
//                   )
//                   .map((product) => (
//                     <div key={product._id} className="product-card">
//                       <img src={product.imageUrl} alt={product.name} />
//                       <h4>{product.name}</h4>
//                       <p>
//                         <strong>Manufacturer:</strong> {product.manufacturer?.name}
//                       </p>
//                       <p>{product.description}</p>
//                       <p>
//                         <strong>Price:</strong> ₹{product.price}
//                       </p>
//                       <p>
//                         <strong>Category:</strong> {product.category}
//                       </p>
//                       <p>
//                         <strong>Stock:</strong> {product.stock}
//                       </p>
//                     </div>
//                   ))}
//             </div>
//           </div>
//         )}
// {activeSection === "categories" && (
//   <div>
//     <h3>Categories</h3>
//     <input
//       type="text"
//       value={searchQuery}
//       onChange={(e) => setSearchQuery(e.target.value)}
//       placeholder="Search categories..."
//       className="search-bar"
//     />
//     <div className="category-list">
//       {Array.isArray(categories) &&
//         categories
//           .filter((category) =>
//             category.category?.toLowerCase().includes(searchQuery.toLowerCase())
//           )
//           .map((category, index) => (
//             <div key={index} className="category-card">
//               <img
//                 src={category.imageUrl}
//                 alt={category.category}
//                 onClick={() => toggleDropdown(category.category)}
//                 style={{ cursor: "pointer" }}
//               />
//               <h4 onClick={() => toggleDropdown(category.category)} style={{ cursor: "pointer" }}>
//                 {category.category}
//               </h4>

//               {/* Dropdown for category products */}
//               {selectedCategory === category.category && (
//                 <div className="dropdown">
//                   {category.products && category.products.length > 0 ? (
//                     category.products.map((product, i) => (
//                       <div key={i} className="product-item">
//                         <img src={product.imageUrl} alt={product.name} />
//                         <p>{product.name}</p>
//                       </div>
//                     ))
//                   ) : (
//                     <p>No products available</p>
//                   )}
//                 </div>
//               )}
//             </div>
//           ))}
//     </div>
//   </div>
// )}

//         {activeSection === "companies" && (
//           <div>
//             <h3>Manufacturers</h3>
//             <div className="search-container">
//               <input
//                 type="text"
//                 placeholder="Search manufacturers..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="search-bar"
//               />
//               <button onClick={() => { /* Implement search functionality if needed */ }}>
//                 Search
//               </button>
//             </div>
//             <table className="manufacturer-table">
//               <thead>
//                 <tr>
//                   <th>Manufacturer Name</th>
//                   <th>Manufacturer Email</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {Array.isArray(manufacturers) &&
//                   manufacturers
//                     .filter((manufacturer) =>
//                       manufacturer.name?.toLowerCase().includes(searchQuery.toLowerCase())
//                     )
//                     .map((manufacturer) => (
//                       <tr key={manufacturer._id}>
//                         <td>{manufacturer.name}</td>
//                         <td>{manufacturer.email}</td>
//                       </tr>
//                     ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {activeSection === "pending-approvals" && (
//           <div className="pending-approvals">
//             <h2>Pending Manufacturer Approvals</h2>
//             {pendingManufacturers.length === 0 ? (
//               <p>No pending manufacturers.</p>
//             ) : (
//               <ul>
//                 {pendingManufacturers.map((manufacturer, index) => (
//                   <li key={index}>
//                     <span>
//                       {manufacturer.name} - {manufacturer.email}
//                     </span>
//                     <button onClick={() => handleApprove(manufacturer.email)}>Approve</button>
//                     <button onClick={() => handleDecline(manufacturer.email)}>Decline</button>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         )}

//         {activeSection === "settings" && (
//           <div className="settings-form">
//             <h3>Settings</h3>
//             <div className="form-group">
//               <label>Email ID</label>
//               <input
//                 type="email"
//                 placeholder="Enter your email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </div>
//             <div className="form-group">
//               <label>Old Password</label>
//               <input
//                 type="password"
//                 placeholder="Enter old password"
//                 value={oldPassword}
//                 onChange={(e) => setOldPassword(e.target.value)}
//               />
//             </div>
//             <div className="form-group">
//               <label>New Password</label>
//               <input
//                 type="password"
//                 placeholder="Enter new password"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//               />
//             </div>
//             <div className="form-group">
//               <label>Confirm Password</label>
//               <input
//                 type="password"
//                 placeholder="Confirm new password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//               />
//             </div>
//             {message && <p className="success-message">{message}</p>}
//             {error && <p className="error-message">{error}</p>}
//             <button onClick={handlePasswordUpdate}>Update Password</button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MasterDashboard;

import React, { useState, useEffect } from "react";
import axios from "axios";
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
  FaFilter
} from "react-icons/fa";
import logo from "../images/logo.jpg";
import "../styles/MasterDashboard.css";
import { useNavigate } from "react-router-dom";
import ReactPlayer from 'react-player';
import { FaVideo } from 'react-icons/fa';


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
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const navigate = useNavigate();

  // Fetch total products and companies counts
  useEffect(() => {
    axios
      .get("https://newmedizon.onrender.com/api/total-products")
      .then((response) => setTotalProducts(response.data.totalProducts || 0))
      .catch((error) => console.error("Error fetching products:", error));

    axios
      .get("https://newmedizon.onrender.com/api/total-manufactures")
      .then((response) => setTotalManufacturers(response.data.totalCompanies || 0))
      .catch((error) => console.error("Error fetching total manufacturers:", error));
  }, []);

  // Fetch data based on active section
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (activeSection === "products") {
      axios
        .get("https://newmedizon.onrender.com/api/products/list", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setProducts(response.data);
          // Extract unique locations from products
          const uniqueLocations = [...new Set(response.data.map(product => product.location))];
          setLocations(uniqueLocations);
        })
        .catch((error) => console.error("Error fetching products:", error));
    }

    if (activeSection === "categories") {
      axios
        .get("https://newmedizon.onrender.com/api/categories", {
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
        .get("https://newmedizon.onrender.com/api/manufacturers", {
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
  }, [activeSection]);

  const fetchPendingManufacturers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://newmedizon.onrender.com/api/auth/pending-manufacturers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPendingManufacturers(response.data);
    } catch (error) {
      console.error("Error fetching pending manufacturers:", error);
    }
  };

  const handleApprove = async (email) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://newmedizon.onrender.com/api/auth/authorize",
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("✅ Manufacturer approved!");
      fetchPendingManufacturers();
    } catch (error) {
      console.error("Approval error:", error);
      alert("❌ Approval failed! " + (error.response?.data?.message || "Please try again."));
    }
  };

  const handleDecline = async (email) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://newmedizon.onrender.com/api/auth/decline-manufacturer",
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
        "https://newmedizon.onrender.com/api/auth/update-password",
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

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setActiveSection("category-products");
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

  // Filter products based on search query and selected location
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

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-logo">
          <img src={logo} alt="Company Logo" />
        </div>
        <button className="toggle-btn" onClick={toggleSidebar}>
          <FaBars />
        </button>
        <ul>
          <li onClick={() => setActiveSection("dashboard")}>
            <FaChartPie />
            <span>Dashboard</span>
          </li>
          <li onClick={() => setActiveSection("products")}>
            <FaBox />
            <span>Products</span>
          </li>
          <li onClick={() => setActiveSection("companies")}>
            <FaBuilding />
            <span>Manufacturer</span>
          </li>
          <li onClick={() => setActiveSection("categories")}>
            <FaTags />
            <span>Category</span>
          </li>
          <li onClick={() => setActiveSection("pending-approvals")}>
            <FaUser />
            <span>Pending Approvals</span>
          </li>
          <li onClick={() => setActiveSection("settings")}>
            <FaCog />
            <span>Settings</span>
          </li>
        </ul>
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
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
          <div className="stats">
            <div className="stat-box">
              <h3>Total Products</h3>
              <p>{totalProducts}</p>
            </div>
            <div className="stat-box">
              <h3>Total Manufacturers</h3>
              <p>{totalManufacturers}</p>
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

            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-bar"
            />

            <div className="product-list">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div key={product._id} className="product-card">
                    <img src={product.imageUrl} alt={product.name} />
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

                    <p>
                      <strong>Video :</strong>
                    </p>
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

                  </div>
                ))
              ) : (
                <p className="no-products">No products found matching your criteria.</p>
              )}
            </div>
          </div>
        )}

        {activeSection === "categories" && (
          <div>
            <h3>Categories</h3>
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-bar"
            />
            <div className="category-list">
              {Array.isArray(categories) &&
                categories
                  .filter((category) =>
                    category.category?.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((category, index) => (
                    <div key={index} className="category-card" onClick={() => handleCategoryClick(category.category)}>
                      <img src={category.imageUrl} alt={category.category} />
                      <h4>{category.category}</h4>
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
                    <div key={product._id} className="product-card">
                      <img src={product.imageUrl} alt={product.name} />
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
                      <p>
                        <strong>Location:</strong> {product.location}
                      </p>
                      <p>
                        <strong>Company Name:</strong> {product.companyName}
                      </p>
                      <p>
                        <strong>Video :</strong>{product.videoUrl}
                      </p>

                      {product.videoUrl && (
                        <div className="video-section">
                          <button
                            className="video-button"
                            onClick={() => openVideoModal(product.videoUrl)}
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
          <div>
            <h3>Manufacturers</h3>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search manufacturers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-bar"
              />
              <button onClick={() => { }}>
                Search
              </button>
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

        {activeSection === "pending-approvals" && (
          <div className="pending-approvals">
            <h2>Pending Manufacturer Approvals</h2>
            {pendingManufacturers.length === 0 ? (
              <p>No pending manufacturers.</p>
            ) : (
              <ul>
                {pendingManufacturers.map((manufacturer, index) => (
                  <li key={index}>
                    <span>
                      {manufacturer.name} - {manufacturer.email}
                    </span>
                    <button onClick={() => handleApprove(manufacturer.email)}>Approve</button>
                    <button onClick={() => handleDecline(manufacturer.email)}>Decline</button>
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