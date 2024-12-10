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
        <div
            style={{
                backgroundClip: "padding-box",
                width: "auto",
                border: "none",
                position: "relative",
                outline: "none",
                margin: "0",
                height: "40px",
                padding: "0 72px",
                borderRadius: "2px",
                boxSizing: "border-box",
                color: "#202124"
            }}
        >
            <div>
                <div
                    style={{
                        width: "100%",
                        padding: "8px 8px",
                        position: "relative",
                        direction: "ltr",
                        borderRadius: "8px",
                        color: "#202124",
                        zIndex: 5,
                        border: "1px solid #70757a",
                    }}
                >
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder={text_placeholder}
                        style={{
                            border: "none",
                            margin: "0px",
                            width: "100%",
                            outline: "none",
                            position: "relative",
                            fontFamily: "Roboto, Arial, sans-serif",
                            fontSize: "0.875rem",
                            fontWeight: 400,
                            letterSpacing: 0,
                            lineHeight: "1.25rem",
                            color: "#202124",
                            padding: "0 !important",
                            height: "24px !important",
                            verticalAlign: "top",
                        }}
                    />
                </div>
            </div>
        </div>
    )
}