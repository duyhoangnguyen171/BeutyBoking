import React, { useContext, useEffect, useState } from "react";
import AppointmentList from "../components/AppointmentList";
import { AppContext } from "../context/AppContext";
import AppointmentService from "../services/AppointmentService";

const MyAppointments = () => {
  const { user, token } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);

  const getMyAppointment = async () => {
    // API call to get user's appointments
    try {
      const userId = parseInt(user?.nameid || "0");
      if (isNaN(userId) || userId <= 0) {
        console.error("Invalid user ID");
        return;
      }

      const response = await AppointmentService.getByUserId(userId);
      console.log("My appointment: ", response);
      setAppointments(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (token) {
      getMyAppointment();
    }
  }, [token]);

  return (
    <div className="">
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
        My Appointments
      </p>
      <div>
        <AppointmentList appointments={appointments} />
      </div>
    </div>
  );
};

export default MyAppointments;
