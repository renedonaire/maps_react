import React, { useState, useEffect } from 'react';
import { useLoadScript, GoogleMap, Marker, InfoWindow, Polygon } from '@react-google-maps/api';
import { locations, polygons } from "../api/fakeApi.js";

// Maps settings. Width and height must be defined
const libraries = ["places"];
const mapContainerStyle = {
   width: "100vw",
   height: "100vh"
};
const defaultCenter = {
   lat: -33.489524621879774, lng: -70.67266277454323
};

export const MapContainer = () => {
   const API_KEY = process.env.REACT_APP_API_KEY;

   const [selectedMarker, setSelectedMarker] = useState(null);
   const [markers, setMarkers] = useState([]);
   const [areas, setAreas] = useState([]);
   const [selectedArea, setSelectedArea] = useState(null);

   // Synchronize map component to screen rendering
   const { isLoaded, loadError } = useLoadScript({
      googleMapsApiKey: API_KEY,
      libraries
   });

   // Load markers and areas
   useEffect(() => {
      if (isLoaded && !loadError) {
         setMarkers(
            locations.map(location => ({
               id: location.id,
               position: { lat: location.lat, lng: location.lng },
               onClick: () => setSelectedMarker(location),
            }))
         );
         setAreas(polygons);
      }
   }, [isLoaded, loadError]);

   // Handler function to select areas
   const handlePolygonClick = (polygon) => {
      setSelectedArea(polygon);
   };

   if (loadError) return "Error loading maps";
   if (!isLoaded) return "Loading Maps";

   return (
      <div>
         <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={13}
            center={defaultCenter}
         >

            {/* Display markers */}
            {markers.map(marker => (
               <Marker
                  key={marker.id}
                  position={marker.position}
                  onClick={marker.onClick}
               />
            ))}
            {/* Display info when clicked */}
            {selectedMarker ? (
               <InfoWindow
                  position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
                  onCloseClick={() => setSelectedMarker(null)}
               >
                  <div>
                     <h2>{selectedMarker.name}</h2>
                     <p>{selectedMarker.description}</p>
                  </div>
               </InfoWindow>
            ) : null}

            {/* Display areas */}
            {areas.map(area => (
               <>
                  <Polygon
                     key={area.id}
                     paths={area.paths}
                     onClick={() => handlePolygonClick(area)}
                     options={{
                        fillColor: selectedArea === area ? 'blue' : 'red',
                        fillOpacity: 0.5,
                        strokeColor: 'black',
                        strokeOpacity: 1,
                        strokeWeight: 1,
                     }}
                  />
                  {/* Display info when clicked */}
                  {selectedArea === area && (
                     <InfoWindow
                        position={area.paths[0]}
                        onCloseClick={() => setSelectedArea(null)}
                     >
                        <div>
                           <h2>{area.name}</h2>
                           <p>{area.description}</p>
                        </div>
                     </InfoWindow>
                  )}
               </>
            ))}

         </GoogleMap>
      </div>
   );
};
