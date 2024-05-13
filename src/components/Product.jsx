import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { useCart } from "react-use-cart";
import { NavLink } from "react-router-dom";

const Product = () => {
  const { id } = useParams();
  const { addItem } = useCart(); // Move useCart hook here

  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);
  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://fakestoreapi.com/products/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product data");
        }
        const data = await response.json();
        setProduct(data);
        setError(null); // Clear any previous error
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch product data"); // Set error message
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, [id]); // Include id in the dependency array

  //add to cart message part

  const addToCart = () => {
    addItem(product);
    setAddedToCart(true); // Set addedToCart to true when item is added to the cart
    // Reset addedToCart after 3 seconds
    setTimeout(() => {
      setAddedToCart(false);
    }, 3000);
  };

  // Loading component
  const Loading = () => {
    return (
      <div>
        <div className="col-md-6">
          <Skeleton height={400} />
        </div>
        <div className="col-md-6" style={{ lineHeight: 2 }}>
          <Skeleton height={50} width={300} />
          <Skeleton height={75} />
          <Skeleton height={25} width={150} />
          <Skeleton height={50} />
          <Skeleton height={150} />
          <Skeleton height={50} width={100} />
          <Skeleton height={50} width={100} style={{ marginLeft: 6 }} />
        </div>
      </div>
    );
  };

  // Show Products component
  const ShowProducts = () => {
    return (
      <>
        <div className="col-md-6">
          <img
            src={product.image}
            alt={product.title}
            height="400px"
            width="400px"
          />
        </div>
        <div className="col-md-6">
          <h4 className="text-uppercase text-black-50">{product.category}</h4>
          <h1 className="display-5">{product.title}</h1>
          <p className="lead fw-bolder">
            Rating {product.rating && product.rating.rate}
            <i className="fa fa-star"></i>
          </p>
          <h3 className="display-6 fw-bold my-4">${product.price}</h3>
          <p className="lead">{product.description}</p>
          <button
            className="btn btn-outline-dark px-2 py-2"
            onClick={addToCart} // Pass product directly
          >
            Add to Cart
          </button>
          {addedToCart && (
            <div className="text-success mt-2">Item added to cart!</div>
          )}
          <NavLink to="/Cart" className="btn btn-dark ms-2 px-3">
            Go to Cart
          </NavLink>
        </div>
      </>
    );
  };

  // Error component
  const Error = ({ message }) => {
    return <div>Error: {message}</div>;
  };

  return (
    <div>
      <div className="container py-5">
        <div className="row py-4">
          {loading ? (
            <Loading />
          ) : error ? (
            <Error message={error} />
          ) : (
            <ShowProducts />
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;
