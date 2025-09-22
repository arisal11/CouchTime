import {Link} from "react-router-dom"
import '../src/styles/main.css'

function Header(){
    return (
        <header className="head">
            <Link to ="/"><img src="./images/home-icon.png" alt="Home" className='home-icon' /></Link>
            <Link to ="/host"><button className='head-button'>Host</button></Link>
            <Link to ="/add"><button className='head-button'>Join</button></Link>
            <Link to ="/about"><button className='head-button'>About Us</button></Link>
        </header>
    );
}

export default Header;