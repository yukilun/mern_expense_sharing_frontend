import {NavLink} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";


function Navbar() {
    return (
        <nav className="navbar">
            <ul>
                <li className="nav_item">
                    <NavLink to="/mern_expense_sharing_frontend/" className="nav_link">Home</NavLink>
                </li>
                <li className="nav_item">
                    <NavLink to="/mern_expense_sharing_frontend/addExpense" className="nav_link"><FontAwesomeIcon icon={faCirclePlus}/> Expense</NavLink>
                </li>
                <li className="nav_item">
                    <NavLink to="/mern_expense_sharing_frontend/addUser" className="nav_link">User</NavLink>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar;