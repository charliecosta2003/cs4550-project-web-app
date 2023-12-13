import {useEffect, useState} from "react";
import * as userClient from "./users/client";
import {useSelector} from "react-redux";
import {Navigate} from "react-router";
import {Link} from "react-router-dom";

function UserTable() {

    const {currentUser} = useSelector(state => state.usersReducer);
    const [users, setUsers] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        const users = await userClient.findAllUsers();
        setUsers(users);
    };

    useEffect(() => {
        if (currentUser && currentUser.role === "ADMIN") {
            setIsAdmin(true);
        }
        fetchUsers();
        setLoading(false);
    }, []);

    return (
        <>
            {!loading &&
                <>
                    {isAdmin ?
                        <div className="container my-5 px-4">
                            <h1>Users ({users.length})</h1>
                            <div className="border border-dark rounded p-3">
                                <table className="table">
                                    <thead>
                                    <tr>
                                        <th>Username</th>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Role</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {users.map(user =>

                                        <tr key={user._id}>
                                            <td>
                                                <Link to={`/profile/${user._id}`}
                                                      className="link-dark link-underline-dark link-underline-opacity-0 link-underline-opacity-100-hover w-100"
                                                >
                                                    {user.username}
                                                </Link>
                                            </td>
                                            <td>{user.firstName}</td>
                                            <td>{user.lastName}</td>
                                            <td>{user.role}</td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>

                        </div>
                        :
                        <Navigate to={"/home"}/>
                    }
                </>
            }
        </>
    )
}

export default UserTable;