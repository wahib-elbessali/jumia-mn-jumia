import { Link } from "react-router-dom";

export default function CategoryCard({ catImg, catName, catId }) {
  return (
    <Link
      to={`/category/${catId}`}
      className="group block bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden w-64 flex-shrink-0 relative"
    >
      <div className="relative aspect-video bg-gradient-to-b from-gray-50 to-gray-100">
        <img
          src={catImg}
          alt={catName}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
        <h4 className="text-lg font-bold text-white drop-shadow-md">
          {catName}
        </h4>
      </div>
    </Link>
  );
}