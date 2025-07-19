import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import TopHeader from './components/header/TopHeader';
import Navbar from './components/header/Navbar';
import MainImage from './components/pages/MainImage';
import ProductDetails from './components/header/Navbar'; 
import NewArrivals from './components/pages/NewArrivals';
import Products from './components/pages/Products';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <TopHeader />
      <Navbar />
      <Routes>
        <Route path="/" element={<MainImage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
      </Routes>
      <Products/>
      <NewArrivals/>
    </Router>
  );
}

export default App;
