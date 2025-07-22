import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import TopHeader from './components/header/TopHeader';
import Navbar from './components/header/Navbar';
import MainImage from './components/pages/MainImage';
import ProductDetails from './components/header/Navbar'; 
import NewArrivals from './components/pages/NewArrivals';
import Products from './components/pages/Products';
import Login from './components/LoginPage/Login'
import Registration from './components/LoginPage/Registration'

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <TopHeader />
      <Navbar />
      <Routes>
        <Route path="/" element={<MainImage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Registration />} />
        <Route path="/newarrivals" element={<NewArrivals />} />
        <Route path="/product/:id" element={<ProductDetails />} />
      </Routes>
    </div>
  );
}

export default App;
