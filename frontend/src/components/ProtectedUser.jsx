import { Navigate } from "react-router-dom";
export default function ProtectedUser({children,login,redirectTo="/user-login",loginkey="user-login"}){
    const isLoggedIn = login || !! localStorage.getItem(loginkey);
    if(!isLoggedIn){
        return <Navigate to={redirectTo} replace />
    }
    return children;
}