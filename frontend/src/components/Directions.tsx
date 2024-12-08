import React, { useEffect, useState } from 'react';
import { useMapsLibrary, useMap } from '@vis.gl/react-google-maps';

interface Props {
    directions: google.maps.DirectionsResult | null;
    carriers: { carrier: string; trucks_per_day: number }[];
}

export default function Directions({ directions, carriers }: Props) {
    const map = useMap();
    const routesLibrary = useMapsLibrary('routes');
    const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
    const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
    const [routeIndex, setRouteIndex] = useState(0);
    const selected = routes[routeIndex];
    const leg = selected?.legs[0];

    useEffect(() => {
        if (!routesLibrary || !map) return;
        const renderer = new routesLibrary.DirectionsRenderer({ map });
        setDirectionsRenderer(renderer);
        return () => {
            renderer.setMap(null);
        };
    }, [routesLibrary, map]);

    useEffect(() => {
        if (!directionsRenderer || !directions) return;
        directionsRenderer.setDirections(directions);
        setRoutes(directions.routes);
    }, [directionsRenderer, directions]);

    useEffect(() => {
        if (!directionsRenderer) return;
        directionsRenderer.setRouteIndex(routeIndex);
    }, [routeIndex, directionsRenderer]);

    if (!leg) return null;

    return (
        <div className="directions-container">
            <div className="directions-header">
                <h2>Route: {selected.summary}</h2>
                <p>
                    {leg.start_address.split(',')[0]} to {leg.end_address.split(',')[0]}
                </p>
                <p>Distance: {leg.distance?.text}</p>
                <p>ETA: {leg.duration?.text}</p>
            </div>

            <div className="directions-routes">
                <h2>Available Routes</h2>
                <ul>
                    {routes.map((route, index) => (
                        <li key={route.summary}>
                            <button onClick={() => setRouteIndex(index)}>
                                {route.summary}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="directions-carriers">
                <h2>Carriers</h2>
                <ul>
                    {carriers.map((carrier, index) => (
                        <li key={index}>
                            {carrier.carrier} - {carrier.trucks_per_day} trucks per day
                        </li>
                    ))}
                    {carriers.length === 0 && <li>No carriers found</li>}
                </ul>
            </div>
        </div>
    );
};
