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
        console.log("ue et prof : ",response.data);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}