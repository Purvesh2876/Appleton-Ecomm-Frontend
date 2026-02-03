import React, { useEffect, useState } from 'react';
import {
  Box, Flex, Text, Table, Thead, Tbody, Tr, Th, Td, Image,
  Button, HStack, VStack, Input, Heading, Divider, Container,
  IconButton, useToast, Center, Spinner, Stack
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { getCart, removeFromCart, updateCartQty } from '../actions/api';
import { useNavigate } from 'react-router-dom';
import OrderSteps from '../components/OrderSteps';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();
  const brandColor = "#A22B21";

  const fetchCart = async () => {
    try {
      const response = await getCart();
      setCartItems(response.cartItems || []);
      setCartTotal(response.cartTotal || 0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const handleUpdateQty = async (productId, newQty) => {
    if (newQty < 1) return;
    try {
      await updateCartQty(productId, newQty);
      fetchCart();
    } catch (error) {
      toast({ title: "Update failed", status: "error" });
    }
  };

  const handleRemove = async (id) => {
    try {
      await removeFromCart(id);
      fetchCart();
      toast({ title: "Item removed", status: "info", variant: "subtle" });
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <Center h="100vh"><Spinner color={brandColor} /></Center>;

  return (
    <Box bg="white" minH="100vh" pb={20}>
      {/* Header - Stays same, text wraps on mobile */}
      <OrderSteps />

      <Container maxW="container.xl" mt={[6, 10]}>
        <Flex direction={{ base: "column", lg: "row" }} gap={10} align="start">

          {/* Left: Product Section */}
          <Box flex="2" w="full">
            {/* 1. LAPTOP TABLE: Visible only on 'lg' and up */}
            <Table variant="simple" size="md" display={{ base: "none", lg: "table" }}>
              <Thead borderBottom="2px solid gray.100">
                <Tr>
                  <Th w="50px"></Th>
                  <Th w="100px"></Th>
                  <Th fontSize="xs">PRODUCT</Th>
                  <Th fontSize="xs">PRICE</Th>
                  <Th fontSize="xs">QUANTITY</Th>
                  <Th fontSize="xs" textAlign="right">SUBTOTAL</Th>
                </Tr>
              </Thead>
              <Tbody>
                {cartItems.map((item) => (
                  <Tr key={item.product._id}>
                    <Td px={0}><IconButton icon={<CloseIcon w={2} h={2} />} variant="ghost" size="xs" color="gray.300" onClick={() => handleRemove(item.product._id)} /></Td>
                    <Td px={2}><Image src={`http://localhost:5000/uploads${item.product.images[0]}`} boxSize="70px" objectFit="cover" /></Td>
                    <Td><Text fontWeight="500" color={brandColor}>{item.product.name}</Text></Td>
                    <Td><Text fontSize="sm" color="gray.600">₹{item.currentPrice} / {item.product.weight} {item.product.unit}</Text></Td>
                    <Td>
                      <HStack border="1px solid" borderColor="gray.200" spacing={0} w="fit-content">
                        <Button size="xs" variant="ghost" onClick={() => handleUpdateQty(item.product._id, item.quantity - 1)}>-</Button>
                        <Box px={3} py={1} borderX="1px solid" borderColor="gray.200" fontSize="xs">{item.quantity}</Box>
                        <Button size="xs" variant="ghost" onClick={() => handleUpdateQty(item.product._id, item.quantity + 1)}>+</Button>
                      </HStack>
                    </Td>
                    <Td textAlign="right"><Text fontWeight="bold" color={brandColor}>₹{item.currentPrice * item.quantity}</Text></Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>

            {/* 2. MOBILE VIEW: Visible only on base up to 'lg' */}
            <VStack display={{ base: "flex", lg: "none" }} spacing={6} align="stretch" divider={<Divider />}>
              {cartItems.map((item) => (
                <Flex key={item.product._id} position="relative" gap={4}>
                  <Image src={`http://localhost:5000/uploads${item.product.images[0]}`} boxSize="100px" objectFit="cover" borderRadius="md" />
                  <VStack align="start" flex="1" spacing={1}>
                    <Text fontWeight="600" color={brandColor} fontSize="md">{item.product.name}</Text>
                    <Text fontSize="sm" color="gray.500">₹{item.currentPrice} / {item.product.weight}{item.product.unit}</Text>

                    <HStack mt={2} border="1px solid" borderColor="gray.200" borderRadius="md">
                      <Button size="sm" variant="ghost" onClick={() => handleUpdateQty(item.product._id, item.quantity - 1)}>-</Button>
                      <Text fontSize="sm" px={2}>{item.quantity}</Text>
                      <Button size="sm" variant="ghost" onClick={() => handleUpdateQty(item.product._id, item.quantity + 1)}>+</Button>
                    </HStack>

                    <Text fontWeight="bold" pt={1}>Total: ₹{item.currentPrice * item.quantity}</Text>
                  </VStack>
                  <IconButton icon={<CloseIcon w={3} h={3} />} position="absolute" top={0} right={0} variant="ghost" color="red.300" onClick={() => handleRemove(item.product._id)} />
                </Flex>
              ))}
            </VStack>

            {/* Coupon Section - Responsive Width */}
            <Stack direction={["column", "row"]} mt={8} spacing={4}>
              <Input placeholder="Coupon code" borderRadius="none" w={["full", "200px"]} size="md" />
              <Button bg={brandColor} color="white" borderRadius="none" size="md" px={6} _hover={{ opacity: 0.9 }}>
                Apply Coupon
              </Button>
            </Stack>
          </Box>

          {/* Right: Cart Totals Card - Full width on mobile */}
          <Box w="full" flex="1" p={[6, 8]} border="1px solid" borderColor="gray.100" shadow="xl" borderRadius="lg" bg="white">
            <Heading size="sm" mb={6} borderBottom="1px solid" borderColor="gray.100" pb={2}>CART TOTALS</Heading>
            <VStack align="stretch" spacing={4} fontSize="sm">
              <Flex justify="space-between">
                <Text color="gray.600">Subtotal</Text>
                <Text fontWeight="500">₹{cartTotal}</Text>
              </Flex>
              <Divider />
              <Box>
                <Flex justify="space-between" mb={2}>
                  <Text color="gray.600">Shipping</Text>
                  <Text color="gray.400" fontSize="xs">Free shipping</Text>
                </Flex>
                {/* <Text textAlign={["left", "right"]} fontWeight="500" fontSize="xs">
                  Shipping to <b>sunstar complex, Ahmedabad 380061, Gujarat.</b>
                </Text>
                <Text textAlign={["left", "right"]} color={brandColor} cursor="pointer" fontSize="xs" mt={1}>Change address</Text> */}
              </Box>
              <Divider />
              <Flex justify="space-between" align="center">
                <Text fontWeight="bold">Total Price</Text>
                <Text fontWeight="bold" fontSize="xl" color={brandColor}>₹{cartTotal}</Text>
              </Flex>
              <Flex justify="space-between" align="center">
                <Text fontWeight="bold">Total Weight</Text>
                <Text fontWeight="bold" fontSize="xl" color={brandColor}>
                  {cartItems.reduce((acc, item) => acc + (item.product.weight * item.quantity), 0)} g
                </Text>
              </Flex>
            </VStack>
            <Button
              mt={8} w="full" bg={brandColor} color="white" borderRadius="none" py={7}
              _hover={{ opacity: 0.9 }}
              onClick={() => navigate('/checkout')}
            >
              Proceed To Checkout
            </Button>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default CartPage;