import React, { useState, useEffect, useMemo } from "react";
import { fetchEventDetails } from "../networkCalls/Api";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import { collection, getDocs, onSnapshot, orderBy, query } from "@firebase/firestore";
import { db } from "../firebase";
import strings from "../utils/strings";

function ProgressBar(params) {
    return (
        <div className="progress mt-3" style={{ height: "20px" }}>
            <div className="progress-bar" role="progressbar" style={{ width: `${params.value}%` }} aria-valuenow={params.value} aria-valuemin="0" aria-valuemax="100">
                {params.value + "%"}
            </div>
        </div>
    );
}

const TotalOverView = ({ overviewCode, eventCode, totalRaces, totalParticipants }) => {
    const cicleImg = `${strings.MEDIA_ROUTE}theme/images/circle.svg`;
    const [races, setRaces] = useState(0);
    const [participants, setParticipants] = useState(0);
    const [raceFinished, setRaceFinished] = useState(0);
    const [raceUnfinihsed, setRaceUnfinished] = useState(0);
    const [participantsData, setParticipantsData] = useState();

    const defaultColDef = useMemo(
        () => ({
            flex: 1,
            resizable: true,
            sortable: true,
        }),
        []
    );

    const [style, setStyle] = useState({
        display: "block",
        height: "calc(100vh - 140px)",
        width: "100%",
    });

    const autoGroupColumnDef = useMemo(() => {
        return {
            cellRenderer: "agGroupCellRenderer",
            headerName: "Progress",
            minWidth: 200,
            field: "percent",
        };
    }, []);

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

    const getIinitalData = async (param_eventCode) => {
        const querySnapshot = await getDocs(
            collection(db, `Events/${param_eventCode}/Participants`),
            orderBy("timestamp", "desc")
        );
        var participants = [];
        querySnapshot.forEach((doc) => {
            participants.push({
                participantName: doc.data().participantName,
                bibNo: doc.data().bibNo,
                city: doc.data().city,
                percent: doc.data().percent ?? 0,
                timestamp: doc.data().timestamp,
                age: doc.data().age,
                gender: doc.data().gender,
                raceName: doc.data().raceName,
                teamName: doc.data().teamName
            });
        });
        setParticipantsData(
            participants.sort((a, b) => {
                return a.timestamp < b.timestamp ? 1 : -1;
            })
        );

        var raceFinishCount = participants.filter((participant) => participant.percent >= 100);
        setRaceFinished(raceFinishCount.length);
        setRaceUnfinished(totalParticipants - raceFinishCount.length);
    }

    useEffect(() => {
        setRaces(totalRaces ?? 0);
        setParticipants(totalParticipants ?? 0);
        if (eventCode !== undefined) {
            getIinitalData(eventCode);

            const firestoreQuery = query(
                collection(db, `Events/${eventCode}/Participants`),
                orderBy("timestamp", "asc")
            );
            const unsubscribe = onSnapshot(firestoreQuery, (querySnapshot) => {
                const participants = [];
                querySnapshot.forEach((doc) => {
                    participants.push({
                        participantName: doc.data().participantName,
                        bibNo: doc.data().bibNo,
                        city: doc.data().city,
                        percent: doc.data().percent ?? 0,
                        timestamp: doc.data().timestamp,
                        age: doc.data().age,
                        gender: doc.data().gender,
                        raceName: doc.data().raceName,
                        teamName: doc.data().teamName
                    });
                });
                setParticipantsData(
                    participants.sort((a, b) => {
                        return a.timestamp < b.timestamp ? 1 : -1;
                    })
                );

                fetchEventDetails(overviewCode).then((response) => {
                    if (response.status === 200) {
                        const data = response.data;
                        setRaces(data?.raceCount)
                        setParticipants(data?.participantCount);

                        var raceFinishCount = participants.filter((participant) => participant.percent >= 100);
                        setRaceFinished(raceFinishCount.length);
                        setRaceUnfinished(data?.participantCount - raceFinishCount.length);

                    }
                }).catch((ex) => {
                    console.log("Exception ", ex.toString());
                });
            });
        }
    }, [eventCode, totalRaces, totalParticipants, overviewCode]);

    return (
        <div className="container-fluid mt-3" style={{ height: "100%" }}>
            <div className="row g-3 statistics">
                <div className="col-6 col-sm-6 col-md-3">
                    <div className="card s1 text-white mb-3">
                        <div className="card-body">
                            <img src={cicleImg} class="card-img-absolute" alt="circle pic" />
                            <h5 className="sm-title">Total Races</h5>
                            <h4 className="mb-0">{races}</h4>
                        </div>
                    </div>
                </div>
                <div className="col-6 col-sm-6 col-md-3">
                    <div className="card s2 text-white mb-3">
                        <div className="card-body">
                            <img src={cicleImg} class="card-img-absolute" alt="circle pic" />
                            <h5 className="sm-title">Total Participants</h5>
                            <h4 className="mb-0">{participants}</h4>
                        </div>
                    </div>
                </div>
                <div className="col-6 col-sm-6 col-md-3">
                    <div className="card s3 text-white mb-3">
                        <div className="card-body">
                            <img src={cicleImg} class="card-img-absolute" alt="circle pic" />
                            <h5 className="sm-title">Race Finished Participants</h5>
                            <h4 className="mb-0">{raceFinished}</h4>
                        </div>
                    </div>
                </div>
                <div className="col-6 col-sm-6 col-md-3">
                    <div className="card s4 text-white mb-3">
                        <div className="card-body">
                            <img src={cicleImg} class="card-img-absolute" alt="circle pic" />
                            <h5 className="sm-title">Race Unfinished Participants</h5>
                            <h4 className="mb-0">{raceUnfinihsed}</h4>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12 mb-3">
                    <div className="card shadow" style={{ borderRadius: "0.25rem" }}>
                        <div className="card-body">
                            <div style={style}>
                                <AgGridReact
                                    className="ag-theme-material"
                                    animateRows={true}
                                    columnDefs={columnDefs}
                                    defaultColDef={defaultColDef}
                                    enableRangeSelection="true"
                                    rowData={participantsData}
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

    )
}

export default TotalOverView;