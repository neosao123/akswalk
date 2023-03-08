import React from 'react'

const EventComplete = () => {
    return (
        <div className="d-flex align-items-center justify-content-center vh-100">
            <div className="col-12 col-sm-12 col-md-6">
                <div className="card border border-danger">
                    <div className="card-header">
                        <h4>Opps!</h4>
                    </div>
                    <div className="card-body text-center">
                        <p>This Event has ended already. You cannot check the progress or scan any qr-code...</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EventComplete