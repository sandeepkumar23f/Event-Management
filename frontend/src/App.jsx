import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import AdminNavbar from "./components/AdminNavbar";
import UserNavbar from "./components/UserNavbar";
import AdminLogin from "./components/admin/Login";
import AdminSignup from "./components/admin/Signup";
import UserLogin from "./components/user/Login";
import UserSignUp from "./components/user/Signup";
import UserDashboard from "./components/user/UserDashBoard";
import AdminDashboard from "./components/admin/AdminDashboard";
import ProtectedAdmin from "./components/ProtectedAdmin";
import ProtectedUser from "./components/ProtectedUser";
import "./App.css";
function App() {
  const [adminlogin, setAdminLogin] = useState(!!localStorage.getItem("admin-login"));
  const [userlogin,setUserLogin] = useState(!!localStorage.getItem("user-login"))
  return (
    <>
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
      </Routes>
    </>
  );
}

export default App;
