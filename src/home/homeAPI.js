import api from '../config/axiosConfig';

export const getUe = async () => {
    try {
        // const response = await api.get('/ue/ue-user');
        const response = [
            {
                "id_ue": 1,
                "label": "Votre_valeur_pour_ue",
                "path": "",
                "enseignant": [
                    {
                        "nom": "kilimou",
                        "prenom": "ambroise"
                    }
                ]
            },
            {
                "id_ue": 7,
                "label": "Math",
                "path": "",
                "enseignant": [
                    {
                        "nom": "kilimou",
                        "prenom": "ambroise"
                    }
                ]
            },
            {
                "id_ue": 8,
                "label": "physique",
                "path": "",
                "enseignant": [
                    {
                        "nom": "garau",
                        "prenom": "thomas"
                    }
                ]
            }
        ]
        console.log("ue et prof : ", response);
        return response;
    }
    catch (error) {
        throw error;
    }
}

export const getJMethod = async () => {
    try {
        // const response = await api.get('/ue/ue-user');
        const response = [
            {
                label: "nom de la matière",
                date: "2024-04-30",
                duree: 80
            },
            {
                label: "nom de la matièrehihi",
                date: "2024-05-01",
                duree: 60
            }

        ]
        console.log("ue et prof : ", response);
        return response;
    }
    catch (error) {
        throw error;
    }
}