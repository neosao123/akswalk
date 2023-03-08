import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import { FaFlagCheckered } from "react-icons/fa";
import { MdOutlineEmojiEvents } from "react-icons/md";
import { fetchChkpt } from "../networkCalls/Api";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import { db } from "../firebase";
import {
    collection,
    getDocs,
    onSnapshot,
    query,
    orderBy
} from "firebase/firestore";



const CheckpointOverview = () => {
    const { linkCode } = useParams();
    const [style, setStyle] = useState({
        display: "block",
        height: "calc(100vh - 140px)",
        width: "100%",
    });
    const [flaggedParticipants, setFlaggedParticipants] = useState();
    const [eventData, setEventData] = useState();
    const [eventStatus, setEventStatus] = useState();
    const [eventCode, setEventCode] = useState();
    const [checkpointData, setCheckpointData] = useState();
    const [checkpointCode, setCheckpointCode] = useState();
    const [error, setError] = useState();

    const columnDefs = useMemo(
        () => [
            {
                field: "participantName",
                headerName: "Name",
                maxWidth: 150,
                sortable: false,
            },
            { field: "raceName", headerName: "Race Name", maxWidth: 150, sortable: false },
            { field: "bibNo", headerName: "Bib No", maxWidth: 150, sortable: false },
            { field: "age", headerName: "Age", maxWidth: 150, sortable: false },
            { field: "gender", headerName: "Gender", maxWidth: 150, sortable: false },
            { field: "city", headerName: "City", maxWidth: 150, sortable: false },
            { field: "teamName", headerName: "Team", maxWidth: 150, sortable: false },
            {
                field: "percent",
                cellRenderer: ProgressBar,
                sortable: false,
                sortingOrder: ["desc"],
            },
        ],
        []
    );

    function ProgressBar(params) {
        return (
            <div className="progress mt-3" style={{ height: "20px" }}>
                <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${params.value}%` }}
                    aria-valuenow={params.value}
                    aria-valuemin="0"
                    aria-valuemax="100"
                >
                    {params.value + "%"}
                </div>
            </div>
        );
    }


    const defaultColDef = useMemo(() => ({
        flex: 1,
        resizable: true,
        sortable: true,
    }), []);

    const autoGroupColumnDef = useMemo(() => {
        return {
            cellRenderer: "agGroupCellRenderer",
            headerName: "Progress",
            minWidth: 200,
            field: "percent",
        };
    }, []);

    const fetchCheckpointData = async (param_link_code) => {
        const loader = document.querySelector("div.loader");
        loader.classList.remove("d-none");
        fetchChkpt(param_link_code)
            .then(async (result) => {
                loader.classList.add("d-none");
                if (result?.status === 200) {
                    setEventData(result.event);
                    setEventStatus(result.event.eventStatus);
                    setCheckpointData(result.checkpoint);
                    var ckCode = result.checkpoint.checkpointCode;
                    setCheckpointCode(ckCode);
                    var chkptData = result.checkpoint;
                    setEventCode(chkptData.eventCode);
                    const querySnapshot = await getDocs(
                        collection(db, `Events/${chkptData.eventCode}/Participants`),
                        orderBy("timestamp", "desc")
                    );
                    var participants = [];
                    querySnapshot.forEach((doc) => {
                        if (doc.data().checkPoints.indexOf(ckCode) !== -1) {
                            participants.push({
                                participantName: doc.data().participantName,
                                bibNo: doc.data().bibNo,
                                city: doc.data().city,
                                percent: doc.data().percent,
                                timestamp: doc.data().timestamp,
                                age: doc.data().age,
                                gender: doc.data().gender,
                                raceName: doc.data().raceName,
                                teamName: doc.data().teamName
                            });
                        }
                    });
                    setFlaggedParticipants(
                        participants.sort((a, b) => {
                            return a.timestamp < b.timestamp ? 1 : -1;
                        })
                    );

                } else {
                    setError(true);
                }
            })
            .catch((ex) => {
                loader.classList.add("d-none");
                console.log("Exception => ", ex.toString());
            });
    };

    useEffect(() => {
        if (linkCode === undefined) {
            alert("You landed on a invalid link or this link has been exired. Please check the url again...");
        } else {
            fetchCheckpointData(linkCode);

            if (eventCode !== "" && checkpointCode !== "") {
                const firestoreQuery = query(
                    collection(db, `Events/${eventCode}/Participants`),
                    orderBy("timestamp", "asc")
                );
                const unsubscribe = onSnapshot(firestoreQuery, (querySnapshot) => {
                    const participants = [];
                    querySnapshot.forEach((doc) => {
                        if (doc.data().checkPoints.indexOf(checkpointCode) !== -1) {
                            participants.push({
                                participantName: doc.data().participantName,
                                bibNo: doc.data().bibNo,
                                city: doc.data().city,
                                percent: doc.data().percent,
                                timestamp: doc.data().timestamp,
                                age: doc.data().age,
                                gender: doc.data().gender,
                                raceName: doc.data().raceName,
                                teamName: doc.data().teamName
                            });
                        }
                    });
                    setFlaggedParticipants(
                        participants.sort((a, b) => {
                            return a.timestamp < b.timestamp ? 1 : -1;
                        })
                    );
                });
            }

        }
    }, [linkCode, eventStatus, eventCode, checkpointCode]);

    return (

        <div className="continer-fluid">
            <div className="text-light p-1 align-items-center" style={{ background: "#dc3545b5" }}>
                <span>Event:</span>
                <span className="badge bg-light text-dark ms-2 " style={{ fontSize: "1.1rem" }}>
                    {eventData?.eventName}
                </span>
            </div>

            <div className="container-fluid" style={{ height: "100%" }}>
                <div className="row">
                    <div className="col mt-1">
                        <h5>
                            <FaFlagCheckered
                                className="text-success"
                                style={{ fontSize: "0.90rem" }}
                            />
                            <span
                                className="text-muted ms-2"
                                style={{ fontSize: "0.90rem" }}
                            >
                                Checkpoint Overview :
                            </span>
                            <span
                                style={{ textTransform: "capitalize" }}
                                className="text-danger ms-2"
                            >
                                {checkpointData?.checkPointName}
                            </span>
                        </h5>
                    </div>
                    <div className="col mt-1">
                        <h5
                            style={{ fontWeight: "400" }}
                            className="align-items-center"
                        >
                            <MdOutlineEmojiEvents />
                            <span className="ms-2">
                                {eventData?.startDate} - {eventData?.endDate}
                            </span>
                        </h5>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 my-3">
                        <div className="card shadow">
                            <div className="card-body">
                                <div style={style}>
                                    <AgGridReact
                                        className="ag-theme-material"
                                        animateRows={true}
                                        columnDefs={columnDefs}
                                        defaultColDef={defaultColDef}
                                        enableRangeSelection="false"
                                        rowData={flaggedParticipants}
                                        rowSelection="multiple"
                                        suppressRowClickSelection="true"
                                        autoGroupColumnDef={autoGroupColumnDef}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default CheckpointOverview;