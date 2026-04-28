import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "250px"
};

export default function MapView({ location }) {
  if (!location) return null;

  const center = {
    lat: location.lat,
    lng: location.lng
  };

  return (
    <LoadScript googleMapsApiKey="YOUR_API_KEY">
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={14}>
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
}