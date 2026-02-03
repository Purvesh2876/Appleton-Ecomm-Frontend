import React, { useState, useEffect } from 'react';
import { PinInput, PinInputField, Box, Heading, Text, Input, Button, Container, Stack, useToast, HStack } from '@chakra-ui/react';
import "@fontsource/pt-sans";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { activate, login, signup } from '../actions/api';

const Otp = () => {

    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const toast = useToast();
    const navigate = useNavigate();

    const handleComplete = (value) => {
        setOtp(value);
    };

    const handleVerifyOtp = async () => {
        try {
            console.log('Login response:', email, otp);
            const response = await activate(email, otp);
            console.log('Login response:', response);
            if (response.status === 200) {
                toast({
                    title: 'OTP Verification Successful',
                    description: 'You have successfully verified your OTP.',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
                navigate('/login');
            } else {
                // Handle unsuccessful login (show error message, etc.)
                console.error('Login failed:', response.data.message);
            }
        } catch (error) {
            // Handle any errors that occur during the API call
            console.error('Error during login:', error.message);
        }
    };

    useEffect(() => {
        const storedEmail = localStorage.getItem('email');
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    return (
        <Container centerContent mt={20}>
            <Heading as="h2" size="xl" mb={4} fontFamily="PT Sans" fontWeight={400}>
                OTP
            </Heading>
            <Box mb={4} width={'100%'} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    isDisabled={true}
                    onChange={(e) => setEmail(e.target.value)}
                    border={'none'}
                    mb={3}
                    textAlign={'center'}
                />
                <HStack justify="center" mb={4}>
                    <PinInput otp onComplete={handleComplete}>
                        <PinInputField />
                        <PinInputField />
                        <PinInputField />
                        <PinInputField />
                        <PinInputField />
                        <PinInputField />
                        {/* Add more fields if your OTP is longer */}
                    </PinInput>
                </HStack>
                <Stack>
                    <Button onClick={handleVerifyOtp} mt={4}>
                        Submit
                    </Button>
                    <Text mt={2} cursor="pointer" color="blue.500">
                        Not registered? Sign Up
                    </Text>
                </Stack>
            </Box>
        </Container>
    );
};

export default Otp;