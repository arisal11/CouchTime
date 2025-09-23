

function Create (){
    return (
        <>
        <div className="create-form">
            <div className="info-cont">
                <h4> Room Creation! </h4>
                <p>Create a room for your <br></br>friends to start sharing!</p>
            </div>

            <div className="form-cont">
                <form>
                        <label> Create Room Password: </label> <br/>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                name="password"
                                className="input"
                                required
                            />
                        </div>
                    <button type="submit" className="button">
                        Submit
                    </button>
                </form>
            </div>
        </div>
        </>
    );
}

export default Create;