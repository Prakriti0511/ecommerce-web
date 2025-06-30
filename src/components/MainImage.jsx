import { Link } from "react-router-dom";

function MainImage() {
  return (
    <div className="relative w-full mx-auto group">
      {/* Product Image */}
      <img
        src="image.png"
        alt="Product"
        className="w-full h-auto object-cover transition duration-300 group-hover:brightness-70"
      />

      {/* View Product Overlay */}
      <Link
        to="/product/123"
        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300"
      >
        <div className="bg-black bg-opacity-70 text-white text-lg px-6 py-3 rounded shadow-lg cursor-pointer">
          View Product
        </div>
      </Link>
    </div>
  );
}

export default MainImage;
