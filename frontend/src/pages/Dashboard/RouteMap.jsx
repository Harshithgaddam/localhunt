import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

// This sub-component handles the routing logic
const Routing = ({ start, end }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !start || !end) return;

    const userIcon = new L.Icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png', // Default blue leaflet icon for the start 📍
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });

    const vendorIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png', // Red marker for the end 🎯
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });
    // The leaflet-routing-machine control
    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(start[0], start[1]), // Start point [lat, lon]
        L.latLng(end[0], end[1]),     // End point [lat, lon]
      ],
      routeWhileDragging: true,
      show: false, // Hide the default text-based instructions
      addWaypoints: false, // Don't allow users to add new waypoints
      createMarker: function (i, waypoint, n) {
        // 'i' is the waypoint index (0 for start, n-1 for end)
        // 'waypoint' is the waypoint object
        // 'n' is the total number of waypoints
        
        if (i === 0) {
          // This is the starting point (user)
          return L.marker(waypoint.latLng, { icon: userIcon });
        } else if (i === n - 1) {
          // This is the ending point (vendor)
          return L.marker(waypoint.latLng, { icon: vendorIcon });
        }
      }
    }).addTo(map);

    return () => map.removeControl(routingControl);
  }, [map, start, end]);

  return null;
};

// The main map component
const RouteMap = ({ userLocation, vendorLocation }) => {
  if (!userLocation || !vendorLocation) {
    return <div>Loading map...</div>;
  }
  
  return (
    <MapContainer 
      center={userLocation} 
      zoom={13} 
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Routing start={userLocation} end={vendorLocation} />
    </MapContainer>
  );
};

export default RouteMap;