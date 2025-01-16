#!/bin/bash

# Update package lists
apt-get update -y

# Install Chrome dependencies
apt-get install -y \
    libasound2 \
    libatk1.0-0 \
    libcups2 \
    libgtk-3-0 \
    fonts-liberation \
    libnspr4 \
    libnss3 \
    libxss1 \
    libxtst6 \
    xdg-utils \
    libgbm1 \
    libnss3 \
    libxshmfence1

# Create required directories
mkdir -p /tmp/chromium
mkdir -p /tmp/chromium-cache

# Set permissions
chmod -R 777 /tmp/chromium
chmod -R 777 /tmp/chromium-cache

# Set environment variables
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
export PUPPETEER_EXECUTABLE_PATH="/tmp/chromium"
