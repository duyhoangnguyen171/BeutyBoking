import "bootstrap/dist/css/bootstrap.min.css";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AdminPanel from "./component/common/AdminPanel";
import PrivateRoute from "./component/common/PrivateRoute";

import Appointment from "./modules/appointments/Appointment";
import LoginForm from "./modules/auth/LoginForm";
import Contact from "./modules/contacts/Contact";
import New from "./modules/news/New";
import Service from "./modules/services/Service";
import Users from "./modules/users/Users";
import WorkShift from "./modules/workshifts/WorkShift";

import UserAdd from "./modules/users/UserAdd";
import UserAppointmentHistory from "./modules/users/UserAppointmentHistory";
import UserEdit from "./modules/users/UserEdit";
import UserView from "./modules/users/UserView";

import AppointmentAdd from "./modules/appointments/AppointmentAdd";
import AppointmentCanceled from "./modules/appointments/AppointmentCanceled";
import AppointmentDetail from "./modules/appointments/AppointmentDetail";
import AppointmentEdit from "./modules/appointments/AppointmentEdit";

import ServiceAdd from "./modules/services/ServiceAdd";
import ServiceEdit from "./modules/services/ServiceEdit";

import RegisterShift from "./modules/workshifts/RegisterShift";
import WorkshiftCreate from "./modules/workshifts/WorkShiftCreate";
import WorkShiftDetail from "./modules/workshifts/WorkShiftDetail";
import WorkShiftEdit from "./modules/workshifts/WorkShiftEdit";
import WorkshiftHistory from "./modules/workshifts/WorkshiftHistory";
const App = () => {
  return (
    <Router>
      <>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginForm />} />

          {/* Admin routes */}
          <Route element={<PrivateRoute allowedRole="admin" />}>
            <Route path="/admin" element={<AdminPanel />}>
              <Route path="users" element={<Users />} />
              <Route path="appointments" element={<Appointment />} />
              <Route path="services" element={<Service />} />
              <Route path="contact" element={<Contact />} />
              <Route path="news" element={<New />} />
              <Route path="workshifts" element={<WorkShift />} />
              <Route path="users/add" element={<UserAdd />} />
              <Route path="users/edit" element={<UserEdit />} />
              <Route path="users/view" element={<UserView />} />
              <Route path="users/:id/appointments-history" element={<UserAppointmentHistory />} />
              <Route path="appointments/add" element={<AppointmentAdd />} />
              <Route path="appointments/edit" element={<AppointmentEdit />} />
              <Route
                path="appointments/detail/:id"
                element={<AppointmentDetail />}
              />  
              <Route
                path="appointments/canceled"
                element={<AppointmentCanceled />}
              />
              <Route path="services/add" element={<ServiceAdd />} />
              <Route path="services/edit" element={<ServiceEdit />} />
              <Route path="workshifts/create" element={<WorkshiftCreate />} />
              <Route path="workshifts/history" element={<WorkshiftHistory />} />
              <Route path="workshifts/edit/:id" element={<WorkShiftEdit />} />
              <Route path="workshifts/register" element={<RegisterShift />} />
              <Route
                path="workshifts/details/view/:shiftId"
                element={<WorkShiftDetail />}
              />
            </Route>
          </Route>

          {/* Staff routes */}
          <Route element={<PrivateRoute allowedRole="staff" />}>
            <Route path="/staff" element={<AdminPanel />}>
              <Route path="users" element={<Users />} />
              <Route path="appointments" element={<Appointment />} />
              <Route path="services" element={<Service />} />
              <Route path="contact" element={<Contact />} />
              <Route path="workshifts" element={<WorkShift />} />
              <Route path="users/add" element={<UserAdd />} />
              <Route path="users/edit" element={<UserEdit />} />
              <Route path="users/view" element={<UserView />} />
              <Route path="appointments/add" element={<AppointmentAdd />} />
              <Route path="appointments/edit" element={<AppointmentEdit />} />
              <Route path="services/add" element={<ServiceAdd />} />
              <Route path="services/edit" element={<ServiceEdit />} />
              <Route path="workshifts/register" element={<RegisterShift />} />
            </Route>
          </Route>
        </Routes>

        {/* ✅ ToastContainer phải nằm ngoài Routes */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </>
    </Router>
  );
};

export default App;
