
//assets
import umbrellaIcon from "assets/images/icon-umberella.png";
import windIcon from "assets/images/icon-wind.png";
import compassIcon from "assets/images/icon-compass.png";

export default function ForecastTable({ fiveDayForecastData , locationData }){
  const getDayName = (dateStr) => {
    let date = new Date(dateStr);
    return date.toLocaleDateString("en-EN", { weekday: "long" });
  };
  return (
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
              <div className="location">{locationData.region}</div>
              <div className="degree">
                <div className="num">
                  {fiveDayForecastData[0].Temperature.Maximum.Value}
                  <sup>o</sup>
                  {fiveDayForecastData[0].Temperature.Maximum.Unit}
                </div>
                <div className="forecast-icon">
                  <img
                    src={require(`assets/images/icons/${fiveDayForecastData[0].Day.Icon}-s.png`)}
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
          {fiveDayForecastData?.map((i, index) => {
            return (
              <div className="forecast" key={index}>
                <div className="forecast-header">
                  <div className="day">{getDayName(i.Date)}</div>
                </div>
                <div className="forecast-content">
                  <div className="forecast-icon">
                    <img
                      src={require(`assets/images/icons/${i.Day.Icon}-s.png`)}
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
  );
}; 