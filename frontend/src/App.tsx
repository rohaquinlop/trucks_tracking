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
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/carriers/${fromCity.split(',')[0].toLocaleLowerCase()}/${toCity.split(',')[0].toLocaleLowerCase()}`);
      setCarriers(response.data.carriers);
      setSearchTriggered(true);
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
            <div
              style={{
                top: "0",
                position: "absolute",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  margin: "12px 0 12px 16px",
                  position: "relative",
                  left: "0",
                  top: "0",
                }}
              >
                <div
                  style={{
                    width: "408px",
                    marginLeft: "-16px",
                    marginTop: "-12px",
                    paddingTop: "12px",
                    backgroundColor: "white",
                    color: "#202124",
                    boxShadow: "0 1px 2px rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15)",
                    borderRadius: "0 0 16px 0",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      paddingBottom: "16px",
                      zIndex: 1002,
                      overflowY: "auto",
                      maxHeight: "calc(40vh - 48px)",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          height: "40px",
                          marginTop: "8px",
                          overflow: "hidden"
                        }}
                      >
                        <div
                          style={{
                            visibility: "visible",
                            position: "absolute",
                            height: "29px",
                            padding: "8px 0 0 25px",
                            left: "0",
                            width: "24px",
                          }}
                        >
                          <div
                            style={{
                              backgroundImage: "url(https://maps.gstatic.com/consumer/images/icons/2x/start_location_grey800_18dp.png)",
                              backgroundSize: "18px 18px",
                              backgroundPositionX: "3px",
                              position: "relative",
                              left: "-1px",
                              top: "1px",
                              marginTop: "2px",
                              marginBottom: "1px",
                              opacity: 1,
                              width: "24px",
                              height: "24px",
                              backgroundRepeat: "no-repeat",
                            }}
                          ></div>
                          <div
                            style={{
                              backgroundImage: "url(https://maps.gstatic.com/consumer/images/icons/2x/route_3dots_grey650_24dp.png)",
                              backgroundSize: "24px 24px",
                              top: "-3px",
                              left: "-1px",
                              height: "32px",
                              position: "relative",
                              backgroundRepeat: "no-repeat",
                              width: "24px",
                            }}
                          ></div>
                        </div>
                        <PlaceAutocomplete
                          onPlaceSelect={(place) => setFromCity(place?.formatted_address || "")}
                          text_placeholder="From"
                        />
                      </div>
                      <div
                        style={{
                          height: "40px",
                          marginTop: "8px",
                          overflow: "hidden"
                        }}
                      >
                        <div
                          style={{
                            visibility: "visible",
                            position: "absolute",
                            height: "29px",
                            padding: "8px 0 0 25px",
                            zIndex: 4,
                            left: "0",
                            width: "24px",
                          }}
                        >
                          <div
                            style={{
                              visibility: "visible",
                              position: "absolute",
                              height: "29px",
                              padding: "8px 0 0 25px",
                              zIndex: 4,
                              left: "0",
                              width: "24px",
                            }}
                          >
                            <div
                              style={{
                                backgroundImage: "url(https://maps.gstatic.com/consumer/images/icons/2x/place_outline_red600_18dp.png)",
                                marginTop: "3px",
                                backgroundSize: "18px 18px",
                                backgroundPositionX: "3px",
                                position: "relative",
                                left: "-1px",
                                top: "-8px",
                                marginBottom: "1px",
                                width: "24px",
                                height: "24px",
                                backgroundRepeat: "no-repeat",
                              }}
                            ></div>
                          </div>
                        </div>
                        <PlaceAutocomplete
                          onPlaceSelect={(place) => setToCity(place?.formatted_address || "")}
                          text_placeholder="To"
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "center",
                      paddingBottom: "8px",
                    }}
                  >
                    <button className="SearchBtn" onClick={handleSearch}>Search</button>
                  </div>
                  {directions &&
                    <div
                      style={{
                        padding: "8px 16px",
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          height: "1px",
                          backgroundColor: "#d1d1d1",
                          margin: "8px 0",
                        }}
                      ></div>
                      <Directions directions={directions} carriers={carriers} />
                    </div>
                  }
                </div>
              </div>
            </div>
          </Map>
        </div>
      </APIProvider >
    </div >
  );
}
