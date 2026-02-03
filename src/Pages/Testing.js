// Home.js

import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import StaticSlider from "../components/StaticSlider";

const Testing = ({ }) => {

  return (
    <>
      <Box
        px="50px" // 50px padding on the left and right
        py="20px" // Optional: Padding on top and bottom
        bg="gray.100" // Optional: Background color for better visual separation
      >
        <StaticSlider />
      </Box>
    </>
  );
};

export default Testing;
