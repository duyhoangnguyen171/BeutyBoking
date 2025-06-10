import React, { useContext } from "react";
// import { staffs } from "../../assets/data/db";
import StaffList from "./StaffList";
import { AppContext } from "../../context/AppContext";

const StaffManagement = () => {
  const { staffs } = useContext(AppContext);
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="">
        <h2 className="text-2xl font-bold mb-4">Staffs Management</h2>
        <button className="bg-green-400 p-2 rounded-xl ">Thêm nhân viên</button>
      </div>

      <StaffList staffs={staffs} />
    </div>
  );
};

export default StaffManagement;
