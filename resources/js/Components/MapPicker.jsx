import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
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

const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position === null ? null : <Marker position={position}></Marker>;
};

const MapPicker = ({
  latitude,
  longitude,
  onLocationChange,
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
    if (latitude && longitude) {
      setPosition([parseFloat(latitude), parseFloat(longitude)]);
    } else if (!latitude && !longitude) {
      setPosition(null);
    }
  }, [latitude, longitude]);

  useEffect(() => {
    if (position) {
      onLocationChange(position[0], position[1]);
    }
  }, [position, onLocationChange]);

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
      </MapContainer>
    </div>
  );
};

export default MapPicker;
