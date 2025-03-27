import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProductsBySubcategory } from '../utils/api';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function SubcategoryPage() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const response = await fetchProductsBySubcategory(id);
        setProducts(response);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message || "Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    console.log(id)
    loadProducts();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">Products</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product._id}
              productId={product._id}
              productImg={product.images[0]}
              productName={product.name}
              price={product.price}
            />
          ))
        ) : (
          <p className="text-gray-500">No products available</p>
        )}
      </div>
    </div>
  );
}