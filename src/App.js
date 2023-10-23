import { MapContainer } from "./components/map.jsx";
import { locations, polygons } from "./api/fakeApi.js";

const API_KEY = process.env.REACT_APP_API_KEY;

function App() {
  return (
    <div className="App">
      <MapContainer apiKey={API_KEY} locations={locations} polygons={polygons}/>
    </div>
  );
}

export default App;
