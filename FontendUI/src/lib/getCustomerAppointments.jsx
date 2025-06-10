import { appointmentsData } from "../assets/data/db";

const getCustomerAppointments = (customerId) => {
  // Lọc các appointment của khách hàng theo customerId
  const customerAppointments = appointmentsData.filter(
    (appointment) => appointment.customerId === customerId
  );

  return customerAppointments;
};
export default getCustomerAppointments;
