import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import "./App.css";
import { Card, Dimmer, Loader, Select } from "semantic-ui-react";
import axios from "axios";

function App() {
  const [loading, setLoading] = useState(true);
  const [priceData, setPriceData] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [series, setSeries] = useState(null);

  const options = [
    { value: "USD", text: "USD" },
    { value: "EUR", text: "EUR" },
    { value: "GBP", text: "GPB" },
  ];

  useEffect(() => {
    axios
      .get("https://api.coindesk.com/v1/bpi/currentprice.json")
      .then((res) => {
        console.log(res.data.bpi);
        setCurrency(res.data.bpi.USD.code);
        setPriceData(res.data.bpi);
        getChartData();
      });
  }, []);

  const getChartData = () => {
    axios
      .get("https://api.coindesk.com/v1/bpi/historical/close.json?")
      .then((res) => {
        console.log(res.data);
        const categories = Object.keys(res.data.bpi);
        const series = Object.values(res.data.bpi);

        setChartData({
          xaxis: {
            categories: categories,
          },
        });
        setSeries([
          {
            name: "Bitcoin Price",
            data: series,
          },
        ]);
        setLoading(false);
      });
  };

  return (
    <div className="container">
      <div
        className="nav"
        style={{ padding: "15px", backgroundColor: "#5843BE" }}
      >
        <span class="bitheader">Real-time bitcoin graph</span>
      </div>
      {loading ? (
        <div>
          <Dimmer active inverted>
            <Loader>Loading</Loader>
          </Dimmer>
        </div>
      ) : (
        <>
          <div
            className="price-container"
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              width: 600,
              height: 30,
              margin: "0 auto",
            }}
          >
            {/* <div className="form">
              <Select
                style={{ backgroundColor: "#C30F70", color: "white" }}
                placeholder="Select your currency"
                onChange={(e, data) => {
                  setCurrency(data.value);
                }}
                options={options}
              />
            </div> */}
            {/* <div className="price">
              <Card>
                <Card.Content>
                  <Card.Header>{currency} Price</Card.Header>
                  <Card.Description>
                    {priceData[currency].rate}
                  </Card.Description>
                </Card.Content>
              </Card>
            </div> */}
          </div>
          <div
            className="price"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Card>
              <Card.Content>
                <Card.Header>{currency} Price</Card.Header>
                <Card.Description>{priceData[currency].rate}</Card.Description>
              </Card.Content>
            </Card>
          </div>
          <div
            className="form"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Select
              style={{ backgroundColor: "#C30F70", color: "white" }}
              placeholder="Select your currency"
              onChange={(e, data) => {
                setCurrency(data.value);
              }}
              options={options}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Chart
              options={chartData}
              series={series}
              class="bitcoinchart"
              type="area"
              style={{ color: "#C30F70" }}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
