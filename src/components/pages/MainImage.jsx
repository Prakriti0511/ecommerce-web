import Navbar from "../header/Navbar";

function MainImage() {
  return (
    <div className="relative w-full min-h-screen bg-[url('/1.png')] bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <div className="flex-1 flex items-center justify-center text-white text-4xl font-bold">
          Welcome to Our Store
        </div>
      </div>
    </div>
  );
}

export default MainImage;
