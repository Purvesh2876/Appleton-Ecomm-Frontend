import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, UnorderedList, ListItem, Input, Button, Container, FormControl, FormLabel, Stack, useToast } from '@chakra-ui/react';
import "@fontsource/pt-sans";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getSingleUser, login, signup } from '../actions/api';
import GoogleSignIn from './GoogleSignIn';

const Login = () => {

    // const [signupForm, setSignupForm] = useState({ email: '', password: '', mobile: '', name: '', dob: '' });
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mobile, setMobile] = useState('');
    const [dob, setDob] = useState('');
    const toast = useToast();
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await login(email, password);
            console.log('Login response:', email, password);
            if (response.success === true) {
                toast({
                    title: 'Login Successful',
                    description: 'You have successfully logged in.',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
                navigate('/');
            } else {
                // Handle unsuccessful login (show error message, etc.)
                console.error('Login failed:', response.data.message);
            }
        } catch (error) {
            // Handle any errors that occur during the API call
            console.error('Error during login:', error.message);
        }
    };

    return (
        <Container centerContent mt={20}>
            <Heading as="h2" size="xl" mb={4} fontFamily="PT Sans" fontWeight={400}>
                LOGIN
            </Heading>
            <Box mb={4}>
                <Input
                    type="email"
                    placeholder="Email"
                    // value={loginForm.email}
                    // onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                    type="password"
                    placeholder="Password"
                    // value={loginForm.password}
                    // onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    mt={2}
                />
                <Stack>
                    <Button onClick={handleLogin} mt={4}>
                        Login
                    </Button>
                    <Text mt={2} cursor="pointer" color="blue.500">
                        Not registered? Sign Up
                    </Text>
                </Stack>
                <GoogleSignIn/>
            </Box>
        </Container>
    );
};

export default Login;