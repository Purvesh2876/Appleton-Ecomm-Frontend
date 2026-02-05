import React, { useState, useEffect } from "react";
import {
    Box,
    Grid,
    Flex,
    Text,
    Select,
    Input,
    VStack,
    HStack,
    Button,
    Image,
    Heading,
    SimpleGrid,
    Badge,
    Divider,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    useToast,
    IconButton
} from "@chakra-ui/react";
import { BsGridFill } from "react-icons/bs";
import { BsListUl } from "react-icons/bs";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAllProducts, getAllCategories, addToCartt } from "../actions/api";

const ShopPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState(0);
    const [categories, setCategories] = useState([]);
    const [cartLoading, setCartLoading] = useState({});
    const [quantities, setQuantities] = useState({});
    const [mobileSort, setMobileSort] = useState("");
    const [viewMode, setViewMode] = useState("grid"); // New state for view mode
    const [priceRange, setPriceRange] = useState({
        min: 0,
        max: 0,
    });

    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const navigate = useNavigate();

    const brandColor = "#A22B21";
    const currentCategoryId = searchParams.get("category");
    const currentSearch = searchParams.get("search") || "";

    /* ---------------- FETCH DATA ---------------- */
    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        fetchFilteredProducts();
    }, [searchParams]);

    const fetchInitialData = async () => {
        const cats = await getAllCategories();
        setCategories(cats || []);
    };

    const fetchFilteredProducts = async () => {
        const params = Object.fromEntries([...searchParams]);
        const cleanFilters = {};

        Object.keys(params).forEach((key) => {
            const value = params[key];
            if (value && typeof value === "string") {
                cleanFilters[key] = value;
            }
        });

        const response = await getAllProducts(cleanFilters);
        setAllProducts(response?.globalTotalProducts);
        setProducts(response?.products || []);
    };

    /* ---------------- HELPERS ---------------- */
    const updateFilters = (key, value) => {
        const newParams = new URLSearchParams(searchParams);
        value ? newParams.set(key, value) : newParams.delete(key);
        setSearchParams(newParams);
    };

    const handleQtyChange = (id, type) => {
        setQuantities((prev) => ({
            ...prev,
            [id]:
                type === "inc"
                    ? (prev[id] || 1) + 1
                    : Math.max(1, (prev[id] || 1) - 1),
        }));
    };

    const handleAddToCart = async (product) => {
        const qty = quantities[product._id] || 1;
        setCartLoading((prev) => ({ ...prev, [product._id]: true }));

        try {
            await addToCartt(product._id, qty);
            toast({
                title: "Added to Cart",
                description: `${qty} x ${product.name}`,
                status: "success",
                duration: 2000,
                position: "bottom-right",
            });
        } catch (err) {
            toast({
                title: "Failed",
                description: err.response?.data?.message || "Please login first",
                status: "error",
            });
        } finally {
            setCartLoading((prev) => ({ ...prev, [product._id]: false }));
        }
    };

    /* ---------------- UI ---------------- */
    return (
        <Box maxW="1500px" mx="auto" p={5} pb={{ base: "70px", md: 5 }}>
            {/* HEADER */}
            <VStack align="start" mb={1} spacing={4}>
                <Heading size="lg">Dry Fruits</Heading>
                <Text color="gray.600">
                    Discover our premium selection of handpicked quality nuts.
                </Text>

                {/* CATEGORY NAV (UNCHANGED) */}
                <HStack
                    spacing={10}
                    overflowX="auto"
                    pt={2}
                    w="full"
                    pb={2}
                >
                    {/* ALL PRODUCTS */}
                    <VStack
                        cursor="pointer"
                        align="start"
                        spacing={0}
                        minW="100px"
                        onClick={() => updateFilters("category", null)}
                    >
                        <Text
                            fontWeight={!currentCategoryId ? "bold" : "normal"}
                            color={!currentCategoryId ? brandColor : "black"}
                        >
                            All Products
                        </Text>
                        {!currentCategoryId && (
                            <Box h="2px" w="full" bg={brandColor} mt={1} />
                        )}
                        <Text fontSize="sm" color="gray.500">
                            {allProducts} Products
                        </Text>
                    </VStack>

                    {/* CATEGORY LIST */}
                    {categories.map((cat) => {
                        const isActive = currentCategoryId === cat._id;

                        return (
                            <VStack
                                key={cat._id}
                                cursor="pointer"
                                align="start"
                                spacing={0}
                                // minW="120px"
                                onClick={() => updateFilters("category", cat._id)}
                            >
                                <Text
                                    fontWeight={isActive ? "bold" : "normal"}
                                    color={isActive ? brandColor : "black"}
                                >
                                    {cat.name}
                                </Text>
                                {isActive && (
                                    <Box h="2px" w="full" bg={brandColor} mt={1} />
                                )}
                                <Text fontSize="sm" color="gray.500">
                                    {cat.productCount} Products
                                </Text>

                            </VStack>
                        );
                    })}
                </HStack>

            </VStack>
            <hr />

            {/* MAIN GRID (DESKTOP SAME) */}
            <Grid
                templateColumns={{ base: "1fr", md: "250px 1fr" }}
                gap={10}
                mt={5}
            > {/* SIDEBAR (DESKTOP ONLY) */}
                <VStack
                    align="start"
                    spacing={6}
                    display={{ base: "none", md: "flex" }}
                >
                    <Box w="full">
                        <Text fontWeight="normal" my={1} fontFamily={'Outfit'} fontSize={'lg'}>
                            Search
                        </Text>
                        <Input
                            placeholder="Search products..."
                            value={currentSearch}
                            fontSize={'xs'}
                            onChange={(e) => updateFilters("search", e.target.value)}
                            borderRadius={'none'}
                        />
                    </Box>

                    <Box w="full">
                        <Text fontWeight="normal" fontSize={'lg'}>
                            Filter By Price
                        </Text>

                        {/* PRICE SLIDER */}
                        <Input
                            type="range"
                            min="0"
                            max="1000"
                            step="10"
                            value={searchParams.get("maxPrice") || 540}
                            onChange={(e) => updateFilters("maxPrice", e.target.value)}
                            sx={{
                                WebkitAppearance: "none",
                                appearance: "none",
                                height: "2px",
                                bg: "red.700",
                                borderRadius: "full",
                                outline: "none",

                                "&::-webkit-slider-thumb": {
                                    WebkitAppearance: "none",
                                    appearance: "none",
                                    width: "14px",
                                    height: "14px",
                                    bg: "red.700",
                                    borderRadius: "full",
                                    cursor: "pointer",
                                },

                                "&::-moz-range-thumb": {
                                    width: "14px",
                                    height: "14px",
                                    bg: "red.700",
                                    borderRadius: "full",
                                    cursor: "pointer",
                                },
                            }}
                        />

                        {/* PRICE LABEL + BUTTON */}
                        <Flex justify="space-between" align="center" mt={2}>
                            <Text fontWeight="normal" color={'gray.500'} fontSize={'sm'}>
                                Price: ₹0 — ₹{searchParams.get("maxPrice") || 540}
                            </Text>

                            {/* <Button
                                size="sm"
                                bg="#A22B21"
                                color="white"
                                _hover={{ bg: "#8f241b" }}
                                onClick={() =>
                                    updateFilters("maxPrice", searchParams.get("maxPrice") || 540)
                                }
                            >
                                Filter
                            </Button> */}
                        </Flex>
                    </Box>


                    <Box w="full">
                        <Text fontWeight="normal" my={1} fontFamily={'Outfit'} fontSize={'lg'}>
                            Product Categories
                        </Text>
                        <VStack align="start" spacing={1}>
                            <Text
                                cursor="pointer"
                                fontWeight={!currentCategoryId ? "bold" : "normal"}
                                color={!currentCategoryId ? brandColor : "gray.700"}
                                onClick={() => updateFilters("category", null)}
                            >
                                All Categories
                            </Text>

                            {categories.map((cat) => (
                                <Box
                                    key={cat._id}
                                    align="start"
                                    spacing={0}
                                    cursor="pointer"
                                    onClick={() => updateFilters("category", cat._id)}
                                    display={'flex'}
                                    justifyContent={'space-between'}
                                    w={'100%'}
                                >
                                    <Text
                                        fontWeight={currentCategoryId === cat._id ? "bold" : "normal"}
                                        color={currentCategoryId === cat._id ? 'black' : "gray.600"}
                                    >
                                        {cat.name}
                                    </Text>

                                    <Text fontSize="sm" color={currentCategoryId === cat._id ? 'white' : 'gray.500'} bgColor={currentCategoryId === cat._id ? brandColor : 'white'} px={3} borderRadius={'lg'} border={'1px solid'}>
                                        {cat.productCount}
                                    </Text>
                                </Box>
                            ))}
                        </VStack>
                    </Box>
                </VStack>

                {/* PRODUCTS */}
                <Box className="helloooo">
                    <Flex
                        justify="space-between"
                        align="center"
                        mb={6}
                        px={5}
                        py={3}
                        bg="gray.50"
                        border="1px solid"
                        borderColor="gray.200"
                    // borderRadius="xl"
                    >
                        <Text color="black" fontFamily={'Playfair Display'}>
                            Showing {products.length} results
                        </Text>

                        <HStack>
                            {/* VIEW TOGGLE BUTTONS */}
                            <HStack spacing={1} display={{ base: "none", md: "flex" }}>
                                <IconButton
                                    icon={<BsGridFill />}
                                    variant={viewMode === "grid" ? "solid" : "ghost"}
                                    // colorScheme={viewMode === "grid" ? "red" : "gray"}
                                    // bg={viewMode === "grid" ? brandColor : "transparent"}
                                    border={viewMode === "grid" ? "1px solid #A22B21" : "noneghost"}
                                    onClick={() => setViewMode("grid")}
                                    size="sm"
                                    aria-label="Grid View"
                                />
                                <IconButton
                                    icon={<BsListUl />}
                                    variant={viewMode === "list" ? "solid" : "ghost"}
                                    border={viewMode === "list" ? "1px solid #A22B21" : "noneghost"}
                                    onClick={() => setViewMode("list")}
                                    size="sm"
                                    aria-label="List View"
                                />
                            </HStack>

                            <Select
                                w="220px"
                                fontSize="sm"
                                borderRadius="md"
                                borderColor="gray.300"
                                fontFamily={'Outfit'}
                                _focus={{ borderColor: brandColor }}
                                display={{ base: "none", md: "block" }}
                                onChange={(e) => updateFilters("sort", e.target.value)}
                            >
                                <option value="priceLowHigh">
                                    Sort by price: low to high
                                </option>
                                <option value="priceHighLow">
                                    Sort by price: high to low
                                </option>
                            </Select>
                        </HStack>
                    </Flex>

                    <SimpleGrid
                        columns={viewMode === "grid" ? [1, 2, 3, 4] : 1}
                        spacing={6}
                    >
                        {products.map((product) => (
                            <Flex
                                key={product._id}
                                direction={viewMode === "grid" ? "column" : "row"} // Switches layout direction
                                border="1px"
                                borderColor="gray.100"
                                overflow="hidden"
                                _hover={{ shadow: "md" }}
                                p={viewMode === "list" ? 4 : 0} // Add padding only in list view
                                align={viewMode === "list" ? "center" : "stretch"}
                            >
                                {/* PRODUCT IMAGE */}
                                <Box
                                    position="relative"
                                    cursor="pointer"
                                    overflow="hidden"
                                    role="group"
                                    minW={viewMode === "list" ? "150px" : "full"} // Fixed width in list mode
                                    maxW={viewMode === "list" ? "150px" : "full"}
                                    onClick={() => navigate(`/productDetails/${product._id}`)}
                                // onClick={() => {
                                //     if (product.stock <= 0) return;
                                //     navigate(`/productDetails/${product._id}`)
                                // }}
                                >
                                    <Image
                                        src={`${process.env.REACT_APP_API_URL}uploads${product.images[0]}`}
                                        w="full"
                                        h={viewMode === "list" ? "150px" : "auto"}
                                        objectFit="cover"
                                        transition="transform 0.4s ease"
                                        _groupHover={{ transform: "scale(1.1)" }}
                                    />
                                    {product.stock <= 0 && (
                                        <Badge position="absolute" top={2} left={2} colorScheme="red">SOLD OUT</Badge>
                                    )}
                                </Box>

                                {/* PRODUCT DETAILS */}
                                <VStack
                                    p={4}
                                    align="start"
                                    spacing={1}
                                    flex={1}
                                    ml={viewMode === "list" ? 6 : 0}
                                >
                                    <Text fontWeight="normal" noOfLines={1} fontFamily={'Outfit'}>
                                        {product.name}
                                    </Text>
                                    <Badge colorScheme="orange">
                                        {product.category?.name}
                                    </Badge>
                                    <Text color="red.600" fontWeight="bold">
                                        ₹{product.price}
                                    </Text>

                                    {/* ADD TO CART SECTION (Code stays here once) */}
                                    <HStack w="full" mt={2} maxW={viewMode === "list" ? "300px" : "full"}>
                                        <HStack border="1px solid" borderColor="gray.200" borderRadius="md" px={2} py={1}>
                                            <Button variant="ghost" size="xs" onClick={() => handleQtyChange(product._id, "dec")}>-</Button>
                                            <Text fontSize="sm">{quantities[product._id] || 1}</Text>
                                            <Button variant="ghost" size="xs" onClick={() => handleQtyChange(product._id, "inc")}>+</Button>
                                        </HStack>
                                        <Button
                                            bg={brandColor}
                                            color="white"
                                            size="sm"
                                            flex={1}
                                            isLoading={cartLoading[product._id]}
                                            onClick={() => handleAddToCart(product)}
                                        // isDisabled={product.stock <= 0}
                                        >
                                            Add To Cart
                                        </Button>
                                    </HStack>
                                </VStack>
                            </Flex>
                        ))}
                    </SimpleGrid>
                </Box>
            </Grid>

            {/* MOBILE FILTER / SORT BAR */}
            <Box
                display={{ base: "flex", md: "none" }}
                position="fixed"
                bottom={0}
                left={0}
                right={0}
                bg="white"
                borderTop="1px solid"
                borderColor="gray.200"
                zIndex={1000}
            >
                <Button flex={1} variant="ghost" onClick={onOpen}>
                    Filters
                </Button>
                <Divider orientation="vertical" />
                <Button flex={1} variant="ghost" onClick={onOpen}>
                    Sort
                </Button>
            </Box>

            {/* MOBILE DRAWER */}
            <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent borderTopRadius="20px">
                    <DrawerCloseButton />
                    <DrawerHeader>Filters & Sort</DrawerHeader>

                    <DrawerBody>
                        <Text fontWeight="bold" mb={2}>
                            Sort By
                        </Text>
                        <Select
                            mb={6}
                            value={mobileSort}
                            onChange={(e) => {
                                setMobileSort(e.target.value);
                                updateFilters("sort", e.target.value);
                            }}
                        >
                            <option value="">Default</option>
                            <option value="priceLowHigh">
                                Price: Low to High
                            </option>
                            <option value="priceHighLow">
                                Price: High to Low
                            </option>
                        </Select>

                        <Text fontWeight="bold" mb={2}>
                            Price
                        </Text>
                        <Input
                            type="range"
                            min="0"
                            max="1000"
                            step="10"
                            mb={2}
                            onChange={(e) => updateFilters("maxPrice", e.target.value)}
                        />
                        <Text mb={6}>
                            ₹0 — ₹{searchParams.get("maxPrice") || 1000}
                        </Text>

                        <Text fontWeight="bold" mb={2}>
                            Categories
                        </Text>
                        <VStack align="start" spacing={2}>
                            <Text
                                cursor="pointer"
                                fontWeight={!currentCategoryId ? "bold" : "normal"}
                                color={!currentCategoryId ? brandColor : "gray.700"}
                                onClick={() => updateFilters("category", null)}
                            >
                                All Categories
                            </Text>

                            {categories.map((cat) => (
                                <Box
                                    key={cat._id}
                                    align="start"
                                    spacing={0}
                                    cursor="pointer"
                                    onClick={() => updateFilters("category", cat._id)}
                                    display={'flex'}
                                    justifyContent={'space-between'}
                                    w={'100%'}
                                >
                                    <Text
                                        fontWeight={currentCategoryId === cat._id ? "bold" : "normal"}
                                        color={currentCategoryId === cat._id ? 'black' : "gray.600"}
                                    >
                                        {cat.name}
                                    </Text>

                                    <Text fontSize="sm" color={currentCategoryId === cat._id ? 'white' : 'gray.500'} bgColor={currentCategoryId === cat._id ? brandColor : 'white'} px={3} borderRadius={'lg'} border={'1px solid'}>
                                        {cat.productCount}
                                    </Text>
                                </Box>
                            ))}
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Box>
    );
};

export default ShopPage;
