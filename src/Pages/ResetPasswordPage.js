import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Input, VStack, Heading, Text, Container, useToast } from '@chakra-ui/react';
import { resetPassword } from '../actions/api';

const ResetPasswordPage = () => {
    const { token } = useParams(); // Grabs the 'f2506e81...' from the URL
    const navigate = useNavigate();
    const toast = useToast();
    const brandColor = "#A22B21";

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleReset = async () => {
        if (password !== confirmPassword) {
            return toast({ title: "Passwords do not match", status: "error" });
        }

        setLoading(true);
        try {
            await resetPassword(token, { password, confirmPassword });
            toast({ 
                title: "Success", 
                description: "Password updated! You can now login.", 
                status: "success" 
            });
            navigate('/'); // Redirect to home/login drawer
        } catch (error) {
            toast({ 
                title: "Error", 
                description: error.response?.data?.message || "Invalid or expired link", 
                status: "error" 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxW="container.sm" py={20}>
            <Box p={8} boxShadow="xl" bg="white" borderRadius="none" border="1px solid" borderColor="gray.100">
                <VStack spacing={6} align="stretch">
                    <Heading size="lg" fontFamily="'PT Sans', sans-serif">Reset Your Password</Heading>
                    <Text fontSize="sm" color="gray.600">Please enter a new, secure password for your account.</Text>
                    
                    <Input 
                        placeholder="New Password" 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        borderRadius="none" 
                        h="50px"
                    />
                    <Input 
                        placeholder="Confirm New Password" 
                        type="password" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        borderRadius="none" 
                        h="50px"
                    />
                    
                    <Button 
                        bg={brandColor} 
                        color="white" 
                        h="55px" 
                        borderRadius="none" 
                        isLoading={loading}
                        onClick={handleReset}
                        _hover={{ opacity: 0.9 }}
                    >
                        Update Password
                    </Button>
                </VStack>
            </Box>
        </Container>
    );
};

export default ResetPasswordPage;