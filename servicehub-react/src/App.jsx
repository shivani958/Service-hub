import React, { useState, useEffect} from "react";
import Login from "./login.jsx";
import Signup from "./signup.jsx";
import { getServices, createBooking, sendContactMessage } from "./api";
import "./App.css";

function App() {
  const [page, setPage] = useState("home");
  const [cart, setCart] = useState([]);
  const [username, setUsername] = useState("Username");
  const [token, setToken] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serviceError, setServiceError] = useState("");

useEffect(() => {
  async function loadServices() {
    try {
      const data = await getServices();

      const updatedServices = data.map((service) => ({
        ...service,
        id: service._id,
        icon:
          service.name === "Home Cleaning" ? "🏠" :
          service.name === "Plumbing" ? "🔧" :
          service.name === "Electrical" ? "⚡" :
          service.name === "AC Repair" ? "❄️" : "🛠️"
      }));

      setServices(updatedServices);
    } catch (error) {
      setServiceError(error.message);
    } finally {
      setLoading(false);
    }
  }

  loadServices();
}, []);
const handleLogin = (data) => {
    setToken(data.token);
    setCurrentUser(data.user);
    setUsername(data.user.name);
    setPage("home");
  };

  const handleSignup = () => {
    alert("Account created successfully! Please login.");
    setPage("login");
  };

  const handleLogout = () => {
    setToken("");
    setCurrentUser(null);
    setUsername("Guest");
    setPage("home");
  };

  // Add service to cart
  const addToCart = (service) => {
    setCart((previousCart) => {
      const existing = previousCart.find(
        (item) => item.id === service.id
      );

      if (existing) {
        return previousCart.map((item) =>
          item.id === service.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...previousCart, { ...service, quantity: 1 }];
    });

    alert(service.name + " added to cart!");
  };

  // Remove service
  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // Change quantity
  const changeQuantity = (id, amount) => {
    setCart((previousCart) =>
      previousCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Calculate total
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Booking
  const bookNow = () => {
    if (cart.length === 0) {
      alert("Please add a service to your cart first!");
      setPage("services");
      return;
    }

    setPage("booking");
  };
  const confirmBooking = async (event) => {
  event.preventDefault();

  try {
    const form = new FormData(event.target);

    const bookingData = {
      customerName: form.get("customerName"),
      email: form.get("email"),
      phone: form.get("phone"),
      address: form.get("address"),
      bookingDate: form.get("bookingDate"),
      serviceIds: [...new Set(cart.map((item) => item.id))]
    };

    const result = await createBooking(bookingData, token);

    alert(result.message);

    setCart([]);
    setPage("home");

  } catch (error) {
    alert(error.message || "Booking failed. Please try again.");
  }
};
  

  // Contact form
  const sendMessage = async (event) => {
  event.preventDefault();

  try {
    const form = new FormData(event.target);

    const contactData = {
      name: form.get("name"),
      email: form.get("email"),
      subject: form.get("subject"),
      message: form.get("message")
    };

    const result = await sendContactMessage(contactData);

    alert(result.message);
    event.target.reset();

  } catch (error) {
    alert(error.message || "Unable to send your message.");
  }
};

  // Logout
  const logout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      handleLogout();
    }
  };

  return (
    <div className="app">

      {/* NAVIGATION BAR */}

      <nav className="navbar">

        <h2 className="logo" onClick={() => setPage("home")}>
          Service<span>Hub</span>
        </h2>

        <div className="nav-links">
          <button onClick={() => setPage("home")}>Home</button>
          <button onClick={() => setPage("services")}>Services</button>
          <button onClick={() => setPage("about")}>About Us</button>
          <button onClick={() => setPage("contact")}>Contact Us</button>
          {!token && (
  <>
    <button onClick={() => setPage("login")}>
      Login
    </button>

    <button onClick={() => setPage("signup")}>
      Sign Up
    </button>
  </>
)}
          <button onClick={() => setPage("cart")}>
            Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
          </button>

        </div>

        <div className="user-area">
          <span>{username}</span>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>

      </nav>

      <main>

        {/* HOME PAGE */}

        {page === "home" && (
          <section className="home">

            <div className="hero">
              <div>
                <span className="tagline">WELCOME TO SERVICEHUB</span>

                <h1>
                  Your Home, <br />
                  Our <span>Responsibility.</span>
                </h1>

                <p>
                  Book trusted professionals for all your
                  home service needs at affordable prices.
                </p>

                <button
                  className="primary-btn"
                  onClick={() => setPage("services")}
                >
                  Explore Services →
                </button>
              </div>

              <div className="hero-image">
                <img
                  src="/images/cleaning.jpg"
                  alt="Home services"
                />
              </div>
            </div>

            <h2 className="section-title">Our Popular Services</h2>
            {loading && <p>Loading services...</p>}

{serviceError && <p>{serviceError}</p>}

            <div className="service-container">
              {services.slice(0, 3).map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  addToCart={addToCart}
                />
              ))}
            </div>

            <button
              className="primary-btn explore-btn"
              onClick={() => setPage("services")}
            >
              View All Services
            </button>

          </section>
        )}

        {/* SERVICES PAGE */}

        {page === "services" && (
          <section className="page-section">

            <h1>Our Services</h1>
            <p>Choose the service you need.</p>
{loading && <p>Loading services...</p>}

{serviceError && <p>{serviceError}</p>}
            <div className="service-container">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  addToCart={addToCart}
                />
              ))}
            </div>

            <button
              className="primary-btn"
              onClick={() => setPage("cart")}
            >
              View Cart ({cart.length})
            </button>

          </section>
        )}

        {/* CART PAGE */}

        {page === "cart" && (
          <section className="page-section">

            <h1>Your Cart</h1>
            <p>Review your selected services.</p>

            <div className="cart-box">

              {cart.length === 0 ? (
                <div className="empty-cart">
                  <h2>🛒</h2>
                  <h3>No items added yet</h3>
                  <p>Choose a service and add it to your cart.</p>

                  <button
                    className="primary-btn"
                    onClick={() => setPage("services")}
                  >
                    Explore Services
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div className="cart-item" key={item.id}>

                    <div>
                      <h3>{item.icon} {item.name}</h3>
                      <p>₹{item.price} per service</p>
                    </div>

                    <div className="quantity">
                      <button onClick={() => changeQuantity(item.id, -1)}>
                        -
                      </button>

                      <span>{item.quantity}</span>

                      <button onClick={() => changeQuantity(item.id, 1)}>
                        +
                      </button>
                    </div>

                    <strong>
                      ₹{item.price * item.quantity}
                    </strong>

                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>

                  </div>
                ))
              )}

              <div className="total">
                <h2>Total Amount</h2>
                <h2>₹{total}</h2>
              </div>

              <button
                className="primary-btn"
                onClick={bookNow}
              >
                Book Now
              </button>

            </div>

          </section>
        )}

        {/* BOOKING PAGE */}

        {page === "booking" && (
          <section className="page-section">

            <h1>Confirm Your Booking</h1>

            <div className="booking-box">

              <h2>Booking Summary</h2>

              {cart.map((item) => (
                <p key={item.id}>
                  {item.name} × {item.quantity} = ₹
                  {item.price * item.quantity}
                </p>
              ))}

              <h3>Total: ₹{total}</h3>

              <form onSubmit={confirmBooking}>

                <label>Full Name</label>
                <input type="text" name="customerName" placeholder="Enter your name" required />

                <label>Email Address</label>
                <input type="email" name="email" placeholder="Enter your email" required />

                <label>Phone Number</label>
                <input type="tel" name="phone" placeholder="Enter phone number"
                  pattern="[0-9]{10}" required />

                <label>Service Address</label>
                <textarea name="address" placeholder="Enter your complete address"
                  required />

                <label>Booking Date</label>
                <input type="date" name="bookingDate" min={new Date().toISOString().split("T")[0]}
                  required />

                <button className="primary-btn" type="submit">
                  Confirm Booking
                </button>

              </form>

            </div>

          </section>
        )}

        {/* ABOUT PAGE */}

        {page === "about" && (
          <section className="page-section about">

            <h1>About ServiceHub</h1>

            <div className="about-content">

              <div>
                <h2>Your Trusted Home Service Partner</h2>

                <p>
                  ServiceHub is an online platform designed to
                  make home services simple, convenient and
                  affordable.
                </p>

                <p>
                  We connect customers with professionals
                  providing cleaning, plumbing, electrical
                  and AC repair services.
                </p>

                <p>
                  Our mission is to save your time and provide
                  reliable services at your doorstep.
                </p>
              </div>

              <img
                src="/images/cleaning.jpg"
                alt="ServiceHub professionals"
              />

            </div>

            <div className="about-stats">
              <div><h2>4+</h2><p>Services</p></div>
              <div><h2>24/7</h2><p>Booking Access</p></div>
              <div><h2>100%</h2><p>Customer Focus</p></div>
            </div>

          </section>
        )}

        {/* CONTACT PAGE */}

        {page === "contact" && (
          <section className="page-section">

            <h1>Contact Us</h1>
            <p>We would love to hear from you!</p>

            <div className="contact-container">

              <div className="contact-image">
                <img
                  src="/images/cleaning.jpg"
                  alt="Contact ServiceHub"
                />
              </div>

              <form className="contact-form" onSubmit={sendMessage}>

                <label>Your Name</label>
                <input type="text"  name="name" placeholder="Enter your name" required />

                <label>Email Address</label>
                <input type="email" name="email" placeholder="Enter your email" required />

                <label>Subject</label>
                <input type="text" name="subject" placeholder="Enter subject" required />

                <label>Your Message</label>
                <textarea name="message" placeholder="Write your message..." required />

                <button className="primary-btn" type="submit">
                  Send Message
                </button>

              </form>

              <div className="contact-info">

                <h2>Get In Touch</h2>

                <p>📧 support@servicehub.com</p>
                <p>📞 +91 9876543210</p>
                <p>📍 India</p>

              </div>

            </div>

          </section>
        )}
        {page === "login" && (
  <Login
    onLogin={handleLogin}
    onSignup={() => setPage("signup")}
  />
)}

{page === "signup" && (
  <Signup
    onSignup={handleSignup}
    onLogin={() => setPage("login")}
  />
)}

      </main>

      {/* FOOTER */}

      <footer>
        <div>
          <h2>ServiceHub</h2>
          <p>Simple service discovery and booking.</p>
        </div>

        <div>
          <p>Contact: servicehub@gmail.com</p>
          <p>© 2026 ServiceHub. All Rights Reserved.</p>
        </div>
      </footer>

    </div>
  );
}

// REUSABLE SERVICE CARD COMPONENT

function ServiceCard({ service, addToCart }) {
  return (
    <div className="service-card">

      <img src={service.image} alt={service.name} />

      <div className="card-content">

        <h2>{service.icon} {service.name}</h2>

        <p>{service.description}</p>

        <h3>₹{service.price}</h3>

        <button onClick={() => addToCart(service)}>
          Add Item
        </button>

      </div>

    </div>
  );
}

export default App;