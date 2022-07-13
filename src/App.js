import React from "react";
import './app.css'
import Navigation from "./navigation/Navigation";
import Cart from "./cart/Cart";
import StoreItiems from "./storeItems/StoreItems";
import Modal from "./modal/Modal";

function App() {

  fetch('https://fakestoreapi.com/products')
  .then( res => res.json())
  .then( response => console.log(response))

  return (
    <>
      <Navigation />
      <Cart />
      <div className="main-container">
        <StoreItiems />
        <Modal />
      </div>
      
    </>
  );
}

export default App;
