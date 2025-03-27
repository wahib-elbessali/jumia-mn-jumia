import { Link } from "react-router-dom";

export default function ProductCard({ productId, productImg, productName, price }) {
  return (
    <Link
      to={`/product/${productId}`}
      className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <img
          src={productImg}
          alt={productName}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        {price && (
          <div className="absolute top-2 right-2 bg-white/90 px-2.5 py-1 rounded-full text-sm font-bold text-indigo-600 shadow-sm">
            ${price.toFixed(2)}
          </div>
        )}
      </div>
      <div className="p-4">
        <h4 className="text-base font-semibold text-gray-900 truncate mb-1">
          {productName}
        </h4>
      </div>
    </Link>
  );
}