🛠️ ServiceHub – Home Services Booking Platform

ServiceHub is a full-stack web application that allows users to explore home services, create accounts, log in, book services, and contact the service provider through a simple and user-friendly interface.

The platform brings essential home services together in one place, making it easier for customers to find and book services.

🚀 Features

👤 User Authentication

- User registration and login
- Password hashing for security
- JWT-based authentication

🏠 Home Services

- Browse available home services
- View service names, descriptions, prices, and images
- Services are fetched dynamically from MongoDB

🛒 Cart Management

- Add services to cart
- Increase or decrease service quantities
- Remove services from cart

📅 Service Booking

- Submit customer details
- Select booking date
- Book selected services
- Store booking information in MongoDB

📩 Contact Us

- Contact form with name, email, subject, and message
- Save submitted messages to MongoDB

💻 Technology Stack

Frontend| Backend| Database
React.js| Node.js| MongoDB
HTML5| Express.js| MongoDB Atlas
CSS3| REST API| 
JavaScript| JWT| 
Vite| Mongoose| 

📂 Project Structure

Service-hub/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── .gitignore
│
├── servicehub-react/
│   ├── public/
│   │   └── images/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── api.js
│   │   └── main.jsx
│   ├── package.json
│   └── .gitignore
│
└── README.md

⚙️ Installation and Setup

1. Clone the Repository

git clone YOUR_GITHUB_REPOSITORY_URL
cd Service-hub

Replace "YOUR_GITHUB_REPOSITORY_URL" with your actual GitHub repository URL.

2. Backend Setup

cd backend
npm install

Create a ".env" file inside the backend folder:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

Start the backend server:

node server.js

Backend runs locally at:

http://localhost:5000

3. Frontend Setup

Open another terminal:

cd servicehub-react
npm install

Create a ".env" file inside "servicehub-react":

VITE_API_URL=http://localhost:5000/api

Start the React development server:

npm run dev

Open the local URL shown in the terminal, usually:

http://localhost:5173

🔗 API Endpoints

Method| Endpoint| Description
GET| "/"| Backend status
GET| "/hello"| Test backend connection
GET| "/api/services"| Fetch all services
POST| "/api/register"| Register a new user
POST| "/api/login"| Login user
POST| "/api/bookings"| Create a service booking
POST| "/api/contact"| Submit contact message

Note: Booking requests require JWT authentication.

🗄️ Database

ServiceHub uses MongoDB Atlas to store application data.

The backend uses Mongoose to manage database models and interact with MongoDB.

Main data collections include:

- Users
- Services
- Bookings
- Contacts

🔐 Security

- Passwords are hashed before storage.
- JWT authentication protects booking requests.
- Environment variables are used for database credentials and secret keys.
- ".env" files and "node_modules" are excluded using ".gitignore".

Important: Never upload your actual ".env" files or expose database credentials on GitHub.

🌐 Deployment

The project is designed for deployment using:

- GitHub: Source code management
- Render: Backend hosting
- Vercel: React frontend hosting
- MongoDB Atlas: Cloud database

Deployment URLs will be added after deployment.

🎯 Future Improvements

- Online payment integration
- Booking history dashboard
- Admin dashboard for managing services
- Booking status tracking
- Customer reviews and ratings
- Email notifications
- Improved responsive design

👩‍💻 Project Information

Project Name: ServiceHub
Project Type: Full-Stack Web Application
Domain: Home Services Booking Platform

---

⭐ If you find this project useful, consider giving the repository a star!
