# trucks tracking

## Dev

```bash
sudo bash dev.sh
```

## Prod

```bash
docker build -t trucks_tracking . && docker run -d -p 80:80 trucks_tracking
```
