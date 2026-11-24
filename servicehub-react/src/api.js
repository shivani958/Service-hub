const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/$/, "");

// Get all services
export async function getServices() {
  const response = await fetch(`${API_URL}/services`);
  if (!response.ok) {
    throw new Error("Unable to fetch services");
  }
  return response.json();
}

// Register user
export async function registerUser(userData) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData)
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Registration failed");
  return data;
}

// Login user
export async function loginUser(credentials) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Login failed");
  return data;
}

// Create booking
export async function createBooking(bookingData, token) {
  const response = await fetch(`${API_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(bookingData)
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Booking failed");
  return data;
}

// Submit contact form
export async function sendContactMessage(formData) {
  const response = await fetch(`${API_URL}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData)
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Message submission failed");
  return data;
}