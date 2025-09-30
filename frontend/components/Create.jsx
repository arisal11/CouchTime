import { useNavigate } from "react-router-dom";


function Create (){

    const navigate = useNavigate();

    const handleRoomCreate = async () =>{
        const res = await fetch("http://localhost:5001/create-room", {
            method: "POST",
            credentials: "include"
        });

        const data = await res.json();
        console.log(data.roomId)
        navigate(`/host/${data.roomId}`)
    }

    return (
        <>
        <div className="create-form">
            <div className="info-cont">
                <h4> Room Creation! </h4>
                <p>Create a room for your <br></br>friends to start sharing!</p>
            </div>
            <div className="form-cont">
                    <button type="submit" className="button" onClick={handleRoomCreate}>
                        Create Room
                    </button>
            </div>
        </div>
        </>
    );
}

export default Create;