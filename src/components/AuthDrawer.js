import React, { useState } from 'react';
import {
    Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton,
    VStack, Input, Button, Text, useToast, HStack, PinInput, PinInputField, Divider, Box
} from '@chakra-ui/react';
import { login, signup, activate, forgotPassword } from '../actions/api';
import GoogleSignIn from '../Pages/GoogleSignIn';

const AuthDrawer = ({ isOpen, onClose }) => {
    const [view, setView] = useState('login'); // 'login', 'signup', 'otp'
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', mobile: '', dob: ''
    });
    const [otp, setOtp] = useState('');
    const toast = useToast();
    const brandColor = "#A22B21";

    // Inside AuthDrawer component
    const [forgotEmail, setForgotEmail] = useState('');

    // 2. Add the handler function
    const handleForgotPassword = async () => {
        try {
            await forgotPassword(forgotEmail);
            toast({
                title: 'Email Sent',
                description: 'Check your inbox for the reset link.',
                status: 'success'
            });
            setView('login'); // Redirect back to login after success
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Something went wrong',
                status: 'error'
            });
        }
    };


    // Handles all inputs + the specific 10-digit logic you had for mobile
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'mobile') {
            const formattedValue = value.replace(/\D/g, '').slice(0, 10);
            setFormData(prev => ({ ...prev, [name]: formattedValue }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSignup = async () => {
        try {
            const { name, email, password, mobile, dob } = formData;
            await signup(name, email, password, mobile, dob);
            localStorage.setItem('email', email);
            toast({ title: 'Activation Code Sent', description: 'Please check your email.', status: 'info' });
            setView('otp');
        } catch (error) {
            toast({ title: 'Signup Error', description: error.response?.data?.error, status: 'error' });
        }
    };

    const handleVerifyOtp = async () => {
        try {
            const email = localStorage.getItem('email');
            const response = await activate(email, otp);
            if (response.status === 200) {
                toast({ title: 'Account Activated', status: 'success' });
                setView('login');
            }
        } catch (error) {
            toast({ title: 'Verification Failed', description: 'Invalid or expired OTP.', status: 'error' });
        }
    };

    const handleLogin = async () => {
        try {
            const response = await login(formData.email, formData.password);
            if (response.success) {
                localStorage.setItem('email', formData.email);
                toast({ title: 'Login Successful', status: 'success' });
                onClose();
                window.location.reload(); // To update the Header state
            }
        } catch (error) {
            const errMsg = error.response?.data?.data || 'Invalid credentials';
            toast({ title: 'Login Failed', description: errMsg, status: 'error' });
        }
    };

    return (
        <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
            <DrawerOverlay backdropFilter="blur(4px)" />
            <DrawerContent borderRadius="none">
                <DrawerCloseButton mt={2} />
                <DrawerHeader borderBottomWidth="1px" fontFamily="'PT Sans', sans-serif" fontWeight={400}>
                    {view === 'login' ? 'LOGIN' : view === 'signup' ? 'CREATE ACCOUNT' : 'VERIFY EMAIL'}
                </DrawerHeader>

                <DrawerBody py={10}>
                    <VStack spacing={5} align="stretch">
                        {view === 'login' && (
                            <>
                                <Input placeholder="Email" name="email" value={formData.email} onChange={handleInputChange} borderRadius="none" />
                                <Input placeholder="Password" type="password" name="password" value={formData.password} onChange={handleInputChange} borderRadius="none" />
                                <Button bg={brandColor} color="white" borderRadius="none" h="50px" _hover={{ opacity: 0.9 }} onClick={handleLogin}>
                                    Login
                                </Button>
                                <HStack justify="center" fontSize="sm">
                                    <Text>Not registered?</Text>
                                    <Text color="blue.500" cursor="pointer" fontWeight="bold" onClick={() => setView('signup')}>Sign Up</Text>
                                </HStack>

                                <Box py={2}>
                                    <HStack><Divider /></HStack>
                                </Box>

                                {/* Your working Google component */}
                                {/* <GoogleSignIn /> */}
                            </>
                        )}

                        {view === 'signup' && (
                            <>
                                <Input placeholder="Full Name" name="name" value={formData.name} onChange={handleInputChange} borderRadius="none" />
                                <Input placeholder="Email" name="email" value={formData.email} onChange={handleInputChange} borderRadius="none" />
                                <Input placeholder="Password" type="password" name="password" value={formData.password} onChange={handleInputChange} borderRadius="none" />
                                <Input placeholder="Mobile Number" name="mobile" value={formData.mobile} onChange={handleInputChange} borderRadius="none" />
                                <Input placeholder="Date of Birth" type="date" name="dob" value={formData.dob} onChange={handleInputChange} borderRadius="none" />
                                <Button bg={brandColor} color="white" borderRadius="none" h="50px" mt={2} onClick={handleSignup}>
                                    Sign Up
                                </Button>
                                <HStack justify="center" fontSize="sm">
                                    <Text>Already a member?</Text>
                                    <Text color="blue.500" cursor="pointer" fontWeight="bold" onClick={() => setView('login')}>Login</Text>
                                </HStack>
                            </>
                        )}

                        {view === 'otp' && (
                            <VStack spacing={8}>
                                <VStack spacing={2} textAlign="center">
                                    <Text fontSize="sm" color="gray.600">Verification code sent to</Text>
                                    <Text fontWeight="bold">{formData.email}</Text>
                                </VStack>
                                <HStack justify="center">
                                    <PinInput otp size="lg" onComplete={(val) => setOtp(val)} focusBorderColor={brandColor}>
                                        {[...Array(6)].map((_, i) => <PinInputField key={i} borderRadius="none" />)}
                                    </PinInput>
                                </HStack>
                                <Button w="full" bg={brandColor} color="white" borderRadius="none" h="50px" onClick={handleVerifyOtp}>
                                    Verify & Activate
                                </Button>
                                <Text fontSize="xs" color="blue.500" cursor="pointer" onClick={() => setView('signup')}>
                                    Change Email or Details
                                </Text>
                            </VStack>
                        )}

                        {view === 'login' && (
                            <>
                                {/* ... existing inputs ... */}
                                <Text
                                    fontSize="xs"
                                    color="blue.500"
                                    cursor="pointer"
                                    textAlign="right"
                                    mt={-3}
                                    onClick={() => setView('forgot')}
                                >
                                    Forgot Password?
                                </Text>
                                {/* ... Login Button ... */}
                            </>
                        )}

                        {view === 'forgot' && (
                            <VStack spacing={5}>
                                <Text fontSize="sm" textAlign="center">Enter your email to receive a password reset link.</Text>
                                <Input
                                    placeholder="Email Address"
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                    borderRadius="none"
                                />
                                <Button w="full" bg={brandColor} color="white" borderRadius="none" h="50px" onClick={handleForgotPassword}>
                                    Send Reset Link
                                </Button>
                                <Text fontSize="xs" color="blue.500" cursor="pointer" onClick={() => setView('login')}>
                                    Back to Login
                                </Text>
                            </VStack>
                        )}
                    </VStack>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};

export default AuthDrawer;