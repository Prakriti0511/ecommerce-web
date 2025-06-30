import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import TopHeader from './components/TopHeader';
import Navbar from './components/Navbar';
import MainImage from './components/MainImage';
import ProductDetails from './components/Navbar'; 
import NewArrivals from './components/NewArrivals';
import Products from './components/Products';

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
