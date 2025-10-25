import { Navigate } from "react-router-dom";

export default function ProtectedAdmin({children,login, loginkey = "admin-login", redirectTo="/admin-login"}){
    const isLoggedIn = login || !!localStorage.getItem(loginkey);
    if(!isLoggedIn){
        return <Navigate to={redirectTo} replace />
    }
    return children
}