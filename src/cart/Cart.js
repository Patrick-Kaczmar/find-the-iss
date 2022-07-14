import React, {useRef} from "react"
import "./cart.css"
import StoreItiems from "../storeItems/StoreItems"

export default function Cart() {
  
    const modal = useRef()
    function toggleModal() {
        if (modal.current.classList.contains('no-show')) {
            modal.current.classList.remove('no-show')
        } else {modal.current.classList.add('no-show')}
    }

  return (
    <>
      <div className="cart-wrapper">
        <button onClick={toggleModal} className="cart-btn">
          cart <span className="notification">3</span>
        </button>
      </div>
      <div className="store-modal-container">
        <StoreItiems />
        <aside ref={modal} className="cart-modal">
            MODAL
        </aside>
      </div>
    </>
  )
}
