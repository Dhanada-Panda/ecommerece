import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Allroute from "./components/Allroute";
import { useCart, CartProvider } from "react-use-cart";
function App() {
  return (
    <div>
      <CartProvider>
        <Navbar />
        <Allroute />
      </CartProvider>
    </div>
  );
}

export default App;
