import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { handleGoogleLogin } from '../actions/api';

const GoogleSignIn = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Initialize Google Identity Services
        window.google.accounts.id.initialize({
            client_id: '405815041614-2qhui5cs0d8s8qi54f9jt75tnjl52hg7.apps.googleusercontent.com',  // Replace with your Google Client ID
            callback: handleGoogleLoginSuccess,  // Success handler
        });

        // Render the Google Sign-In button
        window.google.accounts.id.renderButton(
            document.getElementById('google-signin-btn'),
            { theme: 'outline', size: 'large' }  // Customize the button
        );
    }, []);

    const handleGoogleLoginSuccess = async (response) => {
        try {
            const tokenId = response.credential; // Extract tokenId from the response

            if (!tokenId) {
                throw new Error('Token ID is missing');
            }

            // Send the token ID to the backend
            // const res = await axios.post('http://localhost:5000/api/auth/registerOrLogin', { tokenId });
            const res = await handleGoogleLogin(tokenId);

            // Store the token in localStorage
            localStorage.setItem('token', res.token);

            // Redirect to profile or home page
            navigate('/profile');
        } catch (error) {
            console.error('Error during Google login:', error.message);
        }
    };

    return <div id="google-signin-btn"></div>;
};

export default GoogleSignIn;
