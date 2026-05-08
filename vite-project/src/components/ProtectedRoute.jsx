
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

function ProtectedRoute({ children, role }) {

    const { isAuth, user } = useContext(AuthContext);

    if (!isAuth) {
        return <Navigate to="/signin" />;
    }

    if (role && user?.role !== role) {
        return <Navigate to="/" />;
    }

    return children;
}

export default ProtectedRoute;