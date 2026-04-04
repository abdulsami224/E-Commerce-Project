import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div className="product-card" onClick={() => navigate(`/product/${product._id}`)}>
      <img src={product.image} alt={product.title} />
      <h3>{product.title}</h3>
      <p className="category">{product.category}</p>
      <p className="price">Rs. {product.price}</p>
      <button>View Details</button>
    </div>
  );
};

export default ProductCard;