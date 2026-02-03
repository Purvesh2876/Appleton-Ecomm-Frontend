import React, { useEffect, useState } from 'react';
import {
  Box, Flex, Text, Table, Thead, Tbody, Tr, Th, Td, Image,
  Button, HStack, VStack, Input, Heading, Divider, Container,
  IconButton, useToast, Center, Spinner, Stack,
  Badge
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { getCart, getPublicCoupons, removeFromCart, updateCartQty, validateCoupon } from '../actions/api'; // Added validateCoupon
import { useNavigate } from 'react-router-dom';
import OrderSteps from '../components/OrderSteps';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // 2. Inside the CartPage component, add this state
  const [availableCoupons, setAvailableCoupons] = useState([]);

  // --- NEW COUPON STATES ---
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCode, setAppliedCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();
  const brandColor = "#A22B21";

  const fetchCart = async () => {
    try {
      const response = await getCart();
      setCartItems(response.cartItems || []);
      setCartTotal(response.cartTotal || 0);
      // Reset discount if cart items change significantly (optional logic)
      setDiscount(0);
      setAppliedCode('');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOffers = async () => {
    try {
      const coupons = await getPublicCoupons();
      setAvailableCoupons(coupons);
    } catch (error) {
      console.error("Error fetching offers:", error);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchOffers(); // Add this line here
  }, []);

  // useEffect(() => { fetchCart(); }, []);

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

  // --- NEW COUPON HANDLER ---
  const handleApplyCoupon = async (codeToApply) => {
    // Use the code passed from the button, or fall back to the typed input
    const code = typeof codeToApply === 'string' ? codeToApply : couponCode;

    if (!code) return;

    try {
      const res = await validateCoupon({
        code: code,
        cartItems: cartItems,
        cartTotal: cartTotal
      });
      setDiscount(res.discount);
      setAppliedCode(res.code);
      toast({ title: "Coupon Applied!", status: "success" });
    } catch (err) {
      toast({ title: "Error", description: err.toString(), status: "error" });
    }
  };

  const handleRemoveCoupon = () => {
    setDiscount(0);
    setAppliedCode('');
    setCouponCode(''); // Clears the input field too
    toast({
      title: "Coupon removed",
      status: "info",
      duration: 2000,
      variant: "subtle"
    });
  };

  if (loading) return <Center h="100vh"><Spinner color={brandColor} /></Center>;

  return (
    <Box bg="white" minH="100vh" pb={20}>
      <OrderSteps />

      <Container maxW="container.xl" mt={[6, 10]}>
        <Flex direction={{ base: "column", lg: "row" }} gap={10} align="start">

          {/* Left: Product Section */}
          <Box flex="2" w="full">
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
                    <Td px={2}><Image src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000/'}uploads${item.product.images[0]}`} boxSize="70px" objectFit="cover" /></Td>
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

            {/* MOBILE VIEW */}
            <VStack display={{ base: "flex", lg: "none" }} spacing={6} align="stretch" divider={<Divider />}>
              {cartItems.map((item) => (
                <Flex key={item.product._id} position="relative" gap={4}>
                  <Image src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000/'}uploads${item.product.images[0]}`} boxSize="100px" objectFit="cover" borderRadius="md" />
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

            {/* COUPON SECTION - Connects to Backend */}
            {/* Updated Coupon Section with Remove Logic */}
            <Stack direction={["column", "row"]} mt={8} spacing={4}>
              <Input
                placeholder="Coupon code"
                borderRadius="none"
                w={["full", "200px"]}
                size="md"
                value={couponCode}
                // Disable input if a coupon is already applied to force them to remove it first
                isDisabled={appliedCode !== ''}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              />

              {appliedCode ? (
                <Button
                  colorScheme="red"
                  variant="outline"
                  borderRadius="none"
                  size="md"
                  px={6}
                  onClick={handleRemoveCoupon}
                >
                  Remove
                </Button>
              ) : (
                <Button
                  bg={brandColor}
                  color="white"
                  borderRadius="none"
                  size="md"
                  px={6}
                  isLoading={isApplying}
                  _hover={{ opacity: 0.9 }}
                  onClick={handleApplyCoupon}
                >
                  Apply Coupon
                </Button>
              )}

              {appliedCode && (
                <Text color="green.600" fontSize="sm" alignSelf="center" fontWeight="500">
                  ✓ {appliedCode} Applied
                </Text>
              )}
            </Stack>
            {/* ZOMATO-STYLE OFFERS SECTION */}
            {/* ZOMATO-STYLE OFFERS SECTION */}
            {availableCoupons.length > 0 && (
              <Box mt={8} mb={4} p={4} border="1px solid" borderColor="orange.100" borderRadius="md" bg="orange.50">
                <Text fontSize="xs" fontWeight="bold" color="orange.800" mb={3} letterSpacing="wider">
                  OFFERS FOR YOU
                </Text>
                <VStack align="stretch" spacing={3}>
                  {availableCoupons
                    .filter((coupon) => {
                      // 1. If it's a GLOBAL coupon (no category, no products), always show it
                      if (!coupon.category && (!coupon.applicableProducts || coupon.applicableProducts.length === 0)) {
                        return true;
                      }

                      // 2. If it targets a CATEGORY, check if any cart item matches that category
                      if (coupon.category) {
                        // We check the category ID. Note: Ensure your backend populates the category ID or object.
                        const categoryId = coupon.category._id || coupon.category;
                        return cartItems.some(item => item.product.category === categoryId);
                      }

                      // 3. If it targets specific PRODUCTS, check if any cart item matches those IDs
                      if (coupon.applicableProducts && coupon.applicableProducts.length > 0) {
                        return cartItems.some(item =>
                          coupon.applicableProducts.includes(item.product._id)
                        );
                      }

                      return false;
                    })
                    .map((coupon) => (
                      <Flex
                        key={coupon._id}
                        bg="white"
                        p={3}
                        borderRadius="md"
                        border="1px dashed"
                        borderColor="orange.300"
                        justify="space-between"
                        align="center"
                        shadow="sm"
                      >
                        <VStack align="start" spacing={0}>
                          <HStack>
                            <Badge colorScheme="orange" variant="solid" fontSize="10px">{coupon.code}</Badge>
                            <Text fontSize="xs" fontWeight="bold" color="gray.700">
                              {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                            </Text>
                          </HStack>
                          <Text fontSize="xs" mt={1} color="gray.600">{coupon.description}</Text>

                          {/* NUDGE: Order Value check */}
                          {cartTotal < coupon.minCartValue && (
                            <Text fontSize="10px" color="red.500" fontWeight="500" mt={1}>
                              Add ₹{coupon.minCartValue - cartTotal} more to unlock
                            </Text>
                          )}
                        </VStack>

                        <Button
                          size="xs"
                          colorScheme="orange"
                          isDisabled={cartTotal < coupon.minCartValue}
                          onClick={() => {
                            setCouponCode(coupon.code);
                            handleApplyCoupon(coupon.code);
                          }}
                        >
                          Apply
                        </Button>
                      </Flex>
                    ))}
                </VStack>
              </Box>
            )}
          </Box>

          {/* Right: Cart Totals Card */}
          <Box w="full" flex="1" p={[6, 8]} border="1px solid" borderColor="gray.100" shadow="xl" borderRadius="lg" bg="white">
            <Heading size="sm" mb={6} borderBottom="1px solid" borderColor="gray.100" pb={2}>CART TOTALS</Heading>
            <VStack align="stretch" spacing={4} fontSize="sm">
              <Flex justify="space-between">
                <Text color="gray.600">Subtotal</Text>
                <Text fontWeight="500">₹{cartTotal}</Text>
              </Flex>

              {/* DISCOUNT ROW - Visible only when coupon works */}
              {discount > 0 && (
                <Flex justify="space-between" color="green.600">
                  <Text>Discount</Text>
                  <Text fontWeight="500">- ₹{discount}</Text>
                </Flex>
              )}

              <Divider />
              <Box>
                <Flex justify="space-between" mb={2}>
                  <Text color="gray.600">Shipping</Text>
                  <Text color="gray.400" fontSize="xs">Free shipping</Text>
                </Flex>
              </Box>
              <Divider />
              <Flex justify="space-between" align="center">
                <Text fontWeight="bold">Total Price</Text>
                <Text fontWeight="bold" fontSize="xl" color={brandColor}>
                  ₹{cartTotal - discount}
                </Text>
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
              onClick={() => navigate('/checkout', { state: { discount, appliedCode } })}
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