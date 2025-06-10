import React, { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ServiceContext } from "../context/ServiceContext";
import { StaffContext } from "../context/StaffContext";
import { FiCalendar, FiClock, FiInfo, FiUser } from "react-icons/fi";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";
import AppointmentService from "../services/AppointmentService";
const Appointment = () => {
  const { id } = useParams();
  const pathId = window.location.pathname.split("/").pop(); // Lấy ID từ URL thủ công
  const serviceId = id || pathId;
  const { services } = useContext(ServiceContext);
  const { staffs } = useContext(StaffContext);
  const { user, token } = useContext(AppContext);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedStaffId, setSelectedStaffId] = useState("");

  const [errors, setErrors] = useState({});
  const [serviceInfo, setServiceInfo] = useState({
    id: 0,
    name: "",
    price: "",
    description: "",
    durationMinutes: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServiceInfo = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Kiểm tra dữ liệu đầu vào
        if (!Array.isArray(services) || !serviceId) {
          throw new Error("Dữ liệu dịch vụ hoặc ID không hợp lệ");
        }
        // Tìm kiếm linh hoạt theo nhiều trường hợp
        const serviceInfo = services.find(
          (ser) => ser.id === parseInt(serviceId, 10)
        );

        if (!serviceInfo) {
          throw new Error(`Không tìm thấy dịch vụ với ID: ${serviceId}`);
        }
        setServiceInfo(serviceInfo);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServiceInfo();
  }, [services, serviceId]);

  const validateForm = useCallback(() => {
    const errors = {};

    if (!date) errors.date = "Vui lòng chọn ngày";
    if (!time) errors.time = "Vui lòng chọn giờ";
    if (!selectedStaffId) errors.staff = "Vui lòng chọn nhân viên";

    // Kiểm tra ngày giờ hợp lệ
    if (date && time) {
      const selectedDateTime = new Date(`${date}T${time}`);
      if (selectedDateTime < new Date()) {
        errors.date = "Thời gian phải trong tương lai";
      }
    }
    return errors;
  }, [date, time, selectedStaffId]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const validationError = validateForm();
      if (Object.keys(validationError).length) {
        setErrors(validationError);
        return;
      }
      setErrors({});

      try {
        const appointmentData = {
          appointmentDate: new Date(`${date}T${time}`).toISOString(),
          notes: notes,
          // workShiftId: 39, // Giả sử bạn đã có workShiftId
          customerId: parseInt(user?.nameid, 10),
          staffId: selectedStaffId ? parseInt(selectedStaffId) : null,
          serviceId: serviceId ? parseInt(serviceId) : null,
          status: 1,
        };

        console.log("appointmentData: ", appointmentData);

        const response = await axios.post(
          `https://localhost:7169/api/appointments`,
          appointmentData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        // const response = await AppointmentService.create(appointmentData);
        console.log("Appointment created successfully:", response.data);
        // Xử lý thành công, có thể hiển thị thông báo hoặc chuyển hướng

        if (response.status === 201) {
          toast.success(
            "Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn sớm."
          );
          console.log("Đặt lịch thành công:", response.data);
          setDate("");
          setTime("");
          setNotes("");
          // setSelectedStaffId("");
        } else {
          console.error("Đặt lịch không thành công:", response.data);
          toast.error("Đặt lịch không thành công. Vui lòng thử lại.");
          return;
        }
      } catch (error) {
        console.error("Error creating appointment:", error);
        toast.error("Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại.");
      }
    },
    [user, date, time, notes, selectedStaffId, serviceId, token, validateForm]
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[200px] text-red-500">
        {error}
      </div>
    );
  }

  return (
    serviceInfo && (
      <div className="">
        <form onSubmit={handleSubmit} className="">
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <img
                className="bg-blue-400 w-50 h-70 sm:max-w-72 rounded-lg"
                src={
                  serviceInfo.image ||
                  "https://www.w3schools.com/w3images/avatar2.png"
                }
                alt={serviceInfo.name}
              />
            </div>
            {/* -------- Doc Info: name, degree experience---------- */}
            <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
              <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
                {serviceInfo.name}
              </p>

              <p className="text-gray-500 font-medium mt-4">
                Giá :{" "}
                <span className="text-gray-600 ">{serviceInfo?.price} VND</span>
              </p>
              <p className="text-gray-500 font-medium mt-4">
                Thời gian :{" "}
                <span className="text-gray-600 ">
                  {serviceInfo?.durationMinutes} phút
                </span>
              </p>
              <div>
                <p className="text-sm text-gray-600 max-w-[700px] mt-1">
                  Mô tả : {serviceInfo?.description}
                </p>
              </div>
            </div>
          </div>

          <div className="sm:ml-7 sm:pl-4 mt-4 font-medium text-gray-700">
            <p className="text-lg font-semibold mb-4">Thông tin đặt lịch</p>

            <div className="flex">
              {/* Chọn nhân viên */}
              <div className="mb-4">
                <label className="block text-gray-700 text-lg font-medium mb-2">
                  Nhân viên
                </label>
                <select
                  value={selectedStaffId}
                  onChange={(e) => {
                    setSelectedStaffId(e.target.value);
                  }}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                >
                  <option value="">Chọn nhân viên</option>
                  {staffs.map((staff) => (
                    <option key={staff.id} value={staff.id}>
                      {staff.fullName} - {staff.degree} ({staff.experience} năm
                      kinh nghiệm)
                    </option>
                  ))}
                </select>
              </div>
              {/* Ngày */}
              <div className="relative group">
                <label className="block text-gray-700 text-lg font-medium mb-2">
                  Ngày
                </label>
                {/* <FiCalendar className="absolute left-4 top-4  text-xl" /> */}
                <input
                  type="date"
                  value={date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                />
                {errors.date && (
                  <p className="text-red-400 text-sm mt-1 ml-2 flex items-center gap-1">
                    <FiInfo className="inline" />
                    {errors.date}
                  </p>
                )}
              </div>

              {/* Giờ */}
              <div className="relative group">
                <label className="block text-gray-700 text-lg font-medium mb-2">
                  Giờ
                </label>
                {/* <FiClock className="absolute left-4 top-4  text-xl" /> */}
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                />
                {errors.time && (
                  <p className="text-red-400 text-sm mt-1 ml-2 flex items-center gap-1">
                    <FiInfo className="inline" />
                    {errors.time}
                  </p>
                )}
              </div>
            </div>

            {/* Ghi chú */}
            <div className="md:col-span-2">
              <label className="block  text-lg font-medium mb-3 sm:mb-4">
                Ghi chú thêm (nếu có)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Vui lòng cho chúng tôi biết thêm yêu cầu của bạn..."
                className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 font-medium"
                rows={3}
              />
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full  mt-4"></div>
            <button className="bg-blue-600 hover:bg-blue-400 text-white text-sm font-light px-14 py-3 rounded-full my-6 cursor-pointer hover:scale-105 transiton-all duration-300">
              Đặt lịch hẹn
            </button>
          </div>
        </form>
        {/* -------- Listing Relatedservices---------- */}
      </div>
    )
  );
};

export default Appointment;
