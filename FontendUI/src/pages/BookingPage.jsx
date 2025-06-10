import React, { useCallback, useContext, useState, useEffect } from "react";
import {
  FiCalendar,
  FiCheck,
  FiClock,
  FiInfo,
  FiUser,
  FiX,
} from "react-icons/fi";
import { AppContext } from "../context/AppContext";
import { ServiceContext } from "../context/ServiceContext";
import { StaffContext } from "../context/StaffContext";
import AppointmentService from "../services/AppointmentService";
import WorkShiftService from "../services/WorkShiftService";
import { createGuest } from "../services/UserService";
import toast from "react-hot-toast";

const BookingPage = () => {
  const { services, formatPrice } = useContext(ServiceContext);
  const { user } = useContext(AppContext);
  const { staffs } = useContext(StaffContext);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appointmentData, setAppointmentData] = useState({
    appointmentDate: "",
    time: "",
    customerId: user?.nameid ? parseInt(user.nameid) : "",
    staffId: "",
    serviceIds: [],
    workShiftId: "",
    notes: "",
    status: 0,
  });
  const [workShifts, setWorkShifts] = useState([]);
  const [filteredStaffs, setFilteredStaffs] = useState([]);
  const [isGuest, setIsGuest] = useState(!user?.nameid);
  const [guestData, setGuestData] = useState({ phone: "", fullName: "" });
  const [loadingShifts, setLoadingShifts] = useState(false);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [loadingGuest, setLoadingGuest] = useState(false);

  // Fetch work shifts based on selected date
  useEffect(() => {
    if (!appointmentData.appointmentDate) {
      setWorkShifts([]);
      setAppointmentData((prev) => ({ ...prev, workShiftId: "", staffId: "" }));
      setFilteredStaffs([]);
      return;
    }

    const fetchShifts = async () => {
      setLoadingShifts(true);
      try {
        const selectedDate = new Date(appointmentData.appointmentDate);
        const dayOfWeek = selectedDate.getDay();
        const response = await WorkShiftService.getAll();
        const shifts = response?.$values ?? response ?? [];
        const filteredShifts = shifts.filter(
          (shift) => shift.dayOfWeek === dayOfWeek
        );
        if (filteredShifts.length) {
          setWorkShifts(filteredShifts);
          setErrors((prev) => ({ ...prev, workShift: "" }));
        } else {
          setWorkShifts([]);
          setAppointmentData((prev) => ({
            ...prev,
            workShiftId: "",
            staffId: "",
          }));
          setFilteredStaffs([]);
          setErrors((prev) => ({
            ...prev,
            workShift: "Không có ca làm nào trong ngày này.",
          }));
        }
      } catch (error) {
        console.error("Lỗi khi lấy ca làm:", error);
        setErrors((prev) => ({
          ...prev,
          workShift: "Lỗi khi lấy danh sách ca làm.",
        }));
      } finally {
        setLoadingShifts(false);
      }
    };

    fetchShifts();
  }, [appointmentData.appointmentDate]);

  // Fetch staff based on selected work shift
  useEffect(() => {
    if (!appointmentData.workShiftId) {
      setFilteredStaffs([]);
      setAppointmentData((prev) => ({ ...prev, staffId: "" }));
      return;
    }

    const fetchStaff = async () => {
      setLoadingStaff(true);
      try {
        const shift = await WorkShiftService.getById(
          appointmentData.workShiftId
        );
        if (!shift || !shift.id) {
          setFilteredStaffs([]);
          setErrors((prev) => ({ ...prev, staff: "Ca làm không tồn tại." }));
          return;
        }

        const staffData =
          shift.registeredStaffs?.$values ?? shift.registeredStaffs ?? [];
        const formattedStaffList = staffData
          .filter((staff) => staff && staff.id)
          .map((staff) => ({
            id: staff.id,
            fullName: staff.fullName || `Nhân viên ${staff.id}`,
          }));

        if (formattedStaffList.length) {
          setFilteredStaffs(formattedStaffList);
          setErrors((prev) => ({ ...prev, staff: "" }));
        } else {
          setFilteredStaffs([]);
          setErrors((prev) => ({
            ...prev,
            staff: "Không có nhân viên nào đăng ký cho ca làm này.",
          }));
        }
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết ca làm:", error);
        setFilteredStaffs([]);
        setErrors((prev) => ({
          ...prev,
          staff: "Lỗi khi lấy danh sách nhân viên.",
        }));
      } finally {
        setLoadingStaff(false);
      }
    };

    fetchStaff();
  }, [appointmentData.workShiftId]);

  const validateForm = useCallback(() => {
    const errors = {};
    if (appointmentData.serviceIds.length === 0)
      errors.services = "Vui lòng chọn ít nhất một dịch vụ";
    if (!appointmentData.appointmentDate) errors.date = "Vui lòng chọn ngày";
    if (!appointmentData.time) errors.time = "Vui lòng chọn giờ";
    if (!appointmentData.staffId) errors.staff = "Vui lòng chọn nhân viên";
    if (!appointmentData.workShiftId) errors.workShift = "Vui lòng chọn ca làm";
    if (isGuest && (!guestData.phone || !guestData.fullName)) {
      errors.guest = "Vui lòng nhập đầy đủ số điện thoại và tên khách vãng lai";
    }

    // Validate appointment time within work shift
    if (
      appointmentData.appointmentDate &&
      appointmentData.time &&
      appointmentData.workShiftId
    ) {
      const selectedDateTime = new Date(
        `${appointmentData.appointmentDate}T${appointmentData.time}`
      );
      const shift = workShifts.find(
        (s) => s.id === appointmentData.workShiftId
      );
      if (shift) {
        const startDateTime = new Date(
          `${appointmentData.appointmentDate} ${shift.startTime}`
        );
        const endDateTime = new Date(
          `${appointmentData.appointmentDate} ${shift.endTime}`
        );
        if (
          selectedDateTime < startDateTime ||
          selectedDateTime > endDateTime
        ) {
          errors.time =
            "Thời gian lịch hẹn không nằm trong khoảng thời gian của ca làm";
        }
        if (selectedDateTime < new Date()) {
          errors.date = "Thời gian phải trong tương lai";
        }
      }
    }

    return errors;
  }, [appointmentData, workShifts, isGuest, guestData]);

  const toggleService = useCallback((service) => {
    setAppointmentData((prev) => ({
      ...prev,
      serviceIds: prev.serviceIds.includes(service.id)
        ? prev.serviceIds.filter((id) => id !== service.id)
        : [...prev.serviceIds, service.id],
    }));
  }, []);

  const handleGuestChange = (e) => {
    const { name, value } = e.target;
    setGuestData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuestSelection = async () => {
    if (!guestData.phone || !guestData.fullName) {
      setErrors((prev) => ({
        ...prev,
        guest: "Vui lòng nhập đầy đủ số điện thoại và tên khách vãng lai",
      }));
      return;
    }

    setLoadingGuest(true);
    setErrors((prev) => ({ ...prev, guest: "" }));
    try {
      const existingGuest = await createGuest(guestData);
      if (existingGuest && existingGuest.id) {
        setAppointmentData((prev) => ({
          ...prev,
          customerId: existingGuest.id,
        }));
        setIsGuest(true);
      } else {
        setErrors((prev) => ({
          ...prev,
          guest: "Không thể tạo khách vãng lai",
        }));
      }
    } catch (error) {
      console.error("Lỗi khi tạo khách vãng lai:", error);
      setErrors((prev) => ({
        ...prev,
        guest: "Lỗi khi tạo khách vãng lai. Vui lòng thử lại",
      }));
    } finally {
      setLoadingGuest(false);
    }
  };

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
        const payload = {
          appointmentDate: new Date(
            `${appointmentData.appointmentDate}T${appointmentData.time}`
          ).toISOString(),
          customerId: appointmentData.customerId || parseInt(user?.nameid),
          staffId: parseInt(appointmentData.staffId),
          workShiftId: parseInt(appointmentData.workShiftId),
          serviceIds: appointmentData.serviceIds.map(Number),
          notes: appointmentData.notes,
        };
        console.log("📦 Payload gửi đi:", payload);

        const response = await AppointmentService.create(payload);

        if (response.status !== 200 && response.status !== 201) {
          throw new Error("Failed to create appointment");
        }
        // Reset form
        setAppointmentData({
          appointmentDate: "",
          time: "",
          customerId: user?.nameid ? parseInt(user.nameid) : "",
          staffId: "",
          serviceIds: [],
          workShiftId: "",
          notes: "",
          status: 0,
        });
        setGuestData({ phone: "", fullName: "" });
        setIsGuest(!user?.nameid);
        setWorkShifts([]);
        setFilteredStaffs([]);

        toast.success("Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn sớm.");
      } catch (error) {
        console.error("Error creating appointment:", error);
        toast.error("Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [appointmentData, user, validateForm]
  );

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-5xl font-bold mb-4 font-[Poppins]">
            Đặt lịch
          </h2>
          <p className="text-yellow-600 text-lg sm:text-xl font-medium">
            Chúng tôi luôn sẵn sàng đón tiếp bạn
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border-2 border-yellow-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Thông tin khách hàng */}
            {isGuest ? (
              <>
                <div className="relative group">
                  <FiUser className="absolute left-4 top-4 text-yellow-400 text-xl" />
                  <input
                    type="text"
                    name="fullName"
                    value={guestData.fullName}
                    onChange={handleGuestChange}
                    placeholder="Họ và tên"
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-yellow-100 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-all duration-300 placeholder-yellow-300 text-yellow-700 font-medium"
                    disabled={loadingGuest || isSubmitting}
                  />
                  {errors.guest && (
                    <p className="text-red-400 text-sm mt-1 ml-2 flex items-center gap-1">
                      <FiInfo className="inline" />
                      {errors.guest}
                    </p>
                  )}
                </div>
                <div className="relative group">
                  <FiUser className="absolute left-4 top-4 text-yellow-400 text-xl" />
                  <input
                    type="text"
                    name="phone"
                    value={guestData.phone}
                    onChange={handleGuestChange}
                    placeholder="Số điện thoại"
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-yellow-100 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-all duration-300 placeholder-yellow-300 text-yellow-700 font-medium"
                    disabled={loadingGuest || isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={handleGuestSelection}
                    className="absolute right-4 top-3 text-yellow-400 hover:text-yellow-600"
                    disabled={loadingGuest || isSubmitting}
                  >
                    {loadingGuest ? "Đang xử lý..." : "Xác nhận"}
                  </button>
                </div>
              </>
            ) : (
              <div className="relative group">
                <FiUser className="absolute left-4 top-4 text-yellow-400 text-xl" />
                <input
                  type="text"
                  placeholder="Tên khách hàng"
                  disabled
                  value={user?.unique_name || ""}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-yellow-100 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-all duration-300 placeholder-yellow-300 text-yellow-700 font-medium"
                />
              </div>
            )}

            {/* Chọn ca làm */}
            <div className="relative group">
              <FiClock className="absolute left-4 top-4 text-yellow-400 text-xl" />
              <select
                value={appointmentData.workShiftId}
                onChange={(e) =>
                  setAppointmentData((prev) => ({
                    ...prev,
                    workShiftId: e.target.value,
                  }))
                }
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-yellow-100 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-all duration-300 placeholder-yellow-300 text-yellow-700 font-medium"
                disabled={loadingShifts || isSubmitting}
              >
                <option value="">Chọn ca làm</option>
                {workShifts.map((shift) => (
                  <option key={shift.id} value={shift.id}>
                    {shift.name} ({shift.startTime} - {shift.endTime})
                  </option>
                ))}
              </select>
              {errors.workShift && (
                <p className="text-red-400 text-sm mt-1 ml-2 flex items-center gap-1">
                  <FiInfo className="inline" />
                  {errors.workShift}
                </p>
              )}
            </div>

            {/* Chọn nhân viên */}
            <div className="relative group">
              <FiUser className="absolute left-4 top-4 text-yellow-400 text-xl" />
              <select
                value={appointmentData.staffId}
                onChange={(e) =>
                  setAppointmentData((prev) => ({
                    ...prev,
                    staffId: e.target.value,
                  }))
                }
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-yellow-100 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-all duration-300 placeholder-yellow-300 text-yellow-700 font-medium"
                disabled={loadingStaff || isSubmitting}
              >
                <option value="">Chọn nhân viên</option>
                {filteredStaffs.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.fullName}
                  </option>
                ))}
              </select>
              {errors.staff && (
                <p className="text-red-400 text-sm mt-1 ml-2 flex items-center gap-1">
                  <FiInfo className="inline" />
                  {errors.staff}
                </p>
              )}
            </div>

            {/* Dịch vụ */}
            <div className="md:col-span-2">
              <label className="block text-yellow-700 text-lg font-medium mb-3 sm:mb-4">
                Chọn dịch vụ
              </label>
              <div className="flex flex-wrap gap-2 mb-4">
                {appointmentData.serviceIds.map((id) => {
                  const service = services.find((s) => s.id === id);
                  return service ? (
                    <div
                      key={id}
                      className="flex items-center bg-yellow-100 rounded-full px-4 py-2 text-sm text-yellow-700 font-medium transition-all hover:bg-yellow-200"
                    >
                      <span>{service.name}</span>
                      <button
                        type="button"
                        onClick={() => toggleService(service)}
                        className="ml-2 hover:text-yellow-900"
                        disabled={isSubmitting}
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  ) : null;
                })}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                {services?.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => toggleService(service)}
                    className={`flex items-center p-4 rounded-xl cursor-pointer transition-all ${
                      appointmentData.serviceIds.includes(service.id)
                        ? "bg-yellow-500 text-white shadow-lg"
                        : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-2 border-yellow-100"
                    }`}
                    disabled={isSubmitting}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        appointmentData.serviceIds.includes(service.id)
                          ? "bg-white text-yellow-500"
                          : "bg-yellow-200 text-transparent"
                      }`}
                    >
                      <FiCheck className="w-4 h-4" />
                    </div>
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

            {/* Ngày */}
            <div className="relative group">
              <FiCalendar className="absolute left-4 top-4 text-yellow-400 text-xl" />
              <input
                type="date"
                value={appointmentData.appointmentDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) =>
                  setAppointmentData((prev) => ({
                    ...prev,
                    appointmentDate: e.target.value,
                  }))
                }
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-yellow-100 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-all duration-300 placeholder-yellow-300 text-yellow-700 font-medium"
                disabled={isSubmitting}
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
              <FiClock className="absolute left-4 top-4 text-yellow-400 text-xl" />
              <input
                type="time"
                value={appointmentData.time}
                onChange={(e) =>
                  setAppointmentData((prev) => ({
                    ...prev,
                    time: e.target.value,
                  }))
                }
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-yellow-100 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-all duration-300 placeholder-yellow-300 text-yellow-700 font-medium"
                disabled={isSubmitting}
              />
              {errors.time && (
                <p className="text-red-400 text-sm mt-1 ml-2 flex items-center gap-1">
                  <FiInfo className="inline" />
                  {errors.time}
                </p>
              )}
            </div>

            {/* Ghi chú */}
            <div className="md:col-span-2">
              <label className="block text-yellow-700 text-lg font-medium mb-3 sm:mb-4">
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
                className="w-full px-4 py-3 rounded-xl border-2 border-yellow-100 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-all duration-300 placeholder-yellow-300 text-yellow-700 font-medium"
                rows={3}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full mt-8 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white py-4 sm:py-5 rounded-xl font-bold text-base sm:text-lg shadow-lg hover:shadow-yellow-200 hover:scale-[1.02] transition-all duration-300 ${
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
