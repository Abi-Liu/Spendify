import useUserContext from "../contexts/UserContext";

const Login = () => {
  function google() {
    window.open("http://localhost:8000/auth/google", "_self");
  }
  const { user, logout } = useUserContext();

  async function handleLogout() {
    await logout();
  }

  return (
    <div>
      {user ? (
        <>
          <h1>Logout</h1>
          <button onClick={handleLogout}>logout</button>
        </>
      ) : (
        <>
          <h1>Login</h1>
          <button onClick={google}>login</button>
        </>
      )}
    </div>
  );
};

export default Login;
