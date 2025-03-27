import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Sidebar({ categories, subcategories }) {
  const navigate = useNavigate();
  const [openCategory, setOpenCategory] = useState(null);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Shop Categories
      </h2>
      <ul className="space-y-2">
        {categories.map((category) => {
          const categorySubcategories = subcategories.filter(
            (sub) => sub.category._id === category._id
          );
          const hasSubcategories = categorySubcategories.length > 0;
          const isOpen = openCategory === category._id;

          return (
            <li key={category._id} className="border-b border-gray-100 last:border-0">
              <div className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group">
                <Link
                  to={`/category/${category._id}`}
                  className="flex-grow font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  {category.name}
                </Link>

                {hasSubcategories && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenCategory(isOpen ? null : category._id);
                    }}
                    className="p-1.5 rounded-md hover:bg-gray-200 transition-colors text-gray-500 hover:text-indigo-600"
                  >
                    <svg
                      className={`w-5 h-5 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {isOpen && hasSubcategories && (
                <ul className="ml-6 pl-2 space-y-2 py-2 border-l-2 border-indigo-200">
                  {categorySubcategories.map((sub) => (
                    <li key={sub._id}>
                      <button
                        onClick={() => navigate(`/subcategory/${sub._id}`)}
                        className="w-full text-left px-3 py-1.5 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                      >
                        {sub.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}