import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

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

const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position}></Marker> : null;
};

const MapPicker = ({
  latitude,
  longitude,
  onLocationChange = () => null,
  height = "300px",
  resetTrigger = 0,
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
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} setPosition={setPosition} />
        {position && <RecenterMap lat={position[0]} lng={position[1]} />}
      </MapContainer>
    </div>
  );
};

export default MapPicker;
