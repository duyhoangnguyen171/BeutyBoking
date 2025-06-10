import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../asset/styles/appointment/AppointmentCanceled.css";
import AppointmentService from "../../services/AppointmentService";

const AppointmentCanceled = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const resolveReferences = (data, cache = new Map()) => {
    if (!data) return [];
    if (typeof data !== "object") return data;
    if (data.$id && cache.has(data.$id)) return cache.get(data.$id);

    const resolved = data.$id ? { ...data } : data;
    if (data.$id) cache.set(data.$id, resolved);

    if (Array.isArray(data))
      return data.map((item) => resolveReferences(item, cache));

    if (data.$values) {
      resolved.$values = resolveReferences(data.$values, cache);
      return resolved.$values;
    }

    for (const key in resolved) {
      if (key !== "$ref" && key !== "$id") {
        resolved[key] = resolveReferences(resolved[key], cache);
      }
    }

    delete resolved.$id;
    delete resolved.$ref;

    return resolved;
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      let allAppointments = [];
      try {
        let page = 1;
        let totalPages = 1;

        while (page <= totalPages) {
          const response = await AppointmentService.getCanceled(page); // Lấy dữ liệu mỗi trang
          console.log("API Response for page", page, response.data);

          const appointments = resolveReferences(response.data.data.$values);
          allAppointments = [...allAppointments, ...appointments];

          totalPages = response.data.totalPages; // Cập nhật tổng số trang từ API
          page++; // Tăng số trang
        }

        // Lọc các cuộc hẹn bị hủy và loại bỏ các mục trùng lặp
        const canceledAppointments = allAppointments.filter(
          (app) => app.status === 4
        );

        // Loại bỏ các cuộc hẹn trùng lặp dựa trên id (nếu có)
        const uniqueAppointments = canceledAppointments.filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.id === value.id)
        );

        setAppointments(uniqueAppointments);

        if (uniqueAppointments.length === 0) {
          toast.info("Không có lịch hẹn đã hủy.");
        }
      } catch (error) {
        console.error("Lỗi khi tải lịch hẹn đã hủy:", error);
        setAppointments([]);
        toast.error(
          "Không thể tải danh sách đã hủy: " +
            (error.response?.data?.message || error.message)
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleRestore = async (appointmentId) => {
    try {
      await AppointmentService.updateStatus(appointmentId, 0); // Restore the appointment status to active
      setAppointments((prev) => prev.filter((a) => a.id !== appointmentId));
      toast.success("Khôi phục thành công!");
    } catch (error) {
      toast.error("Không thể khôi phục lịch hẹn.");
    }
  };

  const handleDeletePermanently = async (appointmentId) => {
    try {
      await AppointmentService.delete(appointmentId); // Delete appointment permanently
      setAppointments((prev) => prev.filter((a) => a.id !== appointmentId));
      toast.success("Đã xóa vĩnh viễn!");
    } catch (error) {
      toast.error("Không thể xóa vĩnh viễn.");
    }
  };

  return (
    <>
      <div className="appointment-canceled">
        <h1>Danh sách đã hủy</h1>

        {loading ? (
          <p className="loading">Đang tải dữ liệu...</p>
        ) : appointments.length > 0 ? (
          appointments.map((appointment) => (
            <div key={appointment.id} className="appointment-item">
              <div className="appointment-header">
                <span className="appointment-date">
                  {new Date(appointment.appointmentDate).toLocaleDateString(
                    "vi-VN"
                  )}
                </span>
                <span className="appointment-time">
                  {new Date(appointment.appointmentDate).toLocaleTimeString(
                    "vi-VN",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </span>
              </div>

              <div className="appointment-body">
                <p className="customer-name">
                  <strong>Khách hàng:</strong>{" "}
                  <span className="highlight">
                    {appointment.customerFullName ||
                      appointment.customer?.name ||
                      "Không xác định"}
                  </span>
                </p>
                <p className="staff-name">
                  <strong>Nhân viên:</strong>{" "}
                  {appointment.staffFullName ||
                    appointment.staff?.name ||
                    "Không xác định"}
                </p>
                <p className="services">
                  <strong>Dịch vụ:</strong>{" "}
                  {appointment.appointmentServices
                    ?.map((s) => s.serviceName)
                    .join(", ") || "Không có dịch vụ"}
                </p>
                <p className="notes">
                  <em>{appointment.notes || "Không có ghi chú"}</em>
                </p>
              </div>

              <div className="appointment-actions">
                <button
                  className="restore-btn"
                  onClick={() => handleRestore(appointment.id)}
                >
                  Khôi phục
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeletePermanently(appointment.id)}
                >
                  Xóa vĩnh viễn
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-appointments">Không có lịch hẹn đã hủy</p>
        )}
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default AppointmentCanceled;
