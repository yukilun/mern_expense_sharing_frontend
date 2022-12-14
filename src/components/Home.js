import {useState, useEffect} from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBasket, faBurger, faHouse, faFaucetDrip,  faIcons, faBus, faFileShield, faQuestion, faTrash} from "@fortawesome/free-solid-svg-icons";
import { useCallback, useRef } from 'react';

function Home({pw}) {

    const [categories, setCategories] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [users, setUsers] = useState([]);
    const [summary, setSummary] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const url = "https://mern-expense-sharing-backend.herokuapp.com/" + pw;
    const modal = useRef(null);

    const fetchExpense = useCallback(() => {
        axios.get(url + '/expense')
        .then((res)=> setExpenses(res.data))
        .catch((err)=> console.error(err));
    }, [url]);

    const fetchSummary = useCallback(() => {
        axios.get(url + '/summary')
        .then((res)=> setSummary(res.data))
        .catch((err)=> console.error(err));
    }, [url]);

    useEffect(()=>{
        axios.get(url + '/category')
        .then((res)=> setCategories(res.data))
        .catch((err)=> console.error(err));

        axios.get(url + '/user')
        .then((res)=> setUsers(res.data))
        .catch((err)=> console.error(err));

        fetchExpense();
        fetchSummary();
    }, [url, fetchExpense, fetchSummary]);


    const deleteExpense = (id) => {
        axios.delete(url + '/deleteExpense/' + id)
        .then(()=> {
            fetchExpense();
            fetchSummary();
        })
        .catch((err)=> console.error(err));
    }

    const shared = () => {
        axios.post(url + '/shared')
        .then(()=> {
            fetchExpense();
            fetchSummary();
        })
    }

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
    };

    return (
        <div className="home_container">
            <div>
                <h2>Summary</h2>
                <div className='summary'>
                    <table className="user_table" style={{width: '100%'}}>
                        <tbody>
                            <tr>
                                <th style={{width: '50%'}}>Name</th>
                                <th>Amount</th>
                            </tr>
                            {
                                
                                users.map((user, index)=> {

                                    const result = summary.find((row) => row.name === user.name);
                                    
                                    return result ? ( 
                                        <tr key={index}>
                                            <td>{user.name}</td>
                                            <td>{result.total_paid.toFixed(2)}</td>
                                        </tr>
                                    ):(
                                        <tr key={index}>
                                            <td>{user.name}</td>
                                            <td>$0.00</td>
                                        </tr>
                                    );
                                })
                            }

                            {
                                (function(){
                                    const sum = summary.reduce((preVal, curVal) => preVal + curVal.total_paid, 0);
                                    const perPerson = sum / users.length;

                                    const results = users.map((user, index)=> {
                                        const result = summary.find((row) => row.name === user.name);
                                        if(result){
                                            return result;
                                        }
                                        else{
                                            return {name: user.name, total_paid: 0}
                                        }
                                    });

                                    console.log(results);

                                    let netAmount = results.map((row)=> {return row.total_paid - perPerson});

                                    console.log(netAmount);

                                    let paidArray = new Array(netAmount.length);

                                    for (let i = 0; i < paidArray.length; i++) {
                                        paidArray[i] = new Array(netAmount.length);
                                    }

                                    for(let i = 0; i < netAmount.length; i++){

                                        for(let j = 0; j < netAmount.length; j++){
                                            if(netAmount[i] >= 0 || netAmount[j] <= 0 || i===j) {
                                                paidArray[i][j] = 0;
                                            }
                                            else if(Math.abs(netAmount[i]) >= netAmount[j]){
                                                paidArray[i][j] = netAmount[j];
                                                netAmount[j] = 0;
                                                netAmount[i] = netAmount[i] + netAmount[j];
                                            }
                                            else if(Math.abs(netAmount[i]) < netAmount[j]){
                                                paidArray[i][j] = Math.abs(netAmount[i]);
                                                netAmount[i] = 0;
                                                netAmount[j] = netAmount[j] - netAmount[i];
                                            }
                                        }
                                    }
                                    console.log(paidArray);

                                    return (
                                        <>
                                            <tr className='grandTotal'>
                                                <td style={{textAlign: 'right'}}>Total</td>
                                                <td>${sum.toFixed(2)}</td>
                                            </tr>
                                            <tr className='amountPerPerson'>
                                                <td style={{textAlign: 'right'}}>Per Person</td>
                                                <td>${perPerson.toFixed(2)}</td>
                                            </tr>
                                            {

                                                paidArray.map((row, i)=> row.map((cell, j)=>{
                                                    if(cell > 0){
                                                        return (                                            
                                                            <tr className='pay' key={`${i}_${j}`}>
                                                                <td style={{textAlign: 'right'}}>{results[i].name} to {results[j].name}</td>
                                                                <td>${cell.toFixed(2)}</td>
                                                            </tr>
                                                        )
                                                    }
                                                    else{
                                                        return null;
                                                    }
                                                }))
                                            }
                                            <tr className='shareExpense'>
                                                <td colSpan={2}><button className='shareBtn' onClick={()=>setShowModal(true)}>Share Expenses!</button></td>
                                            </tr>
                                        </>
                                    );
                                })()
                            }

                        </tbody>
                    </table>
                    {
                        showModal && (
                            <div className='modal' ref={modal} onClick={(e)=>{ modal.current === e.target && setShowModal(false)}}>
                                <div className='modal-container'>
                                    <h3>Are you sure all the expenses have been shared?</h3>
                                    <button onClick={()=>{
                                        shared();
                                        setShowModal(false);
                                    }} className="modal-btn confirm">Confirm</button>
                                    <button onClick={()=>setShowModal(false)} className="modal-btn cancel">Cancel</button>
                                </div>
                            </div>
                        )
                    }

                </div>
            </div>
            <div>
                <h2>Expense List</h2>
                    {
                            expenses.length > 0 ? (
                                expenses.map((expense)=> {
                                    const cat = categories.find(c => c.name === expense.category);
                                    var iconStyles = {};
                                    var borderStyle = {};
                                    if(cat){
                                        iconStyles = {
                                            color: cat.color
                                        };
                                        borderStyle = {
                                            border: `4px solid ${cat.color}50`
                                        };
                                        return (
                                            <div key={expense._id} className={"expense_item " + (expense.isShared && "isShared")} style={borderStyle}>
                                                <div className="expense_left">
                                                    <h3><FontAwesomeIcon style={iconStyles} icon={getIcon(cat.icon_class)} size="2x"/></h3>
                                                    <h5>{cat.name}</h5>
                                                </div>
                                                <div className="expense_middle">
                                                    <h4>{new Date(expense.date).toLocaleDateString()}</h4>
                                                    {expense.description && <h4>{expense.description}</h4>}
                                                    <h5>Paid By {expense.username}</h5>
                                                </div>
                                                <div className="expense_right">
                                                    <h2 className='expense_amount'>${expense.amount.toFixed(2)}</h2>
                                                </div>
                                                    <FontAwesomeIcon icon={faTrash} size="1x" onClick={()=> deleteExpense(expense._id)}/>
                                            </div>
                                        );
                                    }
                                    else{
                                        return null;
                                    }
                                })
                            ):
                            (
                                <div className="expense_item">
                                    No Expense Found!
                                </div>
                            )
                    }
            </div>
        </div>
    );
}

export default Home;