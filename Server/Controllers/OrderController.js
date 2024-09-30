const orderCollection=require("../models/OrderModel")
const productslCollection = require("../models/productModels")
const CartCollection = require("../models/CartModels");


// user can place order
const placeOrder = async (req, res) => {
  try {
    const { userId, products, address } = req.body;

    if (!userId || !products || !Array.isArray(products)) {
      return res.status(400).json({ message: 'Invalid order data' });
    }

    const itemIds = products.map(p => p.productId);
    const items = await productslCollection.find({ _id: { $in: itemIds } }).lean();

    const orderProducts = [];

    for (const p of products) {
      const item = items.find(i => i._id.equals(p.productId));
      if (!item) {
        return res.status(400).json({ message: `Product not found for productId: ${p.productId}` });
      }
      orderProducts.push({
        productId: p.productId,
        name: item.name,
        price: item.price,
        quantity: p.quantity
      });
    }

    const totalAmount = orderProducts.reduce((total, product) => total + (product.price * product.quantity), 0);

    const order = new orderCollection({
      userId,
      address,
      products: orderProducts,
      totalAmount: totalAmount + 2, // Add delivery fee
      status: 'Pending'
    });

    await order.save();
    res.status(201).json(order);

  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Error placing order', error: error.message });
  }
};

const CancelOrder=async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await orderCollection.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if the order is already cancelled
    if (order.status === 'Cancelled') {
      return res.status(400).json({ message: 'Order is already cancelled' });
    }

    // Update order status to 'Cancelled'
    order.status = 'Cancelled';
    await order.save();

    res.json({ success: true, message: 'Order cancelled successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// get all orders
const Allorders=async (req, res) => {
  try {
    const response = await orderCollection.find().populate({path:'products.productId',select:'name'})
    res.status(200).send(response);
  } catch (err) {
    console.error('Error fetching orders:', err); // Log full error details
    res.status(500).send({ 
      message: "Internal server error",
      error: err.message,
      stack: err.stack // Include stack trace for more insights
    });
  }
}
// get order by user 
const getOrdersByUser =async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await orderCollection.find({ userId }).populate('products.productId');
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};


// restaurent get their orders

const restuarentOrder = async (req, res) => {
  const restaurantId = req.params.userId; // Ensure this is correctly mapped
  try {
    const orders = await orderCollection.find({ restaurantId })
      .populate({
        path: 'products.productId',
        select: 'name price', // You can select other fields as needed
      });

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving orders', err });
  }
};

// restaurent can update order status
const updateOrdersts=async (req, res) => {
  try {
    console.log('Update request for order:', req.params.orderId);
    const { status } = req.body;
    const order = await orderCollection.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true }
    );
    if (!order) {
      console.log('Order not found');
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Failed to update order status', error });
  }
}

//when order is placed the cart item will empty
const deleteCart= async (req, res) => {
  try {
    const { userId } = req.params;

    // Remove all cart items for the user
    await CartCollection.deleteMany({ userId });

    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Failed to clear cart', error: error.message });
  }
}

// total order count
const Ordercount=async (req,res)=>{
  try{
    const Ordercount=await orderCollection.countDocuments();
    res.json({ count: Ordercount });

  }catch(err){
    return res.status(500).send("intenral server error");
  }
}
//total turnover 
const getTotalTurnover = async (req, res) => {
  try {
    const orders = await orderCollection.find(); // Fetch all orders
    const totalTurnover = orders.reduce((acc, order) => acc + order.totalAmount, 0); // Sum of all totalAmount
    res.status(200).json({ turnover: totalTurnover });
  } catch (err) {
    console.error('Error fetching total turnover:', err);
    res.status(500).json({ message: 'Error fetching total turnover', error: err.message });
  }
};
module.exports={
    placeOrder,getOrdersByUser,restuarentOrder,updateOrdersts,Allorders,deleteCart,Ordercount,getTotalTurnover,CancelOrder
}