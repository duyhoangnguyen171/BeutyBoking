import { createContext, useEffect, useState } from "react";
import { getStaff } from "../services/UserService";
import WorkShiftService from "../services/WorkShiftService";

// eslint-disable-next-line react-refresh/only-export-components
export const StaffContext = createContext();

export const StaffContextProvider = ({ children }) => {
  const [loadingStaffs, setLoadingStaff] = useState(false);
  const [errorStaffs, setErrorStaff] = useState(null);
  const [staffs, setStaffs] = useState([]);

  const fetchStaffs = async () => {
    try {
      setLoadingStaff(true);
      setErrorStaff(null);

      // Gọi API bằng Axios
      const response = await getStaff();
      const data = response.$values;
      if (data && Array.isArray(data)) {
        setStaffs(data);
      } else {
        setStaffs([]);
      }
    } catch (error) {
      console.error("Error loading services:", error);
      setErrorStaff("Không thể tải dữ liệu nhân viên. Vui lòng thử lại sau.");
    } finally {
      setLoadingStaff(false);
    }
  };

  const getShiftByStaffId = async (staffId) => {
    try {
      const response = await WorkShiftService.getByStaffId(staffId);
      const data = response.$values;
      if (data && Array.isArray(data)) {
        return data;
      }
      console.log("Data getShiftByStaffId : ", data);
    } catch (error) {
      console.error("Error loading services:", error);
    }
  };

  useEffect(() => {
    if (staffs.length === 0 && !loadingStaffs) {
      fetchStaffs();
    }
  }, [loadingStaffs, staffs.length]);
  const value = {
    getShiftByStaffId,
    staffs,
    loadingStaffs,
    errorStaffs,
    setErrorStaff,
    fetchStaffs,
  };

  return (
    <StaffContext.Provider value={value}>{children}</StaffContext.Provider>
  );
};
