import React, { useEffect, useState } from 'react';
import {
    Box, Flex, Text, Image, Button, HStack, VStack, Input, Heading,
    Divider, Table, Tbody, Tr, Td, Container, Textarea, useToast, Center, Spinner
} from '@chakra-ui/react';
import { getCart, createOrder, verifyPayment, clearUserCart } from '../actions/api';
import { useNavigate, useLocation } from 'react-router-dom'; // Added useLocation
import OrderSteps from '../components/OrderSteps';

const loadScript = (src) => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const CheckoutPage = () => {
    const location = useLocation(); // Hook to get data from navigate state
    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', company: '', country: '',
        streetAddress: '', apartment: '', city: '',
        state: '', pincode: '', phone: '', email: '', orderNotes: ''
    });

    // 1. EXTRACT COUPON DATA FROM NAVIGATION STATE
    const {
        discount = 0,
        appliedCode = null
    } = location.state || {};

    const toast = useToast();
    const navigate = useNavigate();
    const brandColor = "#A22B21";

    const fetchCheckoutData = async () => {
        try {
            const response = await getCart();
            setCartItems(response.cartItems || []);
            setCartTotal(response.cartTotal || 0);
        } catch (error) { console.error(error); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        fetchCheckoutData();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = async () => {
        const {
            firstName, lastName, email, phone,
            streetAddress, apartment, city, state,
            pincode, orderNotes
        } = formData;

        if (!phone || !firstName || !email || !streetAddress || !pincode) {
            toast({ title: "Please fill required fields", status: "warning" });
            return;
        }

        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        if (!res) {
            toast({ title: "Payment system failed to load", status: "error" });
            return;
        }

        // 2. PREPARE SECURE ORDER DATA
        // Note: 'amount' is no longer required as Backend recalculates
        const orderData = {
            currency: "INR",
            receipt: `rcpt_${Date.now()}`,
            shippingInfo: {
                name: `${firstName} ${lastName}`,
                email,
                phone,
                address: apartment ? `${streetAddress}, ${apartment}` : streetAddress,
                city,
                state,
                pincode: Number(pincode)
            },
            orderNotes: orderNotes,
            // SEND COUPON CODE TO BACKEND
            couponCode: appliedCode,
            items: cartItems.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
            }))
        };

        try {
            // This calls your updated secure backend
            const data = await createOrder(orderData);

            if (!data.success || !data.razorpayOrder) {
                throw new Error("Order creation failed on server.");
            }

            const options = {
                key: "rzp_test_S0jaQgN2TWpblg", // Replace with your key
                amount: data.razorpayOrder.amount, // Secured amount from backend
                currency: data.razorpayOrder.currency,
                name: "Appleton World",
                order_id: data.razorpayOrder.id,
                handler: async function (response) {
                    try {
                        const verifyData = {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        };
                        const verifyResponse = await verifyPayment(verifyData);

                        if (verifyResponse.success) {
                            toast({ title: "Order Placed Successfully!", status: "success" });
                            await clearUserCart();
                            // Redirect to success page or refresh
                            navigate('/order-success', { state: { orderId: response.razorpay_order_id } });
                        }
                    } catch (verifyErr) {
                        console.error("Verification error:", verifyErr);
                    }
                },
                prefill: { name: `${firstName} ${lastName}`, email, contact: phone },
                theme: { color: brandColor }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("Order error:", error);
            toast({ title: "Order failed", description: error.message, status: "error" });
        }
    };

    if (loading) return <Center h="100vh"><Spinner color={brandColor} /></Center>;

    return (
        <Box bg="white" minH="100vh" pb={20}>
            <OrderSteps />

            <Container maxW="container.xl" mt={10}>
                <Flex direction={{ base: "column", lg: "row" }} gap={12}>

                    {/* Left: Billing Details */}
                    <Box flex="1.5">
                        <Heading size="md" mb={6} borderBottom="1px solid #eee" pb={2}>BILLING DETAILS</Heading>
                        <VStack spacing={5} align="stretch">
                            <HStack spacing={4}>
                                <Box flex="1"><Text fontSize="xs" mb={1}>First name *</Text><Input name="firstName" value={formData.firstName} onChange={handleInputChange} borderRadius="none" /></Box>
                                <Box flex="1"><Text fontSize="xs" mb={1}>Last name *</Text><Input name="lastName" value={formData.lastName} onChange={handleInputChange} borderRadius="none" /></Box>
                            </HStack>
                            <Box><Text fontSize="xs" mb={1}>Company name (optional)</Text><Input name="company" onChange={handleInputChange} borderRadius="none" /></Box>
                            <Box><Text fontSize="xs" mb={1}>Street address *</Text><Input name="streetAddress" value={formData.streetAddress} onChange={handleInputChange} placeholder="House number and street name" borderRadius="none" mb={2} /><Input name="apartment" onChange={handleInputChange} placeholder="Apartment, suite, unit, etc. (optional)" borderRadius="none" /></Box>
                            <Box><Text fontSize="xs" mb={1}>Town / City *</Text><Input name="city" value={formData.city} onChange={handleInputChange} borderRadius="none" /></Box>
                            <Box><Text fontSize="xs" mb={1}>PIN Code *</Text><Input name="pincode" value={formData.pincode} onChange={handleInputChange} borderRadius="none" /></Box>
                            <Box><Text fontSize="xs" mb={1}>State</Text><Input name='state' value={formData.state} onChange={handleInputChange} borderRadius="none" /></Box>
                            <Box><Text fontSize="xs" mb={1}>Country / Region *</Text><Input value="India" isReadOnly borderRadius="none" /></Box>
                            <Box><Text fontSize="xs" mb={1}>Phone *</Text><Input name="phone" value={formData.phone} onChange={handleInputChange} borderRadius="none" /></Box>
                            <Box><Text fontSize="xs" mb={1}>Email address *</Text><Input name="email" value={formData.email} onChange={handleInputChange} borderRadius="none" /></Box>
                            <Box><Text fontSize="xs" mb={1}>Order notes (optional)</Text><Textarea name="orderNotes" value={formData.orderNotes} onChange={handleInputChange} placeholder="Notes about your order, e.g. special notes for delivery." borderRadius="none" /></Box>
                        </VStack>
                    </Box>

                    {/* Right: Your Order Summary */}
                    <Box flex="1" p={8} bg="#FDF8F7" border="1px dashed" borderColor="gray.200">
                        <Heading size="sm" mb={6}>YOUR ORDER</Heading>
                        <Table variant="simple" size="sm">
                            <Tbody>
                                <Tr><Td fontWeight="bold" fontSize="xs" border="none">PRODUCT</Td><Td fontWeight="bold" fontSize="xs" border="none" textAlign="right">SUBTOTAL</Td></Tr>
                                {cartItems.map(item => (
                                    <Tr key={item.product._id}>
                                        <Td fontSize="xs">{item.product.name} × {item.quantity}</Td>
                                        <Td fontSize="xs" textAlign="right">₹{item.currentPrice * item.quantity}</Td>
                                    </Tr>
                                ))}
                                <Tr><Td fontSize="xs" fontWeight="bold">Subtotal</Td><Td fontSize="xs" fontWeight="bold" textAlign="right">₹{cartTotal}</Td></Tr>

                                {/* DISPLAY DISCOUNT HERE */}
                                {discount > 0 && (
                                    <Tr>
                                        <Td fontSize="xs" fontWeight="bold" color="green.600">Discount ({appliedCode})</Td>
                                        <Td fontSize="xs" fontWeight="bold" textAlign="right" color="green.600">- ₹{discount}</Td>
                                    </Tr>
                                )}

                                <Tr><Td fontSize="xs" fontWeight="bold">Shipping</Td><Td fontSize="xs" textAlign="right">Free shipping</Td></Tr>
                                <Tr>
                                    <Td fontSize="md" fontWeight="bold">Total</Td>
                                    <Td fontSize="md" fontWeight="bold" textAlign="right" color={brandColor}>
                                        ₹{cartTotal - discount}
                                    </Td>
                                </Tr>
                                <Tr><Td fontSize="xs" fontWeight="bold">Total Weight</Td><Td fontSize="xs" fontWeight="bold" textAlign="right">{cartItems.reduce((acc, i) => acc + (i.product.weight * i.quantity), 0)} g</Td></Tr>
                            </Tbody>
                        </Table>

                        <Box mt={6} p={4} bg="white" border="1px solid #eee">
                            <HStack mb={2}><Text fontWeight="bold" fontSize="xs">Pay by Razorpay</Text></HStack>
                            <Text fontSize="xs" color="gray.500">Pay securely by Credit Card or Internet Banking through Razorpay.</Text>
                        </Box>

                        <Button mt={8} w="full" bg={brandColor} color="white" borderRadius="none" py={7} _hover={{ opacity: 0.9 }} onClick={handlePlaceOrder}>
                            Place Order
                        </Button>
                    </Box>
                </Flex>
            </Container>
        </Box>
    );
};

export default CheckoutPage;