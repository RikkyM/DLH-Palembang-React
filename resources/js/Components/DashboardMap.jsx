import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useMemo } from "react";

const DefaultIcon = L.icon({
  iconUrl: "/img/KLHK_2024.webp",
  className: "bg-[#B3CEAF] rounded-full ",
  iconSize: [25, 25],
});

L.Marker.prototype.options.icon = DefaultIcon;

const defaultCenter = [-2.976, 104.7754];

const DashboardMap = ({ locations }) => {
  const validMarkers = useMemo(() => {
    if (!locations || locations.length === 0) return [];

    return locations
      .map((location, index) => {
        const lat = parseFloat(location.latitude);
        const lng = parseFloat(location.longitude);

        const isValidLat = !isNaN(lat) && lat >= -90 && lat <= 90;
        const isValidLng = !isNaN(lng) && lng >= -180 && lng <= 180;

        if (!isValidLat || !isValidLng) {
          return null;
        }

        return {
          id: `marker-${index}-${location.kodeKecamatan}-${location.kodeKelurahan}`,
          position: [lat, lng],
          kecamatan:
            location.kecamatan?.namaKecamatan || location.kodeKecamatan,
          kelurahan:
            location.kelurahan?.namaKelurahan || location.kodeKelurahan,
          lat: lat.toFixed(6),
          lng: lng.toFixed(6),
        };
      })
      .filter(Boolean);
  }, [locations]);

  return (
    <MapContainer
      style={{ height: "100%", width: "100%", zIndex: "0" }}
      scrollWheelZoom={true}
      zoom={12}
      center={defaultCenter}
      preferCanvas // ⬅️ penting
      zoomAnimation={false} // kurangi animasi
      fadeAnimation={false}
      markerZoomAnimation={false}
      keepBuffer={2}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations &&
        locations.length > 0 &&
        locations.map((location, index) => {
          const lat = parseFloat(location.latitude);
          const lng = parseFloat(location.longitude);

          const isValidLat = !isNaN(lat) && lat >= -90 && lat <= 90;
          const isValidLng = !isNaN(lng) && lng >= -180 && lng <= 180;

          if (!isValidLat || !isValidLng) {
            return null;
          }

          return (
            <Marker
              key={`marker-${index}-${location.kodeKecamatan}-${location.kodeKelurahan}`}
              position={[lat, lng]}
              icon={DefaultIcon}
            >
              <Popup>
                <div className="text-xs leading-[10px]">
                  <p>
                    <strong>Kecamatan:</strong>{" "}
                    {location.kecamatan.namaKecamatan}
                  </p>
                  <p>
                    <strong>Kelurahan:</strong>{" "}
                    {location.kelurahan.namaKelurahan}
                  </p>
                  <p>
                    <strong>Koordinat:</strong> {lat.toFixed(6)},{" "}
                    {lng.toFixed(6)}
                  </p>
                  <a
                    target="_blank"
                    href={`https://www.google.com/maps?q=${lat},${lng}`}
                  >
                    Lihat di Google Maps
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}
    </MapContainer>
  );
};

export default React.memo(DashboardMap);
