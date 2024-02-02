import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { verifyToken } from '../connexion/UserAPI.js';
import { getTokenAndRole } from './Cookie.js';

const PrivateRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const {token, role} = await getTokenAndRole();
                const {valide, informations} = await verifyToken(token);
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

    return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;