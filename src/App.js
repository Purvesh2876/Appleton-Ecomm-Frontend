import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header';
import Header1 from './components/header1';
import Home from './Pages/Home';
import About from './Pages/About';
import ProductDetails from './Pages/ProductDetails/index.js';
import Collection from './Pages/Collection/index.js';
import Footer from './components/footer';
import TermsAndCondition from './Pages/TermsAndCondition.js';
import Refund from './Pages/Refund.js';
import Privacy from './Pages/Privacy.js';
import FilteredProducts from './Pages/filteredProducts.js';
import Signup from './Pages/Signup.js';
import Login from './Pages/Login.js';
import Otp from './Pages/Otp.js';
import Profile from './Pages/Profile.js';
import AllProducts from './Pages/AllProducts.js';
import Testing from './Pages/Testing.js';
import Shipping from './Pages/Shipping.js';
import Contact from './Pages/Contact.js';
import MyOrders from './Pages/Myorders.js';
import CartPage from './Pages/CartPage.js';
import CheckoutPage from './Pages/CheckoutPage.js';
import ResetPasswordPage from './Pages/ResetPasswordPage.js';
import ProductReviewsPage from './Pages/ProductReviewsPage.js';

function App() {
  const isMobile = window.innerWidth < 1000;
  return (
    <Router>
      <div>
        {/* header 1 should only be visible in device more than 1000px
         */}
        {!isMobile && <Header1 />}
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/testing" element={<Testing />} />
          <Route path="/products/:categoryName" element={<FilteredProducts />} />
          <Route path="/about" element={<About />} />
          <Route path="/termsandcondition" element={<TermsAndCondition />} />
          <Route path="/refund" element={<Refund />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/allproducts" element={<AllProducts />} />
          <Route path="/productdetails/:productId" element={<ProductDetails />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/otp" element={<Otp />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/password/reset/:token" element={<ResetPasswordPage />} />
          <Route path="/products/:productId/reviews" element={<ProductReviewsPage />}
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
