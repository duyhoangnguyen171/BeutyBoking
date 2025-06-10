import { useCallback, useContext, useEffect, useState } from "react";
import {
  FiCalendar,
  FiCheck,
  FiInfo,
  FiPhone,
  FiUser,
  FiX,
} from "react-icons/fi";
import { AppContext } from "../context/AppContext";
import { ServiceContext } from "../context/ServiceContext";
import AppointmentService from "../services/AppointmentService";
import { createGuest } from "../services/UserService";
import WorkShiftService from "../services/WorkShiftService";

import toast from "react-hot-toast";

const BookingPage = () => {
  const { services, formatPrice } = useContext(ServiceContext);
  const { user } = useContext(AppContext);
  const [staffs, setStaffs] = useState([]);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appointmentData, setAppointmentData] = useState({
    appointmentDate: "",
    customerId: user?.nameid ? parseInt(user.nameid) : parseInt("", 10),
    staffId: "",
    serviceIds: [],
    workShiftId: "",
    notes: "",
    status: 1,
  });
  const [timeSlots, setTimeSlots] = useState([]);
  const [guestInfo, setGuestInfo] = useState({ fullName: "", phone: "" });
  useEffect(() => {
    const fetchWorkShiftId = async () => {
      if (!appointmentData.staffId || !appointmentData.appointmentDate) return;

      const date = new Date(appointmentData.appointmentDate)
        .toISOString()
        .split("T")[0];
      try {
        const res = await WorkShiftService.getWorkShiftId(
          appointmentData.staffId,
          date
        );
        if (res?.workShiftId) {
          setAppointmentData((prev) => ({
            ...prev,
            workShiftId: res.workShiftId,
          }));
        }
      } catch (error) {
        console.error("Không lấy được workShiftId:", error);
        setTimeSlots([]);
        setStaffs([]);
      }
    };

    fetchWorkShiftId();
  }, [appointmentData.staffId, appointmentData.appointmentDate]);

  useEffect(() => {
    setStaffs([]);
    setTimeSlots([]);
    // setAppointmentData(appointmentData.staffId === "");
    if (appointmentData.appointmentDate) {
      const fetchStaff = async () => {
        try {
          const formattedDate = new Date(appointmentData.appointmentDate)
            .toISOString()
            .split("T")[0];
          const result = await WorkShiftService.getStaffByDate(formattedDate);
          if (result.status === 200) {
            setStaffs(result.data.$values);
          }
        } catch (error) {
          toast.error(error.response.data.message);
          setStaffs([]);
        }
      };
      fetchStaff();
    }
  }, [appointmentData.appointmentDate]);

  useEffect(() => {
    if (appointmentData.appointmentDate && appointmentData.staffId) {
      const formattedDate = appointmentData.appointmentDate;
      WorkShiftService.getTimeSlotsByStaffAndDate(
        appointmentData.staffId,
        formattedDate
      ).then((res) => {
        setTimeSlots(res.$values || []);
      });
    }
  }, [appointmentData.appointmentDate, appointmentData.staffId]);

  const validateForm = useCallback(() => {
    const errors = {};
    if (appointmentData.serviceIds.length === 0)
      errors.services = "Vui lòng chọn ít nhất một dịch vụ";
    if (!appointmentData.appointmentDate) errors.date = "Vui lòng chọn ngày";
    if (!appointmentData.timeSlot) errors.timeSlot = "Vui lòng chọn giờ";
    if (!appointmentData.staffId) errors.staffId = "Vui lòng chọn nhân viên";
    // if (!appointmentData.customerId) {
    //   errors.customerId = "Vui lòng chọn nhân viên";
    // } else if (!guestInfo.phone || !guestInfo.fullName) {
    //   errors.phone = "Vui lòng chọn nhân viên";
    // }

    // Validate appointment time within work shift
    if (
      appointmentData.appointmentDate &&
      appointmentData.timeSlot &&
      appointmentData.workShiftId
    ) {
      const selectedDate = new Date(`${appointmentData.appointmentDate}}`);

      if (selectedDate < new Date(new Date().setHours(0, 0, 0, 0))) {
        errors.date = "Thời gian phải trong tương lai";
      }
    }

    return errors;
  }, [appointmentData]);

  const toggleService = useCallback((service) => {
    setAppointmentData((prev) => ({
      ...prev,
      serviceIds: prev.serviceIds.includes(service.id)
        ? prev.serviceIds.filter((id) => id !== service.id)
        : [...prev.serviceIds, service.id],
    }));
  }, []);
  const toggleStaff = useCallback((staff) => {
    setAppointmentData((prev) => ({
      ...prev,
      staffId: prev.staffId === staff.id ? "" : staff.id,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const validationError = validateForm();
      if (Object.keys(validationError).length) {
        setErrors(validationError);
        return;
      }
      setErrors({});
      setIsSubmitting(true);

      try {
        let customerId = parseInt(user?.nameid);
        if (!customerId) {
          const guest = await createGuest(guestInfo);
          customerId = guest.id;
        }
        const {
          timeSlot, // destruct để loại bỏ
          ...cleanedAppointmentData
        } = appointmentData;
        const payload = {
          ...cleanedAppointmentData,
          appointmentDate: new Date(
            appointmentData.appointmentDate
          ).toISOString(),
          customerId, // 

          timeSlotId: appointmentData.timeSlot,
        };

        const response = await AppointmentService.create(payload);

        if (response.status !== 200 && response.status !== 201) {
          throw new Error("Failed to create appointment");
        }
        // Reset form
        setAppointmentData({
          appointmentDate: "",
          customerId: user?.nameid ? parseInt(user.nameid) : "", //
          staffId: "",
          serviceIds: [],
          workShiftId: "",
          notes: "",
        });
        setStaffs([]);
        setTimeSlots([]);
        // setWorkShifts([]);
        setGuestInfo({ fullName: "", phone: "" });

        toast.success("Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn sớm.");
      } catch (error) {
        console.error("Error creating appointment:", error);

        const errorMsg = error?.response?.data;

        if (typeof errorMsg === "string") {
          if (errorMsg.includes("đã được đặt")) {
            toast.error(
              "Khung giờ này đã được đặt bởi người khác. Vui lòng chọn khung giờ khác."
            );

            // Làm mới lại danh sách timeSlots
            if (appointmentData.staffId && appointmentData.appointmentDate) {
              const formattedDate = appointmentData.appointmentDate;
              try {
                const res = await WorkShiftService.getTimeSlotsByStaffAndDate(
                  appointmentData.staffId,
                  formattedDate
                );
                setTimeSlots(res?.$values || []);
              } catch (refreshErr) {
                console.error("Lỗi khi làm mới timeSlots:", refreshErr);
              }
            }
          } else {
            toast.error(errorMsg);
          }
        } else {
          toast.error("Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại.");
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [appointmentData, guestInfo, user, validateForm]
  );

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-5xl font-bold mb-4 font-[Poppins]">
            Đặt lịch
          </h2>
          <p className="text-blue-600 text-lg sm:text-xl font-medium">
            Chúng tôi luôn sẵn sàng đón tiếp bạn
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border-2 border-blue-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Thông tin khách hàng */}
            {user?.nameid ? (
              <div className="relative group">
                <FiUser className="absolute left-4 top-4 text-blue-400 text-xl" />
                <input
                  type="text"
                  placeholder="Tên khách hàng"
                  disabled
                  value={user?.unique_name || ""}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-blue-100 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all duration-300 placeholder-blue-300 text-blue-700 font-medium"
                />
              </div>
            ) : (
              <div className=" w-full gap-2 sm:flex ">
                <div className="relative group">
                  <FiUser className="absolute left-4 top-4 text-blue-700 text-xl" />
                  <input
                    type="text"
                    placeholder="Tên của bạn"
                    required
                    value={guestInfo.fullName}
                    onChange={(e) =>
                      setGuestInfo((p) => ({ ...p, fullName: e.target.value }))
                    }
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-blue-700 focus:border-blue-700 focus:ring-2 focus:ring-blue-200 transition-all duration-300 placeholder-blue-300 text-blue-700 font-medium"
                  />
                </div>
                <div className="relative group sm:gap-4">
                  <FiPhone className="absolute left-4 top-4 text-blue-400 text-xl" />
                  <input
                    type="phone"
                    placeholder="Số điện thoại"
                    required
                    value={guestInfo.phone}
                    onChange={(e) =>
                      setGuestInfo((p) => ({ ...p, phone: e.target.value }))
                    }
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-blue-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all duration-300 placeholder-blue-300 text-blue-700 font-medium"
                  />
                </div>
              </div>
            )}

            {/* Ngày */}
            <div className="relative group">
              <FiCalendar className="absolute left-4 top-4 text-blue-400 text-xl" />
              <input
                type="date"
                value={appointmentData.appointmentDate}
                required
                min={
                  new Date(new Date().setHours(0, 0, 0, 0))
                    .toISOString()
                    .split("T")[0]
                }
                onChange={(e) => {
                  // Kiểm tra nếu ngày được chọn không nhỏ hơn ngày hiện tại
                  const selectedDate = new Date(e.target.value);
                  const today = new Date(new Date().setHours(0, 0, 0, 0));

                  if (selectedDate >= today) {
                    setAppointmentData(
                      (prev) => ({
                        ...prev,
                        appointmentDate: e.target.value,
                        staffId: "", // Reset staffId khi chọn ngày mới
                        timeSlot: "", // Reset timeSlot khi chọn ngày mới
                      }),
                      setErrors((prev) => ({
                        ...prev,
                        date: "",
                      }))
                    );
                  } else {
                    // Nếu chọn ngày trong quá khứ, hiển thị thông báo
                    setErrors((prev) => ({
                      ...prev,
                      date: "Vui lòng chọn ngày hiện tại hoặc tương lai",
                    }));
                  }
                }}
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-blue-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all duration-300 placeholder-blue-300 text-blue-700 font-medium"
                disabled={isSubmitting}
              />
              {errors.date && (
                <p className="text-red-400 text-sm mt-1 ml-2 flex items-center gap-1">
                  <FiInfo className="inline" />
                  {errors.date}
                </p>
              )}
            </div>

            {/* Chọn nhân viên */}

            {staffs.length > 0 && (
              <div className="md:col-span-3">
                <label className="block text-blue-700 text-lg font-medium mb-3 sm:mb-4">
                  Chọn nhân viên
                </label>
                {errors.staffId && (
                  <p className="text-red-500 text-sm mt-2">{errors.staffId}</p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                  {staffs?.map((staff) => (
                    <div
                      key={staff.id}
                      onClick={() => toggleStaff(staff)}
                      className={`flex items-center p-4 rounded-xl cursor-pointer transition-all ${
                        appointmentData.staffId === staff.id
                          ? "bg-blue-500 text-white shadow-lg"
                          : "bg-blue-50 text-blue-700 hover:bg-blue-100 border-2 border-blue-100"
                      }`}
                      disabled={isSubmitting}
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          appointmentData.staffId === staff.id
                            ? "bg-white text-blue-500"
                            : "bg-blue-500 text-transparent"
                        }`}
                      >
                        <FiCheck className="w-4 h-4" />
                      </div>
                      <img
                        src={
                          staff.imageurl ||
                          "https://www.w3schools.com/w3images/avatar2.png"
                        }
                        alt={staff.fullName}
                        className="w-15 h-15 bg-blue-50"
                      />
                      <span className="ml-3 text-sm font-medium">
                        {staff.fullName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* -----------Booking slots--------- */}
            {timeSlots && appointmentData.staffId && (
              <div className="md:col-span-3">
                <label className="block text-blue-700 text-lg font-medium mb-3 sm:mb-4">
                  Chọn thời gian
                </label>
                <div className="flex flex-wrap gap-3 items-center w-full  mt-4">
                  {timeSlots.map((item) => {
                    const time = new Date(
                      `1970-01-01T${item.startTime}`
                    ).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    });

                    const isSelected = appointmentData.timeSlot === item.id;
                    return (
                      <div
                        onClick={() =>
                          setAppointmentData((prev) => ({
                            ...prev,
                            timeSlot: isSelected ? null : item.id,
                          }))
                        }
                        className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                          isSelected
                            ? "bg-primary text-white"
                            : "border border-blue-200 hover:bg-blue-200"
                        }`}
                        key={item.id}
                      >
                        {time}
                      </div>
                    );
                  })}
                </div>
                {errors.timeSlot && (
                  <p className="text-red-500 text-sm mt-2">{errors.timeSlot}</p>
                )}
              </div>
            )}

            {/* Dịch vụ */}
            <div className="md:col-span-3">
              <label className="block text-blue-700 text-lg font-medium mb-3 sm:mb-4">
                Chọn dịch vụ
              </label>
              <div className="flex flex-wrap gap-2 mb-4">
                {appointmentData?.serviceIds?.map((id) => {
                  const service = services.find((s) => s.id === id);
                  return service ? (
                    <div
                      key={id}
                      className="flex items-center bg-blue-100 rounded-full px-4 py-2 text-sm  font-medium transition-all hover:bg-blue-200"
                    >
                      {" "}
                      <img
                        src={service.imageurl}
                        alt={service.name}
                        className=" w-15 h-15  bg-blue-50"
                      />
                      <span className="text-blue-700">{service.name}</span>
                      <button
                        type="button"
                        onClick={() => toggleService(service)}
                        className="ml-2 hover:text-blue-900 bg-amber-50"
                        disabled={isSubmitting}
                      >
                        <FiX className="w-4 h-4 text-red-700 cursor-pointer " />
                      </button>
                    </div>
                  ) : null;
                })}
              </div>
              <div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 "
                // className="flex flex-wrap gap-2 mb-4"
              >
                {services?.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => toggleService(service)}
                    className={`flex items-center p-4 rounded-xl cursor-pointer transition-all ${
                      appointmentData?.serviceIds?.includes(service.id)
                        ? "bg-blue-500 text-white shadow-lg"
                        : "bg-blue-50 text-blue-700 hover:bg-blue-100 border-2 border-blue-100"
                    }`}
                    disabled={isSubmitting}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        appointmentData?.serviceIds?.includes(service.id)
                          ? "bg-white text-blue-500"
                          : "bg-blue-200 text-transparent"
                      }`}
                    >
                      <FiCheck className="w-4 h-4" />
                    </div>{" "}
                    <img
                      src={service.imageurl}
                      alt={service.name}
                      className=" w-15 h-15  bg-blue-50"
                    />
                    <span className="ml-3 text-sm font-medium">
                      {service.name}
                    </span>
                    <span className="ml-auto text-sm font-medium">
                      {formatPrice(service.price)} VNĐ
                    </span>
                  </div>
                ))}
              </div>
              {errors.services && (
                <p className="text-red-500 text-sm mt-2">{errors.services}</p>
              )}
            </div>

            {/* Ghi chú */}
            <div className="md:col-span-2">
              <label className="block text-blue-700 text-lg font-medium mb-3 sm:mb-4">
                Ghi chú thêm (nếu có)
              </label>
              <textarea
                value={appointmentData.notes}
                onChange={(e) =>
                  setAppointmentData((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
                placeholder="Vui lòng cho chúng tôi biết thêm yêu cầu của bạn..."
                className="w-full px-4 py-3 rounded-xl border-2 border-blue-100 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all duration-300 placeholder-blue-300 text-blue-700 font-medium"
                rows={3}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full mt-8 bg-gradient-to-r from-blue-400 to-blue-600 text-white py-4 sm:py-5 rounded-xl font-bold text-base sm:text-lg shadow-lg hover:shadow-blue-200 hover:scale-[1.02] transition-all duration-300 ${
              isSubmitting ? "opacity-80 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Đang đặt lịch..." : "Xác nhận đặt lịch"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default BookingPage;
