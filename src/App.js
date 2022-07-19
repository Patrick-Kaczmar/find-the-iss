import React from "react";

function App() {

  fetch("https://api.wheretheiss.at/v1/satellites/25544")
  .then(res => res.json())
  .then(data => console.log(data))

  return (
    <>
      
    </>
  )
}

export default App;
