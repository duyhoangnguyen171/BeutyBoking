import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import About from "./pages/About";
import MyProfile from "./pages/MyProfile";
import MyAppointments from "./pages/MyAppointments";
import NotFound from "./pages/NotFound";
import Appointment from "./pages/Appointment";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Blog from "./pages/Blog";
import AdminPage from "./pages/AdminPage";
// import Register from "./pages/Register";
import { Toaster } from "react-hot-toast";
import BookingPage from "./pages/BookingPage";

const App = () => {
  return (
    <div className="mx-4 sm:mx-[3%]">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/my-appointments" element={<MyAppointments />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
      <Footer />
    </div>
  );
};

export default App;
