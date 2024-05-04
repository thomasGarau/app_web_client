import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { verifyToken } from '../connexion/UserAPI.js';
import { getTokenAndRole } from './Cookie.js';

const PublicRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { token } = await getTokenAndRole();
                const { valide } = await verifyToken(token);
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

    return isAuthenticated ? <Navigate to="/home" replace /> : children;
};

export default PublicRoute;
