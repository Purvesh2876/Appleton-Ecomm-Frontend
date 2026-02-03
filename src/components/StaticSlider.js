import React from "react";
import Slider from "react-slick";
import { Box, Text, Image, Stack, IconButton, Card, CardBody } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
// import { Card, CardBody } from "@/components/ui/card";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import slider1 from '../images/1.png';

const StaticSlider = ({ products }) => {
  const CustomPrevArrow = ({ onClick }) => (
    <IconButton
      aria-label="Previous"
      icon={<ChevronLeftIcon />}
      position="absolute"
      left="-40px"
      top="50%"
      transform="translateY(-50%)"
      zIndex="2"
      onClick={onClick}
      bg="blackAlpha.800"
      color="white"
      rounded="full"
      _hover={{ bg: "blackAlpha.600" }}
    />
  );

  const CustomNextArrow = ({ onClick }) => (
    <IconButton
      aria-label="Next"
      icon={<ChevronRightIcon />}
      position="absolute"
      right="-40px"
      top="50%"
      transform="translateY(-50%)"
      zIndex="2"
      onClick={onClick}
      bg="blackAlpha.800"
      color="white"
      rounded="full"
      _hover={{ bg: "blackAlpha.600" }}
    />
  );

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 5, slidesToScroll: 1 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2, slidesToScroll: 1 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1, slidesToScroll: 1 },
      },
    ],
  };

  // Static content for the cards
  const staticContent = [
    { id: 1, image: slider1, name: "Product 1", price: "₹ 100" },
    { id: 2, image: slider1, name: "Product 2", price: "₹ 200" },
    { id: 3, image: slider1, name: "Product 3", price: "₹ 300" },
    { id: 4, image: slider1, name: "Product 4", price: "₹ 400" },
    { id: 5, image: slider1, name: "Product 5", price: "₹ 500" },
    { id: 5, image: slider1, name: "Product 5", price: "₹ 500" },
    { id: 5, image: slider1, name: "Product 5", price: "₹ 500" },
  ];

  return (
    <Box position="relative">
      <Slider {...sliderSettings}>
        {staticContent.map((item) => (
          <Card key={item._id} shadow={"none"} width="244px">
            <CardBody p={0}>
              <Stack sx={{ objectFit: "contain" }} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                <Image
                  height="366px"
                  width="244px"
                  objectFit="cover"
                  borderRadius={"25px"}
                  src={item.image}
                  alt={item.name}
                />
              </Stack>
              <Stack direction="column" align="center" justify="center">
                <Text marginBottom={"5px"} size="xs">
                  {item.name}
                  <br />
                  <Text m={1} fontSize="xs" fontFamily="'Quicksand', sans-serif">
                    {item.price}
                  </Text>
                </Text>
              </Stack>
            </CardBody>
          </Card>
        ))}
      </Slider>
    </Box>
  );
};

export default StaticSlider;