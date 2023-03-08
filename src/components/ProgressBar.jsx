import React from 'react'

const ProgressBar = ({ value }) => {
    return (
        <div className="progress mt-3" style={{ height: "20px" }}>
            <div className="progress-bar" role="progressbar" style={{ width: `${value}%` }} aria-valuenow={value} aria-valuemin="0" aria-valuemax="100">{value + "%"}</div>
        </div>
    );
}

export default ProgressBar;