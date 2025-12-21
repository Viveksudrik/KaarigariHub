# KaarigariHub - Authentic Indian Handicrafts

KaarigariHub is a premium e-commerce platform dedicated to promoting and selling authentic Indian handicrafts. Built using the MERN stack (MongoDB, Express.js, React.js, Node.js), it connects artisans with customers through a seamless and aesthetically pleasing digital experience.

## ✨ Features

### User Experience
*   **Unified Authentication**: Seamless Login and Register experience with a toggle interface.
*   **Glassmorphism UI**: Modern, visually appealing design with glass-effect Navbar and Search bars.
*   **Advanced Browse & Search**: Filter products by Category (Brass, Copper, Ajrakh, etc.), sort by price/newest, and search in real-time.
*   **Smart Navigation**: "Shop Now" buttons intelligently redirect to filtered product views.
*   **Shopping Cart**: Fully functional cart with "Add to Cart" and "Buy Now" capabilities.
*   **Personalized Profile**: Users can manage their own profile securely.

### Backend & Security
*   **Secure Authentication**: JWT-based session management with bcrypt password hashing.
*   **Role-Based Access Control**: Infrastructure ready for User, Seller, and Admin roles.
*   **Data Privacy**: Users can only access and modify their own data.
*   **Responsive API**: Robust REST API handling Products, Users, Orders, and Reviews.

## 🛠️ Tech Stack

*   **Frontend**: React.js, React Router, Bootstrap 5, SCSS
*   **Backend**: Node.js, Express.js
*   **Database**: MongoDB Atlas
*   **Authentication**: JSON Web Token (JWT)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

*   Node.js (v14 or higher)
*   npm (v6 or higher)
*   MongoDB Atlas Connection String

### Installation

1.  **Clone the repository**
    ```bash
    git clone <your-repo-url>
    cd CraftigenStore-main
    ```

2.  **Install Dependencies**

    *Frontend:*
    ```bash
    cd Section_one/frontend
    npm install
    ```

    *Backend:*
    ```bash
    cd ../../Section_two/backend
    npm install
    ```

3.  **Environment Configuration**

    *Backend (`Section_two/backend/.env`):*
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_secure_secret
    ```

    *Frontend (`Section_one/frontend/.env`):*
    ```env
    REACT_APP_API_URL=http://localhost:5000
    ```

### Running the Application

1.  **Start the Backend Server**
    ```bash
    cd Section_two/backend
    npm run dev
    ```
    *Server will start on http://localhost:5000*

2.  **Start the Frontend Client**
    ```bash
    cd Section_one/frontend
    npm start
    ```
    *Client will open on http://localhost:3000*

## 👤 Author

**Vivek** - *Admin & Lead Developer*

---
*Built with ❤️ for Indian Artisans*
