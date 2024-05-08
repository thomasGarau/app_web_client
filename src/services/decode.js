import { jwtDecode } from 'jwt-decode';

export const decodeJWT = (jwtToken) => {
    try {
        const decodedToken = jwtDecode(jwtToken);
        return {
            token: jwtToken,
            role: decodedToken.role,
            id_etudiant : decodedToken.id_etudiant,
            num_etudiant: decodedToken.num_etudiant,
            consentement: decodedToken.consentement,
            exp: decodedToken.exp,
        };
    } catch (error) {
        console.error('Erreur lors du décodage du JWT :', error);
        return null; // ou vous pourriez gérer l'erreur différemment selon votre cas
    }
};

