import React from 'react';
import { Box, HStack, Text } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderSteps = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname;

    // Define the steps and their routes
    const steps = [
        { label: 'SHOPPING CART', path: '/cart' },
        { label: 'CHECKOUT', path: '/checkout' },
        { label: 'ORDER COMPLETE', path: '/order-complete' },
    ];

    return (
        <Box bg="black" color="white" py={10} textAlign="center">
            <HStack justify="center" spacing={[4, 8]} fontSize={["xs", "sm"]} fontWeight="bold">
                {steps.map((step, index) => {
                    const isActive = currentPath === step.path;

                    return (
                        <React.Fragment key={step.path}>
                            <Text
                                cursor="pointer"
                                onClick={() => navigate(step.path)}
                                borderBottom={isActive ? "2px solid white" : "2px solid transparent"}
                                color={isActive ? "white" : "gray.500"}
                                pb={1}
                                transition="all 0.3s"
                                _hover={{ color: "white" }}
                            >
                                {step.label}
                            </Text>

                            {/* Show arrow between steps, but not after the last one */}
                            {index < steps.length - 1 && (
                                <Text color="gray.500" fontWeight="normal">
                                    →
                                </Text>
                            )}
                        </React.Fragment>
                    );
                })}
            </HStack>
        </Box>
    );
};

export default OrderSteps;