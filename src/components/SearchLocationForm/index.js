//modules
import axios from "axios";
import { useState } from "react";

//variables
import { API_URL, AcuWeather_api_key } from "../../constants";


export const SearchLocationForom = ({
  selectLocationKeyHandler,
  selectLocationLocalizedName,
}) => {
  const [locationVariants, setLocationVariants] = useState(null);

  const autocompleteLocation = (i) => {
    if (!i) {
      setLocationVariants(null);
    }else{
      axios
        .get(
          `${API_URL}/locations/v1/cities/autocomplete?apikey=${AcuWeather_api_key}&q=${i}`
        )
        .then((res) => {
          if (res.data.length && res.status === 200) {
            setLocationVariants(res.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  return (
    <div className="find-location-container">
      <form action="#" className="find-location">
        <input
          type="text"
          placeholder="Find your location..."
          onChange={(e) => autocompleteLocation(e.target.value)}
        />
      </form>
      {locationVariants && (
        <ul className="find-location-versions-city">
          {locationVariants.map((i) => (
            <li
              key={i.Key}
              onClick={() => {
                selectLocationKeyHandler(i.Key);
                selectLocationLocalizedName(i.LocalizedName);
                setLocationVariants(null);
              }}
            >
              {i.LocalizedName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};