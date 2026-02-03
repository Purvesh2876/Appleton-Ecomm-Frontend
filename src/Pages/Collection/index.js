import React, { useEffect, useState } from 'react';
import {
  Stack, Heading, Text, Flex,
  SimpleGrid,
  Card, HStack,
  CardBody, Checkbox, VStack,
  CardFooter,
  Image,
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Select, Divider,
  Input, Collapse,
  ButtonGroup,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Collection = ({ }) => {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uniqueCategories, setUniqueCategories] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category');
  const [sizeFilter, setSizeFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [colorFilter, setColorFilter] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [uniqueSizes, setUniqueSizes] = useState([]);
  const [uniqueColor, setUniqueColor] = useState([]);
  const [isSizeFilterOpen, setIsSizeFilterOpen] = useState(false);
  const [isColorFilterOpen, setIsColorFilterOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:4000/product');

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }

        const productsData = await response.json();
        setProducts(productsData);
        setLoading(false);
        console.log(productsData)
        const sizesSet = new Set(
          productsData.flatMap((product) => product.sizes)
        );
        const uniqueSizesArray = [...sizesSet];
        setUniqueSizes(uniqueSizesArray);

        // console.log(uniqueSizes)
        const colorSet = new Set(
          productsData.flatMap((product) => product.color)
        );
        const uniqueColorArray = [...colorSet];
        setUniqueColor(uniqueColorArray);

      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData(); // Call the fetchData function when the component mounts

    // Cleanup function (optional) - will be called if the component is unmounted
    return () => {
      // Any cleanup code (e.g., aborting ongoing requests) can go here
    };
  }, []);


  console.log(sizeFilter)
  const filteredProducts = products.filter((product) => {
    return (
      (category ? product.category === category : true) &&
      (sizeFilter.length === 0 ? true : product.sizes.some((size) => sizeFilter.includes(size))) &&
      (priceFilter ? product.price <= parseInt(priceFilter) : true) &&
      (tagFilter ? product.tag === tagFilter : true) &&
      (typeFilter ? product.type === typeFilter : true) &&
      (colorFilter.length === 0 ? true : product.color.some((color) => colorFilter.includes(color)))

    );
  });
  console.log('sdsd', filteredProducts)


  useEffect(() => {
    // Extract unique categories from products
    const categoriesSet = new Set(products.map((product) => product.category));
    const uniqueCategoriesArray = [...categoriesSet];
    setUniqueCategories(uniqueCategoriesArray);
  }, [products]);


  const handleSizeChange = (size) => {
    if (sizeFilter.includes(size)) {
      setSizeFilter(sizeFilter.filter((selectedSize) => selectedSize !== size));
    } else {
      setSizeFilter([...sizeFilter, size]);
    }
  };

  const handleColorChange = (color) => {
    if (colorFilter.includes(color)) {
      setColorFilter(colorFilter.filter((selectedColor) => selectedColor !== color));
    } else {
      setColorFilter([...colorFilter, color]);
    }
  };


  return (<>

    {/* <Box overflowX="hidden" overflowY="hidden">
  
      <Slider {...sliderSettings}>
        {imagePaths.map((path, index) => (
          <Fade key={index} in={true} style={{ transitionDelay: `${index * 0.5}s` }}>
            <Box>
              <img src={path} alt={`Image ${index + 1}`} style={{ width: '100%', height: 'auto' }} />
            </Box>
          </Fade>
        ))}
      </Slider>

      
      <Slider {...sliderSettings}  >
        {posterPaths.map((path, index) => (
          <Fade  key={index} in={true} style={{ transitionDelay: `${index * 0.5}s` }}>
            <Box mb={4}>
              <img src={path} alt={`Poster ${index + 1}`} style={{ width: '100%', height: 'auto' }} />
            </Box>
          </Fade>
        ))}
      </Slider>

      
    </Box> */}

    <br></br>
    <br></br>
    {/* Filter button for mobile */}
    <Button onClick={onOpen} display={{ md: 'none' }}>
      Open Filter
    </Button>

    {/* Drawer for mobile view */}
    <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Filters</DrawerHeader>
          <DrawerBody>
            {/* Filter options */}
            <ButtonGroup flexDirection="column">
              <Select
                placeholder="Filter by Size"
                onChange={(e) => setSizeFilter(e.target.value)}
              >
                {/* Size options */}
              </Select>

              <Input
                type="number"
                placeholder="Filter by Price"
                onChange={(e) => setPriceFilter(e.target.value)}
              />

              <Select
                placeholder="Filter by Tag"
                onChange={(e) => setTagFilter(e.target.value)}
              >
                {/* Tag options */}
              </Select>

              <Select
                placeholder="Filter by Type"
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                {/* Type options */}
              </Select>

              <Select
                placeholder="Filter by Color"
                onChange={(e) => setColorFilter(e.target.value)}
              >
                {/* Color options */}
              </Select>
            </ButtonGroup>
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>

    {/* Content section */}
    <Flex>
      {/* Filter options for desktop */}
      <Stack
        spacing={4}
        align="center"
        justify="center"
        ml={{ md: '8' }}
        display={{ base: 'none', md: 'block' }}
      >
        {/* Filter options */}
        <Stack flexDirection="column">
          <VStack align="start">
            <Text
              onClick={() => setIsSizeFilterOpen(!isSizeFilterOpen)}
            // variant="link"
            >
              {isSizeFilterOpen ? '🔼 Sizes' : '🔽 Sizes'}
            </Text>
            <Collapse in={isSizeFilterOpen}>
              <VStack align="start" spacing={2}>
                {/* <Checkbox
                      isChecked={sizeFilter.length === uniqueSizes.length}
                      onChange={() => {
                        setSizeFilter(
                          sizeFilter.length === uniqueSizes.length ? [] : uniqueSizes
                        );
                      }}
                    >
                      Select All
                    </Checkbox> */}
                {uniqueSizes.map((sizesString) => {
                  const sizesArray = sizesString.split(','); // Split the sizes string into an array
                  return sizesArray.map((size) => (
                    <Checkbox
                      key={size}
                      isChecked={sizeFilter.includes(size)}
                      onChange={() => handleSizeChange(size)}
                    >
                      {size}
                    </Checkbox>
                  ));
                })}
                {/* {uniqueSizes.map((size) => (
                      <Checkbox
                      key={size}
                      isChecked={sizeFilter.includes(size)}
                      onChange={() => handleSizeChange(size)}
                      justifyContent={'space-between'}
                        // onChange={() => handleSizeChange(size)}
                      >
                        <HStack justify="space-between" w="100%">
                          <Text>{size}</Text>
                          <Text >({filteredProducts.filter((product) => product.sizes.includes(size)).length})</Text>
                        </HStack>
                       
                      </Checkbox>
                    ))} */}
              </VStack>
            </Collapse>
          </VStack>




          <Divider mt={2} mb={2} orientation="vertical" borderColor="gray.200" height="100%" borderWidth="0.3px" />


          <VStack align="start">
            <Text
              onClick={() => setIsColorFilterOpen(!isColorFilterOpen)}
            // variant="link"
            >
              {isColorFilterOpen ? '🔼 Color' : '🔽 Color'}
            </Text>
            <Collapse in={isColorFilterOpen}>
              <VStack align="start" spacing={2}>
                <Checkbox
                  isChecked={colorFilter.length === uniqueColor.length}
                  onChange={() => {
                    setColorFilter(
                      colorFilter.length === uniqueColor.length ? [] : uniqueColor
                    );
                  }}
                >
                  Select All
                </Checkbox>
                {uniqueColor.map((color) => (
                  <Checkbox
                    key={color}
                    isChecked={colorFilter.includes(color)}
                    onChange={() => handleColorChange(color)}
                  // onChange={() => handleSizeChange(size)}
                  >
                    {color}
                  </Checkbox>
                ))}
              </VStack>
            </Collapse>
          </VStack>

          <Divider mt={2} mb={2} orientation="vertical" borderColor="gray.200" height="100%" borderWidth="0.3px" />



          <Input
            type="number"
            placeholder="Filter by Price"
            onChange={(e) => setPriceFilter(e.target.value)}
          />

          <Divider orientation="vertical" borderColor="gray.200" height="100%" borderWidth="0.3px" />
          <Select
            placeholder="Filter by Tag"
            onChange={(e) => setTagFilter(e.target.value)}
          >
            {/* Tag options */}
          </Select>

          <Select
            placeholder="Filter by Type"
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            {/* Type options */}
          </Select>

          <Select
            placeholder="Filter by Color"
            onChange={(e) => setColorFilter(e.target.value)}
          >
            {/* Color options */}
          </Select>
        </Stack>
      </Stack>


      {/* Product cards */}
      <Stack spacing={4} align="center" justify="center" ml={{ base: '0', md: '4' }} flex="1">
        <SimpleGrid columns={[1, 2, 5]} spacing={4} alignItems="stretch">
          {filteredProducts.map((product) => (
            // <Link
            //   to={{ pathname: `/productdetails/${product._id}`, state: { product } }}
            //   key={product._id}
            // >
            //   <Card shadow="none" maxW={['100%', '100%', 'xs']}>
            //     <CardBody p={0}>
            //       {/* {product.images.map((image, index) => ( */}
            //         <Image height="auto" width="100%" src={`http://localhost:4000${product.image[0]}`}/>
            //         {/* <h1>{`http://localhost:4000${product.image}`}</h1> */}
            //       {/* ))} */}
            //       <Stack direction="column" align="center" justify="center">
            //         {/* Product details */}
            //       </Stack>
            //     </CardBody>
            //     <CardFooter p={0} justifyContent="center" mb={2} alignItems="center">
            //       {/* Additional details */}
            //     </CardFooter>
            //   </Card>
            // </Link>
            <Link
              to={{
                pathname: `/productdetails/${product._id}`,
                state: { product },
              }}
              key={product._id}
            >
              <Card shadow={"none"} maxW={["100%", "100%", "xs"]}>
                <CardBody p={0}>
                  <Stack sx={{ objectFit: "contain" }}>
                    <Image
                      height="360px"
                      width="100%"
                      src={`http://localhost:4000${product.image[0]}`} // Replace 'your-base-url' with the actual base URL
                      // key={index}
                      alt={product.name}
                    />
                  </Stack>
                  <Stack direction="column" align="center" justify="center" justifyContent='space-between'>
                    <Text marginBottom={'5px'} size="xs">{product.name}<br /><Text fontSize='xs'>₹ {product.price}</Text></Text>
                    {/* <Text color="blue.600" mb={2} fontSize="xs">
                      ₹ {product.price}
                    </Text> */}
                  </Stack>
                </CardBody>

                <CardFooter
                  p={0}
                  justifyContent='center'
                  mb={2}
                  align="left"
                >
                  <SimpleGrid
                    // columns={[5, 5, 4, 5]}
                    columns={[4]}
                    spacing={3}
                    alignItems="stretch"
                  >
                    {product.sizes[0].split(",").map((size, index) => (
                      <Button
                        key={index}
                        size={"xs"}
                        colorScheme="black"
                        borderColor={"#e8e8e1"}
                        variant="outline"
                        rounded="none"
                      >
                        {size.trim()}{" "}
                        {/* Use trim to remove any leading/trailing whitespace */}
                      </Button>
                    ))}
                  </SimpleGrid>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </SimpleGrid>
      </Stack>
    </Flex>
    <br></br>
    <br></br>

  </>
  );
};

export default Collection;
