import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './ui/App.css'
import Home from '../pages/home/Home';
import Layout from './ui/laout';
import Privacy from '../pages/privacy/Privacy';
import About from '../pages/about/About';


function App() {
  return <BrowserRouter>

    <Routes>
      <Route path="/" element={<Layout />}>

        <Route index element={<Home />} />

        <Route path="privacy" element={<Privacy />} />

        <Route path="about" element={<About />} />

      
      </Route>
    </Routes>

  </BrowserRouter>;
}

export default App
