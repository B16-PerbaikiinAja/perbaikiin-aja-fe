#!/bin/bash
# Stop and remove the currently running container (if any)
docker rm -f your-react-app || true

# Pull the latest image (if you’re using a container registry)
# docker pull yourdockerhubusername/your-react-app:latest

# Alternatively, if you built locally, rebuild on the EC2 machine or deploy the image transferred via SSH
docker run -d -p 80:80 --name your-react-app your-react-app
