import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Category from "./pages/Category";
import AuthLayout from "./components/AuthLayout";

function App() {
  return (
  
      <Routes>
        {/* Layout wraps all pages */}
       
         <Route path="/" element={<AuthLayout/>}>
          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} />
         </Route>
        
        
        <Route path="/" element={<Layout />}>

          {/* Public routes */}
          <Route index element={<Home />} />
          <Route path="product/:id" element={<Product />} />
          <Route path="category/:name" element={<Category />} />

          {/* Protected routes (later adding auth middleware) */}
          <Route path="cart" element={<Cart />} />
          <Route path="profile" element={<Profile />} />

        </Route>
      </Routes>
   
  );
}

export default App;
