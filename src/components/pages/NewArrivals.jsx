function NewArrivals() {
    const products = [
      {
        id: 1,
        name: "Flowcare Gentle Cleanser",
        price: "$19.99",
        description: "Soothing daily cleanser suitable for all skin types.",
        image: "/products-grey.png",
      },
      {
        id: 2,
        name: "Flowcare Hydrating Serum",
        price: "$29.99",
        description: "Lightweight serum that locks in moisture all day long.",
        image: "/products-grey.png",
      },
      {
        id: 3,
        name: "Flowcare Night Repair Cream",
        price: "$34.99",
        description: "Overnight cream that helps restore and rejuvenate skin.",
        image: "/products-grey.png",
      },
      {
        id: 4,
        name: "Flowcare Sun Shield SPF 50",
        price: "$24.99",
        description: "Broad-spectrum sunscreen with a non-greasy finish.",
        image: "/products-grey.png",
      },
    ];
  
    return (
      <section className="w-full min-h-screen bg-white py-10 px-4 md:px-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">New Arrivals</h2>
  
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white"
              >
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {product.description}
                  </p>
                  <p className="text-gray-900 font-bold">{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  export default NewArrivals;