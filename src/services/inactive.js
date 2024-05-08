import { useEffect } from 'react';
import { eraseCookie, getTokenAndRole } from './Cookie';
import { logout } from '../connexion/UserAPI';

export const useIdleTimer = (timeout = 1200000) => {

    useEffect(() => {
        let timer;
        const resetTimer = () => {
            clearTimeout(timer);
            timer = setTimeout(async () => {
                const { token } = await getTokenAndRole() || {};
                if (token) {
                    await logout(token);
                }
                eraseCookie();
            }, timeout);
        };

        // Ajouter les écouteurs d'événements pour réinitialiser le timer
        document.addEventListener('mousemove', resetTimer);
        document.addEventListener('keypress', resetTimer);
        document.addEventListener('scroll', resetTimer);
        document.addEventListener('click', resetTimer);

        resetTimer(); // Initialiser le timer lors du chargement du composant

        return () => {
            clearTimeout(timer);
            document.removeEventListener('mousemove', resetTimer);
            document.removeEventListener('keypress', resetTimer);
            document.removeEventListener('scroll', resetTimer);
            document.removeEventListener('click', resetTimer);
        };
    }, [timeout]);

    return null; // Ce hook ne retourne rien
};
