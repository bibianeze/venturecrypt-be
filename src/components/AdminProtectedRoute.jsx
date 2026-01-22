import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import * as adminApi from '../services/adminApi';

function AdminProtectedRoute({ children }) {
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const adminToken = localStorage.getItem('adminToken');

  useEffect(() => {
    const validateToken = async () => {
      if (!adminToken) {
        setIsValidating(false);
        setIsAuthenticated(false);
        return;
      }

      try {
        // Validate token by fetching admin profile
        await adminApi.getAdminProfile();
        setIsAuthenticated(true);
        console.log('✅ Admin token validated');
      } catch (error) {
        console.error('❌ Token validation failed:', error);
        // Clear invalid token
        adminApi.logout();
        setIsAuthenticated(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [adminToken]);

  // Show loading state while validating
  if (isValidating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B0F1A] via-[#0F2A44] to-[#0B0F1A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Validating credentials...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Render protected content
  return children;
}

export default AdminProtectedRoute;