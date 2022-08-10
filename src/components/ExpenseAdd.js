import {useState, useEffect} from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBasket, faBurger, faHouse, faFaucetDrip,  faIcons, faBus, faFileShield, faQuestion} from "@fortawesome/free-solid-svg-icons";

function ExpenseAdd({pw}) {

    const [expense, setExpense] = useState({
        category: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        username: '',
        isShared: false
    });
    const [categories, setCategories] = useState([]);
    const [users, setUsers] = useState([]);

    const url = "https://mern-expense-sharing-backend.herokuapp.com/" + pw;

    useEffect(()=>{
        axios.get(url + 'category')
        .then((res)=> setCategories(res.data))
        .catch((err)=> console.error(err));

        axios.get(url + '/user')
        .then((res)=> setUsers(res.data))
        .catch((err)=> console.error(err));
    }, [url]);

    const getIcon = (icon_class) => {
        switch(icon_class){
            case "faShoppingBasket":
                return faShoppingBasket;
            case "faBurger":
                return faBurger;     
            case "faHouse":
                return faHouse;
            case "faFaucetDrip":
                return faFaucetDrip;      
            case "faIcons":
                return faIcons;  
            case "faBus":
                return faBus;          
            case "faFileShield":
                return faFileShield;      
            default:
                return faQuestion;                   
        }
    }

    const addExpense = (e) => {
        e.preventDefault();

        console.log(expense);

        axios.post('https://mern-expense-sharing-backend.herokuapp.com/addExpense', expense)
        .then(() => {
            window.location = '/mern_expense_sharing_frontend';
        })
        .catch((error) => {
            console.error(error);
        });
    }

    return (
        <div className="expense_container">
            <div>
                <h2>Add Expense</h2>
                <form className="add_expense_form" onSubmit={addExpense}>

                    <div className='category_container'>
                        Category
                        <div className='category_options'>
                        {
                            categories.map(cat=> {
                                const iconStyle = {
                                    color: cat.color
                                }
                                return (
                                    <div key={cat._id}>
                                        <input type="radio" name="category" id={cat._id} value={cat.name} required onClick={(e)=>setExpense({...expense, category: e.target.value})}/>
                                        <label htmlFor={cat._id} className="category_option"><FontAwesomeIcon style={iconStyle} icon={getIcon(cat.icon_class)}/> {cat.name}</label>
                                    </div>
                                );
                            })
                        }
                        </div>
                    </div>
                    <label>
                        Amount
                        <input type="number" name="amount" value={expense.amount} step="0.01" required onChange={(e)=>setExpense({...expense, amount: e.target.value})}/>
                    </label>
                    <label>
                        Date
                        <input type="date" name="date" value={expense.date} required onChange={(e)=>setExpense({...expense, date: e.target.value})}/>
                    </label>
                    <label>
                        Description (Optional)
                        <input type="text" name="description" value={expense.description} placeholder="e.g. Internet" onChange={(e)=>setExpense({...expense, description: e.target.value})}/>
                    </label>
                    <label>
                        Paid By
                        <select name="username" value={expense.username} required onChange={(e)=> {
                            console.log(e.target.value);
                            setExpense({...expense, username: e.target.value});
                        }}>
                            <option value=''></option>
                            {users.map((u)=>(<option value={u.name} key={u._id}>{u.name}</option>))}
                        </select>
                    </label>
                    <button type='submit'>Add</button>
                </form>
            </div>
        </div>
    );
}

export default ExpenseAdd;