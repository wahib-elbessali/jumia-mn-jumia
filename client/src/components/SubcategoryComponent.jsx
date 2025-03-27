import { useEffect, useState } from "react";
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function SubcategoryComponent({ subId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const response = await fetchProductsBySubcategory(subId);
        setProducts(response);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [subId]);

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
    <div>
      <h3 className="text-lg font-semibold">Products</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-2">
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
