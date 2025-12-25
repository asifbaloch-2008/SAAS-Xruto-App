import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default icon issue in Leaflet
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export interface RouteMapProps {
  routes: Array<{
    driver: string;
    orderDetails: Array<{
      id: string;
      address: string;
      lat: number;
      lng: number;
    }>;
    color?: string;
  }>;
  depot?: { lat: number; lng: number };
}

const COLORS = [
  "#14b8a6", // teal
  "#2563eb", // blue
  "#a21caf", // purple
  "#f59e42", // gold
  "#e11d48", // pink
];

export function RouteMap({ routes, depot }: RouteMapProps) {
  // Center map on depot or first stop
  const center = depot ||
    (routes[0]?.orderDetails[0]
      ? { lat: routes[0].orderDetails[0].lat, lng: routes[0].orderDetails[0].lng }
      : { lat: 51.5074, lng: -0.1278 });

  return (
    <MapContainer center={center} zoom={11} style={{ height: "100%", width: "100%", minHeight: 350 }} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* Depot marker */}
      {depot && (
        <Marker position={depot}>
          <Popup>Depot</Popup>
        </Marker>
      )}
      {/* Driver routes */}
      {routes.map((route, idx) => (
        <>
          <Polyline
            key={route.driver}
            positions={route.orderDetails.map(o => [o.lat, o.lng])}
            color={COLORS[idx % COLORS.length]}
            weight={4}
            opacity={0.8}
          />
          {route.orderDetails.map((order, i) => (
            <Marker key={order.id} position={[order.lat, order.lng]}>
              <Popup>
                <b>{route.driver}</b><br />
                Stop {i + 1}: {order.address}
              </Popup>
            </Marker>
          ))}
        </>
      ))}
    </MapContainer>
  );
}
