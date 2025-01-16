#!/bin/bash

# Create required directories
mkdir -p /tmp/chromium
mkdir -p /tmp/chromium-cache

# Set permissions
chmod -R 777 /tmp/chromium
chmod -R 777 /tmp/chromium-cache

# Set environment variables
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
export PUPPETEER_EXECUTABLE_PATH="/tmp/chromium"
