import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ Children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/" />
    }
    return Children
}

export default ProtectedRoutes;