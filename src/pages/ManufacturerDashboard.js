

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   FaBars, FaChartPie, FaBox, FaSignOutAlt, FaTruck, 
//   FaCogs, FaClipboardList, FaEdit, FaTrash, FaPlus
// } from "react-icons/fa";
// import logo from "../images/logo.jpg";
// import "../styles/ManufacturerDashboard.css";

// const ManufacturerDashboard = () => {
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [activePage, setActivePage] = useState("dashboard");
//   const [products, setProducts] = useState([]);
//   const [editProduct, setEditProduct] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [formValues, setFormValues] = useState({
//     name: "",
//     description: "",
//     price: "",
//     category: "",
//     stock: "",
//     imageUrl: "",
//     imageFile: null,
//   });

//   // Dashboard statistics
//   const [totalProducts, setTotalProducts] = useState(0);
//   const [totalShipments, setTotalShipments] = useState(0);
//   const [totalOrders, setTotalOrders] = useState(0);
  
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (activePage === "products") {
//       fetchProducts();
//     } else if (activePage === "dashboard") {
//       fetchDashboardData();
//     }
//   }, [activePage]);

//   const getToken = () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       alert("No token found. Please log in again.");
//       navigate("/login");
//     }
//     return token;
//   };

//   const fetchProducts = async () => {
//     try {
//       const response = await axios.get("https://newmedizon.onrender.com/api/products/manufacturer", {
//         headers: { Authorization: `Bearer ${getToken()}` },
//       });
//       setProducts(response.data);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     }
//   };

//   const fetchDashboardData = async () => {
//     try {
//       const [productRes, shipmentRes, orderRes] = await Promise.all([
//         axios.get("https://newmedizon.onrender.com/api/manufacturedashboard/products", {
//           headers: { Authorization: `Bearer ${getToken()}` },
//         }),
//         axios.get("https://newmedizon.onrender.com/api/manufacturedashboard/shipments", {
//           headers: { Authorization: `Bearer ${getToken()}` },
//         }),
//         axios.get("https://newmedizon.onrender.com/api/manufacturedashboard/orders", {
//           headers: { Authorization: `Bearer ${getToken()}` },
//         }),
//       ]);

//       setTotalProducts(productRes.data.totalProducts);
//       setTotalShipments(shipmentRes.data.totalShipments);
//       setTotalOrders(orderRes.data.totalOrders);
//     } catch (error) {
//       console.error("Error fetching dashboard data:", error);
//     }
//   };

//   const saveProduct = async (e) => {
//     e.preventDefault();

//     if (!formValues.name || !formValues.price || !formValues.stock || !formValues.category) {
//       alert("Please fill required fields");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("name", formValues.name);
//     formData.append("description", formValues.description);
//     formData.append("price", formValues.price);
//     formData.append("category", formValues.category);
//     formData.append("stock", formValues.stock);
//     if (formValues.imageFile) {
//       formData.append("imageFile", formValues.imageFile);
//     }

//     try {
//       const url = editProduct
//         ? `https://newmedizon.onrender.com/api/products/${editProduct._id}`
//         : "https://newmedizon.onrender.com/api/products";

//       const method = editProduct ? "put" : "post";

//       const response = await axios({
//         method,
//         url,
//         data: formData,
//         headers: {
//           Authorization: `Bearer ${getToken()}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       if (response.status === 200 || response.status === 201) {
//         alert("Product saved successfully!");
//         fetchProducts();
//         closeModal();
//       }
//     } catch (error) {
//       console.error("Error saving product:", error.response?.data);
//       alert(error.response?.data?.message || "Error saving product");
//     }
//   };

//   const deleteProduct = async (id) => {
//     if (!id) {
//       alert("Invalid product ID!");
//       return;
//     }

//     if (!window.confirm("Are you sure you want to delete this product?")) return;

//     try {
//       await axios.delete(`https://newmedizon.onrender.com/api/products/${id}`, {
//         headers: { Authorization: `Bearer ${getToken()}` },
//       });
//       alert("Product deleted successfully!");
//       fetchProducts();
//     } catch (error) {
//       console.error("Error deleting product:", error);
//       alert("Error deleting product. Please try again.");
//     }
//   };

//   const openModal = (product = null) => {
//     if (product) {
//       setEditProduct(product);
//       setFormValues({
//         name: product.name || "",
//         description: product.description || "",
//         price: product.price || "",
//         category: product.category || "",
//         stock: product.stock || "",
//         imageUrl: product.imageUrl || "",
//         imageFile: null,
//       });
//     } else {
//       resetForm();
//     }
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     resetForm();
//   };

//   const resetForm = () => {
//     setFormValues({
//       name: "",
//       description: "",
//       price: "",
//       category: "",
//       stock: "",
//       imageUrl: "",
//       imageFile: null,
//     });
//     setEditProduct(null);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormValues((prevState) => ({ ...prevState, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const previewUrl = URL.createObjectURL(file);
//       setFormValues(prev => ({
//         ...prev,
//         imageFile: file,
//         imageUrl: previewUrl
//       }));
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("manufacturerId");
//     navigate("/login");
//   };

//   return (
//     <div className="dashboard-container">
//       <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
//         <div className="sidebar-logo">
//           <img src={logo} alt="Company Logo" />
//         </div>
//         <button className="toggle-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
//           <FaBars />
//         </button>
//         <ul>
//           <li onClick={() => setActivePage("dashboard")}>
//             <FaChartPie />
//             <span>Dashboard</span>
//           </li>
//           <li onClick={() => setActivePage("products")}>
//             <FaBox />
//             <span>Products</span>
//           </li>
//           <li onClick={() => setActivePage("orders")}>
//             <FaClipboardList />
//             <span>Orders</span>
//           </li>
//           <li onClick={() => setActivePage("shipments")}>
//             <FaTruck />
//             <span>Shipments</span>
//           </li>
//           <li onClick={() => setActivePage("settings")}>
//             <FaCogs />
//             <span>Settings</span>
//           </li>
//         </ul>
//         <button className="logout-btn" onClick={handleLogout}>
//           <FaSignOutAlt />
//           <span>Logout</span>
//         </button>
//       </div>

//       <div className={`content ${isCollapsed ? "collapsed" : ""}`}>
//         <div className="header">
//           <h1>Manufacturer Dashboard</h1>
//         </div>

//         {activePage === "dashboard" && (
//           <div>
//             <h2 className="header">Dashboard Overview</h2>
//             <div className="dashboard-cards">
//               <div className="card">
//                 <h3>Total Orders</h3>
//                 <p>{totalOrders}</p>
//                 <div className="view-all-btn">View All</div>
//               </div>
//               <div className="card">
//                 <h3>Total Products</h3>
//                 <p>{totalProducts}</p>
//                 <div className="view-all-btn">View All</div>
//               </div>
//               <div className="card">
//                 <h3>Total Shipments</h3>
//                 <p>{totalShipments}</p>
//                 <div className="view-all-btn">View All</div>
//               </div>
//             </div>
//           </div>
//         )}

//         {activePage === "products" && (
//           <div className="products-container">
//             <h2>Products</h2>
//             <button className="add-product-btn" onClick={() => openModal()}>
//               <FaPlus /> Add Product
//             </button>
//             <table>
//               <thead>
//                 <tr>
//                   <th>Image</th>
//                   <th>Name</th>
//                   <th>Description</th>
//                   <th>Price</th>
//                   <th>Category</th>
//                   <th>Stock</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {products.length > 0 ? (
//                   products.map((product) => (
//                     <tr key={product._id}>
//                       <td>
//                         {product.imageUrl && (
//                           <img 
//                             src={product.imageUrl} 
//                             alt={product.name}
//                             className="product-image"
//                           />
//                         )}
//                       </td>
//                       <td>{product.name}</td>
//                       <td className="description-cell">
//                         {product.description || "No description"}
//                       </td>
//                       <td>${product.price}</td>
//                       <td>{product.category}</td>
//                       <td>{product.stock}</td>
//                       <td>
//                         <button onClick={() => openModal(product)}>
//                           <FaEdit />
//                         </button>
//                         <button onClick={() => deleteProduct(product._id)}>
//                           <FaTrash />
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="7">No products available</td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {isModalOpen && (
//           <div className="modal-overlay">
//             <div className="modal">
//               <h3>{editProduct ? "Edit Product" : "Add Product"}</h3>
//               <form onSubmit={saveProduct}>
//                 <label>Name</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formValues.name}
//                   onChange={handleInputChange}
//                   placeholder="Product Name"
//                   required
//                 />

//                 <label>Description</label>
//                 <textarea
//                   name="description"
//                   value={formValues.description}
//                   onChange={handleInputChange}
//                   placeholder="Product Description"
//                 />

//                 <label>Price</label>
//                 <input
//                   type="number"
//                   name="price"
//                   value={formValues.price}
//                   onChange={handleInputChange}
//                   placeholder="Product Price"
//                   required
//                 />

//                 <label>Category</label>
//                 <input
//                   type="text"
//                   name="category"
//                   value={formValues.category}
//                   onChange={handleInputChange}
//                   placeholder="Product Category"
//                 />

//                 <label>Stock</label>
//                 <input
//                   type="number"
//                   name="stock"
//                   value={formValues.stock}
//                   onChange={handleInputChange}
//                   placeholder="Product Stock"
//                   required
//                 />

//                 <label>Product Image</label>
//                 <input 
//                   type="file" 
//                   name="imageFile" 
//                   onChange={handleFileChange}
//                   accept="image/*"
//                 />

//                 {formValues.imageUrl && (
//                   <img 
//                     src={formValues.imageUrl} 
//                     alt="Preview" 
//                     className="image-preview"
//                   />
//                 )}

//                 <div className="modal-actions">
//                   <button type="submit" className="btn-primary">
//                     {editProduct ? "Save Changes" : "Add Product"}
//                   </button>
//                   <button 
//                     type="button" 
//                     onClick={closeModal}
//                     className="btn-secondary"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ManufacturerDashboard;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaBars, FaChartPie, FaBox, FaSignOutAlt, FaTruck, 
  FaCogs, FaClipboardList, FaEdit, FaTrash, FaPlus
} from "react-icons/fa";
import logo from "../images/logo.jpg";
import "../styles/ManufacturerDashboard.css";

const ManufacturerDashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activePage, setActivePage] = useState("dashboard"); // Use activePage instead of activeSection
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  
  const [email, setEmail] = useState("");
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    imageUrl: "",
    imageFile: null,
  });

  // Dashboard statistics
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalShipments: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (activePage === "products") {
      fetchProducts();
    } else if (activePage === "dashboard") {
      fetchDashboardData();
    }
  }, [activePage]);

  const getToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found. Please log in again.");
      navigate("/login");
    }
    return token;
  };
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/products/manufacturer", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      console.log("API Response:", response.data); // Log the response
      setProducts(response.data.products || []); // Fallback to an empty array if products is undefined
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]); // Set products to an empty array in case of error
    }
  };

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get("https://newmedizon.onrender.com/api/products/manufacturer", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setDashboardData(response.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const saveProduct = async (e) => {
    e.preventDefault();

    if (!formValues.name || !formValues.price || !formValues.stock || !formValues.category) {
      alert("Please fill required fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", formValues.name);
    formData.append("description", formValues.description);
    formData.append("price", formValues.price);
    formData.append("category", formValues.category);
    formData.append("stock", formValues.stock);
    if (formValues.imageFile) {
      formData.append("imageFile", formValues.imageFile);
    }

    try {
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
    }
  };

  const deleteProduct = async (id) => {
    if (!id) {
      alert("Invalid product ID!");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`https://newmedizon.onrender.com/api/products/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      alert("Product deleted successfully!");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product. Please try again.");
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
        imageUrl: product.imageUrl || "",
        imageFile: null,
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
      imageUrl: "",
      imageFile: null,
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
      const previewUrl = URL.createObjectURL(file);
      setFormValues(prev => ({
        ...prev,
        imageFile: file,
        imageUrl: previewUrl
      }));
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
      const token = localStorage.getItem("token"); // Get stored token
      const response = await axios.put(
        "https://newmedizon.onrender.com/api/auth/update-password",
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
      <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-logo">
          <img src={logo} alt="Company Logo" />
        </div>
        <button className="toggle-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
          <FaBars />
        </button>
        <ul>
          <li onClick={() => setActivePage("dashboard")}>
            <FaChartPie />
            <span>Dashboard</span>
          </li>
          <li onClick={() => setActivePage("products")}>
            <FaBox />
            <span>Products</span>
          </li>
          <li onClick={() => setActivePage("orders")}>
            <FaClipboardList />
            <span>Orders</span>
          </li>
          <li onClick={() => setActivePage("shipments")}>
            <FaTruck />
            <span>Shipments</span>
          </li>
          <li onClick={() => setActivePage("settings")}>
            <FaCogs />
            <span>Settings</span>
          </li>
        </ul>
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>

      <div className={`content ${isCollapsed ? "collapsed" : ""}`}>
        <div className="header">
          <h1>Manufacturer Dashboard</h1>
        </div>

        {activePage === "dashboard" && (
          <div>
            <h2 className="header">Dashboard Overview</h2>
            <div className="dashboard-cards">
              <div className="card">
                <h3>Total Orders</h3>
                <p>{dashboardData.totalOrders}</p>
                <div className="view-all-btn">View All</div>
              </div>
              <div className="card">
                <h3>Total Products</h3>
                <p>{dashboardData.totalProducts}</p>
                <div className="view-all-btn">View All</div>
              </div>
              <div className="card">
                <h3>Total Shipments</h3>
                <p>{dashboardData.totalShipments}</p>
                <div className="view-all-btn">View All</div>
              </div>
            </div>
          </div>
        )}

{activePage === "products" && (
  <div className="products-container">
    <h2>Products</h2>
    <button className="add-product-btn" onClick={() => openModal()}>
      <FaPlus /> Add Product
    </button>
    <table>
      <thead>
        <tr>
          <th>Image</th>
          <th>Name</th>
          <th>Description</th>
          <th>Price</th>
          <th>Category</th>
          <th>Stock</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.length > 0 ? (
          products.map((product) => (
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
              <td>{product.name}</td>
              <td className="description-cell">
                {product.description || "No description"}
              </td>
              <td>${product.price}</td>
              <td>{product.category}</td>
              <td>{product.stock}</td>
              <td>
                <button onClick={() => openModal(product)}>
                  <FaEdit />
                </button>
                <button onClick={() => deleteProduct(product._id)}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="7">No products available. Click "Add Product" to create one.</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
)}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>{editProduct ? "Edit Product" : "Add Product"}</h3>
              <form onSubmit={saveProduct}>
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formValues.name}
                  onChange={handleInputChange}
                  placeholder="Product Name"
                  required
                />

                <label>Description</label>
                <textarea
                  name="description"
                  value={formValues.description}
                  onChange={handleInputChange}
                  placeholder="Product Description"
                />

                <label>Price</label>
                <input
                  type="number"
                  name="price"
                  value={formValues.price}
                  onChange={handleInputChange}
                  placeholder="Product Price"
                  required
                />

                <label>Category</label>
                <input
                  type="text"
                  name="category"
                  value={formValues.category}
                  onChange={handleInputChange}
                  placeholder="Product Category"
                />

                <label>Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={formValues.stock}
                  onChange={handleInputChange}
                  placeholder="Product Stock"
                  required
                />

                <label>Product Image</label>
                <input 
                  type="file" 
                  name="imageFile" 
                  onChange={handleFileChange}
                  accept="image/*"
                />

                {formValues.imageUrl && (
                  <img 
                    src={formValues.imageUrl} 
                    alt="Preview" 
                    className="image-preview"
                  />
                )}

                <div className="modal-actions">
                  <button type="submit" className="btn-primary">
                    {editProduct ? "Save Changes" : "Add Product"}
                  </button>
                  <button 
                    type="button" 
                    onClick={closeModal}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activePage === "settings" && (
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

export default ManufacturerDashboard;
