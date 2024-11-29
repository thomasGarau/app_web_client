import api from '../config/axiosConfig';

export const createCM = async (data, path) => {
    try {
        const formData = new FormData();
        formData.append('data', data);
        formData.append('path', path);

        const response = await api.post(`/carte-mentale/create-cm`, formData, {
            headers: {
                'Content-Type':'multipart/form-data'
            }
        });

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateCM = async (data, path) => {
    try {
        const formData = new FormData();
        formData.append('data', data);
        formData.append('path', path);

        const response = await api.put(`/carte-mentale/update-cm`, formData, {
            headers: {
                'Content-Type':'multipart/form-data'
            }
        });

        return response.data;
    } catch (error) {
        throw error;
    }
}



export const getCMUser = async (id_chap) => {
    try {
        const body = {
            chapitre: id_chap
        };
        const response = await api.post(`/carte-mentale/user-cm`, body);
        return response.data;
    }
    catch (error) {
        throw error;
    }
};


export const getCMInfo = async (id_CM) => {
    try {
        const body = {
            cm : id_CM
        };
        const response = await api.post(`/carte-mentale/cm-info`, body);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const getCmDetails = async (id_CM) => {
    try {
        const body = {
            cm : id_CM
        };
        const response = await api.post(`/carte-mentale/cm-details`, body);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}


export const getAllCM = async (id_chap) => {
    try {
        const body = {
            chapitre: id_chap
        };
        const response = await api.post(`/carte-mentale/all-cm-chapter`, body);
        return response.data;
    }
    catch (error) {
        throw error;
    }
};


export const addCmToCollection = async (id_cm) => {
    try {
        const body = {
            cm: id_cm
        };
        const response = await api.post(`/carte-mentale/add-cm-to-collection`, body);
        return response.data;
    }
    catch (error) {
        throw error;
    }
};

export const deleteCmFromCollection = async (id_cm) => {
    try {
        const response = await api.delete(`/carte-mentale/remove-cm-from-collection`,  {
            data: {
                cm : id_cm
            }
        });
        return response.data;
    }
    catch (error) {
        throw error;
    }
}


export const deleteCM = async (id_cm) => {
    try {
        const response = await api.delete(`/carte-mentale/delete-cm`, {
            data: {
                cm : id_cm
            }
    });
        return response.data;

    }
    catch (error) {
        throw error;
    }
};