

function Join (){
    return (
        <>
        <div className="forms">
            <div className="info-cont">
                <h4> Join a room! </h4>
                <p>Join a room that your friend <br></br> created to start sharing!</p>
            </div>

            <div className="form-cont">
                <form>
                        <label> Input Room Password: </label> <br/>
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

export default Join;