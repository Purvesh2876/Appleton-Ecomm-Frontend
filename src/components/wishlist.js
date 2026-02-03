import React, { useEffect, useState } from 'react';
import {
  Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton,
  DrawerHeader, DrawerBody, Box, Image, Button, Text,
  Divider, HStack, VStack, Stack, useToast, Spinner, Center
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { MdAddShoppingCart } from 'react-icons/md';
import { getWishlist, removeFromWishlist, addToCartt } from '../actions/api';

const WishlistDrawer = ({ isWishlistOpen, setWishlistOpen }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [movingId, setMovingId] = useState(null); // Track specific item loading
  const toast = useToast();
  const brandColor = "#A22B21";

  const fetchWishlistData = async () => {
    setLoading(true);
    try {
      const response = await getWishlist();
      setWishlistItems(response.wishlistItems || []);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isWishlistOpen) fetchWishlistData();
  }, [isWishlistOpen]);

  const handleMoveToCart = async (item) => {
    setMovingId(item.product._id);
    try {
      // 1. Add to Cart using your existing function
      await addToCartt(item.product._id, 1);

      // 2. Remove from Wishlist
      await removeFromWishlist(item.product._id);

      toast({
        title: "Added to cart",
        status: "success",
        duration: 2000,
        variant: "subtle"
      });

      fetchWishlistData(); // Refresh UI
    } catch (err) {
      toast({ title: "Error moving to cart", status: "error" });
    } finally {
      setMovingId(null);
    }
  };

  const handleRemove = async (id) => {
    try {
      await removeFromWishlist(id);
      fetchWishlistData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Drawer
      placement="right"
      onClose={() => setWishlistOpen(false)}
      isOpen={isWishlistOpen}
      size="sm"
    >
      <DrawerOverlay backdropFilter="blur(2px)" />
      <DrawerContent bg="white">
        <DrawerCloseButton top="15px" />
        <DrawerHeader borderBottomWidth="1px" py={5}>
          <Text fontSize="lg" fontWeight="500" fontFamily="'Playfair Display', serif">
            Wishlist Items ({wishlistItems.length})
          </Text>
        </DrawerHeader>

        <DrawerBody p={0}>
          {loading ? (
            <Center h="200px"><Spinner color={brandColor} size="sm" /></Center>
          ) : wishlistItems.length > 0 ? (
            <VStack spacing={0} align="stretch" divider={<Divider />}>
              {wishlistItems.map((item, index) => (
                <Box key={index} p={5} _hover={{ bg: "gray.50" }} transition="0.2s">
                  <HStack spacing={4} align="center">
                    <Image
                      src={`http://localhost:5000/uploads${item.product.images[0]}`}
                      alt={item.product.name}
                      boxSize="70px"
                      objectFit="cover"
                      borderRadius="sm"
                    />

                    <VStack align="start" flex="1" spacing={0}>
                      <Text fontSize="sm" color="gray.800" noOfLines={1}>
                        {item.product.name}
                      </Text>
                      <Text fontSize="sm" color={brandColor} mt={1}>
                        ₹{item.currentPrice?.toLocaleString('en-IN')}
                      </Text>
                    </VStack>

                    <HStack spacing={2}>
                      <Button
                        size="xs"
                        variant="outline"
                        borderColor="gray.200"
                        fontWeight="400"
                        leftIcon={<MdAddShoppingCart />}
                        isLoading={movingId === item.product._id}
                        onClick={() => handleMoveToCart(item)}
                        _hover={{ borderColor: brandColor, color: brandColor }}
                      >
                        Add to Cart
                      </Button>
                      <Button
                        size="xs"
                        variant="ghost"
                        color="gray.400"
                        onClick={() => handleRemove(item.product._id)}
                      >
                        <DeleteIcon />
                      </Button>
                    </HStack>
                  </HStack>
                </Box>
              ))}
            </VStack>
          ) : (
            <Center h="300px" flexDirection="column">
              <Text fontSize="sm" color="gray.400">Your wishlist is empty</Text>
            </Center>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default WishlistDrawer;