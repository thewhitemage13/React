import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './ui/App.css';
import Home from '../pages/home/Home';
import Privacy from '../pages/privacy/Privacy';
import AppContext from "../features/context/AppContext";
import { useEffect, useState } from 'react';
import Base64 from '../shared/base64/Base64';
import Intro from '../pages/intro/Intro';
import Layout from './ui/layout/Laout';
import Group from '../pages/Group/Group';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [productGroups, setProductGroups] = useState([]);

  useEffect(() => {
    request("/api/product-group")
      .then(homePageData => setProductGroups(homePageData.productGroups));
  }, []);

  useEffect(() => {
    const u = token == null ? null : Base64.jwtDecodePayload(token) ;
    console.log(u);
    setUser(u);
  }, [token]);


  const request = (url, conf) => new Promise((resolve, reject) => {
    if(url.startsWith('/')) {
      url = "https://localhost:7229" + url;
    }

    fetch(url, conf)
        .then(r => r.json(url, conf))
        .then(j => {
            if(j.status.isOk) {
              resolve(j.data);
            }
            else {
              console.error(j)
              reject(j);
            }
        });
  });

  return <AppContext.Provider value={ {request, user, token, setToken, productGroups} }>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route index element={<Home />} />
          <Route path="group/:slug" element={<Group />} />

          <Route path="intro" element={<Intro />} />
          <Route path="privacy" element={<Privacy />} />
        </Route>      
      </Routes>
    </BrowserRouter>
  </AppContext.Provider>;
}

export default App;
