import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await API.get(`/products/${id}`);
      setProduct(data);
    };
    fetch();
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="product-detail">
      <img src={product.image} alt={product.title} />
      <div className="info">
        <h2>{product.title}</h2>
        <p className="category">{product.category}</p>
        <p className="description">{product.description}</p>
        <p className="price">Rs. {product.price}</p>
        <p className="stock">
          {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
        </p>
        <button disabled={product.stock === 0}>Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductDetail;