import React from 'react'
import strings from '../utils/strings';

const Notfound = ({ message }) => {
  const notFound = `url(${strings.MEDIA_ROUTE}theme/images/notfound.svg)`;
  return (
    <div>
      <div className="d-flex align-items-center justify-content-center vh-100" style={{ backgroundImage: notFound, backgroundRepeat: "no-repeat", backgroundPosition: "center",  backgroundSize: "contain" }}>
        <div className="col-md-4 text-center">
          <div className="card">
            <div className="card-body">
              {message}
              Have you lost somewhere? <br /> Please verify the link and then
              try again...
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Notfound;
