import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = { width: "100%", height: "400px" };
const DEFAULT_CENTER = { lat: 19.076, lng: 72.877 };

export default function MapView(props) {
  const requests = props.requests ?? [];
  const volunteers = props.volunteers ?? [];
  const selectedRequest = props.selectedRequest ?? null;
  const location = props.location ?? null;

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-gray-100 rounded-xl border border-dashed border-gray-300">
        <div className="text-center text-gray-500 text-sm px-4">
          <p className="text-2xl mb-2">🗺️</p>
          <p className="font-medium">Google Maps API key missing</p>
          <p className="text-xs mt-1 text-gray-400">
            Add <code className="bg-gray-200 px-1 rounded">VITE_GOOGLE_MAPS_API_KEY</code> to your <code className="bg-gray-200 px-1 rounded">.env</code> file
          </p>
        </div>
      </div>
    );
  }

  const selected = requests.find((r) => r.id === selectedRequest);
  const center = selected?.location || location || DEFAULT_CENTER;

  const validRequests = requests.filter((r) => r.location?.lat && r.location?.lng);
  const validVolunteers = volunteers.filter((v) => v.location?.lat && v.location?.lng);

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        mapContainerClassName="rounded-xl overflow-hidden"
        center={center}
        zoom={12}
      >
        {/* 🔵 / 🔴 Request markers */}
        {validRequests.map((req) => (
          <Marker
            key={req.id}
            position={req.location}
            title={req.title}
            icon={{
              url: req.id === selectedRequest
                ? "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                : "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            }}
          />
        ))}

        {/* 🟢 Volunteer markers */}
        {validVolunteers.map((vol) => (
          <Marker
            key={vol.id}
            position={vol.location}
            title={vol.name || "Volunteer"}
            icon={{ url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png" }}
          />
        ))}

        {/* 📍 Single pin — RequestHelp page */}
        {location?.lat && location?.lng && (
          <Marker position={location} title="Your location" />
        )}
      </GoogleMap>
    </LoadScript>
  );
}