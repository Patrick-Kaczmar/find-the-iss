import React from "react";
import Navigation from "./navigation/Navigation";

function App() {

  fetch('https://fakestoreapi.com/products')
  .then( res => res.json())
  .then( response => console.log(response))

  return (
    <>
      <Navigation />
    </>
  );
}

export default App;
