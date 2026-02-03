import axios from "axios";

const baseURL = "http://localhost:5000/api";

const instance = axios.create({
    baseURL: baseURL,
    withCredentials: true,
});

export async function signup(name, email, password, mobile, dob) {
    try {
        const response = await instance.post("/auth/signup", {
            name,
            email,
            password,
            mobile,
            dob

        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function activate(email, activationCode) {
    try {
        console.log("Email:", email, "Activation Code:", activationCode);
        const response = await instance.post("/auth/activate", {
            email: email,
            activationCode: activationCode
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export async function login(email, password) {
    try {
        const response = await instance.post("/auth/login", {
            email,
            password
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function handleGoogleLogin(tokenId) {
    try {
        const response = await instance.post("/auth/registerOrLogin", {
            tokenId
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function logout() {
    try {
        const response = await instance.post("/auth/logout");
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getSingleUser() {
    try {
        const response = await instance.post("/auth/getSingleUser");
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getAllCategories() {
    try {
        const response = await instance.get("/categories");
        return response.data;
    } catch (error) {
        throw error;
    }
}

// Change the arguments to accept a single filter object
export async function getAllProducts(filters = {}) {
    try {
        const response = await instance.get("/products", {
            // Axios 'params' will automatically convert this object 
            // into a query string: ?category=ID&search=cashew...
            params: {
                category: filters.category,
                search: filters.search,
                minPrice: filters.minPrice,
                maxPrice: filters.maxPrice,
                tags: filters.tags,
                page: filters.page,
                itemsPerPage: filters.itemsPerPage,
                sort: filters.sort,
                // ADD THESE TWO LINES
                limit: filters.limit,
                exclude: filters.exclude
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error in getAllProducts API:", error);
        throw error;
    }
}

// Cart API's

export async function getCart() {
    try {
        const response = await instance.get("/cart");
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getCartTotal() {
    try {
        const response = await instance.get("/cart/total");
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function addToCartt(productId, quantity, selectedColor) {
    try {
        const response = await instance.post("/cart/add", {
            product: productId,
            quantity
        });
        return response;
    } catch (error) {
        throw error;
    }
}

// Add this to your api actions file
export const updateCartQty = async (productId, quantity) => {
    try {
        const response = await instance.put('/cart/update', { productId, quantity });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export async function removeFromCart(productId, color) {
    try {
        const response = await instance.post(`/cart/remove`, {
            productId: productId,
            color: color,
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export const clearUserCart = async () => {
    try {
        const response = await instance.delete('/cart/clear');
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Wishlist API's

export async function getWishlist() {
    try {
        const response = await instance.get("/wishlist");
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function addToWishlistt(productId) {
    try {
        const response = await instance.post("/wishlist/add", {
            product: productId
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export async function removeFromWishlist(productId) {
    try {
        const response = await instance.post(`/wishlist/remove`, {
            productId: productId
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export const createOrder = async (orderData) => {
    const { data } = await instance.post('/order/create', orderData);
    return data;
};

export const verifyPayment = async (verifyData) => {
    const { data } = await instance.post('/order/verify', verifyData);
    return data;
};

// inquiry API
export const sendInquiry = async (inquiryData) => {
    // Matches the route: router.post("/submit", submitInquiry);
    const response = await instance.post('/inquiry/submit', inquiryData);
    return response.data;
};

// orders API

// GET: Fetch all orders for the currently logged-in user
// Add 'search' as a third parameter
export const getMyOrders = async (currentPage, ordersPerPage, search = "") => {
    const params = {
        page: currentPage,
        limit: ordersPerPage,
        search: search, // This hits the req.query.search in your controller
    };
    try {
        const response = await instance.get('/order/myorders', { params });
        return response;
    } catch (error) {
        console.error("API Error [getMyOrders]:", error.response?.data || error.message);
        throw error;
    }
};

// 1. Action to request the reset link
export const forgotPassword = async (email) => {
    try {
        const { data } = await instance.post(`/auth/forgotPassword`, { email });
        return data;
    } catch (error) {
        throw error;
    }
};

// 2. Action to submit the new password
export const resetPassword = async (token, passwords) => {
    try {
        // passwords should be { password: 'new', confirmPassword: 'new' }
        const { data } = await instance.put(`/auth/password/reset/${token}`, passwords);
        return data;
    } catch (error) {
        throw error;
    }
};

// review section api's
/**
 * ===============================
 * ADD OR UPDATE REVIEW (USER)
 * ===============================
 * POST /reviews/:productId
 */
export const addOrUpdateReview = async (productId, reviewData) => {
    try {
        const res = await instance.post(
            `/reviews/${productId}`,
            reviewData
        );

        return res.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

/**
 * ===============================
 * GET ALL REVIEWS OF A PRODUCT
 * ===============================
 * GET /reviews/:productId
 */
export const getProductReviews = async (productId) => {
    try {
        const res = await instance.get(
            `/reviews/${productId}`
        );

        return res.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getReviewSummary = async (productId) => {
    try {
        const res = await instance.get(
            `/reviews/summary/${productId}`
        );
        return res.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getSingleProductData = async (productId) => {
    try {
        const response = await instance.get(`/products/${productId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// coupon api's
export const validateCoupon = async (couponData) => {
    // couponData = { code, cartItems, cartTotal }
    const { data } = await instance.post('/v1/coupons/validate', couponData);
    return data;
};

export const getPublicCoupons = async () => {
    try {
        const { data } = await instance.get('/v1/coupons/public');
        return data.coupons;
    } catch (error) {
        throw error.response?.data?.message || "Error fetching coupons";
    }
};