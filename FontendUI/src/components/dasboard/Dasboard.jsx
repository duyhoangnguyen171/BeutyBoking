import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";
// import { appointmentsData, customers, services } from "../../assets/data/db";

const Dasboard = () => {
  const { services } = useContext(AppContext);
  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold">Total Customers</h2>
          <p className="text-2xl font-bold">{customers.length}</p>
        </div> */}
        <div className="bg-white text-center shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold"> Dịch Vụ</h2>
          <p className="text-2xl  font-bold">{services.length}</p>
        </div>
        {/* <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold">Total Appointments</h2>
          <p className="text-2xl font-bold">{appointmentsData.length}</p>
        </div> */}
        <div className="bg-white text-center shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold">Doanh Thu</h2>
          <p className="text-2xl  font-bold">$12,500</p>
        </div>
      </div>
    </div>
  );
};

export default Dasboard;
