import React from "react";
import './app.css'
import Navigation from "./navigation/Navigation";
import Cart from "./cart/Cart";

function App() {

  fetch('https://fakestoreapi.com/products')
  .then( res => res.json())
  .then( response => console.log(response))

  return (
    <>
      <Navigation />
      <Cart />
    </>
  );
}

export default App;
