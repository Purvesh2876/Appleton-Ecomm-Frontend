import React, { useState } from "react";
import {
  Box,
  Text,
  Stack,
  Button,
  Flex,
  Image,
  IconButton,
  useToast,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";
import { addToCartt } from "../actions/api";

const ProductCard = ({ product, wishlistIds, toggleWishlist, hoveredProductId, handleHover, handleHoverOut, handleMouseDown, handleMouseMove, handleCardClick }) => {
  // EACH CARD NOW HAS ITS OWN INDEPENDENT STATE
  const [quantity, setQuantity] = useState(1);
  const toast = useToast();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleAddToCart = async () => {
    try {
      await addToCartt(product._id, quantity);
      toast({ title: "Added to cart", status: "success", duration: 2000 });
    } catch (err) {
      toast({ title: "Error adding to cart", status: "error" });
    }
  };

  const increaseQty = () => setQuantity((q) => q + 1);
  const decreaseQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  return (
    <Box px={2}>
      <Box
        p={0}
        borderRadius="5"
        bg="white"
        role="group" // Required for the hover animation
        position="relative"
        transition="all 0.3s"
      >
        <Link
          to={`/productdetails/${product._id}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onClick={handleCardClick}
        >
          <Box
            position="relative"
            overflow="hidden"
            borderRadius="sm"
            bg="white"
            aspectRatio={1}
            p={{ base: 0.5, md: 1 }}   // 👈 controlled bezel
          >

            {/* WISHLIST ANIMATION: Fade in and Slide from right */}
            <Box
              position="absolute"
              top="15px"
              right="15px"
              zIndex={2}
              transition="all 0.3s ease-in-out"
              opacity={0}
              transform="translateX(5px)"
              _groupHover={{ opacity: 1, transform: "translateX(0)" }}
            >
              <IconButton
                aria-label="Wishlist"
                size="sm"
                isRound
                bg="white"
                boxShadow="md"
                _hover={{ bg: "gray.50", transform: "scale(1.1)" }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleWishlist(product._id);
                }}
                icon={
                  wishlistIds?.includes(product._id) ? (
                    <FaHeart color="#9E2B20" size={18} />
                  ) : (
                    <FaRegHeart size={18} />
                  )
                }
              />
            </Box>

            <Image
              src={`http://localhost:5000/uploads${hoveredProductId === product._id
                ? product.images[1]
                : product.images[0]
                }`}
              alt={product.name}
              w="100%"
              h="100%"
              objectFit="cover"
              transform="scale(0.95)"     // 👈 key line
              transition="0.3s ease"
              onMouseEnter={() => handleHover(product._id)}
              onMouseLeave={handleHoverOut}
            />
          </Box>
        </Link>

        <Stack spacing={1} px={3} pb={3} align="left">
          <Text
            fontSize={{ base: "sm", md: "xl" }}
            fontWeight={500}
            noOfLines={2}
            fontFamily="'Outfit', sans-serif"
          >
            {product.name}
          </Text>

          <Text fontSize={{ base: "sm", md: "md" }} fontStyle="italic">
            <span
              style={{
                padding: "0 7px",
                borderRadius: "4px",
                background: "linear-gradient(90deg, #ffa34e 0%, rgb(255,233,182) 50%, #ffa34e 100%)",
              }}
            >
              {product.category?.name}
            </span>
          </Text>

          <Text fontSize={{ base: "md", md: "lg" }} fontWeight={500}>
            ₹ {product.price} / {product.weight}{product.unit}
          </Text>

          <Flex mt={3} align="center" gap={2}>
            <Flex
              align="center"
              border="1px solid #ddd"
              borderRadius="8px"
              overflow="hidden"
            >
              <Button size="sm" variant="ghost" onClick={decreaseQty}>−</Button>
              <Text px={3} fontWeight={600}>{quantity}</Text>
              <Button size="sm" variant="ghost" onClick={increaseQty}>+</Button>
            </Flex>

            <Button
              flex={1}
              bg="#9E2B20"
              color="white"
              _hover={{ bg: "#7f2219" }}
              // borderRadius="8px"
              size="sm"
              onClick={() => handleAddToCart(product._id, quantity)}
            >
              {isMobile ? <FaShoppingCart /> : "ADD TO CART"}
            </Button>
          </Flex>
        </Stack>
      </Box>
    </Box>
  );
};

export default ProductCard;