import React from 'react'

const EventPending = () => {
    return (
        <div className="d-flex align-items-center justify-content-center vh-100">
            <div className="col-12 col-sm-12 col-md-6">
                <div className="card border border-warning">
                    <div className="card-header">
                        <h4>Hey!</h4>
                    </div>
                    <div className="card-body text-center">
                        <p>Event has not begun yet. Please come back after some time...</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EventPending