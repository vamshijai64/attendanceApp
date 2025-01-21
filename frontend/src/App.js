import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login/Login";
import { useState } from "react";
import HomeScreen from "./components/Home/HomeScreen";

function App() {
  const [user, setUser] = useState(null); //storing log-in user details

  // Protected Route Component
  const ProtectedRoute =({children}) => {
    const token = localStorage.getItem("token");
    return token ? children : <Navigate to="/" replace />
  }

  return (
    
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login setUser={setUser}/>}></Route>
        <Route path="/home" element={
          <ProtectedRoute> 
            <HomeScreen user={user}/> //Passing user to Homescreen
          </ProtectedRoute>
        }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
