import React from 'react';
import {MapContainer, TileLayer, Marker} from 'react-leaflet';

/**
 * MissionMap
 *
 * @param {object} param0
 *
 * @return {object}
 */
export default function MissionMap({lat, lng}) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={17}
      zoomSnap={0.01}
      maxZoom={18} // Map cannot have more than 18 zoom without breaking
      style={{height: '300px', width: '300px'}}
    >
      <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <Marker position={[lat, lng]} />
    </MapContainer>
  );
}
