import React from "react";
import { Routes, Route } from "react-router-dom";
import Products from "./Products";
import Home from "./Home";
import Product from "./Product";
import Cart from './Cart';

function Allroute() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Cart" element={<Cart />} />
      <Route path="/Products" element={<Products />} />
      <Route path="/Products/:id" element={<Product />} />
    </Routes>
  );
}

export default Allroute;
