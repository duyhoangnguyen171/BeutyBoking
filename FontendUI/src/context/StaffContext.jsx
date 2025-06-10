import { createContext, useEffect, useState } from "react";
import { getStaff } from "../services/UserService";

export const StaffContext = createContext();

export const StaffContextProvider = (props) => {
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

  useEffect(() => {
    fetchStaffs();
  }, []);

  const value = {
    staffs,
    loadingStaffs,
    errorStaffs,
    setErrorStaff,
    fetchStaffs,
  };

  return (
    <StaffContext.Provider value={value}>
      {props.children}
    </StaffContext.Provider>
  );
};
