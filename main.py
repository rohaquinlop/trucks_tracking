from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.requests import Request
import sys

app = FastAPI()

## CORS
origins = [
    # "*"
    "http://localhost:80",
    "http://localhost",
    "http://127.0.0.1",
    "http://localhost:80/*",
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


@app.get("/api/carriers/{from_city}/{to_city}")
async def carriers(from_city: str, to_city: str) -> dict:
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


if "run" in sys.argv:
    templates = Jinja2Templates(directory="frontend/build")

    @app.get("/")
    async def index(req: Request):
        return templates.TemplateResponse("index.html", {"request": req})

    app.mount(
        "/", StaticFiles(directory="frontend/build", html=True), name="static"
    )
