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
          <Route path="/mern_expense_sharing_frontend/addUser" element={<UserAdd/>}/>
          <Route path="/mern_expense_sharing_frontend/addExpense" element={<ExpenseAdd/>}/>
          <Route absolute path="/mern_expense_sharing_frontend/" element={<Home/>}/>
        </Routes>
    </div>
  );
}

export default App;
