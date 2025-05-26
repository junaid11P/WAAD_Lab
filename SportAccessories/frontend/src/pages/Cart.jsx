import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, );

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:5050/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch cart');
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      const token = localStorage.getItem('token');
      if (newQuantity < 1) {
        await removeItem(productId);
        return;
      }

      await axios.put('http://localhost:5050/api/cart/update', {
        productId,
        quantity: newQuantity
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchCart(); // Refresh cart data
    } catch (error) {
      setError('Failed to update quantity');
    }
  };

  const removeItem = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5050/api/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchCart(); // Refresh cart data
    } catch (error) {
      setError('Failed to remove item');
    }
  };

  const proceedToCheckout = () => {
    navigate('/checkout');
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border" role="status"></div></div>;
  if (error) return <div className="alert alert-danger m-3" role="alert">{error}</div>;

  return (
    <div className="container my-5">
      <h2 className="mb-4">Shopping Cart</h2>
      
      {cart.items.length === 0 ? (
        <div className="text-center">
          <p>Your cart is empty</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/products')}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.items.map((item) => (
                  <tr key={item.product._id}>
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
                    <td>${item.product.price.toFixed(2)}</td>
                    <td>
                      <div className="input-group" style={{ width: '120px' }}>
                        <button 
                          className="btn btn-outline-secondary"
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <input 
                          type="number" 
                          className="form-control text-center"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.product._id, parseInt(e.target.value))}
                          min="1"
                        />
                        <button 
                          className="btn btn-outline-secondary"
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>${(item.product.price * item.quantity).toFixed(2)}</td>
                    <td>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => removeItem(item.product._id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="row justify-content-end">
            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Cart Summary</h5>
                  <p className="card-text">
                    Subtotal: ${cart.total.toFixed(2)}
                  </p>
                  <button 
                    className="btn btn-primary w-100"
                    onClick={proceedToCheckout}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;