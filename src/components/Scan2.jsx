import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import swal from "sweetalert";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { fetchChkpt, storeCheckpointLog, fetchAllParticipants } from "../networkCalls/Api";
import {
    AiOutlineTrophy,
    AiOutlineCalendar,
    AiOutlineFlag,
} from "react-icons/ai";
import moment from "moment/moment";
import Notfound from "./Notfound";
import EventComplete from "./EventComplete";
import EventPending from "./EventPending";

const Scan2 = () => {
    const { ckpid } = useParams();
    const [eventData, setEventData] = useState();
    const [checkpointData, setCheckpointData] = useState();
    const [raceData, setRaceData] = useState();
    const [participantData, setParticipantData] = useState({});
    const [eventCode, setEventCode] = useState();
    const [eventStatus, setEventStatus] = useState("PENDING");
    const [key, setKey] = useState();
    const [Reerror, setReError] = useState();
    const [participants, setParticipants] = useState([]);

    const handleQrCode = async (e) => {
        setReError("");
        if (e.keyCode === 13) {

            if (e.target.value !== "") {
                let foundParticipant = participants.filter(singleParticipant => singleParticipant.qrCode === key);
                if (foundParticipant.length > 0) {
                    foundParticipant = foundParticipant[0];
                    setParticipantData(foundParticipant);
                    foundParticipant.checkPoints = checkpointData.checkPoints;
                    foundParticipant.timestamp = moment().unix();
                    const races = checkpointData.raceCheckpointPercents;
                    var race = races.filter((race) => race.raceCode === foundParticipant.raceCode);
                    if (race.length === 1) {
                        foundParticipant.percent = race[0].percent;
                        setDoc(doc(db, "Events", eventCode), eventData).catch((err) => {
                            console.log(err);
                        });
                        setDoc(doc(
                            db,
                            "Events",
                            eventCode,
                            "Participants",
                            foundParticipant.participantCode
                        ), foundParticipant);
                        storeCheckpointLog({
                            eventCode: checkpointData.eventCode,
                            raceCode: checkpointData.raceCode,
                            checkpointCode: checkpointData.checkpointCode,
                            participantCode: foundParticipant.participantCode,
                            percent: foundParticipant.percent,
                        });
                        document.querySelector("input[id='qrcodeNumber']").value = "";
                        document.querySelector("input[id='qrcodeNumber']").focus();
                    } else {
                        document.querySelector("input[id='qrcodeNumber']").value = "";
                        document.querySelector("input[id='qrcodeNumber']").focus();
                    }
                } else {
                    setReError("Participant was not found");
                    document.querySelector("input[id='qrcodeNumber']").value = "";
                    document.querySelector("input[id='qrcodeNumber']").focus();
                    return false;
                }
            }
        }
    };

    useEffect(() => {
        if (ckpid === undefined) {
            alert("You have landed on a invalid link. Please check the url again...");
        } else {
            const loader = document.querySelector("div.loader");
            loader.classList.remove("d-none");
            fetchChkpt(ckpid)
                .then((result) => {
                    if (result.status === 200) {
                        setEventData(result.event);
                        setCheckpointData(result.checkpoint);
                        setEventCode(result.checkpoint.eventCode);
                        setTimeout(() => {
                            setEventStatus(result.event.eventStatus);
                            loader.classList.add("d-none");
                            if (result.event.eventStatus === "STARTED") {
                                fetchAllParticipants(result.checkpoint.eventCode, result.checkpoint.raceCode).then((response) => {
                                    if (response.status === 200) {
                                        setParticipants(response.result);
                                    }
                                }).catch((ex) => {
                                    //console.log("Exception => ", ex.toString());
                                });
                            }
                        }, 300);
                    } else {
                        loader.classList.add("d-none");
                        setEventStatus("NOTFOUND");
                        swal("Opps", "Either event might not exists or invalid checkpoint-code. Please confirm you have entered correct url", "warning");
                    }
                })
                .catch((ex) => {
                    loader.classList.add("d-none");
                    //console.log("Exception => ", ex.toString());
                });
        }
    }, [ckpid, eventStatus, checkpointData?.distance]);

    if (eventStatus === "PENDING") {
        return <EventPending />
    } else if (eventStatus === "COMPLETED") {
        return <EventComplete />
    } else if (eventStatus === "STARTED") {
        return (
            <div>
                <div className="bg-dark text-center text-light py-1 align-items-center">
                    <span className="">Scan QR-Code Race </span>
                    <span className="badge bg-light text-dark" style={{ fontSize: "1.1rem" }}>
                        {raceData?.raceName}
                    </span>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12 col-md-6 mt-2">
                            <div className="align-items-center text-muted">
                                <AiOutlineTrophy
                                    className="m-2"
                                    style={{
                                        fontSize: "1.0rem",
                                        fontWeight: "bold",
                                        color: "#d80049",
                                    }}
                                />
                                <span>
                                    Event
                                    <span style={{ fontSize: "1.1rem", fontWeight: "600" }} className="text-dark ms-2">
                                        {eventData?.eventName}
                                    </span>
                                </span>
                            </div>
                            <div className="align-items-center text-muted">
                                <AiOutlineCalendar
                                    className="m-2"
                                    style={{
                                        fontSize: "1.0rem",
                                        fontWeight: "bold",
                                        color: "#d80049",
                                    }}
                                />
                                <span>
                                    <span>
                                        {raceData?.startDate + " - " + raceData?.endDate}
                                    </span>
                                </span>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 mt-2">
                            <div className="align-items-center text-muted">
                                <AiOutlineFlag
                                    className="m-2"
                                    style={{
                                        fontSize: "1.0rem",
                                        fontWeight: "bold",
                                        color: "#d80049",
                                    }}
                                />
                                <span>
                                    Checkpoint
                                    <span
                                        style={{
                                            fontSize: "1.1rem",
                                            fontWeight: "600",
                                            textTransform: "capitalize",
                                        }}
                                        className="text-dark ms-2"
                                    >
                                        {checkpointData?.checkPointName}
                                    </span>
                                </span>
                            </div>
                            <div className="align-items-center text-muted">
                                <AiOutlineCalendar
                                    className="m-2"
                                    style={{
                                        fontSize: "1.0rem",
                                        fontWeight: "bold",
                                        color: "#d80049",
                                    }}
                                />
                                <span>
                                    Distance (in mtrs)
                                    <span className="ms-2" style={{ color: "#525356", fontWeight: "600" }}>
                                        {checkpointData?.distance}
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container col-sm-8 col-md-6 mt-5">
                    <div className="card shadow">
                        <div className="card-body">
                            <div className="row mb-3">
                                <div className="col-4 mt-2">
                                    <b className=""> Enter Barcode</b>
                                </div>
                                <div className="col-8">
                                    <input
                                        id="qrcodeNumber"
                                        autoFocus={true}
                                        placeholder="Scan_QR"
                                        className="form-control"
                                        onKeyUp={(e) => handleQrCode(e)}
                                        onChange={(e) => setKey(e.target.value)}
                                    />
                                </div>
                            </div>
                            {!Reerror ? (
                                <div className="row">
                                    <div className="col-sm-12 px-3 mb-3">
                                        <div className="light-title">Name</div>
                                        <div className="bold-title">{participantData?.participantName}</div>
                                    </div>
                                    <div className="col-sm-12 px-3 mb-3">
                                        <div className="light-title">BIB Number</div>
                                        <div className="bold-title">{participantData?.bibNo}</div>
                                    </div>
                                    <div className="col-sm-12 px-3 mb-3">
                                        <div className="light-title">Team/Club</div>
                                        <div className="bold-title">{participantData?.teamName}</div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="qrCode-dark border border-dark rounded-3 p-3 mt-1">
                                        <h5 className="text-danger text-center">{Reerror}</h5>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return <Notfound />
    }

};

export default Scan2;
