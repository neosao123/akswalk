import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TotalOverView from "./TotalOverView";
import LastScan from "./LastScan";
import { fetchEventDetails } from "../networkCalls/Api";
import strings from "../utils/strings";

const EventOverview = () => {
    const { overviewCode } = useParams();
    const [eventData, setEventData] = useState();
    const logo = `${strings.MEDIA_ROUTE}theme/images/flat-logo.png`;
    useEffect(() => {
        if (overviewCode !== undefined) {
            fetchEventDetails(overviewCode).then((response) => {
                if (response.status === 200) {
                    const data = response.data;
                    setEventData(data);
                }
            }).catch((ex) => {
                console.log("Exception ", ex.toString());
            });
        } else {
            alert("This is an invalid link or no overview code found in url. Please verify the link is correct...");
        }
    }, [overviewCode]);

    return (
        <div className="container-fluid bg-light">
            <div className="row text-light py-1" style={{ background: "#84191b" }}>
                <div className="col-sm-5 d-flex align-items-center">
                    <img src={logo} alt="akstrack-logo" style={{ background: "#ffffff", height: "40px", padding: "2px", borderRadius: "10px" }} />
                </div>
                <div className="col-sm-7 d-flex align-items-center justify-content-md-center" style={{ fontSize: "1.1rem" }}>
                    Event: {eventData?.eventName}
                </div>
            </div>
            <div className="row g-0">
                <div className="col-12">
                    <ul className="nav nav-pills mt-2" id="myTab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button className="nav-link active" id="overview-tab" data-bs-toggle="tab" data-bs-target="#overview" type="button" role="tab" aria-controls="overview" aria-selected="true">Overview</button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link" id="lastscan-tab" data-bs-toggle="tab" data-bs-target="#lastscan" type="button" role="tab" aria-controls="lastscan" aria-selected="false">Last Scan</button>
                        </li>
                    </ul>
                    <div className="tab-content" id="myTabContent">
                        <div className="tab-pane fade show active" id="overview" role="tabpanel" aria-labelledby="overview-tab">
                            <TotalOverView overviewCode={overviewCode} eventCode={eventData?.eventCode} totalRaces={eventData?.raceCount} totalParticipants={eventData?.participantCount} />
                        </div>
                        <div className="tab-pane fade" id="lastscan" role="tabpanel" aria-labelledby="lastscan-tab">
                            <LastScan overviewCode={overviewCode} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EventOverview;