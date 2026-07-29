import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import AuthLayout from "./components/AuthLayout";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Category from "./pages/Category";
import ProductDetail from "./pages/Productdetail";
import Checkout from "./pages/Checkout";
import ThankYou from "./pages/Thankyou";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/Orderdetail";

// Admin
import AdminDashboard from "./admin/pages/Dashboard";
import AddProduct from "./admin/pages/Addproduct";
import AdminLayout from "./admin/layout/AdminLayout";
import AdminProducts from "./admin/pages/AdminProduct";
import EditProduct from "./admin/pages/EditProduct";
import AdminOrders from "./admin/pages/Orders";
import AdminOrderDetail from "./admin/pages/OrderDetail";
import ManageCategories from "./admin/pages/ManageCategory";

function App() {
  return (
    <Routes>
      {/* Auth Routes (Login/Signup) - No main Layout */}
      <Route element={<AuthLayout />}>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Main App Routes - With shared Layout (Navbar + Footer) */}
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="product" element={<Product />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="thankyou" element={<ThankYou />} />
        <Route path="category/:name" element={<Category />} />
        <Route path="order" element={<Orders />} />
        <Route path="orders/:id" element={<OrderDetail />} />

        {/* Protected User Routes */}
        <Route path="cart" element={<Cart />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Admin Routes - own layout (Sidebar only), no customer Navbar/Footer */}
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} /> {/* /admin */}
        <Route path="add-product" element={<AddProduct />} /> {/* /admin/add-product */}
        <Route path="manage-category" element={<ManageCategories />} />
        <Route path="orders" element={<AdminOrders />} /> {/* /admin/orders */}
        <Route path="orders/:id" element={<AdminOrderDetail />} /> {/* /admin/orders/:id */}
        <Route path="products" element={<AdminProducts />} />
        <Route path="edit/:id" element={<EditProduct />} />
      </Route>
    </Routes>
  );
}

export default App;