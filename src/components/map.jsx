import React, { useState, useEffect } from 'react';
import { useLoadScript, GoogleMap, Marker, InfoWindow, Polygon } from '@react-google-maps/api';
import { StandaloneSearchBox } from '@react-google-maps/api';

export const MapContainer = ({ apiKey, locations, polygons }) => {
   const libraries = ["places"];
   const mapContainerStyle = {
      width: "100vw",
      height: "100vh"
   };

   const [selectedMarker, setSelectedMarker] = useState(null);
   const [markers, setMarkers] = useState([]);
   const [areas, setAreas] = useState([]);
   const [selectedArea, setSelectedArea] = useState(null);

   const [map, setMap] = useState(null);
   const [center, setCenter] = useState({ lat: -33.489524621879774, lng: -70.67266277454323 }); // initial location

   const onMapClick = (event) => {
      setMarkers(current => [
         ...current,
         {
            id: event.key,
            position: { lat: event.latLng.lat(), lng: event.latLng.lng() },
            onClick: () => setSelectedMarker(),
            name: event.latLng.lng(), // Add name property
            description: event.latLng.lng(), // Add description property
         }
      ]);
   };

   const [searchBox, setSearchBox] = useState(null);
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

   const { isLoaded, loadError } = useLoadScript({
      googleMapsApiKey: apiKey,
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
               name: location.name, // Add name property
               description: location.description, // Add description property
            }))
         );
         setAreas(polygons);
      }
   }, [isLoaded, loadError, locations, polygons]);

   const handleMarkerClick = (marker) => {
      setSelectedMarker(marker);
   };

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
            center={center}
            onLoad={ref => setMap(ref)}
            onClick={onMapClick}
         >
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
            {markers.map(marker => (
               <Marker
                  key={marker.id}
                  position={marker.position}
                  onClick={() => handleMarkerClick(marker)}
               />
            ))}
            {/* // Display info when clicked */}
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
            {areas.map(area => (
               <React.Fragment key={area.id}>
                  <Polygon
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
               </React.Fragment>
            ))}
         </GoogleMap>
      </div>
   );
};
