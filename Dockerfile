# Build frontend
FROM node:23-alpine AS build-stage

RUN mkdir -p /usr/src/app/frontend

COPY ./frontend /usr/src/app/frontend

WORKDIR /usr/src/app/frontend

RUN yarn install

ENV PATH=/usr/src/app/frontend/node_modules/.bin:$PATH

RUN yarn build


FROM python:3.11

WORKDIR /usr/src/app

COPY ./requirements.txt ./

RUN pip install --no-cache-dir -r ./requirements.txt

COPY ./main.py .

COPY --from=build-stage /usr/src/app/frontend/build ./frontend/build

# Development
# CMD ["fastapi", "dev", "main.py"]

# Production
CMD ["fastapi", "run", "main.py", "--port", "80"]
