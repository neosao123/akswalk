import { axiosPrivate } from "./axios";

export const fetchChkpt = async (linkCode) => {
  const apiResult = await axiosPrivate.get(`/details/checkpoint?linkCode=${linkCode}`);
  return apiResult.data;
};

//donot use this api any where this has been deprecated
export const fetchPrtpnt = async (eventCode, raceCode, qrCode, checkpointCode) => {
  const apiResult = await axiosPrivate.get(`/details/participant?eventCode=${eventCode}&raceCode=${raceCode}&checkpointCode=${checkpointCode}&qrCode=${qrCode}`);
  return apiResult.data;
}

export const fetchRaceData = async (raceCode) => {
  const apiResult = await axiosPrivate.get(`/details/race?linkCode=${raceCode}`);
  return apiResult.data;
};

export const fetchAllParticipants = async (eventCode, raceCode) => {
  const apiResult = await axiosPrivate.get(`/race/participants?eventCode=${eventCode}&raceCode=${raceCode}`);
  return apiResult.data;
};

//use this  api instead to store the checkpoint scan logs
export const storeCheckpointLog = (data) => {
  const apiResult = axiosPrivate.post(`/store/log`, data);
  return apiResult.data;
}

export const fetchOverviewCounts = async (overviewCode) => {
  const apiResult = await axiosPrivate.get(`/event/overview/counts?overviewCode=${overviewCode}`);
  return apiResult.data;
}

export const fetchEventDetails = async (overviewCode) => {
  const apiResult = await axiosPrivate.get(`/details/event?overviewCode=${overviewCode}`);
  return apiResult.data;
}

export const fetchLastScan = async (overviewCode, participantName, bibNumber) => {

  var path = `/event/lastscan?overviewCode=${overviewCode}`;

  if (participantName !== "") {
    if (path !== "")
      path = path + `&participantName=${participantName}`;
  }

  if (bibNumber !== "") {
    if (path !== "")
      path = path + `&bibNumber=${bibNumber}`;
  }

  const apiResult = await axiosPrivate.get(path);
  return apiResult.data;
}

