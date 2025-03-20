import React from 'react';
import { GoogleMap, Marker, InfoWindow, useLoadScript } from '@react-google-maps/api';
import { Attraction } from '../types';

interface AttractionMapProps {
  attractions: Attraction[];
  selectedAttraction: Attraction | null;
  onSelectAttraction: (attraction: Attraction | null) => void;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.5rem',
};

const defaultCenter = {
  lat: 40.730610,
  lng: -73.935242, // New York City coordinates
};

export function AttractionMap({
  attractions,
  selectedAttraction,
  onSelectAttraction,
}: AttractionMapProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyB8uzGv4YbKR2v8UaapCON6PpQ4reh66YE',
  });

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
        <p className="text-red-600">Error loading maps</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={12}
      center={defaultCenter}
      options={{
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
        ],
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: true,
        fullscreenControl: true,
      }}
    >
      {attractions.map((attraction) => (
        <Marker
          key={attraction.id}
          position={{
            lat: attraction.location.lat,
            lng: attraction.location.lng,
          }}
          onClick={() => onSelectAttraction(attraction)}
          animation={google.maps.Animation.DROP}
        />
      ))}

      {selectedAttraction && (
        <InfoWindow
          position={{
            lat: selectedAttraction.location.lat,
            lng: selectedAttraction.location.lng,
          }}
          onCloseClick={() => onSelectAttraction(null)}
        >
          <div className="p-2 max-w-xs">
            <img
              src={selectedAttraction.image}
              alt={selectedAttraction.name}
              className="w-full h-32 object-cover rounded-lg mb-2"
            />
            <h3 className="font-semibold text-lg mb-1">{selectedAttraction.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{selectedAttraction.location.address}</p>
            <div className="flex items-center mb-2">
              <span className="text-yellow-500">★</span>
              <span className="ml-1 text-sm">{selectedAttraction.rating.toFixed(1)}</span>
            </div>
            {selectedAttraction.website && (
              <a
                href={selectedAttraction.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Visit Website
              </a>
            )}
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}