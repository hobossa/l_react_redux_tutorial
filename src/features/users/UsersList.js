import { useSelector } from "react-redux";
import { selectAllUsers } from "./usersSlice";
import { Link } from "react-router-dom";


export function UsersList() {
    // Normally you should stick with using the hooks, but here we're 
    // going to work with the user data using just the RTK Query core 
    // API so you can see how to use it.
    const users = useSelector(selectAllUsers);

    const renderedUsers = users.map(user => (
        <li key={user.id}>
            <Link to={`/users/${user.id}`}>{user.name}</Link>
        </li>
    ));

    //console.log('usersList');
    return (
        <section>
            <h2>Users</h2>
            <ul>{renderedUsers}</ul>
        </section>
    );
}