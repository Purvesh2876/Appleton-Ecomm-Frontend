import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Grid,
  GridItem,
  Stack,
  Text,
  Button,
  Heading,
  HStack,
  Icon,
  Divider,
  Image,
} from "@chakra-ui/react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { MdLocationOn, MdPhone, MdEmail, MdAccessTime } from "react-icons/md";

const Footer = () => {
  return (
    <>
      {/* Decorative Image */}
      <Image
        src="/images/Footer.webp"
        alt="Footer decoration"
        mx="auto"
        mt={10}
        zIndex={1}
        position="relative"
      />

      <Box bg="#9E2B20" color="white" pt={20}>
        <Grid
          maxW="1400px"
          mx="auto"
          px={{ base: 6, md: 12 }}
          gap={{ base: 10, md: 12 }}
          templateColumns={{
            base: "1fr",
            sm: "1fr 1fr",
            lg: "1.2fr 1fr 1fr 1.4fr",
          }}
        >
          {/* BRAND */}
          <GridItem>
            <Stack spacing={6}>
              <Heading fontSize="3xl" fontFamily="'Playfair Display', serif">
                Apple<span style={{ color: "#F5B041" }}>Ton</span>{" "}
                <Text as="span" fontSize="lg">
                  World
                </Text>
              </Heading>

              <Stack direction="row" spacing={3} flexWrap="wrap">
                <Button
                  bg="white"
                  color="#9E2B20"
                  borderRadius="full"
                  size="sm"
                  fontWeight={600}
                >
                  Dealer Inquiry
                </Button>
                <Button
                  bg="white"
                  color="#9E2B20"
                  borderRadius="full"
                  size="sm"
                  fontWeight={600}
                >
                  Customer Inquiry
                </Button>
              </Stack>
            </Stack>
          </GridItem>

          {/* PRODUCTS */}
          <GridItem>
            <Stack spacing={3}>
              <Heading fontSize="lg">Our Products</Heading>
              {[
                "Dry Fruits",
                "Makhana",
                "Seeds",
                "Dried Berries",
                "Dates",
                "Energy Patch",
                "Choco Nuts",
              ].map((item) => (
                <Text key={item} fontSize="sm">
                  •{" "}
                  <Link
                    to={`/products/${encodeURIComponent(item)}`}
                    style={{ color: "white", textDecoration: "none" }}
                  >
                    {item}
                  </Link>
                </Text>
              ))}
            </Stack>
          </GridItem>

          {/* QUICK LINKS */}
          <GridItem>
            <Stack spacing={3}>
              <Heading fontSize="lg">Quick Links</Heading>
              {[
                { label: "Home", path: "/" },
                { label: "About Us", path: "/about" },
                { label: "Products", path: "/products" },
                { label: "Blog", path: "/blog" },
                { label: "Contact", path: "/contact" },
              ].map((item) => (
                <Text key={item.label} fontSize="sm">
                  •{" "}
                  <Link
                    to={item.path}
                    style={{ color: "white", textDecoration: "none" }}
                  >
                    {item.label}
                  </Link>
                </Text>
              ))}
            </Stack>
          </GridItem>

          {/* CONTACT + OPEN TIME + SOCIAL */}
          <GridItem>
            <Stack spacing={4}>
              <Heading fontSize="lg">Contact</Heading>

              <HStack align="start" spacing={3}>
                <Icon as={MdLocationOn} mt={1} />
                <Text fontSize="sm" lineHeight="1.6">
                  Block No. 482, Kashiba Farm, Bakrol Gam, Sarkhej Dholka Road,
                  Ring Road, Bakrol, Ahmedabad, Gujarat 382210
                </Text>
              </HStack>

              <HStack spacing={3}>
                <Icon as={MdPhone} />
                <Text fontSize="sm">+91 91737 02597</Text>
              </HStack>

              <HStack spacing={3}>
                <Icon as={MdEmail} />
                <Text fontSize="sm">info@appletonworld.com</Text>
              </HStack>

              <HStack spacing={3}>
                <Icon as={MdAccessTime} />
                <Text fontSize="sm">
                  Mon – Sat: 10:00 am – 06:00 pm
                </Text>
              </HStack>

              <HStack spacing={4} pt={2}>
                <Icon as={FaFacebookF} boxSize={5} cursor="pointer" />
                <Icon as={FaInstagram} boxSize={5} cursor="pointer" />
                <Icon as={FaWhatsapp} boxSize={5} cursor="pointer" />
              </HStack>
            </Stack>
          </GridItem>
        </Grid>

        {/* BOTTOM BAR */}
        <Divider my={10} borderColor="whiteAlpha.300" />

        <Text
          textAlign="center"
          fontSize="sm"
          pb={6}
          px={4}
          opacity={0.9}
        >
          <Link to="/terms">Terms</Link> |{" "}
          <Link to="/privacy">Privacy</Link> |{" "}
          <Link to="/shipping">Shipping</Link> |{" "}
          <Link to="/refund">Refund</Link>
        </Text>
      </Box>
    </>
  );
};

export default Footer;
