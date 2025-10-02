import { useState } from "react";
import { useNavigate } from "react-router-dom";


function Create (){
    const [name, setName] = useState("");
    const navigate = useNavigate();

    const handleRoomCreate = async () =>{
        try {
            const res = await fetch("http://localhost:5001/host", {
                method: "POST",
                credentials: "include", 
                headers: {
                "Content-Type": "application/json",
            },
                body: JSON.stringify({ name: "My Room" }), 
            });
        
            if (!res.ok) {
                throw new Error(`Request failed: ${res.status}`);
            }
        
            const data = await res.json();
            console.log("Created room:", data);
            navigate(`/host/${data.roomId}`)
            } catch (err) {
            console.error(err);
            }
    }

    return (
        <>
        <div className="forms">
            <div className="info-cont">
                <h4> Room Creation! </h4>
                <p>Create a room for your <br></br>friends to start sharing!</p>
            </div>
            <div className="form-cont">
                <form>
                <label> Input Room Name: </label> <br/>
                    <div className="input-wrapper">
                        <input
                                type="text"
                                className="input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                    </div>
                    <button type="submit" className="button" onClick={handleRoomCreate}>
                                Create Room
                    </button>
                </form>
            </div>
        </div>
        </>
    );
}

export default Create;