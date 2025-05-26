import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const Order = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, );

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5050/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrder(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch order details');
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5050/api/orders/${orderId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchOrder(); // Refresh order data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel order');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'danger';
      case 'processing':
        return 'info';
      case 'shipped':
        return 'primary';
      default:
        return 'warning';
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border" role="status"></div></div>;
  if (error) return <div className="alert alert-danger m-3" role="alert">{error}</div>;
  if (!order) return <div className="alert alert-warning m-3" role="alert">Order not found</div>;

  return (
    <div className="container my-5">
      <div className="mb-4">
        <Link to="/profile" className="text-decoration-none">
          ← Back to Profile
        </Link>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="card-title">Order #{order.trackingNumber}</h2>
            <span className={`badge bg-${getStatusColor(order.status)}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>

          <div className="row mb-4">
            <div className="col-md-6">
              <h5>Order Details</h5>
              <p className="mb-1"><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
              <p className="mb-1"><strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}</p>
              <p className="mb-1"><strong>Payment Method:</strong> {order.paymentMethod}</p>
              <p className="mb-1"><strong>Payment Status:</strong> {order.paymentStatus}</p>
            </div>
            <div className="col-md-6">
              <h5>Shipping Details</h5>
              <p>{order.shippingAddress}</p>
              {order.trackingNumber && order.status !== 'pending' && (
                <p className="mb-1"><strong>Tracking Number:</strong> {order.trackingNumber}</p>
              )}
            </div>
          </div>

          <h5>Order Items</h5>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }}
                        />
                        {item.product.name}
                      </div>
                    </td>
                    <td>{item.quantity}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                  <td><strong>${order.totalAmount.toFixed(2)}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          {(order.status === 'pending' || order.status === 'processing') && (
            <div className="mt-4">
              <button
                className="btn btn-danger"
                onClick={handleCancelOrder}
              >
                Cancel Order
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;