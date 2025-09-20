import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './ui/App.css'
import Home from '../pages/home/Home';
import Layout from './ui/laout';
import Privacy from '../pages/privacy/Privacy';
import About from '../pages/about/About';
import AppContext from '../feauters/context/AppContext';
import { useState } from 'react';


function App() {
  const[user, setUser] = useState(null);
  const [count, setCount] = useState(0);
  
  return <AppContext.Provider value={{ message: "Hello From App", user, setUser, count, setCount }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="about" element={<About />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
}

export default App; 
