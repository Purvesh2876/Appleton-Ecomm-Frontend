import React, { useEffect, useState } from "react";
import {
    Box, Flex, Image, Text, VStack, Heading, Badge, Icon, Divider,
    Center, Spinner, Container, Stack, useDisclosure,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton,
    Link, HStack, Button, SimpleGrid,
    InputGroup,
    InputLeftElement,
    Input
} from "@chakra-ui/react";
import { MdChevronRight, MdCheckCircle, MdLocalShipping, MdPayment, MdReceipt, MdSearch } from "react-icons/md";
import { Link as RouterLink } from "react-router-dom";
import { getMyOrders } from "../actions/api";

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [totalOrders, setTotalOrders] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [searchTerm, setSearchTerm] = useState(""); // New State

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 5;

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                // Now passing searchTerm to the API
                const { data } = await getMyOrders(currentPage, ordersPerPage, searchTerm);
                if (data.success) {
                    setOrders(data.orders);
                    // Note: Use data.pagination.totalPages if you used the optimized controller
                    setTotalPages(data.pagination?.totalPages || data.totalPages);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        // Add a small delay (debounce) so it doesn't fire on every single keystroke
        const delayDebounceFn = setTimeout(() => {
            fetchOrders();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [currentPage, searchTerm]); // <--- Runs when page OR search changes

    const handleOpenDetails = (order) => {
        setSelectedOrder(order);
        onOpen();
    };

    if (loading) return <Center h="60vh"><Spinner size="xl" color="#A22B21" /></Center>;

    return (
        <Container maxW="container.lg" py={10}>
            <VStack spacing={6} align="stretch">
                <Flex justify="space-between" align="baseline" mb={2}>
                    <Heading size="lg" fontFamily="'Playfair Display', serif">Order History</Heading>
                    {/* Search Bar UI */}
                    <InputGroup maxW={{ base: "full", md: "300px" }}>
                        <InputLeftElement pointerEvents="none">
                            <Icon as={MdSearch} color="gray.400" />
                        </InputLeftElement>
                        <Input
                            placeholder="Search by Order ID..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1); // Reset to page 1 on new search
                            }}
                            bg="white"
                            borderRadius="full"
                        />
                    </InputGroup>
                    <Text fontSize="sm" color="gray.500">{totalOrders} orders placed</Text>
                </Flex>

                {orders.map((order) => (
                    <Box
                        key={order._id}
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="lg"
                        overflow="hidden"
                        bg="white"
                        transition="all 0.2s"
                        _hover={{ shadow: "md" }}
                    >
                        {/* Order Header - Professional Gray Bar */}
                        <Flex
                            bg="gray.50"
                            p={4}
                            justify="space-between"
                            align="center"
                            borderBottom="1px solid"
                            borderColor="gray.200"
                            direction={{ base: "column", sm: "row" }}
                            gap={4}
                        >
                            <HStack spacing={8}>
                                <VStack align="start" spacing={0}>
                                    <Text fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase">Order Placed</Text>
                                    <Text fontSize="sm" fontWeight="medium">{new Date(order.createdAt).toLocaleDateString('en-IN')}</Text>
                                </VStack>
                                <VStack align="start" spacing={0}>
                                    <Text fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase">Total</Text>
                                    <Text fontSize="sm" fontWeight="medium">₹{order.totalAmount}</Text>
                                </VStack>
                            </HStack>
                            <VStack align={{ base: "start", sm: "end" }} spacing={0}>
                                <Text fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase">Order ID # {order._id.slice(-8)}</Text>
                                <Button
                                    variant="link"
                                    size="xs"
                                    colorScheme="blue"
                                    onClick={() => handleOpenDetails(order)}
                                >
                                    View Order Details
                                </Button>
                            </VStack>
                        </Flex>

                        {/* Order Content */}
                        <Box p={4}>
                            <HStack mb={4}>
                                <Icon
                                    as={order.status === "shipped" ? MdLocalShipping : MdCheckCircle}
                                    color={order.status === "shipped" ? "blue.500" : "green.500"}
                                />
                                <Text fontWeight="bold" fontSize="md">
                                    {order.status === "paid" ? "Order Confirmed" : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </Text>
                            </HStack>

                            <Stack spacing={4}>
                                {order.items.map((item, index) => (
                                    <Flex key={index} align="center" justify="space-between">
                                        <HStack spacing={4}>
                                            <Image
                                                src={item.product?.images?.[0] ? `http://localhost:5000/uploads/${item.product.images[0]}` : "https://via.placeholder.com/80"}
                                                boxSize="80px"
                                                objectFit="cover"
                                                borderRadius="md"
                                                border="1px solid"
                                                borderColor="gray.100"
                                            />
                                            <VStack align="start" spacing={1}>
                                                <Text fontWeight="semibold" fontSize="sm" noOfLines={2}>
                                                    {item.product?.name}
                                                </Text>
                                                <Text fontSize="xs" color="gray.500">Quantity: {item.quantity}</Text>
                                                <Badge colorScheme="orange" variant="outline" fontSize="xs">Buy it again</Badge>
                                            </VStack>
                                        </HStack>
                                        <Button
                                            as={RouterLink}
                                            to={`/productDetails/${item.product?._id}`}
                                            size="sm"
                                            variant="outline"
                                            rightIcon={<MdChevronRight />}
                                        >
                                            View Item
                                        </Button>
                                    </Flex>
                                ))}
                            </Stack>
                        </Box>
                    </Box>
                ))}

                {/* --- PAGINATION CONTROLS --- */}
                {totalPages > 1 && (
                    <Flex justify="center" mt={8} gap={2}>
                        <Button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            size="sm"
                        >
                            Previous
                        </Button>
                        {[...Array(totalPages)].map((_, i) => (
                            <Button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                colorScheme={currentPage === i + 1 ? "red" : "gray"}
                                bg={currentPage === i + 1 ? "#A22B21" : "gray.100"}
                                size="sm"
                            >
                                {i + 1}
                            </Button>
                        ))}
                        <Button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            size="sm"
                        >
                            Next
                        </Button>
                    </Flex>
                )}
            </VStack>

            {/* Modal code remains largely same but updated with cleaner spacing */}
            <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
                <ModalOverlay backdropFilter="blur(4px)" />
                <ModalContent borderRadius="lg" shadow="2xl">
                    <ModalHeader borderBottom="1px solid" borderColor="gray.100" fontSize="lg" fontFamily="'Playfair Display', serif">
                        Order Details
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody py={6}>
                        {selectedOrder && (
                            <VStack align="stretch" spacing={6}>

                                {/* 1. Status Timeline (The Pro Touch) */}
                                <Box bg="orange.50" p={4} borderRadius="md" borderLeft="4px solid" borderColor="#A22B21">
                                    <Text fontWeight="bold" fontSize="sm" mb={3} color="#A22B21">Order Journey</Text>
                                    <VStack align="stretch" spacing={4} position="relative">
                                        {selectedOrder.statusHistory && selectedOrder.statusHistory.map((history, idx) => {
                                            const isLast = idx === selectedOrder.statusHistory.length - 1;

                                            return (
                                                <HStack key={idx} align="flex-start" spacing={4}>
                                                    <VStack spacing={0} align="center">
                                                        <Icon
                                                            as={MdCheckCircle}
                                                            // Highlight the last status (the most recent one)
                                                            color={isLast ? "#A22B21" : "gray.400"}
                                                            boxSize={isLast ? 5 : 4} // Make the current status slightly larger
                                                            zIndex={1}
                                                            bg="orange.50"
                                                        />
                                                        {/* Only draw the line if it's NOT the last element */}
                                                        {!isLast && (
                                                            <Box w="1.5px" h="25px" bg="gray.300" />
                                                        )}
                                                    </VStack>
                                                    <Box lineHeight="tight">
                                                        <Text
                                                            fontSize="sm"
                                                            fontWeight={isLast ? "bold" : "medium"}
                                                            color={isLast ? "black" : "gray.600"}
                                                            textTransform="capitalize"
                                                        >
                                                            {history.status}
                                                        </Text>
                                                        <Text fontSize="xs" color="gray.500">
                                                            {new Date(history.timestamp).toLocaleString('en-IN', {
                                                                dateStyle: 'medium',
                                                                timeStyle: 'short'
                                                            })}
                                                        </Text>
                                                        {history.comment && (
                                                            <Text fontSize="xs" color="gray.500" fontStyle="italic" mt={1}>
                                                                "{history.comment}"
                                                            </Text>
                                                        )}
                                                    </Box>
                                                </HStack>
                                            );
                                        })}
                                    </VStack>
                                </Box>

                                {/* 2. Shipping Section */}
                                <Box>
                                    <HStack mb={2} color="gray.700">
                                        <Icon as={MdLocalShipping} />
                                        <Text fontWeight="bold" fontSize="sm">Delivery Address</Text>
                                    </HStack>
                                    <Box pl={6}>
                                        <Text fontSize="sm" fontWeight="semibold">{selectedOrder.shippingInfo.name}</Text>
                                        <Text fontSize="sm" color="gray.600">
                                            {selectedOrder.shippingInfo.address}, {selectedOrder.shippingInfo.city}
                                        </Text>
                                        <Text fontSize="sm" color="gray.600">
                                            {selectedOrder.shippingInfo.state} - {selectedOrder.shippingInfo.pincode}
                                        </Text>
                                        <Text fontSize="sm" color="gray.600">Phone: {selectedOrder.shippingInfo.phone}</Text>
                                    </Box>
                                </Box>

                                <Divider />

                                {/* 3. Items List */}
                                <Box>
                                    <Text fontWeight="bold" fontSize="sm" mb={3}>Order Summary</Text>
                                    {selectedOrder.items.map((item, idx) => (
                                        <Flex key={idx} mb={4} align="center" justify="space-between">
                                            <HStack spacing={4}>
                                                <Image
                                                    src={`http://localhost:5000/uploads/${item.product?.images?.[0]}`}
                                                    boxSize="50px"
                                                    objectFit="cover"
                                                    borderRadius="md"
                                                    fallbackSrc="https://via.placeholder.com/50"
                                                />
                                                <VStack align="start" spacing={0}>
                                                    <Link
                                                        as={RouterLink}
                                                        to={`/productDetails/${item.product?._id}`}
                                                        fontWeight="bold"
                                                        fontSize="xs"
                                                        color="#A22B21"
                                                        _hover={{ textDecoration: "underline" }}
                                                    >
                                                        {item.product?.name}
                                                    </Link>
                                                    <Text fontSize="xs" color="gray.500">Qty: {item.quantity} x ₹{item.priceAtOrder}</Text>
                                                </VStack>
                                            </HStack>
                                            <Text fontWeight="bold" fontSize="sm">₹{item.totalPrice}</Text>
                                        </Flex>
                                    ))}
                                </Box>

                                <Divider />

                                {/* 4. Payment Summary */}
                                <Box bg="gray.50" p={4} borderRadius="md" border="1px dashed" borderColor="gray.300">
                                    <HStack mb={3}>
                                        <Icon as={MdPayment} color="gray.600" />
                                        <Text fontWeight="bold" fontSize="sm">Payment Details</Text>
                                    </HStack>
                                    <VStack spacing={2} align="stretch">
                                        <Flex justify="space-between" fontSize="sm">
                                            <Text color="gray.600">Subtotal</Text>
                                            <Text>₹{selectedOrder.totalAmount}</Text>
                                        </Flex>
                                        <Flex justify="space-between" fontSize="sm">
                                            <Text color="gray.600">Shipping</Text>
                                            <Text color="green.500">FREE</Text>
                                        </Flex>
                                        <Divider />
                                        <Flex justify="space-between" fontSize="md" fontWeight="bold">
                                            <Text>Total Paid</Text>
                                            <Text color="#A22B21">₹{selectedOrder.totalAmount}</Text>
                                        </Flex>
                                        <Text fontSize="10px" color="gray.400" mt={2} textAlign="center">
                                            Transaction ID: {selectedOrder.razorpayOrderId}
                                        </Text>
                                    </VStack>
                                </Box>
                            </VStack>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
            {/* ... Keep your Modal code here ... */}
        </Container>
    );
};

export default MyOrders;