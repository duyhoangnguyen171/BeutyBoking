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
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Blog from "./pages/Blog";
import Register from "./pages/Register";
import { Toaster } from "react-hot-toast";
import Appointment from "./pages/Appointment";
import ServicesDetail from "./pages/ServicesDetail";
import BookingPage from "./pages/BookingPage";
import BlogDetail from "./pages/BlogDetail";

const App = () => {
  return (
    <div className="mx-4 sm:mx-[3%]">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog-detail/:id" element={<BlogDetail />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/my-appointments" element={<MyAppointments />} />
        <Route path="/appointment/:id" element={<Appointment />} />
        <Route path="/service-detail/:id" element={<ServicesDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
      <Footer />
    </div>
  );
};

export default App;
