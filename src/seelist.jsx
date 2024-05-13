import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';

function ShowInMap({ address, google }) {
  const [mapCenter, setMapCenter] = useState(null);

  useEffect(() => {
    if (address && google) {
      geocodeAddress(address);
    }
  }, [address, google]);

  const geocodeAddress = (address) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK') {
        const location = results[0].geometry.location;
        setMapCenter({ lat: location.lat(), lng: location.lng() });
      } else {
        console.error('Geocode was not successful for the following reason:', status);
      }
    });
  };

  return (
    <div style={{ height: '300px' }}>
      {mapCenter && google && (
        <Map google={google} zoom={14} center={mapCenter}>
          <Marker name="Nearest Center" position={mapCenter} />
        </Map>
      )}
    </div>
  );
}

function Seelist({ google }) {
  const [userAddress, setUserAddress] = useState('');
  const [nearestCenter, setNearestCenter] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setUserAddress(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/find-nearest-center', { userAddress });
      if (response && response.data) {
        setNearestCenter(response.data);
        setError(null);
        console.log("Min distance center name:", response.data.name);
        console.log("Min distance center address:", response.data.address);
        console.log("Min distance from user:", response.data.distance, "km");
      }
    } catch (error) {
      setError('Error finding nearest center: ' + error.message);
      setNearestCenter(null);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Enter your address:
          <input type="text" value={userAddress} onChange={handleChange} />
        </label>
        <button type="submit">Find Nearest Center</button>
      </form>
      {nearestCenter && (
        <div>
          <h2>Nearest Center:</h2>
          <p>Name: {nearestCenter.name}</p>
          <p>Address: {nearestCenter.address}</p>
          <p>Distance: {nearestCenter.distance} km</p>
          <ShowInMap address={nearestCenter.address} google={google} />
        </div>
      )}
      {error && <p>{error}</p>}
    </div>
  );
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyDJaFr-HFXGBOg8pUSdQfGjGwGdIwtbXhY" // Replace with your actual API key
})(Seelist);
