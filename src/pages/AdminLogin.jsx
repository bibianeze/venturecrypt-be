import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, Shield, AlertCircle } from 'lucide-react';
import * as adminApi from '../services/adminApi';

function AdminLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);

  // Test API connection on component mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        await adminApi.testConnection();
        setConnectionStatus('connected');
        console.log('✅ API connection successful');
      } catch (err) {
        setConnectionStatus('disconnected');
        console.error('❌ API connection failed:', err);
      }
    };

    testConnection();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      setIsLoading(false);
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    console.log('🔐 Attempting login with:', formData.email);

    try {
      // Call real backend API
      const data = await adminApi.adminLogin(formData.email, formData.password);
      
      console.log('✅ Login successful:', data);

      // Store admin token and info
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminInfo', JSON.stringify(data.admin));
      localStorage.setItem('adminEmail', data.admin.email);
      localStorage.setItem('adminName', data.admin.name);
      localStorage.setItem('isAdmin', 'true');
      
      console.log('✅ Admin credentials stored in localStorage');
      
      // Navigate to admin dashboard
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('❌ Login error:', err);
      
      // Provide user-friendly error messages
      let errorMessage = err.message || 'Login failed. Please try again.';
      
      // Handle specific error cases
      if (errorMessage.includes('Invalid credentials')) {
        errorMessage = 'Invalid email or password. Please check your credentials.';
      } else if (errorMessage.includes('suspended')) {
        errorMessage = 'Your admin account has been suspended. Please contact support.';
      } else if (errorMessage.includes('Unable to connect')) {
        errorMessage = 'Unable to connect to server. Please check your internet connection.';
      }
      
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F1A] via-[#0F2A44] to-[#0B0F1A] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-gray-400">Sign in to manage your platform</p>
          
          {/* Connection Status Indicator */}
          {connectionStatus && (
            <div className="mt-3 inline-flex items-center gap-2 text-xs">
              <div className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className={connectionStatus === 'connected' ? 'text-green-400' : 'text-red-400'}>
                {connectionStatus === 'connected' ? 'API Connected' : 'API Connection Failed'}
              </span>
            </div>
          )}
        </div>

        {/* Login Form */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition"
                  placeholder="admin@venturecrypt.com"
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-11 pr-12 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition"
                  placeholder="Enter your password"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                  disabled={isLoading}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || connectionStatus === 'disconnected'}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In as Admin'
              )}
            </button>

            {connectionStatus === 'disconnected' && (
              <p className="text-xs text-red-400 text-center mt-2">
                Cannot connect to server. Please check your connection and try again.
              </p>
            )}
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs text-gray-400 text-center">
              🔒 Secure admin access. All actions are logged and monitored.
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white transition text-sm"
          >
            ← Back to Home
          </button>
        </div>

        {/* Debug Info (only in development) */}
        {import.meta.env.DEV && (
          <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
            <p className="text-xs text-gray-400 mb-2">🔧 Debug Info:</p>
            <pre className="text-xs text-gray-500 overflow-x-auto">
              {JSON.stringify({
                apiUrl: import.meta.env.VITE_API_URL || 'https://venturecrypt-be-backend.onrender.com/api',
                connectionStatus,
                hasError: !!error
              }, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminLogin;