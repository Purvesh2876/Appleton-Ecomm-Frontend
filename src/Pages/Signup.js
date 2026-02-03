import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, UnorderedList, ListItem, Input, Button, Container, FormControl, FormLabel, Stack, useToast } from '@chakra-ui/react';
import "@fontsource/pt-sans";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { login, signup } from '../actions/api';

const Signup = () => {

    // const [signupForm, setSignupForm] = useState({ email: '', password: '', mobile: '', name: '', dob: '' });
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mobile, setMobile] = useState('');
    const [dob, setDob] = useState('');
    const toast = useToast();
    const navigate = useNavigate();

    const handleSignup = async () => {
        try {
            const response = await signup(username, name, email, password, mobile, dob);
            toast({
                title: 'Signup Successful',
                description: 'You have successfully signed up.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            console.log('Signup response:', response);
            localStorage.setItem('email', response.user.email);
            setUsername('');
            setName('');
            setEmail('');
            setPassword('');
            setMobile('');
            setDob('');
            navigate('/otp');
        } catch (error) {
            console.error('Error during signup:', error);
            toast({
                title: 'Error during signup',
                description: error.response.data.error,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Container centerContent mt={20}>
            <Heading as="h2" size="xl" mb={4} fontFamily="PT Sans" fontWeight={400}>
                Signup
            </Heading>
            <Box mb={4} >
                <Input
                    type="text"
                    placeholder="Name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    mt={2}
                />
                <Input
                    type="text"
                    placeholder="Mobile Number"
                    value={mobile}
                    onChange={(e) => {
                        const inputVal = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                        const formattedValue = inputVal.slice(0, 10); // Take only the first 10 characters
                        setMobile(formattedValue);
                    }}
                    mt={2}

                />
                <Input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    mt={2}
                />
                <Input
                    type="date"
                    placeholder="Date of Birth"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    mt={2}
                />
                <Stack>
                    <Button onClick={handleSignup} mt={4}>
                        Signup
                    </Button>
                    <Text mt={2} cursor="pointer" color="blue.500">
                        Already registered? Login
                    </Text>
                </Stack>
            </Box>
        </Container>
    );
};

export default Signup;