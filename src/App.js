import "./App.css";
import React, { useState, useEffect } from "react";
import { init, dispose } from "klinecharts";
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

  useEffect(() => {
    console.log("saraswat");

    (async () => {
      const { data } = await Axios.get(
        "http://139.59.76.169:4002/api/instruments"
      );
      setinstruments(data.data);
    })();

    return () => {
      dispose("basic-k-line");
    };
  }, []);
  const getChartData = async () => {
    console.log("saraswatdata");

    const { data } = await Axios.get(
      `http://139.59.76.169:4002/api/candles?instrument=${company}&timeframe=${timeframe}&from=${fromDate}&to=${toDate}`
    );
    setChartData(data["data"]);
    const kLineChart = init("basic-k-line");
    kLineChart.applyNewData(
      data["data"].map(function (data) {
        return {
          timestamp: new Date(data[0]).getTime(),
          open: showOpen ? +data[1] : null,
          high: showHigh ? +data[2] : null,
          low: showLow ? +data[3] : null,
          close: showClose ? +data[4] : null,
          volume: showVol ? Math.ceil(+data[5]) : null,
        };
      })
    );

    console.log(data["data"]);
  };

  return (
    <div className="App">
      <form className="forminput">
        <div>
          <label htmlFor="instrument">Instrument : </label>
          <select
            value={company}
            onChange={(event) => {
              setCompany(event.target.value);
            }}
          >
            {instruments.map((val, index) => (
              <option key={index} value={val}>
                {val}
              </option>
            ))}
          </select>
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
          onClick={async (e) => {
            e.preventDefault();
            await getChartData();
          }}
        >
          {" "}
          Fetch{" "}
        </button>
      </form>
      <div className="checkboxes">
        <input
          type="checkbox"
          className="checkboxS"
          defaultChecked={showOpen}
          onClick={() => {
            setShowOpen(!showOpen);
            getChartData();
          }}
        />
        <label>Open</label>
        <input
          type="checkbox"
          className="checkboxS"
          defaultChecked={showHigh}
          onClick={() => {
            setShowHigh(!showHigh);
            getChartData();
          }}
        />
        <label>High</label>
        <input
          type="checkbox"
          className="checkboxS"
          defaultChecked={showLow}
          onClick={() => {
            setShowLow(!showLow);
            getChartData();
          }}
        />
        <label>Low</label>
        <input
          type="checkbox"
          className="checkboxS"
          defaultChecked={showClose}
          onClick={() => {
            setShowClose(!showClose);
            getChartData();
          }}
        />
        <label>Close</label>
        <input
          type="checkbox"
          className="checkboxS"
          defaultChecked={showVol}
          onClick={() => {
            setShowVol(!showVol);
            getChartData();
          }}
        />
        <label> Volume</label>
        <input type="checkbox" className="checkboxS" />
        <label>OI</label>
      </div>
      <Layout title="K-Line Chart ">
        <div id="basic-k-line" className="k-line-chart" />
      </Layout>
    </div>
  );
}

export default App;
