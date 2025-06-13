import axios from 'axios';

// Get the API URL from environment variables, with a fallback for local development
const API_URL = 'http://localhost:5000/api';

// Create an instance of axios for making API requests
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * A service object for handling API requests related to applications.
 */
const applicationService = {
    /**
     * Fetches all applications from the backend.
     * @returns {Promise<Object>} A promise that resolves to the API response.
     */
    getApplications: () => {
        // This assumes an endpoint like /api/applications exists on your server
        return api.get('/applications');
    },

    /**
     * Approves an application by its ID.
     * @param {string} id - The ID of the application to approve.
     * @returns {Promise<Object>} A promise that resolves to the API response.
     */
    approveApplication: (id) => {
        return api.patch(`/applications/${id}/approve`);
    },

    /**
     * Rejects an application by its ID.
     * @param {string} id - The ID of the application to reject.
     * @returns {Promise<Object>} A promise that resolves to the API response.
     */
    rejectApplication: (id) => {
        return api.patch(`/applications/${id}/reject`);
    }
};

export default applicationService;
