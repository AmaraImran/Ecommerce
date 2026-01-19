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

// Admin
import AdminDashboard from "./admin/AdminDashboard";
import AddProduct from "./admin/pages/Addproduct";
import AdminLayout from "./admin/layout/AdminLayout"; // You'll need to create this
import AdminProducts from "./admin/pages/AdminProduct";
import EditProduct from "./admin/pages/EditProduct";
import ProductDetail from "./pages/Productdetail";
import Checkout from "./pages/Checkout";
import ThankYou from "./pages/Thankyou";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/Orderdetail";
import AdminOrders from "./admin/pages/Orders";

function App() {
  return (
    <Routes>
      {/* Auth Routes (Login/Signup) - No main Layout */}
      <Route element={<AuthLayout />}>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Main App Routes - With shared Layout (header, footer, etc.) */}
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="product" element={<Product />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="checkout" element={<Checkout/>}/>
           <Route path="thankyou" element={<ThankYou/>}/>
        <Route path="category/:name" element={<Category />} />
        <Route path="order" element={<Orders/>}/>
        <Route path="orders/:id"element={<OrderDetail/>}/>

        {/* Protected User Routes */}
        <Route path="cart" element={<Cart />} />
        <Route path="profile" element={<Profile />} />

        {/* Admin Routes - Nested under /admin with its own layout */}
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} /> {/* /admin */}
          <Route path="add-product" element={<AddProduct />} /> {/* /admin/add-product */}
          <Route path="orders" element={<AdminOrders/>}/> {/* /admin/order */}
          {/* Add more admin routes here */}
          <Route path="products" element={<AdminProducts />} />
          <Route path="edit/:id" element={<EditProduct/>}/>
       
          {/* <Route path="orders" element={<Orders />} /> */}
        </Route>
      </Route>
    </Routes>
  );
}

export default App;