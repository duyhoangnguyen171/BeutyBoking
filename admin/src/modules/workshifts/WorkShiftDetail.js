import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import WorkShiftService from "../../services/WorkShiftService";
import "../../asset/styles/workshift/WorkShiftDetails.css";
const WorkShiftDetail = () => {
  const { shiftId } = useParams();
  const [data, setData] = useState(null);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await WorkShiftService.getById(shiftId);
        console.log("API trả về:", result);

        setData(result);
        setError(null);

        const registeredStaffs = result.registeredStaffs?.$values ?? [];
        console.log("Nhân viên đã đăng ký:", registeredStaffs);
      } catch (error) {
        console.error("Không thể tải dữ liệu ca làm:", error);
        setError("Không thể tải dữ liệu ca làm.");
      }
    };

    if (shiftId) {
      fetchData();
    }
  }, [shiftId]);

  const assignStaff = async (appointmentId, staffId) => {
    if (!staffId) return;
    setAssigning(true);
    try {
      await WorkShiftService.assignStaff(shiftId, appointmentId, staffId);
      setError(null);
      alert("Gán thành công");
      const updated = await WorkShiftService.getById(shiftId);
      setData(updated);
    } catch (err) {
      setError("Lỗi khi gán nhân viên.");
    } finally {
      setAssigning(false);
    }
  };

  const approveStaff = async (userId) => {
    try {
      const workshiftId = parseInt(shiftId, 10);
      const userIdNumber = parseInt(userId, 10);

      console.log("Duyệt nhân viên:", { workshiftId, userId: userIdNumber });

      await WorkShiftService.approveStaff(workshiftId, userIdNumber);

      const updated = await WorkShiftService.getById(workshiftId);
      setData(updated);
      setError(null);
      alert("Nhân viên đã được duyệt.");
    } catch (err) {
      console.error("Lỗi khi duyệt nhân viên:", err);
      setError("Lỗi khi duyệt nhân viên.");
    }
  };

  if (!data) return <div>Đang tải dữ liệu...</div>;

  const appointments = data.appointments?.$values ?? [];
  const registeredStaffs = data.registeredStaffs?.$values ?? [];

  const renderName = (value) => {
    if (typeof value === "string") return value;
    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value);
    }
    return "Không xác định";
  };

  return (
  <div style={{ display: "flex", gap: "40px" }}>
    {/* Danh sách lịch hẹn - chiếm 7 phần */}
    <div style={{ flex: 7 }}>
      <h3>Danh sách lịch hẹn</h3>
      {appointments.length === 0 ? (
        <p>Chưa có lịch nào</p>
      ) : (
        appointments.map((appt) => (
          <div
            key={appt.id}
            style={{
              border: "1px solid gray",
              padding: 10,
              marginBottom: 10,
            }}
          >
            <p>
              <strong>Khách:</strong>{" "}
              {renderName(appt.customerName) || "Chưa có"}
            </p>
            <p>
              <strong>Nhân viên:</strong>{" "}
              {renderName(appt.staffName) || "Chưa gán"}
            </p>
            <label>Chọn nhân viên khác:</label>
            <select
              onChange={(e) =>
                assignStaff(appt.id, parseInt(e.target.value))
              }
              disabled={assigning}
              defaultValue=""
            >
              <option value="" disabled>
                -- Chọn nhân viên --
              </option>
              {registeredStaffs
                .filter((staff) => staff.isApproved === true)
                .map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {renderName(staff.fullName)}
                  </option>
                ))}
            </select>
          </div>
        ))
      )}
    </div>

    {/* Nhân viên đã đăng ký - chiếm 3 phần */}
    <div style={{ flex: 3 }}>
      <h3>Nhân viên đã đăng ký</h3>
      {registeredStaffs.length === 0 ? (
        <p>Chưa có nhân viên đăng ký</p>
      ) : (
        <ul>
          {registeredStaffs.map((s) => (
            <li key={s.id}>
              {renderName(s.fullName)}
              {s.isApproved ? (
                <span
                  style={{
                    marginLeft: "10px",
                    color: "green",
                    fontWeight: "bold",
                  }}
                >
                  Đã duyệt
                </span>
              ) : (
                <button
                  onClick={() => approveStaff(s.id)}
                  style={{ marginLeft: "10px" }}
                >
                  Duyệt
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>

    {/* Hiển thị lỗi nếu có */}
    {error && (
      <div style={{ color: "red", fontWeight: "bold" }}>{error}</div>
    )}
  </div>
);

};

export default WorkShiftDetail;
