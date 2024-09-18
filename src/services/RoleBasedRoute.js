import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { verifyToken } from '../API/UserAPI.js';
import { getTokenAndRole } from './Cookie.js';
import { getUserInfo } from '../API/ProfileAPI';

/**
 * RoleBasedRoute checks both authentication and specific role permissions.
 * @param {ReactNode} children - The component to render if the access check passes.
 * @param {Array} allowedRoles - An array of roles that are allowed to access this route.
 */
const RoleBasedRoute = ({ children, allowedRoles }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { token, role } = await getTokenAndRole();  
                const responseInfo = await getUserInfo();
                setUserRole(responseInfo.role);
                const { valide } = await verifyToken(token);  // Assume verifyToken checks the token's validity
                
                setIsAuthenticated(valide);
            } catch (error) {
                console.error('Erreur lors de la vérification du token :', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (isLoading) {
        return <div>Chargement...</div>;
    }

    // Check if user is authenticated and if their role is in the allowed roles for this route
    if (isAuthenticated && allowedRoles.includes(userRole)) {
        return children;
    } else if (isAuthenticated && userRole === 'administration') {
        return <Navigate to="/admin-interface" replace />;  
    } else if (isAuthenticated) {
        return <Navigate to="/home" replace />;
    } else {
        return <Navigate to="/connexion" replace />;
    }
};

export default RoleBasedRoute;
