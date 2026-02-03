import React, { useEffect, useState } from "react";
import {
  Flex, Box, Image, Heading, Text, Button, Stack, useToast,
  Badge, HStack, Divider, IconButton, VStack, Container, Center, SimpleGrid,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody
} from "@chakra-ui/react";
import { useParams, Link as RouterLink, useNavigate } from "react-router-dom";
import {
  FaFacebookF, FaTwitter, FaEnvelope, FaPinterestP,
  FaLinkedinIn, FaWhatsapp, FaTelegramPlane, FaRegHeart,
  FaExpand,
  FaDownload
} from "react-icons/fa";
import { addToCartt, addToWishlistt, getAllProducts, getSingleProductData } from "../../actions/api";
import ProductReviews from "../../components/ProductReviews";

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [imagee, setImagee] = useState("");
  const [isAddedToWishlist, setIsAddedToWishlist] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure(); // For Lightbox
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        // const response = await fetch(`http://localhost:5000/api/products/${productId}`);
        const data = await getSingleProductData(productId);
        const p = data.product || data;
        setProduct(p);
        setImagee(`http://localhost:5000/uploads${p.images[0]}`);
        if (p?.category?._id) {
          fetchRelatedProducts(p.category._id, p._id);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProductData();
    window.scrollTo(0, 0);
  }, [productId]);

  const fetchRelatedProducts = async (categoryId, productId) => {
    try {
      const res = await getAllProducts({
        category: categoryId,
        exclude: productId,
        limit: 4,
      });
      console.log('related products', res)
      setRelatedProducts(res.products || []);
    } catch (error) {
      console.error("Error fetching related products", error);
    }
  };


  const handleAddToCart = async () => {
    try {
      await addToCartt(product._id, quantity);
      toast({ title: "Added to cart", status: "success", duration: 2000 });
    } catch (err) {
      toast({ title: "Error adding to cart", status: "error" });
    }
  };

  // Digital Zoom Logic
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    e.target.style.transformOrigin = `${x}% ${y}%`;
    e.target.style.transform = "scale(2.5)"; // Deep zoom level
  };

  const handleMouseLeave = (e) => {
    e.target.style.transform = "scale(1)";
    e.target.style.transformOrigin = "center";
  };

  const AddToWishlist = async (id) => {
    try {
      const response = await addToWishlistt(id);
      setIsAddedToWishlist(true);
      toast({ title: response.data.message, status: "success", duration: 2000 });
    } catch (err) {
      toast({ title: err.message, status: "error" });
    }
  };


  // Download Image Logic
  // const downloadImage = async () => {
  //   try {
  //     // Fetch the image as a blob to bypass cross-origin browser behavior
  //     const response = await fetch(imagee);
  //     const blob = await response.blob();

  //     // Create a local URL for the blob
  //     const url = window.URL.createObjectURL(blob);

  //     const link = document.createElement("a");
  //     link.href = url;

  //     // Clean up filename (e.g., "Premium-Almonds.jpg")
  //     const fileName = `${product.name.replace(/\s+/g, '-').toLowerCase()}.jpg`;
  //     link.setAttribute('download', fileName);

  //     document.body.appendChild(link);
  //     link.click();

  //     // Cleanup
  //     document.body.removeChild(link);
  //     window.URL.revokeObjectURL(url);
  //   } catch (error) {
  //     console.error("Download failed:", error);
  //     toast({
  //       title: "Download failed",
  //       description: "Could not download the image due to server restrictions.",
  //       status: "error",
  //       duration: 3000,
  //     });
  //   }
  // };

  if (!product) return <Center h="60vh"><Text>Loading...</Text></Center>;

  return (
    <Container maxW="1400px" py={{ base: 4, md: 10 }} fontFamily={'Outfit'}>

      <Flex direction={{ base: "column", lg: "row" }} gap={{ base: 8, lg: 16 }}>
        {/* Left Side: Gallery Logic */}
        <Flex direction={{ base: "column-reverse", md: "row" }} flex="1.2" gap={4}>
          {/* Vertical Thumbnails */}
          <VStack spacing={3} align="center" display={{ base: "flex", md: "block" }}>
            <Flex direction={{ base: "row", md: "column" }} gap={3}>
              {product.images.map((img, i) => (
                <Box
                  key={i}
                  border="1px solid"
                  borderColor={imagee.includes(img) ? "#A22B21" : "gray.200"}
                  cursor="pointer"
                  onClick={() => setImagee(`http://localhost:5000/uploads${img}`)}
                  boxSize={{ base: "60px", md: "80px" }}
                >
                  <Image src={`http://localhost:5000/uploads${img}`} w="full" h="full" objectFit="contain" />
                </Box>
              ))}
            </Flex>
          </VStack>

          {/* Main Large Image */}
          <Box flex="1" position="relative" overflow="hidden" bg="white">
            <Image
              src={imagee}
              w="full"
              h={{ base: "300px", md: "550px" }}
              objectFit="contain"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={onOpen} // Open Fullscreen Modal
              transition="transform 0.1s ease-out"
            />
          </Box>
        </Flex>

        {/* Right Side: Product Info */}
        <Box flex="1">
          {/* 1. Breadcrumbs */}
          <HStack fontSize="md" color="gray.500" mb={2} spacing={2} wrap="wrap">
            <RouterLink to="/">Home</RouterLink> <Text>/</Text>
            <RouterLink to="/allproducts">Products</RouterLink> <Text>/</Text>
            <RouterLink to={`/allproducts?category=${product.category?._id}`}>{product.category?.name}</RouterLink> <Text>/</Text>
            <Text color="black" fontWeight="bold">{product.name}</Text>
          </HStack>
          <Heading size="xl" mb={2} fontFamily="'Playfair Display', serif">{product.name}</Heading>

          <Text fontSize="2xl" color="#A22B21" fontWeight="bold" mb={4}>
            ₹{product.price}.00 <Text as="span" color="gray.400" fontWeight="400" fontSize="lg">/ {product.weight} {product.unit}</Text>
          </Text>

          {/* Quantity and Actions */}
          <Stack direction={{ base: "column", sm: "row" }} spacing={4} mb={6} align="center">
            <HStack border="1px solid #E2E8F0" p={1} bg="white">
              <Button variant="ghost" size="md" onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)}>−</Button>
              <Text fontWeight="bold" px={4}>{quantity}</Text>
              <Button variant="ghost" size="md" onClick={() => setQuantity(q => q + 1)}>+</Button>
            </HStack>

            <Button
              bg="#A22B21"
              color="white"
              flex="1"
              _hover={{ bg: "#802219" }}
              borderRadius="none"
              onClick={handleAddToCart}
              fontSize="sm"
              height="48px"
            >
              ADD TO CART
            </Button>

            <Button
              variant="outline"
              height="48px"
              size="sm"
              py={1}
              px={4}
              onClick={() => AddToWishlist(product._id)}
              _hover={{ bg: "transparent", color: "#A22B21" }}
              borderRadius="none"
            >
              {isAddedToWishlist ? <FaRegHeart fill="#A22B21" /> : <FaRegHeart />}
            </Button>
          </Stack>

          <Divider mb={4} />

          <Text fontWeight="bold" mb={2} fontSize="sm">
            Category: <Text as="span" color="gray.500" fontWeight="normal">{product.category?.name}</Text>
          </Text>

          {/* Social Share Section */}
          <HStack spacing={3} mb={4}>
            <Text fontWeight="bold" fontSize="sm">Share:</Text>
            {[
              { icon: <FaFacebookF />, color: "#3b5998" },
              { icon: <FaTwitter />, color: "#1da1f2" },
              { icon: <FaEnvelope />, color: "#EA4335" },
              { icon: <FaPinterestP />, color: "#bd081c" },
              { icon: <FaLinkedinIn />, color: "#0077b5" },
              { icon: <FaWhatsapp />, color: "#25d366" },
              { icon: <FaTelegramPlane />, color: "#0088cc" }
            ].map((social, i) => (
              <IconButton
                key={i}
                icon={social.icon}
                size="xs"
                borderRadius="full"
                bg={social.color}
                color="white"
                _hover={{ opacity: 0.8 }}
              />
            ))}
          </HStack>

          <Text color="gray.600" fontSize="sm" lineHeight="1.8" mb={4}>
            {product.description}
          </Text>

          {/* Guaranteed Checkout Section (Design Matching Figma) */}
          <Box
            border="1px dashed"
            borderColor="gray.300"
            p={6}
            pt={8}
            textAlign="center"
            borderRadius="md"
            position="relative"
          >
            <Text
              fontSize="xs"
              fontWeight="bold"
              position="absolute"
              top="-10px"
              left="50%"
              transform="translateX(-50%)"
              bg="white"
              px={4}
              color="gray.500"
              letterSpacing="wider"
            >
              Guaranteed Safe Checkout
            </Text>
            {/* Payment Icons */}
            <HStack justify="center" spacing={4} wrap="wrap">
              {/* Replace with actual payment SVG icons or a single sprite image */}
              <Image src="/images/paymentoptions.webp" h="35px" alt="Payment Methods" />
            </HStack>
          </Box>
        </Box>
      </Flex>

      <ProductReviews
        productId={product._id}
        ratingsAverage={product.ratingsAverage}
        ratingsCount={product.ratingsCount}
        mt={10}
      />

      {relatedProducts.length > 0 && (
        <Box mt={20}>
          <Text
            fontSize="lg"
            fontWeight="bold"
            mb={6}
            textTransform="uppercase"
            letterSpacing="wide"
          >
            Related Products
          </Text>

          <SimpleGrid
            columns={{ base: 1, sm: 2, md: 4 }}
            spacing={6}
          >
            {relatedProducts.map((item) => (
              <Box
                key={item._id}
                bg="white"
                cursor="pointer"
                onClick={() =>
                  navigate(`/productdetails/${item._id}`)
                }
              >
                {/* IMAGE */}
                <Box
                  bg="gray.50"
                  aspectRatio={1}
                  overflow="hidden"
                  onMouseEnter={() => setHoveredId(item._id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <Image
                    src={`http://localhost:5000/uploads${hoveredId === item._id && item.images[1]
                      ? item.images[1]
                      : item.images[0]
                      }`}
                    alt={item.name}
                    w="100%"
                    h="100%"
                    objectFit="contain"
                    transition="0.3s ease"
                  />
                </Box>

                {/* DETAILS */}
                <VStack
                  align="start"
                  spacing={1}
                  mt={3}
                >
                  <Text
                    fontWeight={500}
                    fontSize="sm"
                    noOfLines={2}
                  >
                    {item.name}
                  </Text>

                  <Text
                    fontSize="xs"
                    color="gray.500"
                  >
                    {item.category?.name}
                  </Text>

                  <Text
                    fontWeight="bold"
                    color="#A22B21"
                    fontSize="sm"
                  >
                    ₹{item.price}{" "}
                    <Text
                      as="span"
                      fontWeight="normal"
                      color="gray.400"
                    >
                      / {item.weight}
                      {item.unit}
                    </Text>
                  </Text>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      )}


      {/* --- FULLSCREEN LIGHTBOX MODAL --- */}
      <Modal isOpen={isOpen} onClose={onClose} size="full" allowPaging={false}>
        <ModalOverlay bg="blackAlpha.900" />
        <ModalContent bg="black" color="white" m={0} p={0}>
          <ModalCloseButton zIndex={10} bg="whiteAlpha.200" color="white" _hover={{ bg: "whiteAlpha.400" }} />

          <HStack position="absolute" top={4} left={4} spacing={4} zIndex={10}>
            <IconButton icon={<FaExpand />} onClick={() => document.documentElement.requestFullscreen()} variant="ghost" color="white" aria-label="Fullscreen" />
            {/* <IconButton icon={<FaDownload />} onClick={downloadImage} variant="ghost" color="white" aria-label="Download" /> */}
          </HStack>

          <ModalBody display="flex" justifyContent="center" alignItems="center" p={0}>
            <Box maxW="90%" maxH="90vh" overflow="auto">
              <Image
                src={imagee}
                maxH="85vh"
                objectFit="contain"
                transition="all 0.3s"
                _active={{ transform: "scale(1.5)", cursor: "zoom-out" }}
                cursor="zoom-in"
              />
            </Box>
          </ModalBody>

          <Center pb={6}>
            <Text fontSize="sm" letterSpacing="widest">{product.name.toUpperCase()}</Text>
          </Center>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default ProductDetails;