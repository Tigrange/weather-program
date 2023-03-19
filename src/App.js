import React,{useEffect, useState,Suspense} from "react";

//styles
import "./styles/main.css"
import "./App.css"

//modules
import axios from "axios";

//variables
import {
  API_URL,
  AcuWeather_api_key,
  IpGeolocation_api_key,
} from "./constants";

//components
import { SearchLocationForom } from "components/SearchLocationForm";
import SpinnerLoad from "components/SpinnerLoad";
const ForecastTable = React.lazy(() => import("components/ForecastTable"));


function App() {
  const [fiveDayForecastData,setFiveDayForecastData] = useState(null);
  const [locationData,setLocationData] = useState(null);
  const [locationKey,setLocationKey] = useState(null);
  const [metric,setMetric] = useState(true);

  const selectLocationKeyHandler = async(key)=>{
    setLocationKey(key)
    if(key){
          await axios
            .get(
              `${API_URL}/forecasts/v1/daily/5day/${key}?apikey=${AcuWeather_api_key}&metric=${metric}&details=true`
            )
            .then((res) => {
              if (res.data.DailyForecasts.length && res.status === 200) {
                setFiveDayForecastData(res.data.DailyForecasts);
              }
            })
            .catch((err) => {
              // alert(err);
              console.log(err);
            });
    }else{
      // alert("City Key is not defined")
    }
  }
  const selectLocationLocalizedName = (city) => setLocationData({...locationData,region:city});
  const getUserIpAddress = async() =>{
    let ip_address,
        locationKey;
    await axios
      .get(
        "https://ipgeolocation.abstractapi.com/v1/?api_key=" +
          IpGeolocation_api_key
      )
      .then((res) => {
        setLocationData({
          region: res.data.region,
        });
        ip_address = res.data.ip_address;
      });
    await axios
      .get(
        `${API_URL}/locations/v1/cities/ipaddress?apikey=${AcuWeather_api_key}&q=${ip_address}`
      )
      .then((res) => {
        setLocationKey(res.data.Key);
        locationKey = res.data.Key;
      })
      .catch((err) => console.log(err));

    if (locationKey && ip_address) {
      selectLocationKeyHandler(locationKey);
    }
  }
  //after metric change request
  useEffect(()=>{
    selectLocationKeyHandler(locationKey);
  },[metric]);
  //first render get ipaddres for location
  useEffect(() => {
    getUserIpAddress();
  },[]);

  return (
    <div className="App">
      <div className="hero">
        <div className="container">
          <div className="metric">
            <label htmlFor="metric">Metric</label>
            <input
              checked={!metric}
              type={"checkbox"}
              id="metric"
              onChange={() => setMetric(!metric)}
            />
          </div>
          <SearchLocationForom
            selectLocationKeyHandler={selectLocationKeyHandler}
            selectLocationLocalizedName={selectLocationLocalizedName}
          />
        </div>
      </div>
      {fiveDayForecastData ? (
        <Suspense
          fallback={
            <div className="container"><SpinnerLoad/></div>
          }
        >
          <ForecastTable
            fiveDayForecastData={fiveDayForecastData}
            locationData={locationData}
          />
        </Suspense>
      ) : (
            <div className="container"><SpinnerLoad/></div>
      )}
    </div>
  );
}

export default App;
