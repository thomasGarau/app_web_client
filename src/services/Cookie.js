export const createCookie = (username, token, days) => { 
    try{
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "; expires=" + date.toUTCString();
        document.cookie = username + "=" + token + expires + "; path=/";
    } catch (error) {
        console.error('Erreur lors de la création du cookie :', error);
    }
};

export const getToken = (name) => { 
    try{
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i=0;i < ca.length;i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {c = c.substring(1,c.length);}
            if (c.indexOf(nameEQ) === 0) {return c.substring(nameEQ.length,c.length);}
        }
        return null;
    } catch (error) {
        console.error('Erreur lors de la lecture du cookie :', error);
    }
};

export const eraseCookie = (name) => { };