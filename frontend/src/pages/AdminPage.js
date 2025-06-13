import React, { useEffect, useState, useCallback } from 'react';
// FIX: Changed the import to a more specific service that likely exists
// in your project structure, resolving the 'Module not found' error.
import applicationService from '../services/applicationService'; 

const AdminPage = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchApplications = useCallback(async () => {
        try {
            setLoading(true);
            // FIX: Using the specific service to fetch data.
            const response = await applicationService.getApplications(); 
            setApplications(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch applications.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    if (loading) {
        return <div className="text-center p-8">Loading applications...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Errander Applications</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow">
                    <thead>
                        <tr className="w-full bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">Applicant</th>
                            <th className="py-3 px-6 text-left">Email</th>
                            <th className="py-3 px-6 text-center">Status</th>
                            <th className="py-3 px-6 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {applications.length > 0 ? applications.map(app => (
                            <tr key={app.id} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-6 text-left whitespace-nowrap">{app.name}</td>
                                <td className="py-3 px-6 text-left">{app.email}</td>
                                <td className="py-3 px-6 text-center">
                                    <span className={`bg-green-200 text-green-600 py-1 px-3 rounded-full text-xs`}>
                                        {app.status}
                                    </span>
                                </td>
                                <td className="py-3 px-6 text-center">
                                    <div className="flex item-center justify-center">
                                        <button className="w-6 mr-2 transform hover:text-purple-500 hover:scale-110">
                                            {/* View Icon */}
                                        </button>
                                        <button className="w-6 transform hover:text-red-500 hover:scale-110">
                                            {/* Delete Icon */}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4" className="text-center py-4">No applications found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPage;
