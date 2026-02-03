import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  Checkbox,
  Image,
  Stack,
  Collapse,
  Icon,
} from '@chakra-ui/react';
import { getAllProducts } from '../actions/api';
import { Link, useParams } from 'react-router-dom';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'; // Import icons

const FilteredProducts = () => {
  const [uniqueColors, setUniqueColors] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { categoryName } = useParams();
  const [isOpen, setIsOpen] = useState(false); // State for toggle

  const fetchData = async () => {
    try {
      const response = await getAllProducts(categoryName, selectedColors);
      setFilteredProducts(response.products);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const colorData = async () => {
    try {
      const response = await getAllProducts(categoryName);
      const colors = [...new Set(response.products.flatMap(product => product.variants.map(variant => variant.color)))];
      setUniqueColors(colors);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    colorData();
  }, [selectedColors]);

  const handleColorChange = (color) => {
    setSelectedColors((prev) => {
      if (prev.includes(color)) {
        return prev.filter(c => c !== color);
      } else {
        return [...prev, color];
      }
    });
  };

  return (
    <Box>
      <Box as="header" p={4} bg="teal.500" color="white">
        <Heading>Product Page</Heading>
      </Box>

      <Flex direction={{ base: "column", md: "row" }} p={4}>
        {/* Filter Section */}
        <Box
          w={{ base: "full", md: "200px" }}
          p={4}
          borderRadius="md"
          mb={{ base: 4, md: 0 }}
        >
          <Flex alignItems="center" onClick={() => setIsOpen(!isOpen)} cursor="pointer">
            <Heading size="md" mb={2} mr={2}>Filter by Color</Heading>
            <Icon as={isOpen ? ChevronUpIcon : ChevronDownIcon} />
          </Flex>

          <Collapse in={isOpen}>
            <Stack spacing={2} mt={2}>
              {uniqueColors.map(color => (
                <Checkbox
                  key={color}
                  isChecked={selectedColors.includes(color)}
                  onChange={() => handleColorChange(color)}
                >
                  {color}
                </Checkbox>
              ))}
            </Stack>
          </Collapse>

          <Button
            variant="outline"
            colorScheme="teal"
            onClick={() => setSelectedColors([])}
            width="full"
            mt={2}
          >
            Show All
          </Button>
        </Box>

        {/* Products List */}
        <Box flex="1" p={4} bg="white" borderRadius="md">
          <Heading size="md">Products</Heading>
          <SimpleGrid columns={[1, 2, 2, 4, 5]} spacing={4} mt={4}>
            {filteredProducts.map(product => (
              <>
                <Link
                  to={{
                    pathname: `/productdetails/${product._id}`,
                    state: { product },
                  }}
                  key={product._id}
                >
                  <Box
                    key={product.name}
                    // shadow="md"
                    // borderWidth="1px"
                    // borderRadius="md"
                    textAlign="center"
                    bg="white"
                    height="auto"
                  >
                    <Image
                      src={`http://localhost:5000/uploads${product.images[0]}`}
                      alt={product.name}
                      borderRadius="md"
                      mb={0}
                      width="100%"
                      height="250px"
                      objectFit="cover"
                    />
                    <Box p={2}>
                      <Heading size="sm">{product.name}</Heading>
                      <Text fontSize="lg" fontWeight="bold" color="teal.500">
                        ${product.variants[0].price}
                      </Text>
                    </Box>
                  </Box>
                </Link>
              </>
            ))}
          </SimpleGrid>
        </Box>
      </Flex>
    </Box>
  );
};

export default FilteredProducts;
