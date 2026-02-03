import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  IconButton,
  Drawer,
  Text,
  Input,
  DrawerOverlay,
  Select,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  VStack,
  HStack,
  Divider,
  Button,
  Img,
} from "@chakra-ui/react";
import { HamburgerIcon, Search2Icon } from "@chakra-ui/icons";
import { FaUser, FaShoppingCart, FaRegHeart, FaVoicemail } from "react-icons/fa";
import ShoppingCartDrawer from "../components/cart"
import WishlistDrawer from "./wishlist";
import { MdMail, MdMailOutline, MdOutlineCall } from "react-icons/md";
const Header = () => {


  const [isOpen, setIsOpen] = React.useState(false);
  const [isCartOpen, setCartOpen] = React.useState(false);
  const [isWishlistOpen, setWishlistOpen] = React.useState(false);
  const handleToggle = () => setIsOpen(!isOpen);

  const navigate = useNavigate();

  const handleClick = () => {
    const email = localStorage.getItem('email');
    if (email) {
      navigate('/profile');  // Redirect to profile if email exists
    } else {
      navigate('/login');  // Redirect to login if email doesn't exist
    }
  };

  return (
    <Flex
      color="black"
      px={4}
      py={4}
      backgroundColor={'#FBEEE5'}
      // height="100px"
      align="center"
      justifyContent={'space-between'}
      fontSize={'small'}
    >
      <Flex gap={5}>
        <Flex align={'center'}>
          <MdMailOutline />&nbsp;&nbsp;info@appletonworld.com
        </Flex>

        <Flex align={'center'}>
          <FaVoicemail />&nbsp;&nbsp;info@appletonworld.com
        </Flex>
      </Flex>
      <Flex gap={1.5}>
        <Link>About Us</Link>|
        <Link>Blog</Link>|
        <Link>Inquiry</Link>|
        <Link>Contact Us</Link>
      </Flex>
      {/* <Box>

      </Box> */}
    </Flex>
  );
};

export default Header;
