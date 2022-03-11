import "./App.css";
import React, { useState, useEffect, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis } from "recharts";

import Layout from "./Layout";
import Axios from "axios";

function App() {
  const [instruments, setinstruments] = useState([]);
  const [fromDate, setfromDate] = useState("");
  const [toDate, settoDate] = useState("");
  const [company, setCompany] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const [chartData, setChartData] = useState([]);
  const [showHigh, setShowHigh] = useState(true);
  const [showLow, setShowLow] = useState(true);
  const [showOpen, setShowOpen] = useState(true);
  const [showClose, setShowClose] = useState(true);
  const [showVol, setShowVol] = useState(true);
  const [showOI, setShowOI] = useState(true);

  const [input, setinput] = useState("");
  const [clicked, setclick] = useState(false);
  const [showinstrumentlist, setshowinstrumentlist] = useState(false);
  const [timestampData, setTimestampData] = useState([[{ timestamp: "" }]]);
  const [highData, setHighData] = useState([[{ timestamp: "", value: "" }]]);
  const [lowData, setLowData] = useState([[{ timestamp: "", value: "" }]]);
  const [openData, setOpenData] = useState([[{ timestamp: "", value: "" }]]);
  const [closeData, setCloseData] = useState([[{ timestamp: "", value: "" }]]);
  const [volumeData, setVolumeData] = useState([{ timestamp: "", value: " " }]);
  const [oiData, setOIData] = useState([{ timestamp: "", value: " " }]);
  const [loaded, setLoaded] = useState(false);
  const styles = {
    fontFamily: "sans-serif",
    textAlign: "center",
  };
  useEffect(() => {
    console.log("saraswat");

    (async () => {
      const { data } = await Axios.get(
        "http://139.59.76.169:4002/api/instruments"
      );
      setinstruments(data.data);
    })();
  }, []);
  const getOpenData = (data) => {
    if (!showOpen) return null;
    const index = openData.findIndex((obj) => obj.timestamp === data.timestamp);
    return index === -1 ? null : openData[index].value;
  };
  const getCloseData = (data) => {
    if (!showClose) return null;
    const index = closeData.findIndex(
      (obj) => obj.timestamp === data.timestamp
    );
    return index === -1 ? null : closeData[index].value;
  };
  const getHighData = (data) => {
    if (!showHigh) return null;
    const index = highData.findIndex((obj) => obj.timestamp === data.timestamp);
    return index === -1 ? null : highData[index].value;
  };
  const getLowData = (data) => {
    if (!showLow) return null;
    const index = lowData.findIndex((obj) => obj.timestamp === data.timestamp);
    return index === -1 ? null : lowData[index].value;
  };
  const getVolumeData = (data) => {
    if (!showVol) return null;
    const index = volumeData.findIndex(
      (obj) => obj.timestamp === data.timestamp
    );
    return index === -1 ? null : volumeData[index].value;
  };
  const getOIData = (data) => {
    if (!showOI) return null;

    const index = oiData.findIndex((obj) => obj.timestamp === data.timestamp);
    return index === -1 ? null : oiData[index].value;
  };
  const reset = () => {
    setTimestampData([[{ timestamp: "", value: "" }]]);
    setCloseData([[{ timestamp: "", value: "" }]]);
    setOpenData([[{ timestamp: "", value: "" }]]);
    setHighData([[{ timestamp: "", value: "" }]]);
    setLowData([[{ timestamp: "", value: "" }]]);
    setVolumeData([[{ timestamp: "", value: "" }]]);
    setOIData([[{ timestamp: "", value: "" }]]);
  };
  const getChartData2 = async () => {
    reset();
    setLoaded(false);
    const { data } = await Axios.get(
      `http://139.59.76.169:4002/api/candles?instrument=${company}&timeframe=${timeframe}&from=${fromDate}&to=${toDate}`
    );

    data["data"].map((val) => {
      let time = {
        timestamp: val[0],
      };
      let high = {
        timestamp: val[0],
        value: val[2],
      };
      let low = {
        timestamp: val[0],
        value: val[3],
      };
      let open = {
        timestamp: val[0],
        value: val[1],
      };
      let close = {
        timestamp: val[0],
        value: val[4],
      };
      let vol = {
        timestamp: val[0],
        value: val[5],
      };
      let oi = {
        timestamp: val[0],
        value: val[6],
      };
      setTimestampData((old) => [...old, time]);
      setCloseData((old) => [...old, close]);
      setOpenData((old) => [...old, open]);
      setHighData((old) => [...old, high]);
      setLowData((old) => [...old, low]);
      setVolumeData((old) => [...old, vol]);
      setOIData((old) => [...old, oi]);
    });
    setLoaded(true);
  };

  return (
    <div className="App">
      <form className="forminput">
        <label htmlFor="instrument">Instrument : </label>
        <div>
          <input
            type="search"
            placeholder="Company"
            onChange={(event) => {
              setinput(event.target.value);
              setshowinstrumentlist(true);
              setclick(false);
            }}
            onClick={() => {
              setclick(false);
            }}
            value={clicked ? company : input}
          />
          {showinstrumentlist && (
            <div
              style={{
                width: "11.5vw",
                paddingTop: "0.5vh",
                paddingLeft: "0.5vh",
                backgroundColor: "white",
                maxHeight: "18vh",
                marginTop: "0vh",
                overflow: "auto",
                position: "fixed",
              }}
            >
              {instruments
                .filter((val) => {
                  if (input === "") {
                    return val;
                  } else if (val.toLowerCase().includes(input.toLowerCase())) {
                    return val;
                  }
                })
                .map((val) => {
                  return (
                    <div
                      style={{
                        paddingTop: "0.5vh",
                        paddingLeft: "0.5vh",
                        marginTop: "0.2vh",
                      }}
                      className="listitem"
                      onClick={() => {
                        setCompany(val);
                        setclick(true);
                        setshowinstrumentlist(false);
                      }}
                    >
                      {val}
                    </div>
                  );
                })}
            </div>
          )}
        </div>
        <div>
          <label htmlFor="timeframe">Timeframe : </label>
          <select
            value={timeframe}
            onChange={(event) => {
              setTimeframe(event.target.value);
            }}
          >
            <option value="minute">minute</option>
            <option value="2minute">2minute</option>{" "}
            <option value="3minute">3minute</option>{" "}
            <option value="5minute">5minute</option>{" "}
            <option value="10minute">10minute</option>{" "}
            <option value="15minute">15minute</option>
            <option value="30minute">30minute</option>{" "}
            <option value="hour">hour</option>{" "}
            <option value="2hour">2hour</option>{" "}
            <option value="4hour">4hour</option>
            <option value="day">day</option>
          </select>
        </div>
        <div>
          <label htmlFor="fromdate">From Date :</label>
          <input
            type="date"
            value={fromDate}
            onChange={(event) => {
              setfromDate(event.target.value);
            }}
          ></input>
        </div>
        <div>
          <label htmlFor="fromdate">To Date :</label>
          <input
            type="date"
            value={toDate}
            onChange={(event) => {
              settoDate(event.target.value);
            }}
          ></input>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            getChartData2();
          }}
        >
          {" "}
          Fetch{" "}
        </button>
      </form>
      <div
        style={{
          marginTop: "20vh",
          position: "absolute",
          marginLeft: "5vw",
          overflow: "auto",
          padding: "1vh",
          border: "1px solid black",
        }}
      >
        <div className="checkboxes">
          <input
            type="checkbox"
            className="checkboxS"
            defaultChecked={showOpen}
            onClick={() => {
              setShowOpen(!showOpen);
            }}
          />
          <label>Open</label>
          <input
            type="checkbox"
            className="checkboxS"
            defaultChecked={showHigh}
            onClick={() => {
              setShowHigh(!showHigh);
            }}
          />
          <label>High</label>
          <input
            type="checkbox"
            className="checkboxS"
            defaultChecked={showLow}
            onClick={() => {
              setShowLow(!showLow);
            }}
          />
          <label>Low</label>
          <input
            type="checkbox"
            className="checkboxS"
            defaultChecked={showClose}
            onClick={() => {
              setShowClose(!showClose);
            }}
          />
          <label>Close</label>
          <input
            type="checkbox"
            className="checkboxS"
            defaultChecked={showVol}
            onClick={() => {
              setShowVol(!showVol);
            }}
          />
          <label> Volume</label>
          <input
            type="checkbox"
            className="checkboxS"
            defaultChecked={showOI}
            onClick={() => {
              setShowOI(!showOI);
            }}
          />
          <label>OI</label>
        </div>
        <div style={styles}>
          {loaded && (
            <LineChart
              width={1400}
              height={400}
              data={timestampData}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <Line
                type="monotone"
                dataKey={getCloseData}
                stroke="#8884d8"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey={getOpenData}
                stroke="yellow"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey={getHighData}
                stroke="green"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey={getLowData}
                stroke="orange"
                dot={false}
              />

              <Line
                type="monotone"
                dataKey={getVolumeData}
                stroke="red"
                dot={false}
              />

              <Line
                type="monotone"
                dataKey={getOIData}
                stroke="violet"
                dot={false}
              />
              <XAxis dataKey="timestamp" />
              <YAxis />
            </LineChart>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
