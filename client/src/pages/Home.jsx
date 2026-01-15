import { useSelector, useDispatch } from 'react-redux'
import { logout } from "../redux/slice/authSlice"
import { Link } from 'react-router-dom'

const Home = () => {
    const dispatch = useDispatch()
    const { user, isLoggedIn } = useSelector(state => state.auth)

    return (
        <header>
            {isLoggedIn ? (
                <>
                    <p>Welcome, {user.name}</p>
                    <button onClick={() => dispatch(logout())}>
                        Logout
                    </button>
                </>
            ) : (
                <div> <p>Please Signup</p> <Link to="/signup">Sign up</Link></div>
            )}
        </header>
    )
}

export default Home
