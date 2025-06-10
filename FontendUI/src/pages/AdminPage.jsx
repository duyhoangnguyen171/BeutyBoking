import React, { useContext, useState } from "react";
import StaffManagement from "../components/dasboard/StaffManagement";
// import ServiceManagement from "../components/dasboard/ServiceManagement";
import AppointmentManagement from "../components/dasboard/AppointmentManagement";
import Dasboard from "../components/dasboard/Dasboard";
import { AppContext } from "../context/AppContext";
import Customers from "../components/dasboard/Customers";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("dasboard");
  const { user } = useContext(AppContext);

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "staffs", label: "Staff Management", icon: "👨‍💼" },
    { id: "customers", label: "Customers", icon: "👨‍💼" },
    { id: "services", label: "Services", icon: "✂️" },
    { id: "appointments", label: "Appointments", icon: "📅" },
    { id: "schedules", label: "Ca Làm Việc", icon: "🕒" }, // Đổi id và emoji
    { id: "contacts", label: "Liên Hệ", icon: "📞" }, // Thêm emoji phù hợp
  ];

  return user.role === "admin" || user.role === "staff" ? (
    <div className="">
      <div className="min-h-screen bg-gray-100 flex">
        {/* Vertical Tabs - Left Side */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
          </div>
          <nav className="mt-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center w-full px-4 py-3 text-left transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "bg-amber-100 text-amber-700 border-r-4 border-amber-400"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span className="mr-3 text-lg">{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content - Right Side */}
        <div className="flex-1 p-6">
          {activeTab === "staffs" && <StaffManagement />}
          {activeTab === "services" && <ServiceManagement />}
          {activeTab === "appointments" && <AppointmentManagement />}
          {activeTab === "dashboard" && <Dasboard />}
          {activeTab === "customers" && <Customers />}
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">
        Please log in to view your profile
      </h1>
      <p className="text-gray-600 mb-4">
        You need to be logged in to access this page.
      </p>
      <button
        onClick={() => (window.location.href = "/login")}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
      >
        Go to Login
      </button>
    </div>
  );
};

export default AdminPage;
