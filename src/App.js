import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Form } from "react-router-dom";
import Login from "./Components/Login";
import Register from "./Components/Register";
import UserDashboard from "./Components/UserDashboard";
import AddProducts from "./Components/AddProduct";
import ShowProducts from "./Components/UserProducts";
import AdminDashboard from "./Components/AdminDashboard";
import SuperAdminDashboard from "./Components/SuperAdminDashboard";
import PrivateRoute from "./Components/ProtectedRoutes";
import Mapbox from "./Components/Mapbox";
import BookingForm from "./Components/BookingForm";
import UserBooking from "./Components/UserBooking";
import Form12 from "./Components/Form12";

function App() {
  useEffect(() => {
    const handlePopState = (event) => {
      // Prevent back navigation
      window.history.pushState(null, document.title, window.location.href);
    };

    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/form" element={<Form12 />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/:companyName/book-now" element={<BookingForm />} />
          <Route path="/:companyName/Booking" element={<Mapbox />} />
          <Route path="/:companyName/products" element={<ShowProducts />} />

          {/* Protected Routes for User */}
          <Route
            path="/user-dashboard"
            element={<PrivateRoute element={<UserDashboard />} />}
          />

          {/* Protected Routes for Admin */}
          <Route
            path="/admin-dashboard/:companyName"
            element={<PrivateRoute roles={["admin"]} element={<AdminDashboard />} />}
          >
            <Route path="add-products" element={<AddProducts />} />
            <Route path="user-products" element={<ShowProducts />} />
            <Route path="user-booking" element={<UserBooking />} />
          </Route>

          {/* Protected Routes for Super Admin */}
          <Route
            path="/superadmin-dashboard"
            element={<PrivateRoute roles={["superadmin"]} element={<SuperAdminDashboard />} />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
