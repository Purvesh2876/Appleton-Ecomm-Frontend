import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Flex,
  IconButton,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  HStack,
  Image,
  Badge,
  Link,
  Container,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Spinner,
} from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import { FaUser, FaRegHeart, FaShoppingBag } from "react-icons/fa";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";

import logo from "../images/logo.PNG";
import ShoppingCartDrawer from "../components/cart";
import WishlistDrawer from "./wishlist";
import AuthDrawer from "./AuthDrawer";

import {
  getCart,
  getAllCategories,
  getAllProducts,
  logout,
} from "../actions/api";

/* ================= HEADER ================= */

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /* -------- STATE -------- */
  const [isCartOpen, setCartOpen] = useState(false);
  const [isWishlistOpen, setWishlistOpen] = useState(false);
  const [isAuthOpen, setAuthOpen] = useState(false);

  const [cartData, setCartData] = useState({ total: 0, count: 0 });
  const [categories, setCategories] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  const userEmail = localStorage.getItem("email");

  /* -------- EFFECTS -------- */

  useEffect(() => {
    setShowSearchDropdown(false);
  }, [location.pathname]);

  /* -------- AUTH -------- */
  const handleLogout = async () => {
    await logout();
    localStorage.clear();
    window.location.reload();
  };

  /* -------- SEARCH -------- */
  const fetchSearchResults = async (value) => {
    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearchLoading(true);
      const res = await getAllProducts({ search: value, limit: 6 });
      setSearchResults(res?.products || []);
    } catch (err) {
      console.error("Search error", err);
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const catRes = await getAllCategories();
        setCategories(catRes || []);
      } catch (err) {
        console.error("Category fetch error", err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cartRes = await getCart();
        setCartData({
          total: cartRes.cartTotal || 0,
          count: cartRes.cartItems?.length || 0,
        });
      } catch (err) {
        // User not logged in — ignore
        setCartData({ total: 0, count: 0 });
      }
    };

    fetchCart();
  }, []);

  useEffect(() => {
    if (!isCartOpen) {
      getCart().then((cartRes) => {
        setCartData({
          total: cartRes.cartTotal || 0,
          count: cartRes.cartItems?.length || 0,
        });
      }).catch(() => { });
    }
  }, [isCartOpen]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSearchResults(value);
    }, 400);
  };

  /* -------- REUSABLE -------- */
  const HeaderIcons = () => (
    <HStack spacing={4}>
      <Menu>
        <MenuButton as={IconButton} icon={<FaUser />} variant="ghost" />
        <MenuList>
          {userEmail ? (
            <>
              <Text px={3} py={2} fontSize="sm">{userEmail}</Text>
              <MenuItem onClick={() => navigate("/profile")}>My Profile</MenuItem>
              <MenuItem onClick={() => navigate("/myorders")}>My Orders</MenuItem>
              <MenuItem color="red.500" onClick={handleLogout}>Logout</MenuItem>
            </>
          ) : (
            <MenuItem onClick={() => setAuthOpen(true)}>
              Login / Register
            </MenuItem>
          )}
        </MenuList>
      </Menu>

      <IconButton
        icon={<FaRegHeart />}
        variant="ghost"
        onClick={() => setWishlistOpen(true)}
      />

      <Flex
        as="button"
        onClick={() => setCartOpen(true)}
        align="center"
        bg="#A22B21"
        color="white"
        px={4}
        py={2}
        borderRadius="full"
        position="relative"
      >
        <FaShoppingBag />
        <Text ml={2} fontWeight="bold">
          ₹{cartData.total.toFixed(0)}
        </Text>
        <Badge
          position="absolute"
          top="-5px"
          right="-2px"
          bg="white"
          color="#A22B21"
          borderRadius="full"
          px={2}
          fontSize="0.7em"
        >
          {cartData.count}
        </Badge>
      </Flex>
    </HStack>
  );

  const SearchDropdown = () => (
    <Box
      position="absolute"
      top="55px"
      left="0"
      right="0"
      bg="white"
      borderRadius="md"
      boxShadow="lg"
      zIndex="999"
      p={3}
    >
      {searchLoading ? (
        <Flex justify="center" py={4}>
          <Spinner />
        </Flex>
      ) : (
        <>
          {searchResults.map((item) => (
            <Flex
              key={item._id}
              align="center"
              p={2}
              borderRadius="md"
              cursor="pointer"
              _hover={{ bg: "gray.100" }}
              onMouseDown={() => {
                navigate(`/productDetails/${item._id}`);
                setShowSearchDropdown(false);
              }}
            >
              <Image
                src={`${process.env.REACT_APP_API_URL}uploads${item.images[0]}`}
                boxSize="50px"
                objectFit="cover"
                borderRadius="md"
                mr={3}
              />
              <Box>
                <Text fontWeight="600" fontSize="sm">{item.name}</Text>
                <Text fontSize="xs" color="gray.500">₹{item.price}</Text>
              </Box>
            </Flex>
          ))}

          <Box
            mt={2}
            textAlign="center"
            fontSize="sm"
            color="#A22B21"
            fontWeight="600"
            cursor="pointer"
            onMouseDown={() => {
              navigate(`/allproducts?search=${encodeURIComponent(searchText)}`);
              setShowSearchDropdown(false);
            }}
          >
            VIEW ALL RESULTS
          </Box>
        </>
      )}
    </Box>
  );

  /* -------- UI -------- */
  return (
    <Box bg="white" position="sticky" top="0" zIndex="1000" boxShadow="sm">
      <AuthDrawer isOpen={isAuthOpen} onClose={() => setAuthOpen(false)} />
      <ShoppingCartDrawer isCartOpen={isCartOpen} setCartOpen={setCartOpen} />
      <WishlistDrawer isWishlistOpen={isWishlistOpen} setWishlistOpen={setWishlistOpen} />

      {/* ===== DESKTOP ===== */}
      <Box display={{ base: "none", md: "block" }}>
        <Container maxW="1500px">
          <Flex align="center" justify="space-between" h="90px">
            <Box w="180px">
              <RouterLink to="/">
                <Image src={logo} />
              </RouterLink>
            </Box>

            <Box flex="1" mx={12} position="relative" ref={searchRef}>
              <InputGroup size="lg">
                <InputLeftElement pointerEvents="none">
                  <Search2Icon color="gray.600" />
                </InputLeftElement>
                <Input
                  placeholder="Search for products"
                  value={searchText}
                  onChange={handleSearchChange}
                  onFocus={() => setShowSearchDropdown(true)}
                  borderRadius="full"
                />
              </InputGroup>

              {showSearchDropdown && searchText.trim() && <SearchDropdown />}
            </Box>

            <HeaderIcons />
          </Flex>
        </Container>
      </Box>

      {/* ===== MOBILE ===== */}
      <Box display={{ base: "block", md: "none" }}>
        <Container maxW="1500px">
          <Flex align="center" justify="space-between" py={3}>
            <Box w="120px">
              <RouterLink to="/">
                <Image src={logo} />
              </RouterLink>
            </Box>
            <HeaderIcons />
          </Flex>

          <Box position="relative" pb={3} ref={searchRef}>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Search2Icon color="gray.600" />
              </InputLeftElement>
              <Input
                placeholder="Search for products"
                value={searchText}
                onChange={handleSearchChange}
                onFocus={() => setShowSearchDropdown(true)}
                h="44px"
                borderRadius="full"
              />
            </InputGroup>

            {showSearchDropdown && searchText.trim() && <SearchDropdown />}
          </Box>
        </Container>
      </Box>

      {/* ===== CATEGORY BAR (DESKTOP) ===== */}
      <Box bg="#A22B21" color="white" display={{ base: "none", md: "block" }}>
        <Container maxW="1500px">
          <Flex gap={8} py={4}>
            <Link as={RouterLink} to="/">Home</Link>
            {categories.map((cat) => (
              <Link
                key={cat._id}
                as={RouterLink}
                to={`/allproducts?category=${cat._id}`}
                _hover={{ textDecor: 'none', color: 'gray.300' }}
              >
                {cat.name}
              </Link>
            ))}
          </Flex>
        </Container>
      </Box>
    </Box>
  );
};

export default Header;
