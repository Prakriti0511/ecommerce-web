// Products.jsx
import React, { useState, useEffect } from 'react';
import styles from './Products.module.css';  // CSS Module for scoped styling

const Products = () => {
  // State for products, loading status, and error message
  const [products, setProducts] = useState([]);   // expected: array of {id, name, image, price}
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch product data from backend on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json(); // assume API returns JSON array of products
        setProducts(data);
      } catch (err) {
        setError(err);  // Save the error to show message
      } finally {
        setLoading(false);  // Done loading whether success or error
      }
    };

    fetchProducts();
  }, []); // Empty dependency array → run once on mount

  // Render loading state
  if (loading) {
    return <div className={styles.message}>Loading products...</div>;
  }

  // Render error state
  if (error) {
    return <div className={styles.message}>Error: {error.message}</div>;
  }

  // Render product list when data is available
  return (
    <div className={styles.products}>
      {products.map(product => (
        <div key={product.id} className={styles.productCard}>
          {/* Product image */}
          <img 
            src={product.image} 
            alt={product.name} 
            className={styles.productImage} 
          />
          {/* Product name */}
          <h2 className={styles.productName}>{product.name}</h2>
          {/* Product price */}
          <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
};

export default Products;
