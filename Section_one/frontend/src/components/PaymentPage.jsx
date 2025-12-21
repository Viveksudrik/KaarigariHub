import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import Swal from 'sweetalert2';

const PaymentPage = () => {
    const navigate = useNavigate();
    const { cart, clearCart } = useCart();
    const [loading, setLoading] = useState(false);

    const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handlePayment = () => {
        setLoading(true);
        // Simulate payment processing
        setTimeout(() => {
            setLoading(false);
            clearCart();
            Swal.fire({
                icon: 'success',
                title: 'Payment Successful',
                text: 'Thank you for your purchase!',
            }).then(() => {
                navigate('/home');
            });
        }, 2000);
    };

    if (cart.length === 0) {
        return (
            <div className="container mt-5 text-center">
                <h1>No items to pay for</h1>
                <button className="btn btn-primary mt-3" onClick={() => navigate('/browse')}>Browse Products</button>
            </div>
        )
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-lg rounded-5">
                        <div className="card-body p-5">
                            <h2 className="text-center mb-4">Checkout</h2>
                            <div className="mb-3">
                                <h4>Order Summary</h4>
                                <ul className="list-group mb-3">
                                    {cart.map((item) => (
                                        <li key={item.id} className="list-group-item d-flex justify-content-between lh-sm">
                                            <div>
                                                <h6 className="my-0">{item.name}</h6>
                                                <small className="text-muted">Quantity: {item.quantity}</small>
                                            </div>
                                            <span className="text-muted">₹{item.price * item.quantity}</span>
                                        </li>
                                    ))}
                                    <li className="list-group-item d-flex justify-content-between">
                                        <span>Total (INR)</span>
                                        <strong>₹{totalPrice}</strong>
                                    </li>
                                </ul>
                            </div>

                            <div className="d-grid gap-2">
                                <button
                                    className="btn btn-warning btn-lg"
                                    onClick={handlePayment}
                                    disabled={loading}
                                >
                                    {loading ? 'Processing...' : 'Pay Now'}
                                </button>
                                <button className='btn btn-outline-secondary' onClick={() => navigate('/cart')}>Back to Cart</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
