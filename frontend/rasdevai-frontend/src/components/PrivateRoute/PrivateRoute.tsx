import React, { JSX } from "react";
import { Navigate } from "react-router-dom";
import { isTokenValid } from "../../utils/auth";

interface PrivateRouteProps {
    children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const token = localStorage.getItem("accessToken");

    if (!token || !isTokenValid(token)) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        return <Navigate to="/signin" replace />;
    }

    return children;
};

export default PrivateRoute;
