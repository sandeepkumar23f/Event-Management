import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import AdminNavbar from "./components/admin/AdminNavbar";
import UserNavbar from "./components/user/UserNavbar";
import AdminLogin from "./components/admin/Login";
import AdminSignup from "./components/admin/Signup";
import UserLogin from "./components/user/Login";
import UserSignUp from "./components/user/Signup";
import UserDashboard from "./components/user/UserDashboard";
import AdminDashboard from "./components/admin/AdminDashboard";
import ProtectedAdmin from "./components/admin/ProtectedAdmin";
import ProtectedUser from "./components/user/ProtectedUser";
import "./App.css";
import AddQuestion from "./components/admin/mcq-section/AddQuestion";
import AdminQuestions from "./components/admin/mcq-section/AdminQuestions";
import UpdateQuestion from "./components/admin/mcq-section/UpdateQuestion";
import CreateEvent from "./components/admin/mcq-section/CreateEvent";
import AdminEvents from "./components/admin/mcq-section/Events";
import ExploreEvents from "./components/user/ExploreEvents";
import Register from "./components/user/Register";
import AdminEventRegistrations from "./components/admin/AdminEventRegistrations";
import RegisteredEvents from "./components/user/RegisteredEvents";
function App() {
  const [adminlogin, setAdminLogin] = useState(!!localStorage.getItem("admin-login"));
  const [userlogin,setUserLogin] = useState(!!localStorage.getItem("user-login"))
  return (
    <>
    <br />
     { adminlogin ? (
      <AdminNavbar login={adminlogin} setLogin={setAdminLogin}/>
     ) : userlogin ? (
       <UserNavbar login={userlogin} setUserLogin={setUserLogin}/>
     ) : null}
      <Routes>
        {/* admin login and signup  */}
        <Route path="/admin-signup" element={<AdminSignup setLogin={setAdminLogin}/>}/>
        <Route path="/admin-login" element={<AdminLogin setLogin={setAdminLogin}/>}/>

        {/* user login and signup  */}
        <Route path="/user-signup" element={<UserSignUp setLogin={setUserLogin}/>}/>
        <Route path="/user-login" element={<UserLogin setLogin={setUserLogin}/>}/>
        <Route path="/user-dashboard" element={<ProtectedUser><UserDashboard/></ProtectedUser>} />
        <Route path="/admin-dashboard" element={<ProtectedAdmin><AdminDashboard/></ProtectedAdmin>} />
        <Route path="/add-question/:eventId" element={<ProtectedAdmin><AddQuestion/></ProtectedAdmin>} />
        <Route path="/questions/:eventId" element={<ProtectedAdmin><AdminQuestions/></ProtectedAdmin>} />
        <Route path="/update-question/:id/:eventId" element={<ProtectedAdmin><UpdateQuestion/></ProtectedAdmin>} />
        <Route path="/create-mcq-event" element={<ProtectedAdmin><CreateEvent/></ProtectedAdmin>} />
        <Route path="/events" element={<ProtectedAdmin><AdminEvents/></ProtectedAdmin>} />
        <Route path="/event-registrations/:id" element={<ProtectedAdmin><AdminEventRegistrations/></ProtectedAdmin>} />
        {/* user public Routes */}
        <Route path="/explore-events" element={<ProtectedUser><ExploreEvents/></ProtectedUser>} />
        <Route path="/register-event/:id" element={<ProtectedUser><Register/></ProtectedUser>} />
        <Route path="/my-registrations" element={<ProtectedUser><RegisteredEvents/></ProtectedUser>} />
      </Routes>
    </>
  );
}

export default App;
