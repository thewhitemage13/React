import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './ui/App.css';
import Home from '../pages/home/Home';
import Privacy from '../pages/privacy/Privacy';
import AppContext from "../features/context/AppContext";
import { useEffect, useRef, useState } from 'react';
import Base64 from '../shared/base64/Base64';
import Intro from '../pages/intro/Intro';
import Layout from './ui/layout/Laout';
import Group from '../pages/Group/Group';
import Cart from '../pages/cart/Cart';
import Product from '../pages/product/Product';
import Alarm from './ui/Alarm';

const tokenStorageKey = "react-p26-token";

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [productGroups, setProductGroups] = useState([]);
  const [cart, setCart] = useState({cartItems:[]});
  const alarmRef = useRef();
  const [alarmData, setAlarmData] = useState({});


  const [toastData, setToastData] = useState({});

  const toast = (data) => {
    setToastData(data);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem(tokenStorageKey);

    if(storedToken) {
      const payload = Base64.jwtDecodePayload(storedToken);
      const exp = new Date(payload.Exp.toString().length == 13 
        ? Number(payload.Exp)
        : Number(payload.Exxp) * 1000
      );
      const now = new Date();
      if(exp < now) {
        localStorage.removeItem(tokenStorageKey);
      }
      else {
        console.log("Token left: ", (exp - now) / 1e3, "sec");
        setToken(storedToken);
      }
    }
    request("/api/product-group")
      .then(homePageData => setProductGroups(homePageData.productGroups));
  }, []);

  const updateCart = () => {
    if(token != null) {
      request("/api/cart").then(data => {
          if(data != null) {
            setCart(data)
          }
        });
    }

    else {
      setCart({cartItems:[]})
    }
  }

  useEffect(() => {
      if(token == null) {
        setUser(null);
        localStorage.removeItem(tokenStorageKey);
      }
      else {
        localStorage.setItem(tokenStorageKey, token);
        setUser(Base64.jwtDecodePayload(token));
      }
      updateCart();
    }, [token]);

  const request = (url, conf) => new Promise((resolve, reject) => {
    if(url.startsWith('/')) {
      url = "https://localhost:7229" + url;

      if(token) {
        if(typeof conf == 'undefined') {
          conf = {};
        }
        if(typeof conf.headers == 'undefined') {
          conf.headers = {};
        }
        if(typeof conf.headers['Authorization'] == 'undefined') {
          conf.headers['Authorization'] = "Bearer " + token;
        }
      }
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

  const alarm = (data) => new Promise( (resolve, reject) => {
    data.resolve = resolve;
    data.reject = reject;
    
    setAlarmData(data)
    alarmRef.current.click();
  });

  return <AppContext.Provider value={ {alarm, cart, toast , request, updateCart, user, token, setToken,productGroups} }>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route index element={<Home />} />
          <Route path="group/:slug" element={<Group />} />
          <Route path="cart" element={<Cart />} />
          <Route path="intro" element={<Intro />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="product/:slug" element={<Product />} />

        </Route>      
      </Routes>
    </BrowserRouter>
    {/* <i 
    style={{display: 'block', width: 0, height: 0, position: 'absolute'}}
    ref={alarmRef} 
    data-bs-toggle="modal" 
    data-bs-target="#alarmModal"> 000 </i> */}
    <Alarm alarmData={alarmData}/>
    <Toast toastData={toastData}/>
  </AppContext.Provider>;
}

function Toast({ toastData }) {
  const toastShowTime = 2500; // ms
  const fadeTime = 500;       // ms

  const [isToastVisible, setToastVisible] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const [queue, setQueue] = useState([]);
  const [visibleData, setVisibleData] = useState({});
  const fadeTimeoutRef = useRef(null);
  const hideTimeoutRef = useRef(null);

  useEffect(() => {
    if (toastData.message) {
      setQueue(prevQueue => [...prevQueue, toastData]);
    }
  }, [toastData]);

  useEffect(() => {
    if (queue.length === 0) return;

    const nextToast = queue[0];

    if (isToastVisible && visibleData.message === nextToast.message) {
      clearTimeout(fadeTimeoutRef.current);
      clearTimeout(hideTimeoutRef.current);
      setOpacity(0);
      setTimeout(() => {
        setVisibleData(nextToast);
        setOpacity(1);
        setQueue(q => q.slice(1));
      }, fadeTime);
      return;
    }

    if (!isToastVisible) {
      showNextToast(nextToast);
    }

  }, [queue]);

  const showNextToast = (toast) => {
    setVisibleData(toast);
    setToastVisible(true);
    setOpacity(1);

    fadeTimeoutRef.current = setTimeout(() => setOpacity(0), toastShowTime - fadeTime);

    hideTimeoutRef.current = setTimeout(() => {
      setToastVisible(false);
      setQueue(q => q.slice(1));
    }, toastShowTime);
  };

  useEffect(() => {
    return () => {
      clearTimeout(fadeTimeoutRef.current);
      clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        borderRadius: "10px",
        minWidth: "15vw",
        maxWidth: "25vw",
        textAlign: "center",
        padding: "8px 12px",
        backgroundColor: "#444",
        color: "#fff",
        fontWeight: "500",
        opacity: opacity,
        transition: `opacity ${fadeTime}ms ease`,
        display: isToastVisible ? "block" : "none",
        zIndex: 9999,
      }}
    >
      {visibleData.message}
    </div>
  );
}


export default App;
