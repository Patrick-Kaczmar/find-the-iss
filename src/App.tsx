import React from 'react';
import './App.css';

function Welcome(props: any): JSX.Element {
  return <h1>Hello, {props.name}</h1>
}


function App() {
  return (
    <div>
      <Welcome name='sara'/>
    </div>
  )
}

export default App;
