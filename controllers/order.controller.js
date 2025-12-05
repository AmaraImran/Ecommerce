import Cart from "../models/cartmodel.js";
import Product from "../models/productmodel.js"
import Order from "../models/ordermodel.js";

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Get user cart
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // 2. Calculate total
    let totalAmount = 0;

    for (let item of cart.items) {
      totalAmount += item.productId.price * item.quantity;
    }

    // 3. Reduce product stock
    for (let item of cart.items) {
      const product = await Product.findById(item.productId._id);

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Only ${product.stock} items left for ${product.name}`,
        });
      }

      product.stock -= item.quantity;
      await product.save();
    }

    // 4. Create order
    const order = await Order.create({
      userId,
      items: cart.items,
      totalAmount,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod || "COD",
      paymentStatus: "Pending",
      orderStatus: "Pending",
    });

    // 5. Empty cart after order placed
    await Cart.findOneAndUpdate(
      { userId },
      { items: [] }
    );

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};
// Get all orders of logged-in user
export const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error });
    }
};
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("userId", "name email")
            .populate("items.productId", "name price");

        if (!order) return res.status(404).json({ message: "Order not found" });

        res.status(200).json({ success: true, order });

    } catch (error) {
        res.status(500).json({ message: "Error fetching order", error });
    }
};
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("userId", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, orders });

    } catch (error) {
        res.status(500).json({ message: "Error fetching all orders", error });
    }
};
export const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) return res.status(404).json({ message: "Order not found" });

        order.orderStatus = req.body.status || order.orderStatus;

        if (order.orderStatus === "delivered") {
            order.deliveredAt = Date.now();
        }

        await order.save();

        res.status(200).json({
            success: true,
            message: "Order status updated",
            order,
        });

    } catch (error) {
        res.status(500).json({ message: "Error updating order", error });
    }
};
export const cancelOrder = async (req, res) => {
    try {
        console.log(req.params.id)
        const order = await Order.find({
            id: req.params.id,
            user: req.user.id,
        });

        if (!order) return res.status(404).json({ message: "Order not found" });

        if (order.orderStatus !== "pending") {
            return res.status(400).json({ message: "You cannot cancel this order now" });
        }

        order.orderStatus = "cancelled";
        await order.save();

        res.status(200).json({ success: true, message: "Order cancelled" });

    } catch (error) {
        res.status(500).json({ message: "Error cancelling order", error });
    }
};
