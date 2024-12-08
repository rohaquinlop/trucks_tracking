import React, { useRef, useEffect, useState } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

interface Props {
    onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
    text_placeholder: string;
}

export default function PlaceAutocomplete({ onPlaceSelect, text_placeholder }: Props) {
    const [placeAutocomplete, setPlaceAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const places = useMapsLibrary("places");

    useEffect(() => {
        if (!places || !inputRef.current) return;

        const options = {
            fields: ["geometry", "name", "formatted_address"],
        }

        setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
    }, [places]);

    useEffect(() => {
        if (!placeAutocomplete) return;

        placeAutocomplete.addListener("place_changed", () => {
            const place = placeAutocomplete.getPlace();
            onPlaceSelect(place);
        });
    }, [placeAutocomplete, onPlaceSelect]);

    return (
        <div className="autocomplete-container">
            <input
                ref={inputRef}
                type="text"
                placeholder={text_placeholder}
                style={{
                    width: "95%",
                    height: "40px",
                }}
            />
        </div>
    )
}