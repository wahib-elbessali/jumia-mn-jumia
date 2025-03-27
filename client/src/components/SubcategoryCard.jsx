import React from "react";
import { Link } from 'react-router-dom';

export default function SubcategoryCard({ subImg, subName, subId }) {
  return (
    <div>
      <Link
        to={`/subcategory/${subId}`}
        className="block p-4 border rounded-lg shadow hover:shadow-lg transition"
      >
        <img
          src={subImg}
          alt={`Image of ${subName}`}
          className="w-full h-32 object-cover rounded-md"
          loading="lazy"
        />
        <h2 className="text-lg font-semibold text-center mt-2">{subName}</h2>
      </Link>
    </div>
  );
}
