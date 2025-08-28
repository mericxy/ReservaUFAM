import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const BackButton = () => {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    
    const handleBack = () => {
        navigate(isAdmin ? '/admin/page' : '/home');
    };

    return (
        <button
            onClick={handleBack}
            className="absolute left-5 top-20 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 shadow-md flex items-center gap-2"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5"/>
            </svg>
        </button>
    );
};

export default BackButton; 