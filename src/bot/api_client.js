import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL; // Assuming your API server runs on port 3001

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const callApi = async (method, path, data = null) => {
    try {
        let response;
        switch (method.toLowerCase()) {
            case 'get':
                response = await apiClient.get(path, { params: data });
                break;
            case 'post':
                response = await apiClient.post(path, data);
                break;
            case 'put':
                response = await apiClient.put(path, data);
                break;
            case 'delete':
                response = await apiClient.delete(path, { data }); // For DELETE with body
                break;
            default:
                throw new Error(`Unsupported HTTP method: ${method}`);
        }
        return { success: true, data: response.data };
    } catch (error) {
        console.error(`API call error for ${method} ${path}:`, error.response ? error.response.data : error.message);
        return { success: false, error: error.response ? error.response.data : { message: error.message } };
    }
};

