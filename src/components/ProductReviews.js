import {
    Box,
    Flex,
    Text,
    VStack,
    Textarea,
    Button,
    Divider,
    HStack,
    useToast,
    Progress,
    Avatar,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Stars from "./stars";
import { addOrUpdateReview, getProductReviews, getReviewSummary } from "../actions/api";
import { StarIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

const ProductReviews = ({ productId, ratingsAverage, ratingsCount, mt }) => {
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [summary, setSummary] = useState(null);
    const toast = useToast();
    const navigate = useNavigate();

    const fetchSummary = async () => {
        try {
            const data = await getReviewSummary(productId);
            setSummary(data);
        } catch (error) {
            console.error("Error fetching review summary:", error);
        }
    };

    useEffect(() => {
        fetchReviews();
        fetchSummary();
    }, [productId]);

    const fetchReviews = async () => {
        try {
            const data = await getProductReviews(productId, { limit: 4 });
            setReviews(data.reviews);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        }
    };

    const submitReview = async () => {
        try {
            const response = await addOrUpdateReview(productId, { rating, comment });
            toast({
                title: "Review submitted",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            // ✅ Clear form on success
            setRating(0);
            setComment("");
            // ✅ Refresh reviews
            fetchReviews();
        } catch (error) {
            // optional: show toast error
            console.error(error);
        }
    };


    return (
        <Box mt={mt ? mt : 0}>

            <Box w={'full'} display={'flex'} alignItems={'center'} justifyContent={'center'} p={5} bgColor={'#F9F9F9'} border={'0.5px solid #ededed'}>
                Additional Information
            </Box>
            <Divider mb={10} />

            {/* TOP SECTION */}
            <Flex
                direction={{ base: "column", md: "row" }}
                gap={12}
                align="flex-start"
            >
                {/* LEFT: RATING SUMMARY */}
                {summary && (
                    <Box flex="1" spacing={4}>
                        <HStack spacing={2} mb={2} height={'100%'}>
                            <Text fontSize="7xl" fontWeight="normal" fontFamily={'Assistant'} >
                                {summary.average}
                            </Text>
                            <Box mt={4}>
                                <StarIcon color="teal.400" boxSize={6} />
                            </Box>
                        </HStack>

                        <Text fontSize="sm" color="gray.500" mb={6}>
                            {summary?.total.toLocaleString()} Reviews
                        </Text>

                        <VStack spacing={3} align="stretch">
                            {[5, 4, 3, 2, 1].map((star) => {
                                const count = summary.distribution[star];
                                const percent = summary.total
                                    ? (count / summary.total) * 100
                                    : 0;

                                return (
                                    <HStack key={star} spacing={3}>
                                        <HStack minW="45px">
                                            <Text fontSize="sm">{star}</Text>
                                            <StarIcon boxSize={3} color="orange.400" />
                                        </HStack>

                                        <Progress
                                            value={percent}
                                            h="6px"
                                            borderRadius="full"
                                            bg="gray.200"
                                            flex="1"
                                            minW={{ base: "120px", md: "auto" }}
                                            sx={{
                                                "& > div": {
                                                    background: "#2FA4A9", // Myntra teal
                                                },
                                            }}
                                        />


                                        <Text fontSize="sm" minW="40px" textAlign="right">
                                            {count}
                                        </Text>
                                    </HStack>
                                );
                            })}
                        </VStack>
                    </Box>
                )}


                {/* RIGHT: ADD REVIEW */}
                <Box flex="1">
                    <Text fontWeight="bold" mb={2}>
                        Add a Review
                    </Text>

                    <Text fontSize="sm" color="gray.500" mb={4}>
                        Your email address will not be published. Required fields are marked{" "}
                        <Text as="span" color="red">*</Text>
                    </Text>

                    <VStack align="start" spacing={4}>
                        <Text fontWeight="semibold">
                            Your rating <Text as="span" color="red">*</Text>
                        </Text>
                        <Stars value={rating} onChange={setRating} />

                        <Text fontWeight="semibold">
                            Your review <Text as="span" color="red">*</Text>
                        </Text>
                        <Textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={5}
                        />

                        <Button
                            bg="#A22B21"
                            color="white"
                            size="sm"
                            _hover={{ bg: "#802219" }}
                            onClick={submitReview}
                            borderRadius={'none'}
                        >
                            Submit
                        </Button>
                        {/* REVIEWS LIST */}
                        <Box mt={5}>
                            <Text fontWeight="bold" mb={6}>
                                Reviews
                            </Text>

                            <VStack align="stretch" spacing={6}>
                                {reviews.map((r) => (
                                    <HStack
                                        key={r._id}
                                        align="flex-start"
                                        spacing={4}
                                    >
                                        {/* PROFILE ICON */}
                                        <Avatar
                                            size="sm"
                                            name={r.user?.name || "User"}
                                            bg="gray.300"
                                        />

                                        {/* REVIEW CONTENT */}
                                        <Box>
                                            <Stars value={r.rating} readOnly />

                                            <Text fontSize="sm" color="gray.600" mt={1}>
                                                {r.comment}
                                            </Text>

                                            <Text fontSize="xs" color="gray.400" mt={1}>
                                                {new Date(r.createdAt).toDateString()}
                                            </Text>
                                        </Box>
                                    </HStack>
                                ))}
                            </VStack>

                            <Button
                                variant="link"
                                color="#A22B21"
                                onClick={() => navigate(`/products/${productId}/reviews`)}
                                mt={2}
                            >
                                View all {summary?.total} reviews
                            </Button>

                        </Box>
                    </VStack>
                </Box>
                {/* earlier all reviews were seen here... */}
            </Flex>

        </Box>
    );
};

export default ProductReviews;