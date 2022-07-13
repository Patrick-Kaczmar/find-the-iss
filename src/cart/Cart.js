import React from "react";
import './cart.css'

export default function Cart() {
    return (
        <div className="cart-wrapper">
            <button className="cart-btn">cart <span className="notification">3</span></button>
        </div>
    )
}