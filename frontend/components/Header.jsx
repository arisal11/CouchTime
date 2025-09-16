import '../src/styles/main.css'

function Header(){
    return (
        <header className="head">
            <img src="./images/home-icon.png" alt="Home" className='home-icon' />
            <button>Host</button>
            <button>Guest</button>
            <button>About Us</button>
        </header>
    );
}

export default Header;