// Home.js

import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Fade,
  Stack,
  Button,
  SimpleGrid,
  Card,
  CardHeader,
  Flex,
  CardBody,
  CardFooter,
  Image,
  Divider,
  ButtonGroup,
  Stat,
  useToast,
  Grid,
  GridItem,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  IconButton,
  HStack
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import sdsd from "./sdsd.png";
import cat1 from "../images/cat1.jpg"
import cat2 from "../images/cat2.jpg"
import slider1 from "../images/slider/slider01.jpg";
import slider2 from "../images/slider/slider02.jpg";
import slider3 from "../images/slider/slider03.jpg";
import slider4 from "../images/slider/slider04.jpg";
import slider5 from "../images/slider/slider05.jpg";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { GiHealthNormal, GiStarSattelites, GiPeanut, GiPlantSeed } from "react-icons/gi";
import axios from "axios";
// import "@fontsource/pt-sans";
import { addToWishlistt, getAllCategories, getAllProducts, sendInquiry } from "../actions/api";
import StaticSlider from "../components/StaticSlider";
import { useLocation } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import ProductCard from "../components/ProductCard";

const Home = ({ }) => {
  const sliderSettings = {
    // dots: true,
    infinite: true,
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    autoplay: true,
    autoplaySpeed: 1000,
  };

  const categoryBg = '#efffa0';
  const images = [
    cat1, cat2, cat1, cat2, cat1, cat2, cat1, cat2, cat1, cat2, cat1, cat2, cat1, cat2, cat1, cat2,
    // Add more image paths as needed
  ];
  const posterPaths = [
    slider1,
    slider2,
    slider3,
    slider4,
    slider5
    // Add more image paths as needed
  ];
  const leftSliderSettings = {
    dots: false,
    infinite: true,
    speed: 5000,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: "linear",
    arrows: false,
    pauseOnHover: false,
    responsive: [
      {
        breakpoint: 1024, // For tablets
        settings: {
          slidesToShow: 5, // Show fewer slides on tablets
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768, // For mobile devices
        settings: {
          slidesToShow: 3, // Show even fewer slides on mobile
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480, // For smaller mobile devices
        settings: {
          slidesToShow: 2, // Show only two slides on smaller screens
          slidesToScroll: 1,
        },
      },
    ],
  };
  const rightSliderSettings = {
    dots: false,
    infinite: true,
    speed: 5000,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: "linear",
    arrows: false,
    pauseOnHover: false,
    rtl: true, // Right to left scrolling
    responsive: [
      {
        breakpoint: 1024, // For tablets
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768, // For mobile devices
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480, // For smaller mobile devices
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const categorySliderSettings = {
    dots: false,
    // infinite: false, // Set to false so "All Products" stays at the start
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    initialSlide: 0,
    arrows: false, // Clean look as per Figma
    responsive: [
      {
        breakpoint: 1250,
        settings: {
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 1030,
        settings: {
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 560,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 400,
        settings: {
          slidesToShow: 2, // Shows a peek of the next category to encourage swiping
        }
      },
      {
        breakpoint: 380,
        settings: {
          slidesToShow: 2, // Shows a peek of the next category to encourage swiping
        }
      }
    ]
  };

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uniqueCategories, setUniqueCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [wishlistIds, setWishlistIds] = useState([]);

  const increaseQty = () => setQuantity((q) => q + 1);
  const decreaseQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const toggleWishlist = async (productId) => {
    await addToWishlist(productId);
    setWishlistIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleMouseDown = () => {
    setIsDragging(false);
  };

  const handleMouseMove = () => {
    setIsDragging(true);
  };

  const handleCardClick = (e) => {
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  //  mouse hover on card
  const [hoveredProductId, setHoveredProductId] = useState(null);

  const handleHover = (productId) => {
    setHoveredProductId(productId);
  };

  const handleHoverOut = () => {
    setHoveredProductId(null);
  };

  const location = useLocation();

  useEffect(() => {
    if (location.state?.tag) {
      setTags(location.state.tag);

      // Small delay to let React render the section
      setTimeout(() => {
        const section = document.getElementById("featured-products");
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      }, 300); // adjust delay if needed
    }
  }, [location.state]);

  const featuredProductSliderSettings = {
    dots: false,
    speed: 500,
    arrows: false,
    slidesToScroll: 1,
    slidesToShow: 4,
    infinite: false, // default for desktop

    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          infinite: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          infinite: true, // 👈 IMPORTANT
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1.3,
          infinite: true, // 👈 IMPORTANT
        },
      },
    ],
  };

  const [selectedTag, setSelectedTag] = useState(null);

  const filteredProducts = selectedTag
    ? products.filter((product) => product.tag === selectedTag)
    : products;

  useEffect(() => {
    const categoriesSet = new Set(products.map((product) => product.category));
    const uniqueCategoriesArray = [...categoriesSet];
    setUniqueCategories(uniqueCategoriesArray);
  }, [products]);


  //////////////////

  const [tags, setTags] = useState(['Trending']);
  const [category, setCategory] = useState(null);
  const [color, setColor] = useState(null);

  // const fecthData = async () => {
  //   try {
  //     const response = await getAllCategories();
  //     setCategories(response);
  //     // console.log(response);
  //     // setLoading(false);
  //   }
  //   catch (error) {
  //     setError(
  //       "An error occurred while fetching data. Please try again later."
  //     );
  //     setLoading(false);
  //   };
  // };

  const fetchTags = async () => {
    try {
      const response = await getAllProducts();
      console.log(response, 'product tag wise');
      setProducts(response.products);
    }
    catch (error) {
      setError(error);
      setLoading(false);
    }
  }
  const [allProducts, setAllProducts] = useState([]);
  const fetchAllProducts = async () => {
    try {
      const response = await getAllProducts(1, 10);
      setAllProducts(response.products);
      console.log(response, 'product all');
    }
    catch (error) {
      setError(error);
      setLoading(false);
    }
  }

  const [dryFruits, setDryFruits] = useState([]);
  const [makhana, setMakhana] = useState([]);
  const [seeds, setSeeds] = useState([]);
  const [driedBerries, setDriedBerries] = useState([]);
  const [driedFruits, setDriedFruits] = useState([]);
  const [dates, setDates] = useState([]);
  const [energyPatch, setEnergyPatch] = useState([]);
  const [chocoNuts, setChocoNuts] = useState([]);

  const fetchSectionData = async () => {
    try {
      const allCats = await getAllCategories();
      setCategories(allCats);

      // Find the IDs for your specific sections
      const dryFruitCat = allCats.find(c => c.name === "Dry Fruits");
      const makhanaCat = allCats.find(c => c.name === "Makhana");
      const seedsCat = allCats.find(c => c.name === "Seeds");
      const driedBerriesCat = allCats.find(c => c.name === "Dried Berries");
      const driedFruitsCat = allCats.find(c => c.name === "Dried Fruits");
      const dates = allCats.find(c => c.name === "Dates");
      const energyPatchCat = allCats.find(c => c.name === "Energy Patch");
      const chocoNutsCat = allCats.find(c => c.name === "Choco Nuts");
      console.log(allCats, 'all categories');
      // Fetch products for each section specifically by Category ID
      if (dryFruitCat) {
        const res = await getAllProducts({ category: dryFruitCat._id });
        console.log(res, 'dry fruit cat id');
        setDryFruits(res.products);
      }
      if (makhanaCat) {
        const res = await getAllProducts({ category: makhanaCat._id });
        setMakhana(res.products);
      }
      if (seedsCat) {
        const res = await getAllProducts({ category: seedsCat._id });
        setSeeds(res.products);
      }
      if (driedBerriesCat) {
        const res = await getAllProducts({ category: driedBerriesCat._id });
        setDriedBerries(res.products);
      }
      if (driedFruitsCat) {
        const res = await getAllProducts({ category: driedFruitsCat._id });
        setDriedFruits(res.products);
      }
      if (dates) {
        const res = await getAllProducts({ category: dates._id });
        setDates(res.products);
      }
      if (energyPatchCat) {
        const res = await getAllProducts({ category: energyPatchCat._id });
        setEnergyPatch(res.products);
      }
      if (chocoNutsCat) {
        const res = await getAllProducts({ category: chocoNutsCat._id });
        setChocoNuts(res.products);
      }
    } catch (err) {
      console.error("Home fetch error:", err);
    }
  };

  useEffect(() => {
    fetchSectionData();
  }, []);

  const toast = useToast();
  const addToWishlist = async (productId) => {
    const response = await addToWishlistt(productId);
    // console.log(response);
    // setIsAddedToWishlist(true);
    toast({
      title: response.data.message,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  useEffect(() => {
    fetchAllProducts();
    fetchTags();
  }, [tags]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = await sendInquiry(formData);
      if (data.success) {
        toast({
          title: "Inquiry Sent!",
          description: "We will get back to you shortly.",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
        // Clear form after success
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: error.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Box overflowX="hidden">

        {/* Second Slider with Poster Paths */}
        <Slider {...sliderSettings}>
          {posterPaths.map((path, index) => (
            <Fade
              key={index}
              in={true}
              style={{ transitionDelay: `${index * 0.5}s` }}
            >
              <Box position="relative" mb={4}>
                {/* Image */}
                <Image
                  src={path}
                  alt={`Poster ${index + 1}`}
                  width="100%"
                  height="auto"
                />

                {/* Bottom gradient overlay */}
                <Box
                  position="absolute"
                  bottom="0"
                  left="0"
                  width="100%"
                  height="6px"
                  // bg="linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1))"
                  bg="white"
                  opacity={0.5}
                  pointerEvents="none"
                />
              </Box>
            </Fade>
          ))}
        </Slider>
      </Box>

      <Box id="collection" py={{ base: 0, md: 10 }}>
        <Stack direction="column" spacing={4} align="center" justify="center" mt={5} mb={8}>
          <Heading
            p={'5px 30px'}
            color="#A22B21"
            fontWeight={700}
            fontSize={{ base: "2xl", md: "4xl" }}
            fontFamily="'Playfair Display', serif"
            textAlign="center"
          >
            Dive Into Our Premium Collections
          </Heading>
        </Stack>

        {/* Slider Container */}
        <Box px={{ base: 4, md: 12 }}>
          <Slider {...categorySliderSettings}>

            {/* 1. Static "All Products" Slide */}
            <Box px={3}>
              <Link to="/allproducts" style={{ textDecoration: "none" }}>
                <Flex direction="column" align="center" gap={4}>
                  <Box
                    w={{
                      base: "110px",   // mobile (smaller)
                      sm: "120px",     // large mobile
                      md: "160px",     // tablet
                      lg: "220px",     // desktop (unchanged)
                    }}
                    h={{
                      base: "110px",
                      sm: "120px",
                      md: "160px",
                      lg: "220px",
                    }}
                    borderRadius="full"
                    bg="#F1F1F1"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Image
                      src="https://appletonworld.com/wp-content/uploads/2025/08/Makhana-Image-1.jpg"
                      alt="All Products"
                      w="92%"
                      h="92%"
                      objectFit="cover"
                      borderRadius="full"
                      filter="grayscale(100%)" // Distinguishes "All" visually
                    />
                  </Box>
                  <Text
                    fontSize={{ base: "lg", md: "xl" }}
                    fontWeight="600"
                    color="#2D2D2D"
                    fontFamily="'Playfair Display', serif"
                    textAlign="center"
                  >
                    All Products
                  </Text>
                </Flex>
              </Link>
            </Box>

            {/* 2. Dynamic Categories */}
            {categories.map((category) => (
              <Box key={category._id} px={3}>
                <Link
                  to={`/allproducts?category=${category._id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Flex direction="column" align="center" gap={4}>
                    <Box
                      w={{
                        base: "110px",   // mobile (smaller)
                        sm: "120px",     // large mobile
                        md: "160px",     // tablet
                        lg: "220px",     // desktop (unchanged)
                      }}
                      h={{
                        base: "110px",
                        sm: "120px",
                        md: "160px",
                        lg: "220px",
                      }}
                      borderRadius="full"
                      bg="#F1F1F1"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Image
                        src={`http://localhost:5000/uploads${category.image}`} // Dynamic backend image
                        alt={category.name}
                        w="92%"
                        h="92%"
                        objectFit="cover"
                        borderRadius="full"
                      />
                    </Box>
                    <Text
                      fontSize={{ base: "lg", md: "xl" }}
                      fontWeight="600"
                      color="#2D2D2D"
                      fontFamily="'Playfair Display', serif"
                      textAlign="center"
                    >
                      {category.name}
                    </Text>
                  </Flex>
                </Link>
              </Box>
            ))}
          </Slider>
        </Box>
      </Box >


      <Box
        w="100%"
        overflow="hidden"
        mt={{ base: 6, md: 10 }}
      >
        {/* Dotted line */}
        <Box
          h={{ base: '5px', md: '5px', lg: '6px' }}  // 👈 responsive height
          bgImage="radial-gradient(circle, #A22B21 3px, transparent 4px)"
          bgSize="10px 10px"
          bgRepeat="repeat-x"
        />

        {/* Marquee wrapper */}
        <Box
          bg="#A22B21"
          pt={{ base: 3, md: 5, lg: 5 }}   // 👈 responsive height
          pb={{ base: 4, md: 6, lg: 6 }}   // 👈 responsive height
          overflow="hidden"
        >
          {/* Moving track */}
          <Box
            display="flex"
            w="max-content"
            animation="marquee 18s linear infinite"
          >
            {Array(4).fill(null).map((_, i) => (
              <HStack
                key={i}
                spacing={{ base: 6, md: 10 }}
                px={{ base: 4, md: 8 }}
                whiteSpace="nowrap"
              >
                <Text
                  fontFamily="'Playfair Display', serif"
                  fontSize={{ base: "lg", md: "2xl", lg: "4xl" }} // 👈 responsive text
                  color="white"
                >
                  ✻ Yummyness in every bite ✻
                </Text>

                <Text
                  fontFamily="'Playfair Display', serif"
                  fontSize={{ base: "lg", md: "2xl", lg: "4xl" }}
                  color="white"
                >
                  ✻ Yummyness with you anytime ✻
                </Text>
              </HStack>
            ))}
          </Box>
        </Box>
      </Box>


      {/* <Box id="featured-products" m={0} bg={'#FBEEE5'} pt={20} pb={10}> */}
      <Box
        id="featured-products"
        m={0}
        bg="#FBEEE5"
        pt={{ base: 10, md: 20 }}
        pb={{ base: 6, md: 10 }}
      >
        <Stack direction="column" spacing={4} align="center" justify="center" py={4}>
          <Stack color={'#A22B21'} direction="column" spacing={0} align="center" justify="center" mb={4}>
            <Heading
              px={{ base: 4, md: 8 }}
              py={2}
              fontSize={{ base: "3xl", md: "5xl" }}
              fontFamily="'Playfair Display', sans-serif"
            >
              DryFruits
            </Heading>
            <Box>_____</Box>
            <Text
              color="black"
              mt={4}
              fontSize={{ base: "sm", md: "lg" }}
              maxW={{ base: "95%", md: "80%" }}
              textAlign="center"
              fontFamily="'Outfit', sans-serif"
            >
              Discover the finest selection of premium dry fruits, handpicked for quality, taste, and nutrition. At ``Appleton World``, we bring you nature’s powerhouse of energy, delicious, crunchy, and wholesome dry fruits that are perfect for snacking, gifting, or adding to your daily diet. Whether you're looking for crunchy almonds, creamy cashews, fiber rich raisins, apricots or exotic pistachios, we have it all. Our dry fruits are hygienically packed to retain freshness and ensure you get the best in every bite.
            </Text>
          </Stack>
        </Stack>

        <Box mt={4} maxW="1300px" mx="auto" px={{ base: 3, md: 0 }}>
          <Slider {...featuredProductSliderSettings}>
            {/* FILTER ADDED HERE */}
            {dryFruits.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                wishlistIds={wishlistIds}
                toggleWishlist={toggleWishlist}
                hoveredProductId={hoveredProductId}
                handleHover={handleHover}
                handleHoverOut={handleHoverOut}
                handleMouseDown={handleMouseDown}
                handleMouseMove={handleMouseMove}
                handleCardClick={handleCardClick}
              />
            ))}
          </Slider>
        </Box>

        <Box textAlign={'center'} mt={10}>
          <Button borderRadius={'0'} px={7} py={5} fontWeight={700} fontSize={'sm'} color={'white'} bgColor={'#A22B21'}>VIEW ALL PRODUCTS</Button>
        </Box>
      </Box >

      <Box id="featured-products" m={0} bg={'radial-gradient(#fee1af, #fdc441)'} pt={10} pb={10}>
        <Stack direction="column" spacing={4} align="center" justify="center" py={4}>
          <Stack color={'#A22B21'} direction="column" spacing={0} align="center" justify="center" mb={4}>
            <Heading p={'5px 30px'} colorScheme="black" variant="outline" rounded="full" fontSize={'5xl'} fontFamily="'Playfair Display', sans-serif">
              Makhana
            </Heading>
            <Box>_____</Box>
            <Text color={'black'} mt={5} fontSize={'lg'} maxW={'80%'} textAlign={'center'} fontFamily="'Outfit', sans-serif">
              Discover the finest selection of premium dry fruits, handpicked for quality, taste, and nutrition. At ``Appleton World``, we bring you nature’s powerhouse of energy, delicious, crunchy, and wholesome dry fruits that are perfect for snacking, gifting, or adding to your daily diet. Whether you're looking for crunchy almonds, creamy cashews, fiber rich raisins, apricots or exotic pistachios, we have it all. Our dry fruits are hygienically packed to retain freshness and ensure you get the best in every bite.
            </Text>
          </Stack>
        </Stack>

        <Stack spacing={6} mt={4} maxW="1300px" mx="auto" px={{ base: 3, md: 0 }}>
          <Slider {...featuredProductSliderSettings}>
            {products.map((product) => (
              <Box key={product._id} px={2}>
                <Card
                  shadow="none"
                  w="100%"
                  maxW={{ base: "180px", md: "280px", lg: "320px" }}
                  mx="auto"
                >
                  <CardBody
                    p={0}
                    borderRadius="24px"
                    bg="white"
                    boxShadow="0px 4px 12px rgba(0,0,0,0.08)"
                  >
                    <Link
                      to={`/productdetails/${product._id}`}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onClick={handleCardClick}
                    >
                      <Box p={2}>
                        <Image
                          src={`http://localhost:5000/uploads${hoveredProductId === product._id
                            ? product.images[1]
                            : product.images[0]
                            }`}
                          alt={product.name}
                          w="100%"
                          h={{ base: "140px", md: "290px" }}
                          objectFit="contain"
                          borderRadius="sm"
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

                      <Text
                        fontSize={{ base: "sm", md: "md" }}
                        fontStyle="italic"
                      >
                        <span
                          style={{
                            padding: "0 7px",
                            borderRadius: "4px",
                            background:
                              "linear-gradient(90deg, #ffa34e 0%, rgb(255,233,182) 50%, #ffa34e 100%)",
                          }}
                        >
                          {product.category?.name}
                        </span>
                      </Text>

                      <Text fontSize={{ base: "md", md: "lg" }} fontWeight={500}>
                        ₹ {product.price} / {product.weight}{product.unit}
                      </Text>

                      <Button
                        mt={2}
                        w="100%"
                        size={{ base: "sm", md: "md" }}
                        borderRadius="full"
                        onClick={() => addToWishlist(product._id)}
                      >
                        Add To Wishlist
                      </Button>
                    </Stack>
                  </CardBody>
                </Card>
              </Box>
            ))}
          </Slider>
        </Stack>

        <Box textAlign={'center'} mt={10}>
          <Button borderRadius={'0'} px={7} py={5} fontWeight={700} fontSize={'sm'} color={'white'} bgColor={'#A22B21'}>VIEW ALL PRODUCTS</Button>
        </Box>

      </Box >

      <Box id="featured-products" m={0} bg={'radial-gradient(#a694542b, #a69454d9);'} pt={10} pb={10}>
        <Stack direction="column" spacing={4} align="center" justify="center" py={4}>
          <Stack color={'#A22B21'} direction="column" spacing={0} align="center" justify="center" mb={4}>
            <Heading p={'5px 30px'} colorScheme="black" variant="outline" rounded="full" fontSize={'5xl'} fontFamily="'Playfair Display', sans-serif">
              Seeds
            </Heading>
            <Box>_____</Box>
            <Text color={'black'} mt={5} fontSize={'lg'} maxW={'80%'} textAlign={'center'} fontFamily="'Outfit', sans-serif">
              Discover the finest selection of premium dry fruits, handpicked for quality, taste, and nutrition. At ``Appleton World``, we bring you nature’s powerhouse of energy, delicious, crunchy, and wholesome dry fruits that are perfect for snacking, gifting, or adding to your daily diet. Whether you're looking for crunchy almonds, creamy cashews, fiber rich raisins, apricots or exotic pistachios, we have it all. Our dry fruits are hygienically packed to retain freshness and ensure you get the best in every bite.
            </Text>
          </Stack>
        </Stack>

        <Stack spacing={6} mt={4} maxW="1300px" mx="auto" px={{ base: 3, md: 0 }}>
          <Slider {...featuredProductSliderSettings}>
            {products.map((product) => (
              <Box key={product._id} px={2}>
                <Card
                  shadow="none"
                  w="100%"
                  maxW={{ base: "180px", md: "280px", lg: "320px" }}
                  mx="auto"
                >
                  <CardBody
                    p={0}
                    borderRadius="24px"
                    bg="white"
                    boxShadow="0px 4px 12px rgba(0,0,0,0.08)"
                  >
                    <Link
                      to={`/productdetails/${product._id}`}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onClick={handleCardClick}
                    >
                      <Box p={2}>
                        <Image
                          src={`http://localhost:5000/uploads${hoveredProductId === product._id
                            ? product.images[1]
                            : product.images[0]
                            }`}
                          alt={product.name}
                          w="100%"
                          h={{ base: "140px", md: "290px" }}
                          objectFit="contain"
                          borderRadius="sm"
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

                      <Text
                        fontSize={{ base: "sm", md: "md" }}
                        fontStyle="italic"
                      >
                        <span
                          style={{
                            padding: "0 7px",
                            borderRadius: "4px",
                            background:
                              "linear-gradient(90deg, #ffa34e 0%, rgb(255,233,182) 50%, #ffa34e 100%)",
                          }}
                        >
                          {product.category?.name}
                        </span>
                      </Text>

                      <Text fontSize={{ base: "md", md: "lg" }} fontWeight={500}>
                        ₹ {product.price} / {product.weight}{product.unit}
                      </Text>

                      <Button
                        mt={2}
                        w="100%"
                        size={{ base: "sm", md: "md" }}
                        borderRadius="full"
                        onClick={() => addToWishlist(product._id)}
                      >
                        Add To Wishlist
                      </Button>
                    </Stack>
                  </CardBody>
                </Card>
              </Box>
            ))}
          </Slider>
        </Stack>

        <Box textAlign={'center'} mt={10}>
          <Button borderRadius={'0'} px={7} py={5} fontWeight={700} fontSize={'sm'} color={'white'} bgColor={'#A22B21'}>VIEW ALL PRODUCTS</Button>
        </Box>

      </Box >

      <Box id="featured-products" m={0} bg={'radial-gradient(#a694542b, #fdb2b7);'} pt={10} pb={10}>
        <Stack direction="column" spacing={4} align="center" justify="center" py={4}>
          <Stack color={'#A22B21'} direction="column" spacing={0} align="center" justify="center" mb={4}>
            <Heading p={'5px 30px'} colorScheme="black" variant="outline" rounded="full" fontSize={'5xl'} fontFamily="'Playfair Display', sans-serif">
              Dried Berries
            </Heading>
            <Box>_____</Box>
            <Text color={'black'} mt={5} fontSize={'lg'} maxW={'80%'} textAlign={'center'} fontFamily="'Outfit', sans-serif">
              Discover the finest selection of premium dry fruits, handpicked for quality, taste, and nutrition. At ``Appleton World``, we bring you nature’s powerhouse of energy, delicious, crunchy, and wholesome dry fruits that are perfect for snacking, gifting, or adding to your daily diet. Whether you're looking for crunchy almonds, creamy cashews, fiber rich raisins, apricots or exotic pistachios, we have it all. Our dry fruits are hygienically packed to retain freshness and ensure you get the best in every bite.
            </Text>
          </Stack>
        </Stack>

        <Stack spacing={6} mt={4} maxW="1300px" mx="auto" px={{ base: 3, md: 0 }}>
          <Slider {...featuredProductSliderSettings}>
            {products.map((product) => (
              <Box key={product._id} px={2}>
                <Card
                  shadow="none"
                  w="100%"
                  maxW={{ base: "180px", md: "280px", lg: "320px" }}
                  mx="auto"
                >
                  <CardBody
                    p={0}
                    borderRadius="24px"
                    bg="white"
                    boxShadow="0px 4px 12px rgba(0,0,0,0.08)"
                  >
                    <Link
                      to={`/productdetails/${product._id}`}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onClick={handleCardClick}
                    >
                      <Box p={2}>
                        <Image
                          src={`http://localhost:5000/uploads${hoveredProductId === product._id
                            ? product.images[1]
                            : product.images[0]
                            }`}
                          alt={product.name}
                          w="100%"
                          h={{ base: "140px", md: "290px" }}
                          objectFit="contain"
                          borderRadius="sm"
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

                      <Text
                        fontSize={{ base: "sm", md: "md" }}
                        fontStyle="italic"
                      >
                        <span
                          style={{
                            padding: "0 7px",
                            borderRadius: "4px",
                            background:
                              "linear-gradient(90deg, #ffa34e 0%, rgb(255,233,182) 50%, #ffa34e 100%)",
                          }}
                        >
                          {product.category?.name}
                        </span>
                      </Text>

                      <Text fontSize={{ base: "md", md: "lg" }} fontWeight={500}>
                        ₹ {product.price} / {product.weight}{product.unit}
                      </Text>

                      <Button
                        mt={2}
                        w="100%"
                        size={{ base: "sm", md: "md" }}
                        borderRadius="full"
                        onClick={() => addToWishlist(product._id)}
                      >
                        Add To Wishlist
                      </Button>
                    </Stack>
                  </CardBody>
                </Card>
              </Box>
            ))}
          </Slider>
        </Stack>

        <Box textAlign={'center'} mt={10}>
          <Button borderRadius={'0'} px={7} py={5} fontWeight={700} fontSize={'sm'} color={'white'} bgColor={'#A22B21'}>VIEW ALL PRODUCTS</Button>
        </Box>

      </Box >


      <Box id="featured-products" m={0} bg={'radial-gradient(#a694542b, #ffb100a8)'} pt={10} pb={10}>
        <Stack direction="column" spacing={4} align="center" justify="center" py={4}>
          <Stack color={'#A22B21'} direction="column" spacing={0} align="center" justify="center" mb={4}>
            <Heading p={'5px 30px'} colorScheme="black" variant="outline" rounded="full" fontSize={'5xl'} fontFamily="'Playfair Display', sans-serif">
              Dried Fruits
            </Heading>
            <Box>_____</Box>
            <Text color={'black'} mt={5} fontSize={'lg'} maxW={'80%'} textAlign={'center'} fontFamily="'Outfit', sans-serif">
              Discover the finest selection of premium dry fruits, handpicked for quality, taste, and nutrition. At ``Appleton World``, we bring you nature’s powerhouse of energy, delicious, crunchy, and wholesome dry fruits that are perfect for snacking, gifting, or adding to your daily diet. Whether you're looking for crunchy almonds, creamy cashews, fiber rich raisins, apricots or exotic pistachios, we have it all. Our dry fruits are hygienically packed to retain freshness and ensure you get the best in every bite.
            </Text>
          </Stack>
        </Stack>

        <Stack spacing={6} mt={4} maxW="1300px" mx="auto" px={{ base: 3, md: 0 }}>
          <Slider {...featuredProductSliderSettings}>
            {products.map((product) => (
              <Box key={product._id} px={2}>
                <Card
                  shadow="none"
                  w="100%"
                  maxW={{ base: "180px", md: "280px", lg: "320px" }}
                  mx="auto"
                >
                  <CardBody
                    p={0}
                    borderRadius="24px"
                    bg="white"
                    boxShadow="0px 4px 12px rgba(0,0,0,0.08)"
                  >
                    <Link
                      to={`/productdetails/${product._id}`}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onClick={handleCardClick}
                    >
                      <Box p={2}>
                        <Image
                          src={`http://localhost:5000/uploads${hoveredProductId === product._id
                            ? product.images[1]
                            : product.images[0]
                            }`}
                          alt={product.name}
                          w="100%"
                          h={{ base: "140px", md: "290px" }}
                          objectFit="contain"
                          borderRadius="sm"
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

                      <Text
                        fontSize={{ base: "sm", md: "md" }}
                        fontStyle="italic"
                      >
                        <span
                          style={{
                            padding: "0 7px",
                            borderRadius: "4px",
                            background:
                              "linear-gradient(90deg, #ffa34e 0%, rgb(255,233,182) 50%, #ffa34e 100%)",
                          }}
                        >
                          {product.category?.name}
                        </span>
                      </Text>

                      <Text fontSize={{ base: "md", md: "lg" }} fontWeight={500}>
                        ₹ {product.price} / {product.weight}{product.unit}
                      </Text>

                      <Button
                        mt={2}
                        w="100%"
                        size={{ base: "sm", md: "md" }}
                        borderRadius="full"
                        onClick={() => addToWishlist(product._id)}
                      >
                        Add To Wishlist
                      </Button>
                    </Stack>
                  </CardBody>
                </Card>
              </Box>
            ))}
          </Slider>
        </Stack>

        <Box textAlign={'center'} mt={10}>
          <Button borderRadius={'0'} px={7} py={5} fontWeight={700} fontSize={'sm'} color={'white'} bgColor={'#A22B21'}>VIEW ALL PRODUCTS</Button>
        </Box>

      </Box >

      <Box id="featured-products" m={0} bg={'radial-gradient(#a694542b, #7f3024e3);'} pt={10} pb={10}>
        <Stack direction="column" spacing={4} align="center" justify="center" py={4}>
          <Stack color={'#A22B21'} direction="column" spacing={0} align="center" justify="center" mb={4}>
            <Heading p={'5px 30px'} colorScheme="black" variant="outline" rounded="full" fontSize={'5xl'} fontFamily="'Playfair Display', sans-serif">
              Dates
            </Heading>
            <Box>_____</Box>
            <Text color={'black'} mt={5} fontSize={'lg'} maxW={'80%'} textAlign={'center'} fontFamily="'Outfit', sans-serif">
              Discover the finest selection of premium dry fruits, handpicked for quality, taste, and nutrition. At ``Appleton World``, we bring you nature’s powerhouse of energy, delicious, crunchy, and wholesome dry fruits that are perfect for snacking, gifting, or adding to your daily diet. Whether you're looking for crunchy almonds, creamy cashews, fiber rich raisins, apricots or exotic pistachios, we have it all. Our dry fruits are hygienically packed to retain freshness and ensure you get the best in every bite.
            </Text>
          </Stack>
        </Stack>

        <Stack spacing={6} mt={4} maxW="1300px" mx="auto" px={{ base: 3, md: 0 }}>
          <Slider {...featuredProductSliderSettings}>
            {products.map((product) => (
              <Box key={product._id} px={2}>
                <Card
                  shadow="none"
                  w="100%"
                  maxW={{ base: "180px", md: "280px", lg: "320px" }}
                  mx="auto"
                >
                  <CardBody
                    p={0}
                    borderRadius="24px"
                    bg="white"
                    boxShadow="0px 4px 12px rgba(0,0,0,0.08)"
                  >
                    <Link
                      to={`/productdetails/${product._id}`}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onClick={handleCardClick}
                    >
                      <Box p={2}>
                        <Image
                          src={`http://localhost:5000/uploads${hoveredProductId === product._id
                            ? product.images[1]
                            : product.images[0]
                            }`}
                          alt={product.name}
                          w="100%"
                          h={{ base: "140px", md: "290px" }}
                          objectFit="contain"
                          borderRadius="sm"
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

                      <Text
                        fontSize={{ base: "sm", md: "md" }}
                        fontStyle="italic"
                      >
                        <span
                          style={{
                            padding: "0 7px",
                            borderRadius: "4px",
                            background:
                              "linear-gradient(90deg, #ffa34e 0%, rgb(255,233,182) 50%, #ffa34e 100%)",
                          }}
                        >
                          {product.category?.name}
                        </span>
                      </Text>

                      <Text fontSize={{ base: "md", md: "lg" }} fontWeight={500}>
                        ₹ {product.price} / {product.weight}{product.unit}
                      </Text>

                      <Button
                        mt={2}
                        w="100%"
                        size={{ base: "sm", md: "md" }}
                        borderRadius="full"
                        onClick={() => addToWishlist(product._id)}
                      >
                        Add To Wishlist
                      </Button>
                    </Stack>
                  </CardBody>
                </Card>
              </Box>
            ))}
          </Slider>
        </Stack>

        <Box textAlign={'center'} mt={10}>
          <Button borderRadius={'0'} px={7} py={5} fontWeight={700} fontSize={'sm'} color={'white'} bgColor={'#A22B21'}>VIEW ALL PRODUCTS</Button>
        </Box>

      </Box >

      <Box id="featured-products" m={0} bg={'radial-gradient(#a694542b, #f5b073);'} pt={10} pb={10}>
        <Stack direction="column" spacing={4} align="center" justify="center" py={4}>
          <Stack color={'#A22B21'} direction="column" spacing={0} align="center" justify="center" mb={4}>
            <Heading p={'5px 30px'} colorScheme="black" variant="outline" rounded="full" fontSize={'5xl'} fontFamily="'Playfair Display', sans-serif">
              Energy Patch
            </Heading>
            <Box>_____</Box>
            <Text color={'black'} mt={5} fontSize={'lg'} maxW={'80%'} textAlign={'center'} fontFamily="'Outfit', sans-serif">
              Discover the finest selection of premium dry fruits, handpicked for quality, taste, and nutrition. At ``Appleton World``, we bring you nature’s powerhouse of energy, delicious, crunchy, and wholesome dry fruits that are perfect for snacking, gifting, or adding to your daily diet. Whether you're looking for crunchy almonds, creamy cashews, fiber rich raisins, apricots or exotic pistachios, we have it all. Our dry fruits are hygienically packed to retain freshness and ensure you get the best in every bite.
            </Text>
          </Stack>
        </Stack>

        <Stack spacing={6} mt={4} maxW="1300px" mx="auto" px={{ base: 3, md: 0 }}>
          <Slider {...featuredProductSliderSettings}>
            {products.map((product) => (
              <Box key={product._id} px={2}>
                <Card
                  shadow="none"
                  w="100%"
                  maxW={{ base: "180px", md: "280px", lg: "320px" }}
                  mx="auto"
                >
                  <CardBody
                    p={0}
                    borderRadius="24px"
                    bg="white"
                    boxShadow="0px 4px 12px rgba(0,0,0,0.08)"
                  >
                    <Link
                      to={`/productdetails/${product._id}`}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onClick={handleCardClick}
                    >
                      <Box p={2}>
                        <Image
                          src={`http://localhost:5000/uploads${hoveredProductId === product._id
                            ? product.images[1]
                            : product.images[0]
                            }`}
                          alt={product.name}
                          w="100%"
                          h={{ base: "140px", md: "290px" }}
                          objectFit="contain"
                          borderRadius="sm"
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

                      <Text
                        fontSize={{ base: "sm", md: "md" }}
                        fontStyle="italic"
                      >
                        <span
                          style={{
                            padding: "0 7px",
                            borderRadius: "4px",
                            background:
                              "linear-gradient(90deg, #ffa34e 0%, rgb(255,233,182) 50%, #ffa34e 100%)",
                          }}
                        >
                          {product.category?.name}
                        </span>
                      </Text>

                      <Text fontSize={{ base: "md", md: "lg" }} fontWeight={500}>
                        ₹ {product.price} / {product.weight}{product.unit}
                      </Text>

                      <Button
                        mt={2}
                        w="100%"
                        size={{ base: "sm", md: "md" }}
                        borderRadius="full"
                        onClick={() => addToWishlist(product._id)}
                      >
                        Add To Wishlist
                      </Button>
                    </Stack>
                  </CardBody>
                </Card>
              </Box>
            ))}
          </Slider>
        </Stack>

        <Box textAlign={'center'} mt={10}>
          <Button borderRadius={'0'} px={7} py={5} fontWeight={700} fontSize={'sm'} color={'white'} bgColor={'#A22B21'}>VIEW ALL PRODUCTS</Button>
        </Box>

      </Box >

      <Box id="featured-products" m={0} bg={'radial-gradient(#a694542b, #8e4f46);'} pt={10} pb={10}>
        <Stack direction="column" spacing={4} align="center" justify="center" py={4}>
          <Stack color={'#A22B21'} direction="column" spacing={0} align="center" justify="center" mb={4}>
            <Heading p={'5px 30px'} colorScheme="black" variant="outline" rounded="full" fontSize={'5xl'} fontFamily="'Playfair Display', sans-serif">
              Choco Nuts
            </Heading>
            <Box>_____</Box>
            <Text color={'black'} mt={5} fontSize={'lg'} maxW={'80%'} textAlign={'center'} fontFamily="'Outfit', sans-serif">
              Discover the finest selection of premium dry fruits, handpicked for quality, taste, and nutrition. At ``Appleton World``, we bring you nature’s powerhouse of energy, delicious, crunchy, and wholesome dry fruits that are perfect for snacking, gifting, or adding to your daily diet. Whether you're looking for crunchy almonds, creamy cashews, fiber rich raisins, apricots or exotic pistachios, we have it all. Our dry fruits are hygienically packed to retain freshness and ensure you get the best in every bite.
            </Text>
          </Stack>
        </Stack>

        <Stack spacing={6} mt={4} maxW="1300px" mx="auto" px={{ base: 3, md: 0 }}>
          <Slider {...featuredProductSliderSettings}>
            {products.map((product) => (
              <Box key={product._id} px={2}>
                <Card
                  shadow="none"
                  w="100%"
                  maxW={{ base: "180px", md: "280px", lg: "320px" }}
                  mx="auto"
                >
                  <CardBody
                    p={0}
                    borderRadius="24px"
                    bg="white"
                    boxShadow="0px 4px 12px rgba(0,0,0,0.08)"
                  >
                    <Link
                      to={`/productdetails/${product._id}`}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onClick={handleCardClick}
                    >
                      <Box p={2}>
                        <Image
                          src={`http://localhost:5000/uploads${hoveredProductId === product._id
                            ? product.images[1]
                            : product.images[0]
                            }`}
                          alt={product.name}
                          w="100%"
                          h={{ base: "140px", md: "290px" }}
                          objectFit="contain"
                          borderRadius="sm"
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

                      <Text
                        fontSize={{ base: "sm", md: "md" }}
                        fontStyle="italic"
                      >
                        <span
                          style={{
                            padding: "0 7px",
                            borderRadius: "4px",
                            background:
                              "linear-gradient(90deg, #ffa34e 0%, rgb(255,233,182) 50%, #ffa34e 100%)",
                          }}
                        >
                          {product.category?.name}
                        </span>
                      </Text>

                      <Text fontSize={{ base: "md", md: "lg" }} fontWeight={500}>
                        ₹ {product.price} / {product.weight}{product.unit}
                      </Text>

                      <Button
                        mt={2}
                        w="100%"
                        size={{ base: "sm", md: "md" }}
                        borderRadius="full"
                        onClick={() => addToWishlist(product._id)}
                      >
                        Add To Wishlist
                      </Button>
                    </Stack>
                  </CardBody>
                </Card>
              </Box>
            ))}
          </Slider>
        </Stack>

        <Box textAlign={'center'} mt={10}>
          <Button borderRadius={'0'} px={7} py={5} fontWeight={700} fontSize={'sm'} color={'white'} bgColor={'#A22B21'}>VIEW ALL PRODUCTS</Button>
        </Box>

      </Box >


      <Box
        w="100%"
        py={{ base: 10, md: 20 }}
        px={{ base: 4, md: 16 }}
        bg="white"
      >
        <Grid
          templateColumns={{ base: "1fr", md: "1fr 1fr" }}
          gap={{ base: 10, md: 20 }}
          alignItems="center"
        >
          {/* LEFT IMAGE */}
          <GridItem>
            <Box w="100%" display="flex" justifyContent="center">
              <Image
                src="/images/about.webp" // 🔴 replace with your image
                alt="Appleton Dry Fruits"
                maxW="100%"
                objectFit="contain"
              />
            </Box>
          </GridItem>

          {/* RIGHT CONTENT */}
          <GridItem>
            <Stack spacing={6} maxW="600px">
              <Heading
                fontSize={{ base: "3xl", md: "5xl" }}
                fontFamily="'Playfair Display', serif"
                fontWeight={700}
                color="#A22B21"
              >
                Fresh, Nutritious,
              </Heading>

              <Heading
                fontSize={{ base: "2xl", md: "4xl" }}
                fontFamily="'Playfair Display', serif"
                fontWeight={700}
                color="black"
                lineHeight="1.3"
              >
                And Guilt – Free Snacking
              </Heading>

              <Text
                fontSize={{ base: "md", md: "lg" }}
                color="gray.700"
                fontFamily="'Outfit', sans-serif"
                lineHeight="1.8"
              >
                At Appleton (a brand by Nirant Dry Fruits Private Limited), we believe
                that good health begins with quality nutrition and that’s exactly what
                we deliver. With roots dating back to 2014 as Shivam Cashew Industry,
                we began our journey by importing raw cashews from Africa and setting
                up an in-house production facility in Ahmedabad to serve customers
                across India.
              </Text>

              <Text
                fontSize={{ base: "md", md: "lg" }}
                color="gray.700"
                fontFamily="'Outfit', sans-serif"
                lineHeight="1.8"
              >
                Over the years, our commitment to quality and customer trust has helped
                us evolve into one of India’s leading importers and processors of
                premium dry fruits including almonds, pistachios, cashews, walnuts,
                and more.
              </Text>

              <Button
                alignSelf="flex-start"
                bg="#9E2B20"
                color="white"
                px={8}
                py={6}
                borderRadius="full"
                fontSize="md"
                _hover={{ bg: "#7f2219" }}
              >
                Explore More
              </Button>
            </Stack>
          </GridItem>
        </Grid>
      </Box>

      <Box
        w="100%"
        bg="white"
        py={{ base: 8, md: 10 }}
        borderTop="1px solid #eee"
        borderBottom="1px solid #eee"
        backgroundColor={'#F1F1F1'}
      >
        <Grid
          templateColumns={{ base: "1fr 1fr", md: "repeat(4, 1fr)" }}
          maxW="100%"
          mx="auto"
          position="relative"
        >
          {/* Healthy */}
          <GridItem borderRight={'1px solid grey'}>
            <Stack align="center" spacing={3}>
              <GiHealthNormal size={48} color="#E38B2D" />
              <Text
                fontSize="lg"
                fontWeight={600}
                fontFamily="'Playfair Display', serif"
              >
                Healthy
              </Text>
            </Stack>
          </GridItem>

          {/* Tasty */}
          <GridItem borderRight={'1px solid grey'}>
            <Stack align="center" spacing={3}>
              <GiStarSattelites size={48} color="#E38B2D" />
              <Text
                fontSize="lg"
                fontWeight={600}
                fontFamily="'Playfair Display', serif"
              >
                Tasty
              </Text>
            </Stack>
          </GridItem>

          {/* Crunchy */}
          <GridItem borderRight={'1px solid grey'}>
            <Stack align="center" spacing={3}>
              <GiPeanut size={48} color="#E38B2D" />
              <Text
                fontSize="lg"
                fontWeight={600}
                fontFamily="'Playfair Display', serif"
              >
                Crunchy
              </Text>
            </Stack>
          </GridItem>

          {/* Natural */}
          <GridItem>
            <Stack align="center" spacing={3}>
              <GiPlantSeed size={48} color="#E38B2D" />
              <Text
                fontSize="lg"
                fontWeight={600}
                fontFamily="'Playfair Display', serif"
              >
                Natural
              </Text>
            </Stack>
          </GridItem>
        </Grid>
      </Box>

      <Box
        w="100%"
        py={{ base: 10, md: 20 }}
        px={{ base: 4, md: 20 }}
        bg="white"
      >
        <Grid
          templateColumns={{ base: "1fr", md: "1.2fr 0.8fr" }}
          gap={{ base: 10, md: 16 }}
          alignItems="center"
          maxW="1400px"
          mx="auto"
          py={5}
          px={10}
        >
          {/* LEFT – FORM */}
          <GridItem as="form" onSubmit={handleSubmit}>
            <Stack spacing={6}>
              <Heading
                fontSize={{ base: "3xl", md: "5xl" }}
                fontFamily="'Playfair Display', serif"
                color="#A22B21"
              >
                Export Inquiry
              </Heading>

              <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
                <FormControl isRequired>
                  <FormLabel>Enter Your Name*</FormLabel>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="What's Your Good Name?"
                    variant="flushed"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Email Address*</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter Your Email Address"
                    variant="flushed"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Phone Number*</FormLabel>
                  <Input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter Your Phone Number"
                    variant="flushed"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Subject*</FormLabel>
                  <Input
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="How Can We Help You?"
                    variant="flushed"
                  />
                </FormControl>
              </Grid>

              <FormControl isRequired>
                <FormLabel>Your Message*</FormLabel>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Describe About Your Project"
                  variant="flushed"
                  rows={4}
                />
              </FormControl>

              <Button
                type="submit"
                mt={4}
                bg="#9E2B20"
                color="white"
                size="lg"
                borderRadius="md"
                _hover={{ bg: "#7f2219" }}
                w="100%"
                isLoading={isSubmitting}
                loadingText="Sending..."
              >
                Send Message
              </Button>
            </Stack>
          </GridItem>

          {/* RIGHT – IMAGE */}
          <GridItem
            display={{ base: "none", md: "flex" }}
            justifyContent="center"
          >
            <Image
              src="/images/contact.webp" // 🔴 replace with your image
              alt="Dry Fruits Export"
              w="100%"
              h="100%"
              objectFit="cover"
            />
          </GridItem>
        </Grid>
      </Box>

    </>
  );
};

export default Home;
