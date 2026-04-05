import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useCart } from '../context/CartContext';  // ← add this

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();  // ← add this

  useEffect(() => {
    const fetch = async () => {
      const { data } = await API.get(`/products/${id}`);
      setProduct(data);
    };
    fetch();
  }, [id]);

  const handleAddToCart = async () => {
    await addToCart(product._id, 1);  // ← add this
    navigate('/cart');                 // ← goes to cart after adding
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="product-detail">
      <img src={product.image} alt={product.title} />
      <div className="info">
        <h2>{product.title}</h2>
        <p>{product.category}</p>
        <p>{product.description}</p>
        <p>Rs. {product.price}</p>
        <p>{product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}</p>
        <button
          onClick={handleAddToCart}       // ← connected now
          disabled={product.stock === 0}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;