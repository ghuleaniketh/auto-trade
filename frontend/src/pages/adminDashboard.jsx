import { useAuth } from "../provider/authProvider";
import { useState, useEffect } from "react";
import AdminCarCard from "../components/admincard";
import  api from '../auth/api';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleLogout = () => {
        logout();
    };

    useEffect(()=>{
        const fetchCars = async () => {
        try {
            const response = await api.get('/admin/cars');
        console.log('Response data:', response.data);
        console.log('Type of data:', typeof response.data);
        console.log('Is array?', Array.isArray(response.data));
            setCars(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching cars:', error);
            setLoading(false);
        }
        };

        fetchCars();
    }, []);

    return (
        <div className="dashboard">
        <header className="bg-white shadow-md px-6 py-3 flex items-center justify-between">
            <div className="flex items-center">
            <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTL9ENz-dOnr5hifne_S-_VzaMQPKONQiF4rA&s" 
                alt="Cars12 Logo" 
                className="h-10 w-auto object-contain"
            />
            </div>

            <div className="flex items-center space-x-4">
            <a className="text-gray-700 text-sm hidden sm:block">
                Welcome, {user?.username || user?.email}!
            </a>
            <a href="./dashboard" className="text-gray-700 text-sm hidden sm:block">
                User Dashboard
            </a>
            <a href="./admin" className="text-gray-700 text-sm hidden sm:block">
                Add New
            </a>
            
            <a href="#" className="text-gray-700 text-sm hidden sm:block">
                Profile
            </a>

            
            <select 
                onChange={(e) => {
                if (e.target.value === "logout") handleLogout();
                }}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            >
                <option value="profile">Profile</option>
                <option value="settings">Settings</option>
                <option value="logout">Logout</option>
                {user?.role === "admin" && (
                <>
                    <option value="user-management">User Management</option>
                </>
                )}
                <option value="help">Help</option>
            </select>
            </div>
        </header>
        
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto max-w-8xl">
            <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Available Cars</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 auto-rows-fr">
                {cars.map((car) => (
                <AdminCarCard
                    key={car.id}
                    id={car.id}
                    carImage={car.carImage}
                    carName={car.carName}
                    year={car.year}
                    price={car.price}
                    distanceTraveled={car.distanceTraveled}
                    fuelType={car.fuelType}
                    transmission={car.transmission}
                    owners={car.owners}
                    location={car.location}
                    status={car.status}
                />
                ))}
            </div>
            
            {cars.length === 0 && !loading && (
                <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No cars available at the moment.</p>
                </div>
            )}
            </div>
        </div>
        </div>
    );
    }
