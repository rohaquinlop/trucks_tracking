FROM python:3.11

RUN mkdir -p /usr/src/app/api


WORKDIR /usr/src/app/api


COPY ./requirements.txt ./


RUN pip install --no-cache-dir --upgrade -r ./requirements.txt


COPY . .

# Development
# CMD ["fastapi", "dev", "main.py"]

# Production
CMD ["fastapi", "run"]
