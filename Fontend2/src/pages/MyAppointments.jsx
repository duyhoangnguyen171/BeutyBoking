import React, { useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { ServiceContext } from "../context/ServiceContext";
import toast from "react-hot-toast";
import AppointmentService from "../services/AppointmentService";

const MyAppointments = () => {
  const { user, token } = useContext(AppContext);
  const { services } = useContext(ServiceContext);
  const [appointments, setAppointments] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatVietnameseDateTime = (dateString) => {
    const date = new Date(dateString);

    const dateFormat = date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const timeFormat = date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      // second: "2-digit",
      hour12: false,
    });

    return `${dateFormat}  ${timeFormat}`;
  };

  // const getServiceName = (serviceId) => {
  //   const service = services.find((s) => s.id === serviceId);
  //   return service ? service.name : "Unknown Service";
  // };

  // const getStaffName = (staffId) => {
  //   const staff = staffs.find((s) => s.id === staffId);
  //   return staff ? staff.fullName : "Unknown Staff";
  // };

  const cancelappointment = async (id) => {
    try {
      const response = await axios.put(
        `https://localhost:7169/api/appointments/${id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("appointmentId : ", id);
      if (response.status === 200) {
        toast.success("Hủy thành công!");
        getMyAppointment();
      }
    } catch (error) {
      console.error(error);
      toast.error("Hủy thất bại!");
    }
  };

  const getMyAppointment = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const userId = parseInt(user?.nameid, 10);
      if (isNaN(userId) || userId <= 0) {
        throw new Error(`Invalid user ID: ${user?.nameid}`);
      }

      const response = await AppointmentService.getAll();

      console.log("reponDAta : ", response.data.data?.$values);
      if (!response.data.data?.$values) {
        throw new Error("Invalid response format");
      }

      const data = response.data.data.$values.reverse();
      // setAppointments(data);
      // Chuyển đổi appointmentServices thành mảng
      const enrichedAppointments = data.map((item) => ({
        ...item,
        // Chuyển đổi appointmentServices.$values thành mảng trực tiếp
        appointmentServices: item.appointmentServices?.$values || [],
        // serviceName: getServiceName(item.serviceId),
        // staffName: getStaffName(item.staffId),
      }));
      console.log("enrichedAppointments : ", enrichedAppointments);

      setAppointments(enrichedAppointments);
    } catch (error) {
      setError(error.message);
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }, [token, user?.nameid]);

  useEffect(() => {
    if (token && user?.nameid) {
      getMyAppointment();
    }
  }, [getMyAppointment, token, user]);

  // Hàm tính tổng giá của một lịch hẹn
  const calculateTotalPrice = (appointmentServices) => {
    if (!Array.isArray(appointmentServices) || !Array.isArray(services)) {
      return 0;
    }

    return appointmentServices.reduce((total, service) => {
      const serviceInfo = services.find((s) => s.id === service.serviceId);
      return total + (serviceInfo?.price || 0);
    }, 0);
  };

  // Format tiền VND
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const filterStatus012 = appointments.filter(
    (item) => item.status !== 3 && item.status !== 4
  );
  const filterStatus34 = appointments.filter(
    (item) => item.status !== 1 && item.status !== 2 && item.status !== 0
  );
  // console.log("filterStatus012 :", filterStatus012);
  // console.log("filterStatus34 :", filterStatus34);

  if (!user?.nameid) {
    return <div>Please log in to view appointments</div>;
  }

  if (loading) {
    return <div>Loading appointments...</div>;
  }

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={getMyAppointment}>Retry</button>
      </div>
    );
  }

  return (
    <div className="sm:block md:flex lg:flex xl:flex 2xl:flex min-h-[400px]">
      {filterStatus012.length > 0 ? (
        <div className="px-4 w-full">
          <p className="pb-3 mt-12  text-white text-center font-bold border-b bg-blue-400">
            My Appointments
          </p>

          <div className="space-y-4">
            {filterStatus012.map((item, index) => (
              <div
                className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 p-2 border-b hover:bg-blue-100  "
                key={index}
              >
                <div className="flex-1 text-sm text-zinc-600">
                  <p className="text-neutral-800 font-semibold">
                    Dịch vụ :
                    {item.appointmentServices
                      .map((s) => s.serviceName)
                      .join(", ") || "Không có dịch vụ"}
                  </p>

                  <p className="text-zinc-700 font-medium mt-1">
                    Nhân viên: {item.staffFullName}
                  </p>
                  {/* Thêm hiển thị tổng giá */}
                  <p className=" mt-1 text-sm text-neutral-700 font-medium">
                    Tổng giá:{" "}
                    <span className="text-red-500">
                      {formatCurrency(
                        calculateTotalPrice(item.appointmentServices)
                      )}
                    </span>
                  </p>

                  <p className="text-xs mt-1">
                    <span className="text-sm text-neutral-700 font-medium">
                      Time & Date :
                    </span>{" "}
                    {/* {formatVietnameseDateTime(item.appointmentDate)} */}
                    {item.timeSlot?.startTime
                      ? ` ${item.timeSlot.startTime.substring(
                          0,
                          5
                        )} - ${new Date(
                          item.appointmentDate
                        ).toLocaleDateString("vi-VN")}`
                      : formatVietnameseDateTime(item.appointmentDate)}
                  </p>
                </div>

                {item.status === 0 ? (
                  <div className="w-32">
                    <p className="text-sm text-neutral-700 text-center font-medium mt-1">
                      Chưa xác định
                    </p>
                  </div>
                ) : item.status === 1 ? (
                  <div className="w-32">
                    <p className="text-sm text-neutral-700 text-center font-medium mt-1">
                      Chờ xác nhận
                    </p>
                  </div>
                ) : (
                  <div className="w-32">
                    <p className="text-sm text-neutral-700 text-center font-medium mt-1">
                      <span className="text-yellow-500">Đã xác nhận</span>
                    </p>
                  </div>
                )}

                <div className="flex flex-col gap-2 justify-end">
                  <button
                    onClick={() => cancelappointment(parseInt(item.id, 10))}
                    className="text-sm text-white text-center sm:min-w-48 py-2 border rounded-2xl bg-red-500 hover:bg-red-400 hover:text-white transition-all duration-300 cursor-pointer"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className=" text-center text-red-500  w-full">
          <p className="pb-3 mt-12">Chưa có lịch hẹn</p>
          <button
            onClick={() => (window.location.href = "/booking")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Đặt lịch hẹn
          </button>
        </div>
      )}
      {filterStatus34.length > 0 && (
        <div className="px-4 w-full">
          <p className="pb-3 mt-12  text-white text-center font-bold border-b bg-red-400">
            Lịch sử
          </p>
          <div className="space-y-4 max-h-[500px] overflow-y-auto ">
            {filterStatus34.map((item, index) => (
              <div
                className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 p-2 border hover:bg-blue-100"
                key={index}
              >
                <div className="flex-1 text-sm text-zinc-600">
                  <p className="text-neutral-800 font-semibold">
                    Dịch vụ :
                    {item.appointmentServices
                      .map((s) => s.serviceName)
                      .join(", ") || "Null"}
                  </p>

                  <p className="text-zinc-700 font-medium mt-1">
                    Nhân viên: {item.staffFullName}
                  </p>

                  <p className="text-xs mt-1">
                    <span className="text-sm text-neutral-700 font-medium">
                      Date & Time:
                    </span>{" "}
                    {item.timeSlot?.startTime
                      ? `${item.timeSlot.startTime.substring(0, 5)} ${new Date(
                          item.appointmentDate
                        ).toLocaleDateString("vi-VN")}`
                      : formatVietnameseDateTime(item.appointmentDate)}
                  </p>
                </div>

                {item.status === 3 ? (
                  <div className="w-32">
                    <p className="text-sm text-neutral-700 text-center font-medium mt-1">
                      <span className="text-green-500">Đã hoàn thành</span>
                    </p>
                  </div>
                ) : (
                  <div className="w-32">
                    <p className="text-sm text-neutral-700 text-center font-medium mt-1">
                      <span className="text-red-500">Đã hủy</span>
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
