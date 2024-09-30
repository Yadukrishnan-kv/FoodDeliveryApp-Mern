import React, { useContext, useState, useEffect } from 'react';
import '../PlaceOrder/placeOrder.css';
import { Context } from '../../../Context/Context';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';


function PlaceOrder() {
  const { getTotalPrice, cartItems, userId, token, setCartItems } = useContext(Context);
  const navigate = useNavigate();

  const [formData, setformData] = useState({
    name: '',
    phoneNumber: '',
    street: '',
    city: '',
    pincode: ''
  });

  useEffect(() => {
    if (!token) {
      navigate('/cart'); // Redirect to cart if user is not logged in
    } else if (getTotalPrice() === 0) {
      navigate('/cart'); // Redirect to cart if cart is empty
    }
  }, [token, getTotalPrice, navigate]);

  const handleChange = (e) => {
    setformData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePayment = async (e) => {
  e.preventDefault(); // Prevent default form submission

  try {
    const orderDetails = {
      userId: userId,
      address: {
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        street: formData.street,
        city: formData.city,
        pincode: formData.pincode,
      },
      products: cartItems.map(item => ({
        productId: item.itemId, // Ensure this is correct
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: getTotalPrice() + 2, // Assuming 2 is the delivery fee
      status: 'Pending'
    };

    const response = await axios.post('http://localhost:4000/placeorder', orderDetails);
    console.log('Order placed successfully:', response.data);
    toast.success('Order placed successfully!')
    // Clear the cart after placing the order
    await axios.delete(`http://localhost:4000/cart/clear/${userId}`);
    setCartItems([]); // Clear the cart in the frontend as well
    
    // Redirect to order history or confirmation page
    navigate('/myorder');

  } catch (error) {
    console.error('Error placing order:', error);
    toast.error(error)
    // Optionally, show error feedback to the user
  }
};

  return (
    <form className='place-order' onSubmit={handlePayment}>
      <div className="place-order-left">
        <h2>Shipping Address</h2>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="street"
          placeholder="Street Address"
          value={formData.street}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          value={formData.pincode}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2><br />
          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>{getTotalPrice()}</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>{2}</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <p>Total</p>
            <p>{getTotalPrice() + 2}</p>
          </div>
          <button style={{ marginTop: "30px" }} type="submit">PROCEED TO ORDER</button>
        </div>
      </div>
    </form>
  );
}

export default PlaceOrder;