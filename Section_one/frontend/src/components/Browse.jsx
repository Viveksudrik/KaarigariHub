import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Slide from 'react-reveal/Slide';

const Browse = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart, cart } = useCart();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // Filter States
    const categoryParam = searchParams.get('category') || '';
    const searchParam = searchParams.get('search') || '';
    const [sortOption, setSortOption] = useState('newest');

    // Categories List
    const categories = ['Brass', 'Copper', 'Ajrakh', 'Kalamkari', 'Sui Dhaga', 'Wall Decor', 'Festive'];

    const fetchProducts = async () => {
        setLoading(true);
        try {
            // Build Query String
            let query = `?sort=${sortOption}`;
            if (categoryParam) query += `&category=${categoryParam}`;
            if (searchParam) query += `&search=${searchParam}`;

            const res = await fetch(`${process.env.REACT_APP_API_URL}/product/getall${query}`);
            const data = await res.json();

            // Handle response structure (obj with products arr or just arr)
            const productList = data.products || data;
            setProducts(productList);
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [categoryParam, searchParam, sortOption]);

    const handleCategoryChange = (cat) => {
        if (categoryParam === cat) {
            searchParams.delete('category'); // Toggle off
        } else {
            searchParams.set('category', cat);
        }
        setSearchParams(searchParams);
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    const handleBuyNow = (product) => {
        addToCart(product);
        navigate('/cart');
    };

    return (
        <div className="container-fluid mt-5 pt-5" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            <div className="container mt-4">
                <div className="row">
                    {/* Sidebar Filters */}
                    <div className="col-md-3 mb-4">
                        <div className="card shadow-sm border-0 rounded-4 p-3 sticky-top" style={{ top: '100px' }}>
                            <h5 className="fw-bold mb-3">Filters</h5>

                            <div className="mb-4">
                                <h6 className="fw-bold text-muted">Categories</h6>
                                <div className="d-flex flex-column gap-2 mt-2">
                                    <div
                                        className={`p-2 rounded-3 cursor-pointer ${!categoryParam ? 'bg-warning text-white' : 'hover-bg-light'}`}
                                        onClick={() => { searchParams.delete('category'); setSearchParams(searchParams); }}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        All Categories
                                    </div>
                                    {categories.map(cat => (
                                        <div
                                            key={cat}
                                            className={`p-2 rounded-3 cursor-pointer ${categoryParam === cat ? 'bg-warning text-white' : 'hover-bg-light'}`}
                                            onClick={() => handleCategoryChange(cat)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {cat}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="col-md-9">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2 className="fw-bold">
                                {categoryParam ? `${categoryParam} Collection` : 'All Products'}
                                {searchParam && <span className="fs-5 text-muted ms-2">(Search: "{searchParam}")</span>}
                            </h2>
                            <select
                                className="form-select w-auto shadow-sm rounded-pill"
                                value={sortOption}
                                onChange={handleSortChange}
                            >
                                <option value="newest">Newest First</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                            </select>
                        </div>

                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-warning" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-5">
                                <h3>No products found under this criteria.</h3>
                                <button
                                    className="btn btn-outline-dark mt-3"
                                    onClick={() => { setSearchParams({}); setSortOption('newest'); }}
                                >
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            <div className="row g-4">
                                {products.map((product) => (
                                    <div className="col-md-6 col-lg-4" key={product._id}>
                                        <Slide bottom>
                                            <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden product-card">
                                                <div style={{ height: '250px', overflow: 'hidden' }}>
                                                    <img
                                                        src={product.image.startsWith('http') ? product.image : `${process.env.REACT_APP_API_URL}/${product.image}`}
                                                        className="card-img-top w-100 h-100"
                                                        style={{ objectFit: 'cover', transition: 'transform 0.3s' }}
                                                        alt={product.name}
                                                    />
                                                </div>
                                                <div className="card-body">
                                                    <div className="d-flex justify-content-between mb-2">
                                                        <span className="badge bg-light text-dark border">{product.category}</span>
                                                        <span className="fw-bold text-success">₹{product.price}</span>
                                                    </div>
                                                    <h5 className="card-title fw-bold text-truncate">{product.name}</h5>
                                                    <h6 className="card-subtitle mb-2 text-muted text-truncate">{product.title}</h6>

                                                </div>
                                                <div className="card-footer bg-white border-0 p-3 pt-0">
                                                    <div className="d-grid gap-2">
                                                        <button
                                                            className="btn btn-warning rounded-pill text-white fw-bold"
                                                            onClick={() => addToCart(product)}
                                                        >
                                                            Add to Cart
                                                        </button>
                                                        <button
                                                            className="btn btn-outline-dark rounded-pill fw-bold"
                                                            onClick={() => handleBuyNow(product)}
                                                        >
                                                            Buy Now
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Slide>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .hover-bg-light:hover {
                    background-color: #e9ecef;
                }
                .product-card:hover {
                    transform: translateY(-5px);
                    transition: transform 0.3s ease;
                    box-shadow: 0 1rem 3rem rgba(0,0,0,.175)!important;
                }
                .product-card:hover img {
                    transform: scale(1.05);
                }
            `}</style>
        </div>
    );
};

export default Browse;