import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
  Popup,
} from "react-leaflet";
import L from "leaflet";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { Map } from "lucide-react";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const RecenterMap = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (!isNaN(lat) && !isNaN(lng)) {
      map.setView([lat, lng], map.getZoom());
    }
  }, [lat, lng, map]);
  return null;
};

const LocationMarker = ({ position, setPosition, editable }) => {
  useMapEvents(
    editable === true
      ? {
          click(e) {
            setPosition([e.latlng.lat, e.latlng.lng]);
          },
        }
      : {},
  );

  return position ? (
    <Marker position={position}>
      {!editable ? (
        <Popup>
          <a
            href={`https://www.google.com/maps?q=${position[0]},${position[1]}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-blue-600"
          >
            <Map />
            <span>Buka di Google Maps</span>
          </a>
        </Popup>
      ) : null}
    </Marker>
  ) : null;
};

const MapPicker = ({
  latitude,
  longitude,
  onLocationChange = () => null,
  height = "300px",
  resetTrigger = 0,
  editable,
}) => {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (resetTrigger > 0) {
      setPosition(null);
    }
  }, [resetTrigger]);

  useEffect(() => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (!isNaN(lat) && !isNaN(lng)) {
      setPosition([lat, lng]);
    } else if (!latitude && !longitude) {
      setPosition(null);
    }
  }, [latitude, longitude]);

  const defaultCenter = [-2.976, 104.7754];
  const center = position || defaultCenter;

  useEffect(() => {
    if (position) {
      const [lat, lng] = position;
      if (lat !== parseFloat(latitude) || lng !== parseFloat(longitude)) {
        onLocationChange(lat, lng);
      }
    }
  }, [position]);

  return (
    <div
      style={{ height, width: "100%" }}
      className="rounded border border-gray-300"
    >
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        key={`map-${resetTrigger}`}
        // dragging={!editable ? false : true}
        // doubleClickZoom={!editable ? false : true}
        // touchZoom={!editable ? false : true}
        // zoomControl={!editable ? false : true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker
          position={position}
          setPosition={setPosition}
          editable={editable}
        />
        {position && <RecenterMap lat={position[0]} lng={position[1]} />}
      </MapContainer>
    </div>
  );
};

export default MapPicker;
