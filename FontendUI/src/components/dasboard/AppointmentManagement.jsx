import {
  appointmentsData,
  customers,
  services,
  staffs,
} from "../../assets/data/db";
import React, { useState } from "react";
import { FiTrash2, FiEdit } from "react-icons/fi";

const AppointmentManagement = () => {
  // Kết hợp dữ liệu từ các bảng
  const [appointments, setAppointments] = useState(() => {
    return appointmentsData.map((appointment) => {
      const customer = customers.find((c) => c.id === appointment.customerId);
      const service = services.find((s) => s.id === appointment.serviceId);
      const staff = staffs.find((s) => s.id === appointment.staffId);

      return {
        ...appointment,
        customerName: customer?.name || "Unknown",
        customerPhone: customer?.phone || "N/A",
        serviceName: service?.name || "Service not found",
        servicePrice: service?.price || 0,
        staffName: staff?.name || "Staff not found",
      };
    });
  });

  // Xử lý xóa appointment
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      setAppointments((prev) => prev.filter((app) => app.id !== id));
    }
  };

  // Xử lý thay đổi trạng thái
  const handleStatusChange = (id, newStatus) => {
    setAppointments((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    );
  };

  // Xử lý edit (placeholder)
  const handleEdit = (id) => {
    console.log("Editing appointment:", id);
    // Thêm logic edit tại đây
  };
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  return (
    <section className="sm:px-6  py-8">
      <div className="container mx-auto max-w-6xl">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {appointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      "Customer",
                      "Phone",
                      "Service",
                      "Staff",
                      "Date",

                      "Time",
                      "Status",
                      "Actions",
                    ].map((header) => (
                      <th
                        key={header}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {appointment.customerName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {appointment.customerPhone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {appointment.serviceName}
                          <span className="ml-2 text-xs text-gray-500">
                            ({formatPrice(appointment.servicePrice)} VNĐ)
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {appointment.staffName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(appointment.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {appointment.time}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={appointment.status}
                          onChange={(e) =>
                            handleStatusChange(appointment.id, e.target.value)
                          }
                          className={`text-sm rounded px-2 py-1 ${
                            appointment.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : appointment.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {["pending", "confirmed", "cancelled"].map(
                            (status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            )
                          )}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(appointment.id)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                          title="Edit"
                        >
                          <FiEdit className="inline w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(appointment.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <FiTrash2 className="inline w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No appointments scheduled yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AppointmentManagement;
