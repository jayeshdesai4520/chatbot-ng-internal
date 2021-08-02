## How to run

```bash

docker build -t rdf-visualization-jayesh:latest .
docker run -p 41022:5000 -e SSL_KEY=certs/key.key -e SSL_CERT=certs/cert.cert -t rdf-visualization-jayesh:latest

```
