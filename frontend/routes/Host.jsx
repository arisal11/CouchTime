import Header from '../components/Header';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import Villian from '../components/Villian';
import Create from '../components/Create';

function Host({setRoomToken}){
    return (
        <>
        <Create setRoomToken={setRoomToken}/>
        </>
    );
}

export default Host