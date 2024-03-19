import React, { useState, useEffect } from "react";
import "./Home.css";
import logo from "../assets/sweet-dainties-logo.jpeg";
import cart from "../assets/cart.png";
// import product1 from "../assets/walnut-fruit-cake.png";
// import product2 from "../assets/chewy chocolate.png";
// import product3 from "../assets/assorted-muffins.png";
// import product4 from '../assets/coconut-jelly.jpeg'
// import product5 from '../assets/osmanthus-jelly.jpeg'
// import product6 from '../assets/walnut-choc.jpeg'
import { useNavigate } from "react-router-dom";
import { FaInstagram, FaFacebook, FaWhatsapp } from 'react-icons/fa';
import { createClient } from "@supabase/supabase-js";

const ProductShowcase = ({
  products,
  cartItems,
  addToCart,
  removeFromCart,
  removeremoveFromCart,
}) => {
  return (
    <div className="product-showcase">
      {products.map((product, index) => {
        const cartItem = cartItems.find((item) => item.id === product.id);
        const quantityInCart = cartItem ? cartItem.quantity : 0;

        return (
          <div className="product-card" key={index}>
            <div className="product-image">
              <img
                src={require(`../assets/${product.name}.png`)}
                alt={product.name}
                onerror="this.onerror=null;this.src='../assets/default.png'; this.alt='Image not found';"
              />
            </div>
            <div className="product-details">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">${product.price}</p>
              <p>{product.remarks}</p>
              <div className="cart-controls">
                <button
                  className={`cart-button ${
                    quantityInCart > 0 ? "added-to-cart" : ""
                  }`}
                  onClick={() => {
                    if (quantityInCart > 0) {
                      removeremoveFromCart(product.id, true);
                    } else {
                      addToCart(product);
                    }
                  }}
                >
                  {quantityInCart > 0 ? "Remove from Cart" : "Add to Cart"}
                </button>
                {quantityInCart > 0 && (
                  <div className="quantity-controls">
                    <button
                      className="quantity-button"
                      onClick={() => removeFromCart(product.id, true)}
                    >
                      -
                    </button>
                    <div className="quantity">{quantityInCart}</div>
                    <button
                      className="quantity-button"
                      onClick={() => addToCart(product)}
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default function Home() {
  const supabase = createClient(
    "https://rvhsywcynucieeskuztk.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2aHN5d2N5bnVjaWVlc2t1enRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA3MzQzMTEsImV4cCI6MjAyNjMxMDMxMX0.vU7S4eBuQd-58veloqkKGJhYbCcXNHO2_-qfTBODkNE",
  );
  const [fetchError, setFetchError] = useState(null);
  const [items, setItems] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase.from("products").select();
      if (error) {
        setFetchError("Could not fetch items");
        console.log(error);
        setItems(null);
      }
      if (data) {
        setItems(data);
        setFetchError(null);
      }
    };
    fetchItems();
  }, []);

  // const products = [
  //   {
  //     id: 1,
  //     name: "Walnut Fruit Cake",
  //     image: product1,
  //     price: "24.99",
  //   },
  //   {
  //     id: 2,
  //     name: "Big Chewy Chocolate Chip Cookie",
  //     image: product2,
  //     price: "7.99",
  //   },
  //   {
  //     id: 3,
  //     name: "Assorted Muffins",
  //     image: product3,
  //     price: "1.99",
  //   },
  //   { id: 4, name: "Coconut Jelly", image: product4, price: "5.99" },
  //   {
  //     id: 5,
  //     name: "milk",
  //     image: product5,
  //     price: "7.99",
  //   },
  //   {
  //     id: 6,
  //     name: "Walnut Chocolate Chip Cake",
  //     image: product6,
  //     price: "1.99",
  //   },
  // ];
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, []);

  useEffect(() => {
    const cartCount = cartItems.reduce(
      (total, item) => total + item.quantity,
      0,
    );
    document.getElementById("cart-counter").textContent = cartCount.toString();
  }, [cartItems]);

  const addToCart = (product) => {
    const existingCartItem = cartItems.find((item) => item.id === product.id);
    if (existingCartItem) {
      const updatedCart = cartItems.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      );
      setCartItems(updatedCart);
      localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
      localStorage.setItem(
        "cartItems",
        JSON.stringify([...cartItems, { ...product, quantity: 1 }]),
      );
    }
  };

  const removeFromCart = (productId, decreaseQuantity = false) => {
    const updatedCart = cartItems.map((item) =>
      item.id === productId
        ? {
            ...item,
            quantity: decreaseQuantity ? item.quantity - 1 : item.quantity,
          }
        : item,
    );

    setCartItems(updatedCart.filter((item) => item.quantity > 0));
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };
  const removeremoveFromCart = (productId, decreaseQuantity = false) => {
    const updatedCart = cartItems.map((item) =>
      item.id === productId
        ? {
            ...item,
            quantity: decreaseQuantity
              ? item.quantity - item.quantity
              : item.quantity,
          }
        : item,
    );

    setCartItems(updatedCart.filter((item) => item.quantity > 0));
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  const increaseQuantity = (productId) => {
    const updatedCart = cartItems.map((item) =>
      item.id === productId ? { ...item, quantity: item.quantity + 1 } : item,
    );

    setCartItems(updatedCart);
  };

  const decreaseQuantity = (productId) => {
    const updatedCart = cartItems.map((item) =>
      item.id === productId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item,
    );

    setCartItems(updatedCart.filter((item) => item.quantity > 0));
  };
  const navigate = useNavigate();

  const handleCartClick = () => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    navigate({
      pathname: "/cart",
      state: { cartItems },
    });
  };
  const iconStyle = {
    fontSize: "24px",
    margin: "0 10px",
    color: "#333",
    transition: "color 0.3s ease-in-out",
  };

  return (
    <div className="home-container">
      <header className="header">
        <a href="https://www.instagram.com/sweet.dainties/" target="_blank">
          <img className="logo" src={logo} alt="Product Logo" />
        </a>
        <div className="cartwrapper">
          <img
            className="cart"
            src={cart}
            alt="cart"
            onClick={handleCartClick}
          />
          <div className="cart-counter" id="cart-counter">
            {cartItems.length}
          </div>
          {/* <text className='navcart'>Cart</text> */}
        </div>
      </header>
      <div className="product-section">
        {items ? (
          <ProductShowcase
            products={items}
            cartItems={cartItems}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            increaseQuantity={increaseQuantity}
            decreaseQuantity={decreaseQuantity}
            removeremoveFromCart={removeremoveFromCart}
          />
        ) : (
          <p>Loading...</p>
        )}
      </div>

      <footer
        className="footer"
        style={{ textAlign: "center", fontWeight: "600" }}
      >
        &copy; 2024 Sweet Dainties Confectionery
        <div style={{ marginTop: "10px" }}>
          {/* <a
            href="https://www.instagram.com/sweet.dainties/"
            target="_blank"
            style={{ ...iconStyle, color: "#e4405f" }}
          >
            <FaInstagram />
          </a> */}
          {/* <a
            href="https://www.whatsapp.com/"
            target="_blank"
            style={{ ...iconStyle, color: "#25D366" }}
          >
            <FaWhatsapp />
          </a> */}
        </div>
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
        <text style={{ fontSize: 14, fontWeight: "500" }}>Done by </text>
        <a
          style={{ fontSize: 14, fontWeight: "500", color: "black" }}
          target="_blank"
          href="https://www.linkedin.com/in/caleb-han-792349235/"
        >
          Caleb Han
        </a>
      </footer>
    </div>
  );
}
