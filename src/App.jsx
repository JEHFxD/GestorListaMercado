import { useState, useEffect } from "react";
import { FormMarket } from "./Components/FormMarket/FormMarket";
import { ListMarket } from "./Components/ListMarket/ListMarket";
import { MarketContextHandler } from "./Components/Context/MarketContext";
import { auth } from "../src/assets/firebase.config";
import { setPersistence, browserLocalPersistence, onAuthStateChanged } from "firebase/auth";
import { Login } from "./Components/Login/Login";
import { useNavigate } from 'react-router-dom'; 
import { Route, Routes, Navigate } from "react-router-dom"; 
import SupportForm from "./Components/SupportForm/SupportForm";
import "./App.css";

const App = () => {
  const [user, setUser] = useState(null);
  const [showSupport, setShowSupport] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch((error) => {
      console.error("Persistence error:", error.code, error.message);
    });
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userFirebase) => {
      setUser(userFirebase); 
      if (userFirebase) {
        navigate('/home'); 
      } else {
        navigate('/login'); 
      }
    });
    return () => unsubscribe();
  }, [navigate]); 

  return (
    <MarketContextHandler>
      <div className="container">
        <h1>Lista de Mercado</h1>
        
       
        {user && (
          <button 
            onClick={() => setShowSupport(!showSupport)}
            className="support-button"
          >
            {showSupport ? 'Cerrar Soporte' : 'Contactar Soporte'}
          </button>
        )}
        
  
        {showSupport && (
          <div className="support-overlay">
            <div className="support-modal">
              <SupportForm onClose={() => setShowSupport(false)} />
            </div>
          </div>
        )}
        
        <section>
          <Routes>
            <Route path="/login" element={user ? <Navigate to="/home" /> : <Login />} />
            <Route path="/home" element={
              user ? (
                <>
                  <FormMarket />
                  <ListMarket />  
                </>
              ) : (
                <Navigate to="/login" />
              )
            } />
            <Route path="/" element={<Navigate to={user ? "/home" : "/login"} />} />
          </Routes>
        </section>
      </div>
    </MarketContextHandler>
  );
};

export default App;