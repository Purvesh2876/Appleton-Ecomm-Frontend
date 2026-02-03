import React, { useEffect, useState } from 'react';
import {
  Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody,
  VStack, Heading, Box, Flex, Input, Image, Button, Text, Divider, HStack, Stack,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  Tabs, Tab, TabList, TabPanel, TabPanels, useToast, Center, Icon
} from '@chakra-ui/react';
import { createOrder, getCart, removeFromCart, verifyPayment, addToCartt, updateCartQty, clearUserCart } from '../actions/api';
import { CloseIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const ShoppingCartDrawer = ({ isCartOpen, setCartOpen }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [isOrderModalOpen, setOrderModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '', phoneNumber: '', address: '', city: '', pincode: '' });
  const navigate = useNavigate();

  const toast = useToast();
  const brandColor = "#A22B21";

  const getCartData = async () => {
    try {
      const response = await getCart();
      setCartItems(response.cartItems || []);
      setCartTotal(response.cartTotal || 0);
    } catch (error) {
      console.error('Error fetching cart data:', error);
    }
  };

  useEffect(() => {
    if (isCartOpen) getCartData();
  }, [isCartOpen]);

  // 2. Inside your ShoppingCartDrawer component, update this function:
  const handleUpdateQty = async (productId, newQty) => {
    // Ensure productId is just the string ID (e.g., "69541b57...")
    try {
      const response = await updateCartQty(productId, newQty);
      if (response) {
        getCartData();
      }
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      await removeFromCart(productId);
      getCartData();
      toast({ title: "Item removed", status: "info", duration: 2000, variant: "subtle" });
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleNextStep = () => setCurrentStep(prev => prev + 1);

  const handleCheckout = () => setOrderModalOpen(true);
  const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleDone = async () => {
    // 1. Validation
    const { name, email, phoneNumber, address, city, pincode } = formData;
    if (!phoneNumber || !name || !email || !address || !city || !pincode) {
      toast({ title: "Missing Information", status: "warning" });
      return;
    }
    // 2. Load Razorpay
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!res) {
      toast({ title: "Payment system failed to load", status: "error" });
      return;
    }
    // 3. Prepare Order Data

    const orderData = {
      amount: cartTotal,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      shippingInfo: { name, email, phone: phoneNumber, address, city, pincode },
      items: cartItems.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.currentPrice
      }))
    };
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      // 4. Create Order on Backend
      const data = await createOrder(orderData);
      if (!data.success || !data.razorpayOrder) {
        throw new Error("Order creation failed on server.");
      }

      // 5. Razorpay Options
      const options = {
        key: "rzp_test_S0jaQgN2TWpblg", // Replace with your actual key
        amount: data.razorpayOrder.amount,
        currency: data.razorpayOrder.currency,
        name: "Appleton World",
        order_id: data.razorpayOrder.id,
        handler: async function (response) {
          // Verification logic
          try {
            const verifyData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };

            // 5. Verify using the new action
            const verifyRes = await verifyPayment(verifyData);
            if (verifyRes.success) {
              toast({ title: "Order Placed Successfully!", status: "success" });
              // Reset local states
              // --- NEW STEP: CLEAR THE CART ---
              await clearUserCart();
              setOrderModalOpen(false);
              setCartOpen(false);
              setCurrentStep(0);
              getCartData();
            }
          } catch (verifyErr) {
            console.error("Verification error:", verifyErr);
          }
        },
        prefill: { name, email, contact: phoneNumber },
        theme: { color: "#A22B21" }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      toast({ title: "Order processing failed", status: "error" });
    }
  };
  // --- Razorpay & Checkout Logic Remains the Same ---
  // (Include your loadScript and handleDone functions here)

  return (
    <Drawer placement="right" onClose={() => setCartOpen(false)} isOpen={isCartOpen} size="sm">
      <DrawerOverlay backdropFilter="blur(2px)" />
      <DrawerContent>
        {/* Header matched to image */}
        <DrawerHeader py={6} borderBottomWidth="1px">
          <Flex justify="space-between" align="center">
            <Heading size="lg" fontFamily="'Playfair Display', serif" fontWeight="500">
              Shopping Cart
            </Heading>
            <HStack cursor="pointer" onClick={() => setCartOpen(false)} spacing={1}>
              <CloseIcon w={3} h={3} />
              <Text fontSize="md" fontWeight="500">Close</Text>
            </HStack>
          </Flex>
        </DrawerHeader>

        <DrawerBody p={0}>
          <VStack spacing={0} align="stretch" h="full">
            <Box flex="1" overflowY="auto" px={6}>
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <HStack key={item.product._id} py={6} align="start" spacing={4} borderBottom="1px solid" borderColor="gray.100" position="relative">
                    <Image
                      src={`${process.env.REACT_APP_API_URL}uploads${item.product.images[0]}`}
                      boxSize="90px"
                      objectFit="cover"
                      borderRadius="sm"
                    />

                    <VStack align="start" flex="1" spacing={2}>
                      <Text fontWeight="500" fontSize="md" color="gray.800">{item.product.name}</Text>

                      {/* Quantity Selector matched to image */}
                      <HStack border="1px solid" borderColor="gray.200" spacing={0}>
                        <Button size="xs" variant="ghost" borderRadius="0" onClick={() => handleUpdateQty(item.product._id, item.quantity - 1)}>-</Button>
                        <Box px={4} py={1} borderX="1px solid" borderColor="gray.200">
                          <Text fontSize="xs">{item.quantity}</Text>
                        </Box>
                        <Button size="xs" variant="ghost" borderRadius="0" onClick={() => handleUpdateQty(item.product._id, item.quantity + 1)}>+</Button>
                      </HStack>

                      <Text fontSize="sm" color="gray.500">
                        {item.quantity} × <Text as="span" fontWeight="bold" color={brandColor}>₹{item.currentPrice?.toLocaleString('en-IN')}</Text>
                        <Text as="span" color="gray.400"> / {item.product.weight}{item.product.unit}</Text>
                      </Text>
                    </VStack>

                    <Icon
                      as={CloseIcon}
                      w={2} h={2}
                      color="gray.400"
                      cursor="pointer"
                      onClick={() => handleRemoveFromCart(item.product._id)}
                      position="absolute"
                      right="0"
                      top="24px"
                    />
                  </HStack>
                ))
              ) : (
                <Center h="200px"><Text color="gray.400">Your cart is empty</Text></Center>
              )}
            </Box>

            {/* Footer matched to image */}
            <Box px={6} py={8} borderTopWidth="1px">
              <VStack spacing={4} align="stretch" mb={6}>
                <Flex justify="space-between" align="center">
                  <Heading size="md" fontWeight="500">Subtotal:</Heading>
                  <Text fontSize="xl" fontWeight="bold" color={brandColor}>₹{cartTotal?.toLocaleString('en-IN')}</Text>
                </Flex>
                <Flex justify="space-between" align="center">
                  <Heading size="md" fontWeight="500">Total Weight:</Heading>
                  <Text fontSize="xl" fontWeight="bold" color={brandColor}>
                    {cartItems.reduce((acc, item) => acc + (item.product.weight * item.quantity), 0)} g
                  </Text>
                </Flex>
              </VStack>

              <Stack spacing={3}>
                <Button w="full" bg={brandColor} color="white" h="50px" borderRadius="0" _hover={{ opacity: 0.9 }} onClick={() => {
                  setCartOpen(false); // Close drawer first
                  navigate('/cart');  // Go to the new page
                }}>
                  View Cart
                </Button>
                <Button w="full" bg={brandColor} color="white" h="50px" borderRadius="0" _hover={{ opacity: 0.9 }} onClick={handleCheckout}>
                  Checkout
                </Button>
                {/* <Button w="full" bg={brandColor} color="white" h="50px" borderRadius="0" _hover={{ opacity: 0.9 }} onClick={() => { navigate('/checkout'); setCartOpen(false); }}>
                  Checkout
                </Button> */}
              </Stack>
            </Box>
          </VStack>
        </DrawerBody>

        <Modal isOpen={isOrderModalOpen} onClose={() => setOrderModalOpen(false)} size="xl">
          <ModalOverlay />
          <ModalContent borderRadius="none">
            <ModalHeader borderBottomWidth="1px">Order Confirmation</ModalHeader>
            <ModalCloseButton />
            <ModalBody py={6}>
              <Tabs index={currentStep} isFitted variant="enclosed">
                <TabList mb="1em">
                  <Tab isDisabled={currentStep !== 0}>1. Receiver</Tab>
                  <Tab isDisabled={currentStep !== 1}>2. Address</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <VStack spacing={4}>
                      <Input name="name" placeholder="Full Name" value={formData.name} onChange={handleInputChange} />
                      <Input name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} />
                      <Input name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleInputChange} />
                    </VStack>
                  </TabPanel>
                  <TabPanel>
                    <VStack spacing={4}>
                      <Input name="address" placeholder="Street Address" value={formData.address} onChange={handleInputChange} />
                      <Input name="city" placeholder="City" value={formData.city} onChange={handleInputChange} />
                      <Input name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleInputChange} />
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </ModalBody>
            <ModalFooter borderTopWidth="1px">
              {currentStep === 0 ? (
                <Button bg="black" color="white" onClick={handleNextStep} isDisabled={!formData.name || !formData.phoneNumber || !formData.email}>
                  Next Step
                </Button>
              ) : (
                <Button bg="#A22B21" color="white" onClick={handleDone} isDisabled={!formData.address || !formData.pincode}>
                  Pay Now
                </Button>
              )}
            </ModalFooter>
          </ModalContent>
        </Modal>
      </DrawerContent>
    </Drawer>
  );
};

export default ShoppingCartDrawer;