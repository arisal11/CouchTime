import Header from '../components/Header';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import Villian from '../components/Villian';

function Add({setRoomToken}){
    return (
        <>
        <Villian setRoomToken={setRoomToken}/>
        </>
    );
}

export default Add