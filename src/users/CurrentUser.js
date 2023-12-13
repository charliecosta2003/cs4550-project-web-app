import * as client from "./client";
import {useDispatch, useSelector} from "react-redux";
import {useState, useEffect} from "react";
import {setCurrentUser, setLoggedIn} from "./reducer";

function CurrentUser({children}) {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const {currentUser, loggedIn} = useSelector(state => state.usersReducer);

    const fetchUser = async () => {
        const fetchedUser = await client.profile();
        dispatch(setCurrentUser(fetchedUser));
        if (currentUser && !loggedIn) {
            dispatch(setLoggedIn(true));
        }
        if (!currentUser && loggedIn) {
            dispatch(setLoggedIn(false));
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUser();
    }, [loggedIn]);

    return <>{!loading && children}</>
}

export default CurrentUser;