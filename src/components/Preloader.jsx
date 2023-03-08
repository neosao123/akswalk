import React from "react";
import { ColorRing } from "react-loader-spinner";
const Preloader = () => {
  return (
    <div className="d-flex align-items-center justify-content-center vh-100 d-none hide loader">
      <div className="text-center">
        <ColorRing
          visible={true}
          height="90"
          width="90"
          ariaLabel="blocks-loading"
          wrapperStyle={{}}
          wrapperClass="blocks-wrapper"
          colors={["#1E8481", "#1E8481", "#1E8481", "#1E8481", "#1E8481"]}
        />
      </div>
    </div>
  );
};

export default Preloader;
