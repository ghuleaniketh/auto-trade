import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../auth/api';

function CarDashboard() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [cars, setCars] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCarDetails = async () => {
        try {
            const response = await api.get(`/dashboard/${id}`);
            if (response) {
            console.log("full response:", response);
            const carKaData = response.data.data;
            console.log("the given to temp");
            console.log(carKaData);
            setCars(carKaData);
            } else {
            setError("Car not found");
            }
        } catch (err) {
            console.error('Error fetching car details:', err);
            setError("Failed to load car details");
        } finally {
            setLoading(false);
        }
        };

        fetchCarDetails();
    }, [id]);

    useEffect(() => {
        if (cars) {
        console.log("Car state updated:", cars);
        } else {
        console.log("No car data available");
        }
    }, [cars]);

    const parseFeatures = (features) => {
        if (!features) return [];
        if (Array.isArray(features)) return features;
        
        try {
        const parsed = JSON.parse(features);
        return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
        console.error('Error parsing features:', error);
        return [];
        }
    };

    const handleContact = () => {
        alert(`Contacting seller for ${cars.carName}`);
    };

    const formatPrice = (price) => {
        return price?.toLocaleString('en-IN') || '0';
    };

    const formatDistance = (distance) => {
        return distance?.toLocaleString() || '0';
    };

    if (loading) {
        return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading car details...</p>
            </div>
        </div>
        );
    }

    if (error || !cars) {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="text-center">
            <h1 className="text-3xl font-bold text-red-600 mb-4">
                {error || "Car Not Found"}
            </h1>
            <p className="text-gray-600 mb-6">
                The car you're looking for doesn't exist or has been removed.
            </p>
            <button 
                onClick={() => navigate('/dashboard')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
                Back to Dashboard
            </button>
            </div>
        </div>
        );
    }

    const features = parseFeatures(cars.features);

    return (
        <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto max-w-6xl px-4">
            
            <button 
            onClick={() => navigate('/dashboard')}
            className="mb-6 flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Cars
            </button>

            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                <h1 className="text-3xl font-bold mb-2">Car Dashboard</h1>
                <h2 className="text-xl">{cars.carName} {cars.year}</h2>
            </div>

            <div className="md:flex">
                
                <div className="md:w-1/2">
                <img 
                    src={cars.carImage} 
                    alt={cars.carName}
                    className="w-full h-96 md:h-full object-cover"
                    onError={(e) => {
                    e.target.src = "/api/placeholder/400/300";
                    }}
                />
                </div>
                
                <div className="md:w-1/2 p-8">
                <div className="text-4xl font-bold text-blue-600 mb-6">
                    ₹{formatPrice(cars.price)}
                </div>

                <p className="text-gray-600 mb-6">{cars.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                    <span className="text-sm text-gray-500">Distance Traveled</span>
                    <div className="text-lg font-semibold">{formatDistance(cars.distanceTraveled)} KM</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                    <span className="text-sm text-gray-500">Fuel Type</span>
                    <div className="text-lg font-semibold">{cars.fuelType}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                    <span className="text-sm text-gray-500">Transmission</span>
                    <div className="text-lg font-semibold">{cars.transmission}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                    <span className="text-sm text-gray-500">Owners</span>
                    <div className="text-lg font-semibold">{cars.owners}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                    <span className="text-sm text-gray-500">Engine</span>
                    <div className="text-lg font-semibold">{cars.engineCapacity}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                    <span className="text-sm text-gray-500">Mileage</span>
                    <div className="text-lg font-semibold">{cars.mileage}</div>
                    </div>
                </div>

                <div className="flex items-center text-gray-600 mb-6">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-lg">{cars.location}</span>
                </div>

                <button 
                    onClick={handleContact}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                    Contact Seller
                </button>
                </div>
            </div>

            <div className="border-t p-8">
                <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Features</h3>
                    <div className="flex flex-wrap gap-2">
                    {features.map((feature, index) => (
                        <span 
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                        >
                        {feature}
                        </span>
                    ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Additional Information</h3>
                    <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Color:</span>
                        <span className="font-medium">{cars.color}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Registration:</span>
                        <span className="font-medium">{cars.registrationNumber}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Insurance:</span>
                        <span className="font-medium">{cars.insurance}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Last Service:</span>
                        <span className="font-medium">{cars.lastService}</span>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    );
    }

export default CarDashboard;
