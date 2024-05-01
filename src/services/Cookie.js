export const createCookie = (token, days, role) => { 
    try {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "; expires=" + date.toUTCString();
        const cookieValue = `${token}|${role}`;
        document.cookie = "authData=" + cookieValue + expires + "; path=/";
    } catch (error) {
        console.error('Erreur lors de la création du cookie :', error);
    }
};

export const getTokenAndRole = async () => { 
    try {
        const authDataValue = getCookieValue("authData");
        if (authDataValue) {
            const parts = authDataValue.split('|');
            if (parts.length === 2) {
                const [token, role] = parts;
                return { token, role };
            }
        }
        return null;
    } catch (error) {
        console.error('Erreur lors de la lecture du cookie :', error);
        return null;
    }
};

const getCookieValue = (name) => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
    return null;
};

export const eraseCookie = () => {
    try {
        //on redéfinit le cookie avec une date d'expiration dépassée pour que le navigateur le supprime
        const expires = "; expires=Thu, 01 Jan 1970 00:00:00 UTC";
        document.cookie = "authData=" + expires + "; path=/";
    } catch (error) {
        console.error('Erreur lors de la suppression du cookie :', error);
    }
};