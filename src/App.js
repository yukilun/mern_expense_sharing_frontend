import './App.css'; 
import Header from './components/Header';
import Navbar from './components/Navbar';
import {Routes, Route} from 'react-router-dom';
import UserAdd from './components/UserAdd';
import ExpenseAdd from './components/ExpenseAdd';
import Home from './components/Home';
import { useState } from 'react';
import axios from 'axios';

function App() {

  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [pw, setPw] = useState('');
  const [msg, setMsg] = useState('Enter Password: ');

  const checkPw = () => {
    axios.get('https://mern-expense-sharing-backend.herokuapp.com/'+ pw)
    .then((res)=> setisLoggedIn(true))
    .catch((err)=> setMsg('Incorrect Password! Re-enter Password: '));
  };

  return (
    <div className="App">
      {
        !isLoggedIn ?(
        <>
          <Header />
          <div className='login'>
            <label>
              {msg} <br/>
              <input type='password' maxLength='4' onChange={(e)=>setPw(e.target.value)}/>
            </label>
            <button className="login-btn" onClick={checkPw}>Login</button>
          </div>
        </>
        )
        :
        (
          <>
          <Header />
          <Navbar />
          <Routes>
            <Route path="/addUser" element={<UserAdd pw={pw}/>} />
            <Route path="/addExpense" element={<ExpenseAdd pw={pw}/>} />
            <Route absolute path="/" element={<Home pw={pw}/>} />
          </Routes>
        </>
        )
      }
    </div>
  );
}

export default App;
