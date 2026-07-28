import Cart from "../models/cartmodel.js";
import Product from "../models/productmodel.js";

export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.body.productId;
    const quantity = Number(req.body.quantity) || 1;

    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ userId });

    // figure out what the total quantity would be after this add
    let existingQty = 0;
    if (cart) {
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId
      );
      if (existingItem) existingQty = existingItem.quantity;
    }

    const newTotalQty = existingQty + quantity;

    if (newTotalQty > product.stock) {
      return res.status(400).json({
        message: `Only ${product.stock} left in stock`,
      });
    }

    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, quantity }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = newTotalQty;
      } else {
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();
    res.status(200).json(cart);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, itemId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((item) => {
      // itemId removes a cart entry directly by its own subdocument id —
      // used when the referenced product no longer exists (productId is null)
      if (itemId) {
        return item._id.toString() !== itemId;
      }
      // guard against null productId (deleted product) so this never crashes
      return item.productId && item.productId.toString() !== productId;
    });

    await cart.save();
    res.status(200).json({ message: "Item removed", cart });

  } catch (error) {
    res.status(500).json({ message: "Error removing item", error });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (!item) return res.status(404).json({ message: "Product not in cart" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (quantity > product.stock) {
      return res.status(400).json({
        message: `Only ${product.stock} left in stock`,
      });
    }

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