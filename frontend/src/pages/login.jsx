import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../provider/authProvider";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { getlogin } = useAuth();
  const navigate = useNavigate();



  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus("");

    try {
      const result = await getlogin(formData);
      if (result.success) {
        setStatus("Login successful!");
        navigate("/dashboard");
      } else {
        setStatus(result.error);
      }
    } catch (err) {
      console.error("Login error:", err);
      setStatus("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
                <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Welcome Back</h1>
                <p className="text-gray-600 text-center mb-8">Sign in to your account</p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            placeholder="Enter your email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            placeholder="Enter your password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                {status && (
                    <div className={`mt-4 p-3 rounded-md text-sm ${status.includes('successful') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                        {status}
                    </div>
                )}

                <p className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account? <a href="/register" className="text-blue-600 hover:text-blue-500 font-medium">Create Account</a>
                </p>
            </div>
        </div>
    );
}
