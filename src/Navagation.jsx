import './Navagation.css';

export function NavBar() {
  const userData = JSON.parse(localStorage.getItem("sb-ughstfzbqkwwurstknii-auth-token"));
  let name;
  if(userData) {
    name = userData.user.user_metadata.userName;
  } else {
    name = "Person";
  }
  return (
    <>
      <nav id="navBar" className="flex between verticalCenter">
        <div>
          <h4>Heya, {name}!</h4>
        </div>
        <div className="flex">
          <a href="../home">
            <i className="fa-solid fa-house"></i>
          </a>
          <a href="../login">
            <i className="fa-solid fa-user-tie"></i>
          </a>
          <a href="../logout">
            <i className="fa-solid fa-right-from-bracket"></i>
          </a>
        </div>
      </nav>
    </>
  );
}