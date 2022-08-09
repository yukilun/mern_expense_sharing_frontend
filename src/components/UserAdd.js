import {useState, useEffect} from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function UserAdd() {

    const [inputUser, setInputUser] = useState({name: ''});
    const [users, setUsers] = useState([]);

    useEffect(()=>{
        fetchUser();
    }, []);


    const fetchUser = () => {
        axios.get('https://mern-expense-sharing-backend.herokuapp.com/user')
        .then((res) => setUsers(res.data));
    }

    const addUser = (e) => {
        e.preventDefault();

        axios.post('https://mern-expense-sharing-backend.herokuapp.com/addUser', {
            name: inputUser.name
        })
        .then(() => {
            setInputUser({name: ''});
            fetchUser();
        })
        .catch((error) => {
            console.error(error);
        });
    }

    const deleteUser = (id) => {    

        const url = 'https://mern-expense-sharing-backend.herokuapp.com/deleteUser/'+id;

        axios.delete(url, {
            id: id
        })
        .then(()=> {
            fetchUser();
        })
        .catch((error) => {
            console.error(error);
        });
    }


    return (
        <div className="homeContainer">
            <div>
                <h2>Add User</h2>
                <form className="add_user_form" onSubmit={addUser}>
                <label>
                    Name
                    <input type="text" name="name" value={inputUser.name} required onChange={(e)=>setInputUser({name: e.target.value})}/>
                </label>
                <button type='submit'>Add</button>
                </form>
            </div>
            <div>
                <h2>Current Users</h2>
                <table className="user_table">
                    <tbody>
                        <tr>
                            <th>Name</th>
                            <th>Delete</th>
                        </tr>
                        {
                            users.map((user)=> {
                                return (
                                    <tr key={user._id}>
                                        <td>{user.name}</td>
                                        <td><FontAwesomeIcon icon={faTrash} onClick={()=> deleteUser(user._id)}/></td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default UserAdd;