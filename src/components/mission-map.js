import React from 'react'
import { Map, TileLayer, Marker } from 'react-leaflet'

export default function MissionMap ({ lat, lng }) {
  return (
    <Map
      center={[lat, lng ]}
      zoom={17}
      zoomSnap={0.01}
      maxZoom={19} // Map cannot have more than 19 zoom without breaking
      style={{ height: '300px', width: '300px' }}
    >
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <Marker position={[lat, lng]} />
    </Map>
  )
}
