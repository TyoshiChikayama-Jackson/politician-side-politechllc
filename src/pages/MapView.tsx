/// <reference types="vite/client" />
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const mapCenter = { lat: 39.8283, lng: -98.5795 };
const markerLocations = [
  { id: 'zip-94107', position: { lat: 37.7765, lng: -122.395 } },
  { id: 'zip-90210', position: { lat: 34.0901, lng: -118.4065 } },
  { id: 'zip-60614', position: { lat: 41.9227, lng: -87.6533 } }
];

export function MapView() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey ?? '',
  });

  return (
    <section className="section-panel">
      <div className="section-title">
        <div>
          <h2>Zip code outreach map</h2>
          <p>Visualize constituent density, outreach gaps, and campaign activity across districts.</p>
        </div>
      </div>

      <div className="map-container">
        {loadError ? (
          <div className="map-error">
            Unable to load Google Maps. Confirm your API key in <code>.env</code> and restart the dev server.
          </div>
        ) : !isLoaded ? (
          <div className="map-error">Loading map…</div>
        ) : (
          <GoogleMap mapContainerClassName="map-container" center={mapCenter} zoom={4}>
            {markerLocations.map((marker) => (
              <Marker key={marker.id} position={marker.position} />
            ))}
          </GoogleMap>
        )}
      </div>

      <div className="card">
        <h3>Map insights</h3>
        <p>Use the map to prioritize door-knock routes, volunteers, and listening sessions by zip code.</p>
      </div>
    </section>
  );
}
