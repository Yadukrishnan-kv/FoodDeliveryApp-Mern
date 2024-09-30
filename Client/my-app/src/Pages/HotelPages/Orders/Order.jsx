import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Context } from '../../../Context/Context';
import parcels from '../../../Assets/admin_assets/parcel_icon.png';
import './Order.css';

function Order() {
  const [orders, setOrders] = useState([]);
  const { userId } = useContext(Context);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/restaurant/${userId}`);
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      }
    };
    fetchOrders();
  }, [userId]);

  const handleStatusChange = async (orderId, status) => {
    try {
      await axios.patch(`http://localhost:4000/updateorder/${orderId}`, { status });
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, status } : order
        )
      );
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  return (
    <div className='order-container'>
      {orders.map(order => (
        <div key={order._id} className='order-card'>
          <div className='order-header'>
            <img src={parcels} alt="Parcel Icon" className='parcel-icon' />
            <h2>Order ID: {order._id}</h2>
          </div>

          <div className='order-details'>
            <ul className='order-products'>
              {order.products.map(product => (
                <li key={product.productId} className='product-item'>
                  {product.name} x {product.quantity}
                </li>
              ))}
            </ul>
            <p className='order-total'><strong>Total Price:</strong> ${order.totalAmount}</p>
          </div>

          <div className='order-address'>
            {order.address ? (
              <>
                <p><strong>Name:</strong> {order.address.name}</p>
                <p><strong>Address:</strong> {order.address.street}, {order.address.city}</p>
                <p><strong>Phone:</strong> {order.address.phoneNumber}</p>
                <p><strong>Pincode:</strong> {order.address.pincode}</p>
              </>
            ) : (
              <p>Shipping address not available.</p>
            )}
          </div>

          <div className='order-status'>
            <p><strong>Status:</strong> <span className={`status-${order.status.toLowerCase()}`}>{order.status}</span></p>
            {order.status !== 'Cancelled' && (
              <>
                <button onClick={() => handleStatusChange(order._id, 'Order Ready')} className='status-button'>Mark as Ready</button>
                <button onClick={() => handleStatusChange(order._id, 'Order Delivered')} className='status-button'>Mark as Delivered</button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Order;
