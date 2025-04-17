
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { createClient } from '@supabase/supabase-js';
// import axios from "axios";
// import {
//   FaBars, FaChartPie, FaBox, FaSignOutAlt, FaTruck, 
//   FaCogs, FaClipboardList, FaEdit, FaTrash, FaPlus
// } from "react-icons/fa";
// import logo from "../images/logo.jpg";
// import "../styles/ManufacturerDashboard.css";

// const SUPABASE_URL = 'https://wxcqhslupuixynbjgncf.supabase.co';
// const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4Y3Foc2x1cHVpeHluYmpnbmNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MjYyNjEsImV4cCI6MjA1NzAwMjI2MX0.u6vJb-zV6rFUU3HGpgNgQlmxDZfTgbpDcxTgbmEZeM0'; // Ensure this is secure
// const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// async function loadData() {
//   let { data: orders, error } = await supabase
//   .from('orders')
//   .select('*')
//   console.log(error)
//   console.log(orders)
// }


// const ManufacturerDashboard = () => {
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [activePage, setActivePage] = useState("dashboard");
//   const [products, setProducts] = useState([]);
//   const [editProduct, setEditProduct] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [oldPassword, setOldPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [email, setEmail] = useState("");
//   const [orders, setOrders] = useState([]);
//   const [formValues, setFormValues] = useState({
//     name: "",
//     description: "",
//     price: "",
//     category: "",
//     stock: "",
//     imageUrl: "",
//     imageFile: null,
//   });
//   const [dashboardData, setDashboardData] = useState({
//     totalProducts: 0,
//     totalOrders: 0,
//     totalShipments: 0,
//   });

//   const navigate = useNavigate();

//   useEffect(() => {
//     if (activePage === "products") {
//       fetchProducts();
//     } else if (activePage === "orders") {
//       fetchOrders();
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
//         try {
//           const response = await axios.get("https://newmedizon.onrender.com/api/products/manufacturer", {
//             headers: { Authorization: `Bearer ${getToken()}` },
//           });
//           console.log("API Response:", response.data.products); // Log the response
//           setProducts(response.data.products || []);
          
          
          
//            // Fallback to an empty array if products is undefined
//         } catch (error) {
//           console.error("Error fetching products:", error);
//           setProducts([]); // Set products to an empty array in case of error
//         }
//       };
    
      // const fetchDashboardData = async () => {
      //   try {
      //     const response = await axios.get("https://newmedizon.onrender.com/api/products/manufacturer", {
      //       headers: { Authorization: `Bearer ${getToken()}` },
      //     });
      //     setDashboardData(response.data);
      //   } catch (error) {
      //     console.error("Error fetching dashboard data:", error);
      //   }
      // };

//   const fetchOrders = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('orders')
//         .select('*');
//       if (error) throw error;
//       setOrders(data || []);
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//       setOrders([]);
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

//   const handlePasswordUpdate = async () => {
//     if (newPassword !== confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }
//     try {
//       const token = getToken();
//       const response = await axios.put(
//         "https://newmedizon.onrender.com/api/auth/update-password",
//         { email, oldPassword, newPassword },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setEmail("");
//       setOldPassword("");
//       setNewPassword("");
//       setConfirmPassword("");
//       setError("");
//       setMessage(response.data.message);
//       setTimeout(() => { navigate("/login"); }, 2000);
//     } catch (error) {
//       setMessage("");
//       setError(error.response?.data?.message || "Error updating password.");
//     }
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
//                 <p>{dashboardData.totalOrders}</p>
//                 <div className="view-all-btn">View All</div>
//               </div>
//               <div className="card">
//                 <h3>Total Products</h3>
//                 <p>{dashboardData.totalProducts}</p>
//                 <div className="view-all-btn">View All</div>
//               </div>
//               <div className="card">
//                 <h3>Total Shipments</h3>
//                 <p>{dashboardData.totalShipments}</p>
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
//                     <td colSpan="7">No products available. Click "Add Product" to create one.</td>
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

//         {activePage === "orders" && (
//           <div className="orders-container">
//             <h2>Orders</h2>
//             <table>
//               <thead>
//                 <tr>
//                   <th>ID</th>
//                   <th>Email</th>
//                   <th>Full Name</th>
//                   <th>Contact Number</th>
//                   <th>Total Amount</th>
//                   <th>Payment Method</th>
//                   <th>Items</th>
//                   <th>Created At</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {orders.length > 0 ? (
//                   orders.map((order) => (
//                     <tr key={order.id}>
//                       <td>{order.id}</td>
//                       <td>{order.email}</td>
//                       <td>{order.full_name}</td>
//                       <td>{order.contact_number}</td>
//                       <td>{order.total_amount}</td>
//                       <td>{order.payment_method}</td>
//                       <td>{JSON.stringify(order.items)}</td>
//                       <td>{new Date(order.created_at).toLocaleString()}</td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="8">No orders available.</td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {activePage === "settings" && (
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

// export default ManufacturerDashboard;



// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { createClient } from '@supabase/supabase-js';
// import axios from "axios";
// import {
//   FaBars, FaChartPie, FaBox, FaSignOutAlt, FaTruck, 
//   FaCogs, FaClipboardList, FaEdit, FaTrash, FaPlus
// } from "react-icons/fa";
// import logo from "../images/logo.jpg";
// import "../styles/ManufacturerDashboard.css";

// const SUPABASE_URL = 'https://wxcqhslupuixynbjgncf.supabase.co';
// const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4Y3Foc2x1cHVpeHluYmpnbmNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MjYyNjEsImV4cCI6MjA1NzAwMjI2MX0.u6vJb-zV6rFUU3HGpgNgQlmxDZfTgbpDcxTgbmEZeM0'; // Ensure this is secure
// const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// async function loadData() {
//   let { data: orders, error } = await supabase
//   .from('orders')
//   .select('*')
//   console.log(error)
//   console.log(orders)
// }


// const ManufacturerDashboard = () => {
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [activePage, setActivePage] = useState("dashboard");
//   const [products, setProducts] = useState([]);
//   const [editProduct, setEditProduct] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [oldPassword, setOldPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [email, setEmail] = useState("");
//   const [orders, setOrders] = useState([]);
//   const [formValues, setFormValues] = useState({
//     name: "",
//     description: "",
//     price: "",
//     category: "",
//     stock: "",
//     imageUrl: "",
//     imageFile: null,
//   });
//   const [dashboardData, setDashboardData] = useState({
//     totalProducts: 0,
//     totalOrders: 0,
//     totalShipments: 0,
//   });

//   const navigate = useNavigate();

//   useEffect(() => {
//     if (activePage === "products") {
//       fetchProducts();
//     } else if (activePage === "orders") {
//       fetchOrders();
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
//         try {
//           const response = await axios.get("https://newmedizon.onrender.com/api/products/manufacturer", {
//             headers: { Authorization: `Bearer ${getToken()}` },
//           });
//           console.log("API Response:", response.data.products); // Log the response
//           setProducts(response.data.products || []);
          
          
          
//            // Fallback to an empty array if products is undefined
//         } catch (error) {
//           console.error("Error fetching products:", error);
//           setProducts([]); // Set products to an empty array in case of error
//         }
//       };
    

// const fetchDashboardData = async () => {
//   try {
//       // Fetch manufacturer products data
//       const manufacturerResponse = await axios.get("https://newmedizon.onrender.com/api/products/manufacturer", {
//           headers: { Authorization: `Bearer ${getToken()}` },
//       });

//       // Fetch orders data using Supabase
//       const { data: ordersData, error: ordersError } = await supabase
//           .from('orders')
//           .select('*');

//       if (ordersError) {
//           throw ordersError;
//       }

//       // Fetch products data using Axios
//       const productsResponse = await axios.get("https://newmedizon.onrender.com/api/products/manufacturer", {
//           headers: { Authorization: `Bearer ${getToken()}` },
//       });

//       // Update the dashboard state with product and order data
//       setDashboardData({
//           manufacturerData: manufacturerResponse.data,
//           totalProducts: productsResponse.data.products.length, // Update this line
//           totalOrders: ordersData.length, 
//       });
//   } catch (error) {
//       console.error("Error fetching dashboard data:", error);
//   }
// };

//   const fetchOrders = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('orders')
//         .select('*');
//       if (error) throw error;
//       setOrders(data || []);
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//       setOrders([]);
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

//   const handlePasswordUpdate = async () => {
//     if (newPassword !== confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }
//     try {
//       const token = getToken();
//       const response = await axios.put(
//         "https://newmedizon.onrender.com/api/auth/update-password",
//         { email, oldPassword, newPassword },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setEmail("");
//       setOldPassword("");
//       setNewPassword("");
//       setConfirmPassword("");
//       setError("");
//       setMessage(response.data.message);
//       setTimeout(() => { navigate("/login"); }, 2000);
//     } catch (error) {
//       setMessage("");
//       setError(error.response?.data?.message || "Error updating password.");
//     }
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
//           {/* <li onClick={() => setActivePage("shipments")}>
//             <FaTruck />
//             <span>Shipments</span>
//           </li> */}
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
//     <div>
//         <h2 className="header">Dashboard Overview</h2>
//         <div className="dashboard-cards">
//             <div className="card">
//                 <h3>Total Orders</h3>
//                 <p>{dashboardData.totalOrders}</p>
//                 <div className="view-all-btn">View All</div>
//             </div>
//             <div className="card">
//                 <h3>Total Products</h3>
//                 <p>{dashboardData.totalProducts}</p>  
//                 <div className="view-all-btn">View All</div>
//             </div>
//             {/* <div className="card">
//                 <h3>Total Shipments</h3>
//                 <p>{dashboardData.totalShipments}</p>
//                 <div className="view-all-btn">View All</div>
//             </div> */}
//         </div>
//     </div>
// )}
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
//                     <td colSpan="7">No products available. Click "Add Product" to create one.</td>
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

//         {activePage === "orders" && (
//           <div className="orders-container">
//             <h2>Orders</h2>
//             <table>
//               <thead>
//                 <tr>
//                   <th>ID</th>
//                   <th>Email</th>
//                   <th>Full Name</th>
//                   <th>Contact Number</th>
//                   <th>Total Amount</th>
//                   <th>Payment Method</th>
//                   <th>Items</th>
//                   <th>Created At</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {orders.length > 0 ? (
//                   orders.map((order) => (
//                     <tr key={order.id}>
//                       <td>{order.id}</td>
//                       <td>{order.email}</td>
//                       <td>{order.full_name}</td>
//                       <td>{order.contact_number}</td>
//                       <td>{order.total_amount}</td>
//                       <td>{order.payment_method}</td>
//                       <td>{JSON.stringify(order.items)}</td>
//                       <td>{new Date(order.created_at).toLocaleString()}</td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="8">No orders available.</td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {activePage === "settings" && (
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

// export default ManufacturerDashboard;



// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { createClient } from '@supabase/supabase-js';
// import axios from "axios";
// import {
//   FaBars, FaChartPie, FaBox, FaSignOutAlt, FaTruck, 
//   FaCogs, FaClipboardList, FaEdit, FaTrash, FaPlus
// } from "react-icons/fa";
// import logo from "../images/logo.jpg";
// import "../styles/ManufacturerDashboard.css";

// const SUPABASE_URL = 'https://wxcqhslupuixynbjgncf.supabase.co';
// const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4Y3Foc2x1cHVpeHluYmpnbmNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MjYyNjEsImV4cCI6MjA1NzAwMjI2MX0.u6vJb-zV6rFUU3HGpgNgQlmxDZfTgbpDcxTgbmEZeM0'; // Ensure this is secure
// const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// async function loadData() {
//   let { data: orders, error } = await supabase
//   .from('orders')
//   .select('*')
//   console.log(error)
//   console.log(orders)
// }

// const ManufacturerDashboard = () => {
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [activePage, setActivePage] = useState("dashboard");
//   const [products, setProducts] = useState([]);
//   const [editProduct, setEditProduct] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [oldPassword, setOldPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [email, setEmail] = useState("");
//   const [orders, setOrders] = useState([]);
//   const [formValues, setFormValues] = useState({
//     name: "",
//     description: "",
//     price: "",
//     category: "",
//     stock: "",
//     imageUrl: "",
//     imageFile: null,
//   });
//   const [dashboardData, setDashboardData] = useState({
//     totalProducts: 0,
//     totalOrders: 0,
//     totalShipments: 0,
//   });

//   const navigate = useNavigate();

//   useEffect(() => {
//     if (activePage === "products") {
//       fetchProducts();
//     } else if (activePage === "orders") {
//       fetchOrders();
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
//       console.log("API Response:", response.data.products); // Log the response
//       setProducts(response.data.products || []);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//       setProducts([]); // Set products to an empty array in case of error
//     }
//   };

//   const fetchDashboardData = async () => {
//     try {
//       // Fetch manufacturer products data
//       const manufacturerResponse = await axios.get("https://newmedizon.onrender.com/api/products/manufacturer", {
//         headers: { Authorization: `Bearer ${getToken()}` },
//       });

//       // Fetch orders data using Supabase
//       const { data: ordersData, error: ordersError } = await supabase
//         .from('orders')
//         .select('*');

//       if (ordersError) {
//         throw ordersError;
//       }

//       // Fetch products data using Axios
//       const productsResponse = await axios.get("https://newmedizon.onrender.com/api/products/manufacturer", {
//         headers: { Authorization: `Bearer ${getToken()}` },
//       });

//       // Update the dashboard state with product and order data
//       setDashboardData({
//         manufacturerData: manufacturerResponse.data,
//         totalProducts: productsResponse.data.products.length, // Update this line
//         totalOrders: ordersData.length, 
//       });
//     } catch (error) {
//       console.error("Error fetching dashboard data:", error);
//     }
//   };

//   const fetchOrders = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('orders')
//         .select('*');
//       if (error) throw error;
//       setOrders(data || []);
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//       setOrders([]);
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

//   const handlePasswordUpdate = async () => {
//     if (newPassword !== confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }
//     try {
//       const token = getToken();
//       const response = await axios.put(
//         "https://newmedizon.onrender.com/api/auth/update-password",
//         { email, oldPassword, newPassword },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setEmail("");
//       setOldPassword("");
//       setNewPassword("");
//       setConfirmPassword("");
//       setError("");
//       setMessage(response.data.message);
//       setTimeout(() => { navigate("/login"); }, 2000);
//     } catch (error) {
//       setMessage("");
//       setError(error.response?.data?.message || "Error updating password.");
//     }
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
//                 <p>{dashboardData.totalOrders}</p>
//                 <div 
//                   className="view-all-btn" 
//                   onClick={() => setActivePage("orders")} // Redirect to orders page
//                 >
//                   View All
//                 </div>
//               </div>
//               <div className="card">
//                 <h3>Total Products</h3>
//                 <p>{dashboardData.totalProducts}</p>  
//                 <div className="view-all-btn"
//                 onClick={() => setActivePage("products")}>View All</div>
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
//                     <td colSpan="7">No products available. Click "Add Product" to create one.</td>
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

//         {activePage === "orders" && (
//           <div className="orders-container">
//             <h2>Orders</h2>
//             <table>
//               <thead>
//                 <tr>
//                   <th>ID</th>
//                   <th>Email</th>
//                   <th>Full Name</th>
//                   <th>Contact Number</th>
//                   <th>Total Amount</th>
//                   <th>Payment Method</th>
//                   <th>Items</th>
//                   <th>Created At</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {orders.length > 0 ? (
//                   orders.map((order) => (
//                     <tr key={order.id}>
//                       <td>{order.id}</td>
//                       <td>{order.email}</td>
//                       <td>{order.full_name}</td>
//                       <td>{order.contact_number}</td>
//                       <td>{order.total_amount}</td>
//                       <td>{order.payment_method}</td>
//                       <td>{JSON.stringify(order.items)}</td>
//                       <td>{new Date(order.created_at).toLocaleString()}</td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="8">No orders available.</td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {activePage === "settings" && (
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

// export default ManufacturerDashboard;



import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from '@supabase/supabase-js';
import axios from "axios";
import {
  FaBars, FaChartPie, FaBox, FaSignOutAlt, FaTruck, 
  FaCogs, FaClipboardList, FaEdit, FaTrash, FaPlus
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
  const [orders, setOrders] = useState([]);
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    location: "",
    imageUrl: "",
    imageFile: null,
  });

  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    totalOrders: 0,
  });

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
    if (activePage === "products") {
      fetchProducts();
    } else if (activePage === "orders") {
      fetchOrders();
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
      const response = await axios.get("https://newmedizon.onrender.com/api/products/manufacturer", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const manufacturerResponse = await axios.get("https://newmedizon.onrender.com/api/products/manufacturer", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*');

      if (ordersError) {
        throw ordersError;
      }

      const productsResponse = await axios.get("https://newmedizon.onrender.com/api/products/manufacturer", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      setDashboardData({
        manufacturerData: manufacturerResponse.data,
        totalProducts: productsResponse.data.products.length,
        totalOrders: ordersData.length,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*');
      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    }
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    if (!formValues.name || !formValues.price || !formValues.stock || !formValues.category || !formValues.location) {
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
        location: product.location || "",
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
      location: "",
      imageUrl: "",
      imageFile: null,
    });
    setEditProduct(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validation logic
    if (name === "name" && value.length > 50) {
      alert("Name should not exceed 50 characters.");
      return;
    }
    if (name === "description" && value.length > 20) {
      alert("Description should not exceed 20 characters.");
      return;
    }
    
    if (name === "price" && (value.length > 5 || isNaN(value))) {
      alert("Price should be a number with a maximum of 5 digits.");
      return;
    }
    if (name === "stock" && (value.length > 5 || isNaN(value))) {
      alert("Stock should be a number with a maximum of 5 digits.");
      return;
    }

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
      const token = getToken();
      const response = await axios.put(
        "https://newmedizon.onrender.com/api/auth/update-password",
        { email, oldPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEmail("");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError("");
      setMessage(response.data.message);
      setTimeout(() => { navigate("/login"); }, 2000);
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
                <div className="view-all-btn"
                onClick={() => setActivePage("products")}>View All</div>
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
                  <th>Location</th>
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
                      <td>{product.location}</td>
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
                    <td colSpan="8">No products available. Click "Add Product" to create one.</td>
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
                <label>Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={formValues.stock}
                  onChange={handleInputChange}
                  placeholder="Product Stock"
                  required
                />
                <label>Location</label>
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

        {activePage === "orders" && (
          <div className="orders-container">
            <h2>Orders</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Full Name</th>
                  <th>Contact Number</th>
                  <th>Total Amount</th>
                  <th>Payment Method</th>
                  <th>Items</th>
                  <th>Created At</th>
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
                      <td>{order.total_amount}</td>
                      <td>{order.payment_method}</td>
                      <td>{JSON.stringify(order.items)}</td>
                      <td>{new Date(order.created_at).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8">No orders available.</td>
                  </tr>
                )}
              </tbody>
            </table>
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