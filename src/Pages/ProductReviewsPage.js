import {
    Box,
    Text,
    VStack,
    HStack,
    Button,
    Container,
    Divider,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    getProductReviews,
    getReviewSummary,
} from "../actions/api";
import Stars from "../components/stars";

const REVIEWS_LIMIT = 10;

const ProductReviewsPage = () => {
    const { productId } = useParams();
    const navigate = useNavigate();

    const [reviews, setReviews] = useState([]);
    const [summary, setSummary] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sort, setSort] = useState("latest");

    useEffect(() => {
        fetchSummary();
        fetchReviews();
        window.scrollTo(0, 0);
    }, [page, sort]);

    const fetchSummary = async () => {
        const data = await getReviewSummary(productId);
        setSummary(data);
    };

    const fetchReviews = async () => {
        const data = await getProductReviews(productId, {
            page,
            limit: REVIEWS_LIMIT,
            sort,
        });
        setReviews(data.reviews);
        setTotalPages(data.totalPages);
    };

    return (
        <Container maxW="1200px" py={10}>
            {/* HEADER */}
            <HStack mb={6} spacing={2} fontSize="sm" color="gray.500">
                <Text cursor="pointer" onClick={() => navigate(-1)}>
                    ← Back to product
                </Text>
            </HStack>

            <Text fontSize="2xl" fontWeight="bold" mb={8}>
                Ratings & Reviews
            </Text>

            <Divider mb={8} />

            {/* REVIEWS LIST */}
            <VStack align="stretch" spacing={8}>
                {reviews.map((r) => (
                    <HStack key={r._id} align="flex-start" spacing={4}>
                        {/* Avatar */}
                        <Box
                            w="36px"
                            h="36px"
                            borderRadius="full"
                            bg="gray.300"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            fontWeight="bold"
                            fontSize="sm"
                        >
                            {r.user?.name?.[0] || "U"}
                        </Box>

                        {/* Content */}
                        <Box>
                            <Stars value={r.rating} readOnly />
                            <Text fontSize="sm" mt={1}>
                                {r.comment}
                            </Text>
                            <Text fontSize="xs" color="gray.500" mt={1}>
                                {r.user?.name || "User"} •{" "}
                                {new Date(r.createdAt).toDateString()}
                            </Text>
                        </Box>
                    </HStack>
                ))}
            </VStack>

            {/* PAGINATION */}
            {totalPages > 1 && (
                <HStack justify="center" mt={10} spacing={4}>
                    <Button
                        size="sm"
                        isDisabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                    >
                        Previous
                    </Button>

                    <Text fontSize="sm">
                        Page {page} of {totalPages}
                    </Text>

                    <Button
                        size="sm"
                        isDisabled={page === totalPages}
                        onClick={() => setPage((p) => p + 1)}
                    >
                        Next
                    </Button>
                </HStack>
            )}
        </Container>
    );
};

export default ProductReviewsPage;
