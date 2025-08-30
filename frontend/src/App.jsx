import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/login.jsx";
import Landing from "./pages/landing.jsx";
import Registration from "./pages/registration.jsx";
import Dashboard from "./pages/dashboard.jsx";
import AdminDashboard from "./pages/adminDashboard.jsx";
import CarDashboard from "./pages/viewCar.jsx";  
import AdminCarCard from "./pages/editCar.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useAuth } from "./provider/authProvider.jsx";
import "./App.css";

function App() {
    const { token, loading,user } = useAuth();

    if (loading) {
        return (
        <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading...</p>
        </div>
        );
    }

    return (
        <Routes>
                            {/* ye genaral public ke liye */}
        <Route 
            path="/" 
            element={token ? <Navigate to="/dashboard" replace /> : <Landing />} 
        />
        <Route 
            path="/login" 
            element={token ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
        />
        <Route 
            path="/register" 
            element={token ? <Navigate to="/dashboard" replace /> : <Registration />} 
        />
        


                            {/* ye hamare bando ke liya */}
        <Route
            path="/dashboard"
            element={
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
            }
        />
        <Route
            path="/dashboard/:id"
            element={
            <ProtectedRoute>
                <CarDashboard />
            </ProtectedRoute>
            }
        />
        <Route
            path="/admin/:id"
            element={
            <ProtectedRoute>
                <AdminCarCard />
            </ProtectedRoute>
            }
        />



        
                            {/* /ye srif admin walo ke liya  */}
        <Route 
            path="/admin" 
            element={
            <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
            </ProtectedRoute>
            } 
        />
        


        
                            {/* ye jo kesi kaam ke nahi hai, mane berojgar :) */}
        <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
