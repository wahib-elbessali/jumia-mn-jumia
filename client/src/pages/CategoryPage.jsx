import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchCategoriesPublic, fetchSubcategoriesPublic } from '../utils/api';
import SubcategoryCard from '../components/SubcategoryCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function CategoryPage() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadCategoryData = async () => {
      try {
        setLoading(true);
        const allCategories = await fetchCategoriesPublic();
        const foundCategory = allCategories.find(cat => cat._id === id);
        setCategory(foundCategory);

        const allSubcategories = await fetchSubcategoriesPublic();
        setSubcategories(allSubcategories.filter(sub => sub.category._id === id));
      } catch (err) {
        console.error(err.response?.data?.message || "Error fetching category data");
        setError("Failed to load category data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadCategoryData();
  }, [id]);

  const filteredSubcategories = subcategories.filter(sub =>
    sub.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner />; // Show loading spinner while fetching data
  if (error) return <ErrorMessage message={error} />; // Display error message ila kayn chi erro

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{category?.name}</h1>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search subcategories..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full"
        />
      </div>

      {/* Subcategories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredSubcategories.length > 0 ? (
          filteredSubcategories.map(sub => (
            <SubcategoryCard key={sub._id} subImg={sub.image} subName={sub.name} subId={sub._id} />
          ))
        ) : (
          <p className="text-center col-span-full">No subcategories available.</p>
        )}
      </div>
    </div>
  );
}
