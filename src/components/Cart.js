import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Cart.css'
import logo from '../assets/sweet-dainties-logo.jpeg'
import home from '../assets/home.png'
import { FaWhatsapp } from "react-icons/fa";
import Modal from "react-modal";
import { FaInstagram, FaFacebook } from 'react-icons/fa';


const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, []);

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };
  const handleCartClick = () => {
    navigate('/')
  };

  const [remarks, setRemarks] = useState('');

  const handleInputChange = (event) => {
    setRemarks(event.target.value);
  };

  const createWhatsAppLink = () => {
    const itemDetails = cartItems.map(
      (item, index) =>
        `${index + 1}. ${item.name} - Price: $${item.price}, Quantity: ${item.quantity}`
    );
  
    const formattedItemDetails = itemDetails.join("\n");
  
    const message = `Hi Sweet Dainties,\nI would like to order the following.\nI have *${cartItems.length}* item(s) in my cart:\n${formattedItemDetails}\nRemarks:\n- *${remarks}*`;
  
    const totalPriceMessage = `\nTotal Price: $${calculateTotalPrice()}`;
  
    const encodedMessage = encodeURIComponent(message + totalPriceMessage);
  
    const phoneNumber = "6596906771";
    return `https://wa.me/${phoneNumber}/?text=${encodedMessage}`;
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate('/')
  };
  const iconStyle = {
    fontSize: '24px',
    margin: '0 10px',
    color: '#333',
    transition: 'color 0.3s ease-in-out',
};
  return (
    <div className="cart-container">
      <header className="header">
        <img className="logo" src={logo} alt="Product Logo" />
        <div className="cartwrapper">
          <img
            className="home"
            src={home}
            alt="home"
            onClick={handleCartClick}
          />
          <div className="cart-counter" id="cart-counter">
            Home
          </div>
        </div>
      </header>
      <h2 className="cart-title">Your Cart</h2>
      <div className="cart-items-container">
        {cartItems.length === 0 ? (
          <p className="empty-cart-message">Your cart is empty.</p>
        ) : (
          <div className="cart-items-list">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="cart-item-image">
                  <img
                    src={require(`../assets/${item.name}.png`)}
                    alt={item.name}
                  />
                </div>
                <div className="cart-item-details">
                  <h4 className="item-name">{item.name}</h4>
                  <p className="item-price">${item.price}</p>
                  <p className="item-quantity">Quantity: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        <div class="remarks-container">
          <h2 className="cart-title">Remarks</h2>

          <input
            type="text"
            id="remarks"
            name="remarks"
            class="remarks-input"
            placeholder="Any remarks? (e.g. Use less sugar.)"
            value={remarks}
            onChange={handleInputChange}
          />
        </div>
        <div className="checkout">
          <p className="checkout-total">
            Grand Total: ${calculateTotalPrice()}
          </p>
          {cartItems.length === 0 ? (
            <div>
              <a href="#" onClick={openModal} className="checkout-button">
                <FaWhatsapp style={{ marginRight: 10, alignSelf: "center" }} />
                Place Order via WhatsApp
              </a>

              <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Order via WhatsApp Modal"
                overlayClassName="overlay"
                className="modal"
              >
                <h2>Order Incomplete</h2>
                <p>Please add something to cart to proceed.</p>
                <button onClick={closeModal}>Back to Home</button>
              </Modal>
            </div>
          ) : (
            <a
              href={createWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="checkout-button"
            >
              <FaWhatsapp style={{ marginRight: 10, alignSelf: "center" }} />
              Place Order via WhatsApp
            </a>
          )}
        </div>
      </div>
      <footer
        className="footer"
        style={{ textAlign: "center", fontWeight: "600" }}
      >
        &copy; 2024 Sweet Dainties Confectionery
        <br />
        <div style={{ marginTop: 10 }} />
        <text>Powered by </text>
        <text style={{ color: "#35bc80" }}>Supabase </text>
        <img
          src={require("../assets/supabase-logo-icon.png")}
          style={{
            height: 15,
            width: 15,
            // alignSelf: "center",
            verticalAlign: "middle",
          }}
        />
        <br />
        <div style={{ marginTop: "10px" }}>
          <a
            href="https://www.instagram.com/sweet.dainties/"
            style={{ ...iconStyle, color: "#e4405f" }}
          >
            <FaInstagram />
          </a>
          {/* <a href="https://www.facebook.com" style={{ ...iconStyle, color: '#1877f2' }}>
                    <FaFacebook />
                </a> */}
        </div>
        <text style={{ fontSize: 14, fontWeight: "500" }}>Done by </text>
        <a
          style={{ fontSize: 14, fontWeight: "500", color: "black" }}
          href="https://www.linkedin.com/in/caleb-han-792349235/"
        >
          Caleb Han
        </a>
      </footer>
    </div>
  );
};

export default Cart;
