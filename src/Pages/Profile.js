import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, Input, Button, Container, Stack, useToast, VStack, Divider, Flex } from '@chakra-ui/react';
import "@fontsource/pt-sans";
import { useNavigate } from 'react-router-dom';
import { getSingleUser, logout } from '../actions/api';

const Profile = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [dob, setDob] = useState('');
    const toast = useToast();
    const navigate = useNavigate();

    const fetchUser = async () => {
        const response = await getSingleUser();
        console.log('User response:', response);
        if (response.success === true) {
            setName(response.data.name);
            setEmail(response.data.email);
            setMobile(response.data.mobile);
            setDob(response.data.dob);
        } else {
            // Handle unsuccessful login (show error message, etc.)
            console.error('Login failed:', response.data.message);
        }
    }

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleLogout = async () => {
        const response = await logout();
        toast({
            title: 'Logout Successful',
            description: 'You have successfully logged out.',
            status: 'success',
            duration: 5000,
            isClosable: true,
        });
        localStorage.removeItem('email');
        navigate('/login');
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        // <Container centerContent mt={20}>
        <Box maxW="600px" mx="auto" mt={10} p={6} boxShadow="lg" borderRadius="md">
            <Heading size="lg" mb={6} textAlign="center">
                Profile Information
            </Heading>
            <VStack spacing={4} align="start">
                <Flex justify="space-between" width="100%">
                    <Text fontWeight="bold">Name:</Text>
                    <Text>{name}</Text>
                </Flex>
                <Divider />

                <Flex justify="space-between" width="100%">
                    <Text fontWeight="bold">Email:</Text>
                    <Text>{email}</Text>
                </Flex>
                <Divider />

                <Flex justify="space-between" width="100%">
                    <Text fontWeight="bold">Mobile:</Text>
                    <Text>{mobile}</Text>
                </Flex>
                <Divider />

                <Flex justify="space-between" width="100%">
                    <Text fontWeight="bold">Date of Birth:</Text>
                    <Text>{formatDate(dob)}</Text>
                </Flex>
            </VStack>

            <Button colorScheme="red" mt={6} width="100%" onClick={handleLogout}>
                Logout
            </Button>
        </Box>
        // </Container>
    );
};

export default Profile;