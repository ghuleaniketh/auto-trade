import React from 'react';
import { Link } from 'react-router-dom';

const AdminCarCard = ({ 
  id, // Use id instead of key
  carImage, 
  carName, 
  year, 
  price, 
  distanceTraveled, 
  fuelType, 
  transmission, 
  owners, 
  location, 
  status,
  onViewDetails,
  onContact 
}) => {
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return 'bg-green-500';
      case 'sold':
        return 'bg-red-500';
      case 'reserved':
      case 'on-hold':
        return 'bg-yellow-500';
      case 'featured':
        return 'bg-purple-500';
      case 'new-arrival':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };
  console.log("CarCard rendered with id:", id);
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 mb-8">
      <div className="flex flex-col md:flex-row h-auto md:h-90">
        
        {/* Car Image Section */}
        <div className="relative w-full h-56 md:w-80 md:h-full bg-gray-200 order-1 md:order-none">
          <img 
            src={carImage || "/api/placeholder/400/300"} 
            alt={carName}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "/api/placeholder/400/300";
            }}
          />
          {status && (
            <div className={`absolute top-3 right-3 ${getStatusBadge(status)} text-white px-3 py-1 rounded-full text-sm font-medium capitalize shadow-lg`}>
              {status.replace('-', ' ')}
            </div>
          )}
        </div>

        {/* Car Details Section */}
        <div className="flex-1 p-8 flex flex-col justify-between order-2 md:order-none">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {carName} {year}
            </h3>
            
            <div className="text-3xl font-bold text-blue-600 mb-4">
              ₹{price?.toLocaleString('en-IN')}
            </div>
            
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Distance:</span>
                <span className="font-medium">{distanceTraveled?.toLocaleString()} KM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fuel:</span>
                <span className="font-medium">{fuelType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transmission:</span>
                <span className="font-medium">{transmission}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Owners:</span>
                <span className="font-medium">{owners}</span>
              </div>
            </div>
            
            <div className="flex items-center text-gray-600 text-sm mb-4">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
              </svg>
              <span>{location}</span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-3 mt-4">
            <Link 
              to={`/admin/${id}`}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
            >
              Edit
            </Link>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCarCard;
