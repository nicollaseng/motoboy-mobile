import React from  'react'
import MapViewDirections from 'react-native-maps-directions'

const Directions = ({ destination, origin, onReady }) => (
    <MapViewDirections
        destination={destination}
        origin={origin}
        onReady={onReady}
        apikey="AIzaSyBionuXtSnhN7kKXD8Y2tms-Dx43GI4W6g"
        strokeWidth={3}
        strokeColor="#363777"
    />
)

export default Directions