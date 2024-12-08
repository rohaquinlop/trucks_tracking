from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

## CORS
origins = [
    "http://localhost:3000",
    "http://192.168.0.197:*/*",
    "http://192.168.0.197:3000/*",
    "http://localhost",
    "http://127.0.0.1",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def normalize_city_name(city_name: str) -> str:
    city_name = city_name.lower().strip()
    city_name = city_name.replace("d.c.", "dc")
    city_name = city_name.replace(".", "")
    city_name = city_name.replace(" ", "")

    # Map common variations to a standardized format
    city_name_mappings = {
        "newyork": "newyork",
        "ny": "newyork",
        "washingtondc": "washingtondc",
        "washington": "washingtondc",
        "sanfrancisco": "sanfrancisco",
        "losangeles": "losangeles",
        "losángeles": "losangeles",
    }

    return city_name_mappings.get(city_name, city_name)


@app.get("/routes/{from_city}/{to_city}")
async def read_truck(from_city: str, to_city: str) -> dict:
    from_city = normalize_city_name(from_city)
    to_city = normalize_city_name(to_city)

    match (from_city, to_city):
        case ("newyork", "washingtondc"):
            carriers = [
                {
                    "carrier": "Knight-Swift Transport Services",
                    "trucks_per_day": 10,
                },
                {
                    "carrier": "J.B. Hunt Transport Services Inc",
                    "trucks_per_day": 7,
                },
                {"carrier": "YRC Worldwide", "trucks_per_day": 5},
            ]
        case ("sanfrancisco", "losangeles"):
            carriers = [
                {"carrier": "XPO Logistics", "trucks_per_day": 9},
                {"carrier": "Schneider", "trucks_per_day": 6},
                {"carrier": "Landstar Systems", "trucks_per_day": 2},
            ]
        case (_, "washingtondc") | (_, "losangeles"):
            carriers = [
                {"carrier": "UPS Inc.", "trucks_per_day": 11},
                {"carrier": "FedEx Corp", "trucks_per_day": 9},
            ]
        case _:
            carriers = []

    return {
        "carriers": carriers,
    }