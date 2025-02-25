export const createProduct = async (productData) => {
    try {
      const response = await fetch("http://localhost:5000/api/products/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`, // Ensure token is stored correctly
        },
        body: JSON.stringify(productData),
      });
  
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create product");
      }
      
      return data;
    } catch (error) {
      console.error("❌ Error creating product:", error.message);
      throw error;
    }
  };
  