import React, { useState, useEffect } from 'react';
import { useLoadScript, GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { locations } from "../api/fakeApi.js";

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
   const [selected, setSelected] = useState(null);
   const [markers, setMarkers] = useState([]);

   const { isLoaded, loadError } = useLoadScript({
      googleMapsApiKey: API_KEY,
      libraries
   });

   useEffect(() => {
      if (isLoaded && !loadError) {
         setMarkers(
            locations.map(location => ({
               id: location.id,
               position: { lat: location.lat, lng: location.lng },
               onClick: () => setSelected(location),
            }))
         );
      }
   }, [isLoaded, loadError]);


   if (loadError) return "Error loading maps";
   if (!isLoaded) return "Loading Maps";

   return (
      <div>
         <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={13}
            center={defaultCenter}
         >
            {markers.map(marker => (
               <Marker
                  key={marker.id}
                  position={marker.position}
                  onClick={marker.onClick}
               />
            ))}

            {selected ? (
               <InfoWindow
                  position={{ lat: selected.lat, lng: selected.lng }}
                  onCloseClick={() => setSelected(null)}
               >
                  <div>
                     <h2>{selected.name}</h2>
                     <p>{selected.description}</p>
                  </div>
               </InfoWindow>
            ) : null}

         </GoogleMap>
      </div>
   );
};