import React from "react";
import { Link } from "react-router-dom";
import strings from '../utils/strings';

const Header = () => {
    const logo = `${strings.MEDIA_ROUTE}theme/images/flat-logo.png`;
    return (
        <div>
            <header>
                <nav className="navbar navbar-expand-md navbar-light bg-light ">
                    <div className="container-fluid">
                        <Link className="navbar-brand" to="/">
                            <img
                                src={logo}
                                alt="AKSTrack logo"
                                style={{ height: "35px", width: "auto" }}
                            />
                        </Link>
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarCollapse"
                            aria-controls="navbarCollapse"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div
                            className="collapse navbar-collapse text-align-right"
                            id="navbarCollapse"
                        >
                            <ul className="navbar-nav ms-auto mb-2 smb-md-0">
                                <li className="nav-item">
                                    <Link
                                        to="/home"
                                        className="nav-link active"
                                        aria-current="page"
                                        href="#"
                                    >
                                        Home
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/events" className="nav-link" href="#">
                                        Events
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/services" className="nav-link" href="#">
                                        Services
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/about" className="nav-link" href="#">
                                        About
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
        </div>
    );
};

export default Header;
