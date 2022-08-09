import './App.css'; 
import Header from './components/Header';
import Navbar from './components/Navbar';
import {Routes, Route} from 'react-router-dom';
import UserAdd from './components/UserAdd';
import ExpenseAdd from './components/ExpenseAdd';
import Home from './components/Home';

function App() {
  return (
    <div className="App">
        <Header/>
        <Navbar/>
        <Routes>
          <Route path="/addUser" element={<UserAdd/>}/>
          <Route path="/addExpense" element={<ExpenseAdd/>}/>
          <Route absolute path="/" element={<Home/>}/>
        </Routes>
    </div>
  );
}

export default App;
