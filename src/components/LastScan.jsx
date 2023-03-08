import React, { useState, useEffect, useMemo } from "react";
import { fetchLastScan } from "../networkCalls/Api";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";

const LastScan = ({ overviewCode }) => {
    const [participants, setParticipants] = useState();
    const [stopAutofetch, setStopAutofetch] = useState(false);
    const defaultColDef = useMemo(() => ({
        flex: 1,
        resizable: true,
        sortable: true,
    }), []);

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

    const columnDefs = useMemo(() => [
        {
            field: "participantName",
            headerName: "Name",
            maxWidth: 150,
            sortable: false,
        },
        { field: "raceName", headerName: "Race Name", minWidth: 150, sortable: false },
        { field: "bibNo", headerName: "Bib No", minWidth: 150, sortable: false },
        { field: "age", headerName: "Age", minWidth: 150, sortable: false },
        { field: "gender", headerName: "Gender", minWidth: 150, sortable: false },
        { field: "city", headerName: "City", minWidth: 150, sortable: false },
        { field: "teamName", headerName: "Team", minWidth: 150, sortable: false },
        { field: "lastScan", headerName: "Last Scan", minWidth: 150, sortable: false },
    ], []);

    const callLog = async (param_overviewCode) => {
        await fetchLastScan(param_overviewCode, "", "").then((res) => {
            if (res.status === 200) {
                setParticipants(res.data);
            }
        }).catch((ex) => {
            console.log("Exception Cause ", ex.toString());
        });
    }

    const handleClear = async (event) => {
        event.preventDefault();
        document.querySelector("input[name='search_bibnumber']").value = "";
        document.querySelector("input[name='search_name']").value = "";
        callLog(overviewCode);
        setStopAutofetch(false);
    };

    const handleSearch = async (event) => {
        event.preventDefault();
        const search_bibnumber = document.querySelector("input[name='search_bibnumber']").value;
        const search_name = document.querySelector("input[name='search_name']").value;
        console.log(search_name, search_bibnumber);
        setStopAutofetch(true);
        await fetchLastScan(overviewCode, search_name, search_bibnumber).then((res) => {
            if (res.status === 200) {
                setParticipants(res.data);
            }
        }).catch((ex) => {
            console.log("Exception Cause ", ex.toString());
        });
    }

    useEffect(() => {
        if (overviewCode !== undefined) {
            const interval = setInterval(() => {
                //console.log("API CAlled AT ", moment().format("DD/MM/YY hh:mm:ss"));
                if (!stopAutofetch)
                    callLog(overviewCode);
            }, 20000);
            return () => clearInterval(interval);
        }
    }, [overviewCode, stopAutofetch])

    return (
        <div className="container-fluid" style={{ height: "100%" }}>
            <div className="row">
                <div className="col-12 my-3">
                    <div className="card shadow" style={{ borderRadius: "0.25rem" }}>
                        <div className="card-body">
                            <h5 className="card-title mb-2">Search by:</h5>
                            <div className="row">
                                <div className="col-sm-7 col-md-4 col-lg-3 mb-2">
                                    <input type="text" name="search_name" className="form-control form-control-sm" placeholder="Name of participant" />
                                </div>
                                <div className="col-sm-5 col-md-4 col-lg-3 mb-2">
                                    <input type="text" name="search_bibnumber" className="form-control form-control-sm" placeholder="Bib Number" />
                                </div>
                                <div className="col-sm-12 mb-3">
                                    <button className="btn btn-success btn-sm me-1" onClick={handleSearch}>Search</button>
                                    <button className="btn btn-outline-danger btn-sm me-1" onClick={handleClear}>Clear</button>
                                </div>
                            </div>
                            <div style={style}>
                                <AgGridReact
                                    className="ag-theme-material"
                                    animateRows={true}
                                    columnDefs={columnDefs}
                                    defaultColDef={defaultColDef}
                                    enableRangeSelection="true"
                                    rowData={participants}
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

export default LastScan;