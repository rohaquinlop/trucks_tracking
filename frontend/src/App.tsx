import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  APIProvider,
  Map,
} from "@vis.gl/react-google-maps";
import PlaceAutocomplete from "./components/PlaceAutocomplete";
import Directions from "./components/Directions";
import "./App.css";

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "";

export default function App() {
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [carriers, setCarriers] = useState([]);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [searchTriggered, setSearchTriggered] = useState(false);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/routes/${fromCity.split(',')[0].toLocaleLowerCase()}/${toCity.split(',')[0].toLocaleLowerCase()}`);
      setCarriers(response.data.carriers);
      setSearchTriggered(true);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!searchTriggered || !fromCity || !toCity) return;

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: fromCity,
        destination: toCity,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );

    setSearchTriggered(false);
  }, [searchTriggered, fromCity, toCity]);

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        width: "100vw",
      }}
    >
      <APIProvider apiKey={API_KEY} libraries={['places']}>
        <div style={{ height: "100%", width: "100%" }}>
          <Map
            defaultCenter={{ lat: 37.7749, lng: -122.4194 }}
            defaultZoom={8}
            gestureHandling={'greedy'}
            fullscreenControl={false}
            mapTypeControl={false}
          >
            {directions && <Directions directions={directions} carriers={carriers} />}
          </Map>
        </div>
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "50px",
            zIndex: 1,
            display: "flex",
            flexDirection: "row",
            gap: "10px",
            padding: "10px",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
          }}
        >
          <PlaceAutocomplete
            onPlaceSelect={(place) => setFromCity(place?.formatted_address || "")}
            text_placeholder="Origin City"
          />
          <PlaceAutocomplete
            onPlaceSelect={(place) => setToCity(place?.formatted_address || "")}
            text_placeholder="Destination City"
          />
          <button className="SearchBtn" onClick={handleSearch}>Search</button>
        </div>
      </APIProvider >
    </div >
  );
}
