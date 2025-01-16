#!/bin/bash

# Update package lists
yum update -y

# Install Chrome and its dependencies
yum install -y \
    alsa-lib.x86_64 \
    atk.x86_64 \
    at-spi2-atk.x86_64 \
    at-spi2-core.x86_64 \
    cups-libs.x86_64 \
    GConf2.x86_64 \
    gtk3.x86_64 \
    libXcomposite.x86_64 \
    libXcursor.x86_64 \
    libXdamage.x86_64 \
    libXext.x86_64 \
    libXi.x86_64 \
    libXrandr.x86_64 \
    libXScrnSaver.x86_64 \
    libXtst.x86_64 \
    libappindicator-gtk3.x86_64 \
    liberation-fonts \
    liberation-sans-fonts \
    liberation-mono-fonts \
    liberation-serif-fonts \
    mesa-libgbm.x86_64 \
    pango.x86_64 \
    xorg-x11-fonts-100dpi \
    xorg-x11-fonts-75dpi \
    xorg-x11-fonts-cyrillic \
    xorg-x11-fonts-misc \
    xorg-x11-fonts-Type1 \
    xorg-x11-utils \
    libnspr4 \
    libnss3 \
    libnss3-tools \
    libxss1 \
    libxtst6 \
    libgtk-3-0 \
    libgbm1 \
    libasound2 \
    fonts-liberation \
    libappindicator3-1 \
    xdg-utils \
    libcairo2 \
    libpango-1.0-0 \
    libgdk-pixbuf2.0-0 \
    shared-mime-info \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libglib2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcb-dri3-0 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxss1 \
    libxtst6 \
    libnss3 \
    libgconf-2-4 \
    libgtk2.0-0 \
    ca-certificates \
    fonts-liberation \
    libappindicator1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    wget \
    xdg-utils

# Create required directories
mkdir -p /tmp/chromium
mkdir -p /tmp/chromium-cache

# Set permissions
chmod -R 777 /tmp/chromium
chmod -R 777 /tmp/chromium-cache

# Set environment variables
export CHROME_PATH="$(which chromium-browser)"
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
export PUPPETEER_EXECUTABLE_PATH="$(which chromium-browser)"
