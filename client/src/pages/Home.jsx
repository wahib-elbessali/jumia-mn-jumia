import { useEffect, useState, useRef, useCallback } from "react";
import {
  fetchProducts,
  fetchCategoriesPublic,
  fetchSubcategoriesPublic,
} from "../utils/api";
import Sidebar from "../components/Sidebar";
import ProductCard from "../components/ProductCard";
import CategoryCard from "../components/CategoryCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef(null);
  const [isLeftDisabled, setIsLeftDisabled] = useState(true);
  const [isRightDisabled, setIsRightDisabled] = useState(false);

  const checkScrollButtons = useCallback(() => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      const buffer = 10;
      setIsLeftDisabled(scrollLeft <= buffer);
      setIsRightDisabled(scrollLeft + clientWidth + buffer >= scrollWidth);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData, subcategoriesData] = await Promise.all([
          fetchProducts(),
          fetchCategoriesPublic(),
          fetchSubcategoriesPublic(),
        ]);

        setProducts(productsData);
        setCategories(categoriesData);
        setSubcategories(subcategoriesData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => checkScrollButtons();
    const handleResize = () => checkScrollButtons();

    container.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    // Initial check
    checkScrollButtons();

    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [checkScrollButtons]);

  useEffect(() => {
    checkScrollButtons();
  }, [categories, subcategories, checkScrollButtons]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-72 p-6 bg-white border-r border-gray-100 sticky top-0 h-screen overflow-y-auto hidden md:block">
        <Sidebar categories={categories} subcategories={subcategories} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* Search Input */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-0 rounded-full bg-gray-100 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
            <svg 
              className="w-5 h-5 absolute left-4 top-3.5 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Categories Carousel */}
        <div className="mb-16 ">
          <div className="flex items-center justify-between mb-6 px-4 ">
            <h3 className="text-2xl font-bold text-gray-900">Shop Categories</h3>
            <div className="flex gap-2 ">
              <button
                className={`p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-sm ${
                  isLeftDisabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => {
                  containerRef.current.scrollBy({
                    left: -300,
                    behavior: "smooth",
                  });
                }}
                disabled={isLeftDisabled}
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <button
                className={`p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-sm ${
                  isRightDisabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => {
                  containerRef.current.scrollBy({
                    left: 300,
                    behavior: "smooth",
                  });
                }}
                disabled={isRightDisabled}
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="relative ">
            <div
              ref={containerRef}
              className="overflow-x-auto scrollbar-hide flex gap-6 pb-4 scroll-smooth px-4 "
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {categories.map((category) => (
                <CategoryCard
                  key={category._id}
                  catImg={category.image}
                  catName={category.name}
                  catId={category._id}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="px-4">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            Featured Products
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                productId={product._id}
                productImg={product.images[0]}
                productName={product.name}
                price={product.price}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}