import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../provider/authProvider.jsx';
import api from '../auth/api';

function EditCar() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editedCar, setEditedCar] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchCarDetails = async () => {
            try {
                const response = await api.get(`/dashboard/${id}`);
                if (response) {
                    const carData = response.data.data;
                    setCar(carData);
                    setEditedCar({ ...carData });
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

    const handleInputChange = (field, value) => {
        setEditedCar(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleFeatureChange = (features) => {
        setEditedCar(prev => ({
            ...prev,
            features: JSON.stringify(features)
        }));
    };

    const addFeature = () => {
        const currentFeatures = parseFeatures(editedCar.features);
        const newFeatures = [...currentFeatures, ''];
        handleFeatureChange(newFeatures);
    };

    const removeFeature = (index) => {
        const currentFeatures = parseFeatures(editedCar.features);
        const newFeatures = currentFeatures.filter((_, i) => i !== index);
        handleFeatureChange(newFeatures);
    };

    const updateFeature = (index, value) => {
        const currentFeatures = parseFeatures(editedCar.features);
        currentFeatures[index] = value;
        handleFeatureChange(currentFeatures);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const response = await api.put(`/admin/cars/${id}`, editedCar);
            
            if (response.status === 200) {
                setCar(editedCar);
                alert('Car details updated successfully!');
            }
        } catch (err) {
            console.error('Error updating car:', err);
            alert('Failed to update car details');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setEditedCar({ ...car });
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

    if (error || !car) {
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

    const features = parseFeatures(editedCar.features);

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto max-w-6xl px-4">
                
                <div className="flex items-center justify-between mb-6">
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Cars
                    </button>

                    <div className="flex space-x-2">
                        <button 
                            onClick={handleCancel}
                            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                    
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                        <h1 className="text-3xl font-bold mb-2">Edit Car Details</h1>
                        <div className="flex space-x-4">
                            <input 
                                type="text"
                                value={editedCar.carName || ''}
                                onChange={(e) => handleInputChange('carName', e.target.value)}
                                className="bg-white/20 text-white placeholder-white/70 border border-white/30 rounded px-3 py-1 text-xl"
                                placeholder="Car Name"
                            />
                            <input 
                                type="number"
                                value={editedCar.year || ''}
                                onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                                className="bg-white/20 text-white placeholder-white/70 border border-white/30 rounded px-3 py-1 text-xl w-24"
                                placeholder="Year"
                            />
                        </div>
                    </div>

                    <div className="md:flex">
                        
                        <div className="md:w-1/2">
                            <div className="p-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Car Image URL:
                                </label>
                                <input 
                                    type="url"
                                    value={editedCar.carImage || ''}
                                    onChange={(e) => handleInputChange('carImage', e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
                                    placeholder="https://example.com/car-image.jpg"
                                />
                                <img 
                                    src={editedCar.carImage} 
                                    alt={editedCar.carName}
                                    className="w-full h-64 object-cover rounded"
                                    onError={(e) => {
                                        e.target.src = "/api/placeholder/400/300";
                                    }}
                                />
                            </div>
                        </div>
                        
                        <div className="md:w-1/2 p-8">
                            
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price (₹):
                                </label>
                                <input 
                                    type="number"
                                    value={editedCar.price || ''}
                                    onChange={(e) => handleInputChange('price', parseInt(e.target.value))}
                                    className="text-4xl font-bold text-blue-600 border border-gray-300 rounded-md px-3 py-2 w-full"
                                />
                            </div>

                            
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description:
                                </label>
                                <textarea 
                                    value={editedCar.description || ''}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    rows="3"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                />
                            </div>

                            
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                {[
                                    { label: 'Distance Traveled', field: 'distanceTraveled' },
                                    { label: 'Fuel Type', field: 'fuelType' },
                                    { label: 'Transmission', field: 'transmission' },
                                    { label: 'Owners', field: 'owners' },
                                    { label: 'Engine', field: 'engineCapacity' },
                                    { label: 'Mileage', field: 'mileage' }
                                ].map(({ label, field }) => (
                                    <div key={field} className="bg-gray-50 p-4 rounded-lg">
                                        <span className="text-sm text-gray-500">{label}</span>
                                        <input 
                                            type={field === 'distanceTraveled' ? 'number' : 'text'}
                                            value={editedCar[field] || ''}
                                            onChange={(e) => handleInputChange(field, field === 'distanceTraveled' ? parseInt(e.target.value) : e.target.value)}
                                            className="w-full border border-gray-300 rounded px-2 py-1 text-lg font-semibold mt-1"
                                        />
                                    </div>
                                ))}
                            </div>

                            
                            <div className="flex items-center text-gray-600 mb-6">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                <input 
                                    type="text"
                                    value={editedCar.location || ''}
                                    onChange={(e) => handleInputChange('location', e.target.value)}
                                    className="border border-gray-300 rounded px-2 py-1 text-lg flex-1"
                                    placeholder="Location"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-t p-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">Features</h3>
                                <div className="space-y-2">
                                    {features.map((feature, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <input 
                                                type="text"
                                                value={feature}
                                                onChange={(e) => updateFeature(index, e.target.value)}
                                                className="flex-1 border border-gray-300 rounded px-2 py-1"
                                                placeholder="Feature name"
                                            />
                                            <button 
                                                onClick={() => removeFeature(index)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                    <button 
                                        onClick={addFeature}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        + Add Feature
                                    </button>
                                </div>
                            </div>

                            
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">Additional Information</h3>
                                <div className="space-y-2 text-sm">
                                    {[
                                        { label: 'Color', field: 'color' },
                                        { label: 'Registration', field: 'registrationNumber' },
                                        { label: 'Insurance', field: 'insurance' },
                                        { label: 'Last Service', field: 'lastService' }
                                    ].map(({ label, field }) => (
                                        <div key={field} className="flex justify-between">
                                            <span className="text-gray-600">{label}:</span>
                                            <input 
                                                type="text"
                                                value={editedCar[field] || ''}
                                                onChange={(e) => handleInputChange(field, e.target.value)}
                                                className="border border-gray-300 rounded px-2 py-1 text-xs flex-1 ml-2"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditCar;
