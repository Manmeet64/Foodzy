import React, { useState, useEffect, useCallback } from "react";
import {
    useJsApiLoader,
    GoogleMap,
    Marker,
    DirectionsRenderer,
} from "@react-google-maps/api";
import styles from "./Map.module.css";
import useGetLocation from "../useGetLocation";

const MAP_LIBRARIES = ["places"];
const MAP_CONTAINER_STYLE = { width: "100%", height: "400px" };

function Map({ origin }) {
    const { location } = useGetLocation(); // Destination location
    const [directionsResponse, setDirectionsResponse] = useState(null);
    const [distance, setDistance] = useState("");
    const [time, setTime] = useState("");

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyCi7wvXEC0r0td0KSSoeXzJNrUv5fYMNgw", // Use env variable for security
        libraries: MAP_LIBRARIES,
    });

    // Fetch directions only when both origin and destination are valid
    const fetchDirections = useCallback(async () => {
        if (origin && location?.latitude && location?.longitude) {
            setDirectionsResponse(null); // Clear old response to avoid overlap
            const directionsService = new google.maps.DirectionsService();
            try {
                const result = await directionsService.route({
                    origin: { lat: origin.latitude, lng: origin.longitude },
                    destination: {
                        lat: location.latitude,
                        lng: location.longitude,
                    },
                    travelMode: google.maps.TravelMode.DRIVING,
                });
                if (result.routes.length > 0) {
                    setDirectionsResponse(result);
                    setDistance(result.routes[0].legs[0].distance.text);
                    setTime(result.routes[0].legs[0].duration.text);
                } else {
                    console.warn("No routes found");
                }
            } catch (error) {
                console.error("Error fetching directions:", error);
            }
        }
    }, [origin, location]);

    // Trigger directions fetch when dependencies change
    useEffect(() => {
        fetchDirections();
    }, [fetchDirections]);

    // Fallback UI for map loading error
    if (loadError) {
        return <div>Error loading map. Please try again later.</div>;
    }

    // Fallback UI for map loading state
    if (!isLoaded) {
        return <div>Loading map...</div>;
    }

    return (
        <div className={styles.mapContainer}>
            <GoogleMap
                center={{
                    lat: location?.latitude || 0,
                    lng: location?.longitude || 0,
                }}
                zoom={10}
                mapContainerStyle={MAP_CONTAINER_STYLE}
                options={{
                    zoomControl: true,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                }}
            >
                {/* Markers for origin and destination */}
                {origin && (
                    <Marker
                        position={{
                            lat: origin.latitude,
                            lng: origin.longitude,
                        }}
                        icon={{
                            url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                        }}
                    />
                )}
                {location && (
                    <Marker
                        position={{
                            lat: location.latitude,
                            lng: location.longitude,
                        }}
                        icon={{
                            url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                        }}
                    />
                )}

                {/* Render route directions */}
                {directionsResponse && (
                    <DirectionsRenderer directions={directionsResponse} />
                )}
            </GoogleMap>

            {/* Display distance and time */}
            {distance && time && (
                <div className={styles.infoPanel}>
                    <p>
                        <strong>Distance:</strong> {distance}
                    </p>
                    <p>
                        <strong>Estimated Time:</strong> {time}
                    </p>
                </div>
            )}
        </div>
    );
}

export default Map;
