import { Navigate } from "react-router-dom";
import { useAuth } from "../provider/authProvider";

export default function ProtectedRoute({ children ,requireAdmin = false }) {
    const { token, loading, user } = useAuth();

    if (loading) {
        return (
        <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading...</p>
        </div>
        );
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }
    if(requireAdmin && user?.role !== "admin"){
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}
