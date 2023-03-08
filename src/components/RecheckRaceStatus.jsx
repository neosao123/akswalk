import React from 'react'
import { BiRefresh } from 'react-icons/bi'
const RecheckRaceStatus = () => {
    return (
        <div className="d-flex align-items-center justify-content-center vh-100">
            <div className="col-md-4 col-sm-6">
                <div className="card my-auto">
                    <div className="card-body">
                        <h4 className="text-danger">Hey!</h4>
                        <p>The race has not started yet. To check the status whether race has started please click the button below.</p>
                        <small> The QR-Scan section will be avialable 10 mins before the race starts...</small>
                    </div>
                    <div className="card-body">
                        <button
                            className="btn btn-primary"
                            onClick={() => window.location.reload()}
                        >
                            Check Status <BiRefresh style={{ fontSize: "1.2rem" }} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RecheckRaceStatus