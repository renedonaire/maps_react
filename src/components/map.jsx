import React, { useState, useEffect } from 'react';
import { useLoadScript, GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { StandaloneSearchBox } from '@react-google-maps/api';

// Contenedor para el mapa, copn librería de búsqueda y tamaño explícito
export const MapContainer = ({ apiKey, locations }) => {
   const libraries = ["places"];
   const mapContainerStyle = {
      width: "100vw",
      height: "100vh"
   };

   // Estados de React
   const [selectedMarker, setSelectedMarker] = useState(null);
   const [markers, setMarkers] = useState([]);
   const [map, setMap] = useState(null);
   const [center, setCenter] = useState({ lat: -33.489524621879774, lng: -70.67266277454323 });
   const [searchBox, setSearchBox] = useState(null);

   // Función para agregar marcadores al hacer click en el mapa
   const onMapClick = (event) => {
      setMarkers(current => [
         ...current,
         {
            id: event.key,
            position: { lat: event.latLng.lat(), lng: event.latLng.lng() },
            onClick: () => setSelectedMarker(),
            name: event.latLng.lng(),
            description: event.latLng.lng(),
         }
      ]);
   };

   // Captura la búsqueda de lugares y re enfoca mapa
   const onSearchBoxLoaded = ref => setSearchBox(ref);
   const onPlacesChanged = () => {
      const places = searchBox.getPlaces();

      if (places && places.length > 0) {
         const location = places[0].geometry.location;
         setCenter({
            lat: location.lat(),
            lng: location.lng()
         });
         map.panTo(location);
      }
   };

   // Carga las librerías una vez que el mapa está renderizado
   const { isLoaded, loadError } = useLoadScript({
      googleMapsApiKey: apiKey,
      libraries
   });

   // Carga los marcadores
   useEffect(() => {
      if (isLoaded && !loadError) {
         setMarkers(
            locations.map(location => ({
               id: location.id,
               position: { lat: location.lat, lng: location.lng },
               onClick: () => setSelectedMarker(location),
               name: location.name, // Add name property
               description: location.description, // Add description property
            }))
         );
      }
   }, [isLoaded, loadError, locations]);

   // Función que maneja el click en los marcadores
   const handleMarkerClick = (marker) => {
      setSelectedMarker(marker);
   };

   // Indica si hubo error
   if (loadError) return "Error loading maps";
   if (!isLoaded) return "Loading Maps";

   return (
      <div>
         <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={13}
            center={center}
            onLoad={ref => setMap(ref)}
            onClick={onMapClick}
         >

            {/* Caja de búsqueda */}
            <StandaloneSearchBox
               onLoad={onSearchBoxLoaded}
               onPlacesChanged={onPlacesChanged}
            >
               <input
                  type="text"
                  placeholder="Search location"
                  style={{ boxSizing: 'border-box', border: '1px solid transparent', width: '240px', height: '32px', marginTop: '27px', padding: '0 12px', borderRadius: '3px', boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)', fontSize: '14px', outline: 'none', textOverflow: 'ellipses', position: "absolute", left: "50%", marginLeft: "-120px" }}
               />
            </StandaloneSearchBox>

            {/* Marcadores */}
            {markers.map(marker => (
               <Marker
                  key={marker.id}
                  position={marker.position}
                  onClick={() => handleMarkerClick(marker)}
               />
            ))}

            {/* // Muestra info cuando se clickea */}
            {selectedMarker && (
               <InfoWindow
                  position={selectedMarker.position}
                  onCloseClick={() => setSelectedMarker(null)}
               >
                  <div>
                     <h2>{selectedMarker.name}</h2>
                     <p>{selectedMarker.description}</p>
                  </div>
               </InfoWindow>
            )}

         </GoogleMap>
      </div>
   );
};
