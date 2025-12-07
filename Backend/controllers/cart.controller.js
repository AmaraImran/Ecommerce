import Cart from "../models/cartmodel.js";
import Product from "../models/productmodel.js";

export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;  // comes from JWT middleware
    const { productId, quantity } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    // Find user's cart
    let cart = await Cart.findOne({ userId });

    // If no cart exists → create new cart
    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, quantity }],
      });

      await cart.save();
      return res.status(201).json({
        message: "Cart created & product added",
        cart,
      });
    }

    // Cart exists → check if product already inside
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      // If product already exists → increase quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Push a new item
      cart.items.push({ productId, quantity });
    }

    // Save cart
    await cart.save();

    res.status(200).json({
      message: "Product added to cart",
      cart,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();
    res.status(200).json({ message: "Item removed", cart });

  } catch (error) {
    res.status(500).json({ message: "Error removing item", error });
  }
};
export const updateQuantity = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (!item) return res.status(404).json({ message: "Product not in cart" });

    item.quantity = quantity;

    await cart.save();
    res.status(200).json(cart);

  } catch (error) {
    res.status(500).json({ message: "Error updating quantity", error });
  }
};
export const getUserCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId }).populate("items.productId");

    res.status(200).json(cart || { items: [] });

  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error });
  }
};
export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    await Cart.findOneAndUpdate(
      { userId },
      { items: [] }
    );

    res.status(200).json({ message: "Cart cleared" });

  } catch (error) {
    res.status(500).json({ message: "Error clearing cart", error });
  }
};

