import {React, useEffect, useState,Suspense} from "react";
//styles
import "./styles/main.css"
import "./App.css"
//assets
import forecastIcon from "./assets/images/icons/icon-1.svg";
import umbrellaIcon from "./assets/images/icon-umberella.png";
import windIcon from "./assets/images/icon-wind.png";
import compassIcon from "./assets/images/icon-compass.png";

//modules
import axios from "axios";
//variables
import { API_URL,AcuWeather_api_key } from "./constants";
//components
import { SearchLocationForom } from "./components/SearchLocationForm";


function App() {
  const [fiveDayForecastData,setFiveDayForecastData] = useState(null);
  const [locationData,setLocationData] = useState(null);
  const [locationKey,setLocationKey] = useState(null);
  const [metric,setMetric] = useState(true);

  const getDayName = (dateStr)=> {
    var date = new Date(dateStr);
    return date.toLocaleDateString("en-EN", { weekday: "long" });
  }
  const selectLocationKeyHandler = (key)=>{
    setLocationKey(key)
    axios
      .get(
        `${API_URL}/forecasts/v1/daily/5day/${key}?apikey=${AcuWeather_api_key}&metric=${metric}&details=true`
      )
      .then((res) => {
        if (res.data.DailyForecasts.length && res.status === 200) {
          setFiveDayForecastData(res.data.DailyForecasts);
        }
      })
      .catch((err) => {
        alert(err)
        console.log(err);
      });
  }
  const selectLocationLocalizedName = (city) => setLocationData(city);
  const selectLocationByIpAddress = async() =>{
    let 
    ip_address,
    apiKey = "6e775446082c4a91afb9e6eb287c6630";
    await axios.get("https://ipgeolocation.abstractapi.com/v1/?api_key=" + apiKey).then((res)=>{
      setLocationData(res.data.region);
      ip_address = res.data.ip_address;
    });
    await axios
      .get(
        `${API_URL}/locations/v1/cities/ipaddress?apikey=${AcuWeather_api_key}&q=${ip_address}`
      )
      .then((res) => setLocationKey(res.data.Key))
      .catch((err) => console.log(err));

    if (locationKey && ip_address) {
      selectLocationKeyHandler(locationKey);
    };
  }

  useEffect(()=>{
    selectLocationKeyHandler(locationKey);
  },[metric]);

  useEffect(()=>{
    selectLocationByIpAddress();
  },[]);

  console.log(fiveDayForecastData, "fiveDayForecastData");
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
      {fiveDayForecastData && (
        <Suspense fallback={<h1>Please Wait ...</h1>}>
          <div className="forecast-table">
            <div className="container">
              <div className="forecast-container">
                <div className="today forecast">
                  <div className="forecast-header">
                    <div className="day">
                      {getDayName(fiveDayForecastData[0].Date)}
                    </div>
                  </div>

                  <div className="forecast-content">
                    <div className="location">{locationData}</div>
                    <div className="degree">
                      <div className="num">
                        {fiveDayForecastData[0].Temperature.Maximum.Value}
                        <sup>o</sup>
                        {fiveDayForecastData[0].Temperature.Maximum.Unit}
                      </div>
                      <div className="forecast-icon">
                        <img
                          src={require(`./assets/images/icons/${fiveDayForecastData[0].Day.Icon}-s.png`)}
                          alt=""
                          width="70"
                        />
                      </div>
                    </div>
                    <span>
                      <img src={umbrellaIcon} alt="" />
                      {fiveDayForecastData[0].Day.PrecipitationProbability}%
                    </span>
                    <span>
                      <img src={windIcon} alt="" />
                      {fiveDayForecastData[0].Day.Wind.Speed.Value}{" "}
                      {fiveDayForecastData[0].Day.Wind.Speed.Unit}
                    </span>
                    <span>
                      <img src={compassIcon} alt="" />
                      {fiveDayForecastData[0].Day.Wind.Direction.English}
                    </span>
                  </div>
                </div>
                {fiveDayForecastData.map((i, index) => {
                  return (
                    <div className="forecast">
                      <div className="forecast-header">
                        <div className="day">{getDayName(i.Date)}</div>
                      </div>
                      <div className="forecast-content">
                        <div className="forecast-icon">
                          <img
                            src={require(`./assets/images/icons/${i.Day.Icon}-s.png`)}
                            alt=""
                            width="48"
                          />
                        </div>
                        <div className="degree">
                          {i.Temperature.Maximum.Value}
                          <sup>o</sup>
                          {i.Temperature.Maximum.Unit}
                        </div>
                        <small>
                          {i.Temperature.Minimum.Value}
                          <sup>o</sup>
                          {i.Temperature.Minimum.Unit}
                        </small>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Suspense>
      )}
    </div>
  );
}

export default App;
