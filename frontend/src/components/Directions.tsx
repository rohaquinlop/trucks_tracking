import React, { useEffect, useState } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import { isEditable } from '@testing-library/user-event/dist/utils';

interface Props {
    directions: google.maps.DirectionsResult | null;
    carriers: { carrier: string; trucks_per_day: number }[];
}

export default function Directions({ directions, carriers }: Props) {
    const map = useMap();
    const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
    const [routeIndex, setRouteIndex] = useState(0);
    const selected = routes[routeIndex];
    const leg = selected?.legs[0];
    const polylinesRef = React.useRef<google.maps.Polyline[]>([]);

    useEffect(() => {
        if (!directions || !map) return;

        polylinesRef.current.forEach(polyline => polyline.setMap(null));

        const newPolylines = directions.routes.slice(0, 3).map((route, index) => {
            const isSelected = index === routeIndex;
            const polyline = new google.maps.Polyline({
                path: route.overview_path,
                map,
                strokeColor: isSelected ? '#4285F4' : '#000',
                strokeOpacity: isSelected ? 1.0 : 0.3,
                strokeWeight: isSelected ? 6 : 4,
                zIndex: isSelected ? 2 : 1,
                icons: !isEditable ? [
                    {
                        icon: {
                            path: 'M 0,-1 0,1',
                            strokeOpacity: 1,
                            scale: 2,
                        },
                        offset: '0',
                        repeat: '10px',
                    }
                ] : null,
            });

            polyline.addListener('click', () => setRouteIndex(index));
            return polyline;
        });

        polylinesRef.current = newPolylines;
        setRoutes(directions.routes.slice(0, 3));

        const bounds = new google.maps.LatLngBounds();
        newPolylines.forEach(polyline => {
            polyline.getPath().forEach(latLng => {
                bounds.extend(latLng);
            })
        });

        map.fitBounds(bounds);
    }, [directions, map, routeIndex]);

    useEffect(() => {
        polylinesRef.current.forEach((polyline, index) => {
            const isSelected = index === routeIndex;
            polyline.setOptions({
                strokeColor: isSelected ? '#4285F4' : '#000',
                strokeOpacity: isSelected ? 1.0 : 0.3,
                strokeWeight: isSelected ? 6 : 4,
                icons: !isEditable ? [
                    {
                        icon: {
                            path: 'M 0,-1 0,1',
                            strokeOpacity: 1,
                            scale: 2,
                        },
                        offset: '0',
                        repeat: '10px',
                    }
                ] : null,
            });
        });

    }, [routeIndex]);

    if (!leg) return null;

    return (
        <div className="directions-container">
            <div className="directions-carriers">
                <h1>Carriers</h1>
                <ul>
                    {carriers.map((carrier, index) => (
                        <li key={index}>
                            <b>{carrier.carrier}</b> - {carrier.trucks_per_day} trucks per day
                        </li>
                    ))}
                    {carriers.length === 0 && <li>No carriers found</li>}
                </ul>
            </div>
        </div>
    );
};
