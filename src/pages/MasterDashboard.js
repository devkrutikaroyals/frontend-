
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
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

// const MasterDashboard = () => {
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [totalProducts, setTotalProducts] = useState(0);
//   const [totalCompanies, setTotalCompanies] = useState(0);
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
//   const navigate = useNavigate();

//   // Fetch total products and companies counts
//   useEffect(() => {
//     axios
//       .get("http://localhost:5000/api/total-products")
//       .then((response) => setTotalProducts(response.data.totalProducts || 0))
//       .catch((error) => console.error("Error fetching products:", error));

//     axios
//       .get("http://localhost:5000/api/total-companies")
//       .then((response) => setTotalCompanies(response.data.totalCompanies || 0))
//       .catch((error) => console.error("Error fetching companies:", error));
//   }, []);

//   // Fetch data based on active section
//   useEffect(() => {
//     const token = localStorage.getItem("token"); // Get stored token

//     if (activeSection === "products") {
//       axios
//         .get("http://localhost:5000/api/products/list", {
//           headers: {
//             Authorization: `Bearer ${token}`, // Include token in headers
//           },
//         })
//         .then((response) => setProducts(response.data))
//         .catch((error) => console.error("Error fetching products:", error));
//     }

//     if (activeSection === "categories") {
//       axios
//         .get("http://localhost:5000/api/categories", {
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
//         .get("http://localhost:5000/api/manufacturers", {
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
//       const response = await axios.get("http://localhost:5000/api/auth/pending-manufacturers", {
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
//         "http://localhost:5000/api/auth/authorize",
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
//         "http://localhost:5000/api/auth/decline-manufacturer",
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
//       const userId = localStorage.getItem("userId"); // Replace with your actual logic
//       const response = await axios.put(
//         "http://localhost:5000/api/update-password",
//         { userId, oldPassword, newPassword },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`, // Include token in headers
//           },
//         }
//       );
//       setMessage(response.data.message);
//       setError("");
//     } catch (error) {
//       setMessage("");
//       setError(error.response?.data?.message || "Error updating password");
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

//   return (
//     <div className="dashboard-container">
//       {/* Sidebar */}
//       <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
//         <div className="sidebar-logo">
//           <img src={logo} alt="Company Logo" />
//           {!isCollapsed && <span>Master Dashboard</span>}
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

//         <div className="main-content">
//           {activeSection === "dashboard" && (
//             <div className="stats">
//               <div className="stat-box">
//                 <h3>Total Products</h3>
//                 <p>{totalProducts}</p>
//               </div>
//               <div className="stat-box">
//                 <h3>Total Manufacturer</h3>
//                 <p>{totalCompanies}</p>
//               </div>
//             </div>
//           )}

//           {activeSection === "products" && (
//             <div>
//               <h3>Products</h3>
//               <input
//                 type="text"
//                 placeholder="Search products..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="search-bar"
//               />
//               <div className="product-list">
//                 {Array.isArray(products) &&
//                   products
//                     .filter((product) =>
//                       product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                       product.manufacturer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                       product.category?.toLowerCase().includes(searchQuery.toLowerCase())
//                     )
//                     .map((product) => (
//                       <div key={product._id} className="product-card">
//                         <img src={product.imageUrl} alt={product.name} />
//                         <h4>{product.name}</h4>
//                         <p>
//                           <strong>Manufacturer:</strong> {product.manufacturer?.name}
//                         </p>
//                         <p>{product.description}</p>
//                         <p>
//                           <strong>Price:</strong> ₹{product.price}
//                         </p>
//                         <p>
//                           <strong>Category:</strong> {product.category}
//                         </p>
//                         <p>
//                           <strong>Stock:</strong> {product.stock}
//                         </p>
//                       </div>
//                     ))}
//               </div>
//             </div>
//           )}

//           {activeSection === "categories" && (
//             <div>
//               <h3>Categories</h3>
//               <input
//                 type="text"
//                 placeholder="Search categories..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="search-bar"
//               />
//               <div className="category-list">
//                 {Array.isArray(categories) &&
//                   categories
//                     .filter((category) =>
//                       category.category?.toLowerCase().includes(searchQuery.toLowerCase())
//                     )
//                     .map((category, index) => (
//                       <div key={index} className="category-card">
//                         <img src={category.imageUrl} alt={category.category} />
//                         <h4>{category.category}</h4>
//                       </div>
//                     ))}
//               </div>
//             </div>
//           )}

//           {activeSection === "companies" && (
//             <div>
//               <h3>Manufacturers</h3>
//               <div className="search-container">
//                 <input
//                   type="text"
//                   placeholder="Search manufacturers..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="search-bar"
//                 />
//                 <button onClick={() => { /* Implement search functionality if needed */ }}>
//                   Search
//                 </button>
//               </div>
//               <table className="manufacturer-table">
//                 <thead>
//                   <tr>
//                     <th>Manufacturer Name</th>
//                     <th>Manufacturer Email</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {Array.isArray(manufacturers) &&
//                     manufacturers
//                       .filter((manufacturer) =>
//                         manufacturer.name?.toLowerCase().includes(searchQuery.toLowerCase())
//                       )
//                       .map((manufacturer) => (
//                         <tr key={manufacturer._id}>
//                           <td>{manufacturer.name}</td>
//                           <td>{manufacturer.email}</td>
//                         </tr>
//                       ))}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           {activeSection === "pending-approvals" && (
//             <div className="pending-approvals">
//               <h2>Pending Manufacturer Approvals</h2>
//               {pendingManufacturers.length === 0 ? (
//                 <p>No pending manufacturers.</p>
//               ) : (
//                 <ul>
//                   {pendingManufacturers.map((manufacturer, index) => (
//                     <li key={index}>
//                       <span>
//                         {manufacturer.name} - {manufacturer.email}
//                       </span>
//                       <button onClick={() => handleApprove(manufacturer.email)}>Approve</button>
//                       <button onClick={() => handleDecline(manufacturer.email)}>Decline</button>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           )}

//           {activeSection === "settings" && (
//             <div className="settings-form">
//               <h3>Settings</h3>
//               <div className="form-group">
//                 <label>Email ID</label>
//                 <input
//                   type="email"
//                   placeholder="Enter your email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Old Password</label>
//                 <input
//                   type="password"
//                   placeholder="Enter old password"
//                   value={oldPassword}
//                   onChange={(e) => setOldPassword(e.target.value)}
//                 />
//               </div>
//               <div className="form-group">
//                 <label>New Password</label>
//                 <input
//                   type="password"
//                   placeholder="Enter new password"
//                   value={newPassword}
//                   onChange={(e) => setNewPassword(e.target.value)}
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Confirm Password</label>
//                 <input
//                   type="password"
//                   placeholder="Confirm new password"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                 />
//               </div>
//               {message && <p className="success-message">{message}</p>}
//               {error && <p className="error-message">{error}</p>}
//               <button onClick={handlePasswordUpdate}>Update Password</button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MasterDashboard;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
} from "react-icons/fa";
import logo from "../images/logo.jpg";
import "../styles/MasterDashboard.css";

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
  const navigate = useNavigate();

  // Fetch total products and companies counts
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/total-products")
      .then((response) => setTotalProducts(response.data.totalProducts || 0))
      .catch((error) => console.error("Error fetching products:", error));

    axios
      .get("http://localhost:5000/api/total-manufactures")
      .then((response) => setTotalManufacturers(response.data.totalCompanies || 0))
      .catch((error) => console.error("Error fetching total manufacturers:", error));
  }, []);

  // Fetch data based on active section
  useEffect(() => {
    const token = localStorage.getItem("token"); // Get stored token

    if (activeSection === "products") {
      axios
        .get("http://localhost:5000/api/products/list", {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in headers
          },
        })
        .then((response) => setProducts(response.data))
        .catch((error) => console.error("Error fetching products:", error));
    }

    if (activeSection === "categories") {
      axios
        .get("http://localhost:5000/api/categories", {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in headers
          },
        })
        .then((response) => {
          setCategories(Array.isArray(response.data) ? response.data : []);
        })
        .catch((error) => console.error("Error fetching categories:", error));
    }

    if (activeSection === "companies") {
      axios
        .get("http://localhost:5000/api/manufacturers", {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in headers
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
      const token = localStorage.getItem("token"); // Get stored token
      const response = await axios.get("http://localhost:5000/api/auth/pending-manufacturers", {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in headers
        },
      });
      setPendingManufacturers(response.data);
    } catch (error) {
      console.error("Error fetching pending manufacturers:", error);
    }
  };

  const handleApprove = async (email) => {
    try {
      const token = localStorage.getItem("token"); // Get stored token
      await axios.post(
        "http://localhost:5000/api/auth/authorize",
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in headers
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
      const token = localStorage.getItem("token"); // Get stored token
      await axios.post(
        "http://localhost:5000/api/auth/decline-manufacturer",
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in headers
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
      const token = localStorage.getItem("token"); // Get stored token
      const response = await axios.put(
        "http://localhost:5000/api/auth/update-password",
        { email, oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in headers
          },
        }
      );

      // Clear form and show success message
      setEmail("");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError("");
      setMessage(response.data.message);

      // Redirect to login page after 2 seconds
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
            <h3>Products</h3>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-bar"
            />
            <div className="product-list">
              {Array.isArray(products) &&
                products
                  .filter((product) =>
                    product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.manufacturer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.category?.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((product) => (
                    <div key={product._id} className="product-card">
                      <img src={product.imageUrl} alt={product.name} />
                      <h4>{product.name}</h4>
                      <p>
                        <strong>Manufacturer:</strong> {product.manufacturer?.name}
                      </p>
                      <p>{product.description}</p>
                      <p>
                        <strong>Price:</strong> ₹{product.price}
                      </p>
                      <p>
                        <strong>Category:</strong> {product.category}
                      </p>
                      <p>
                        <strong>Stock:</strong> {product.stock}
                      </p>
                    </div>
                  ))}
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
                    <div key={index} className="category-card">
                      <img src={category.imageUrl} alt={category.category} />
                      <h4>{category.category}</h4>
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
              <button onClick={() => { /* Implement search functionality if needed */ }}>
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
      </div>
    </div>
  );
};

export default MasterDashboard;