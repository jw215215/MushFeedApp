#!/bin/bash

# Update package lists
yum update -y

# Install Chrome and its dependencies
yum install -y \
    alsa-lib.x86_64 \
    atk.x86_64 \
    cups-libs.x86_64 \
    gtk3.x86_64 \
    ipa-gothic-fonts \
    libXcomposite.x86_64 \
    libXcursor.x86_64 \
    libXdamage.x86_64 \
    libXext.x86_64 \
    libXi.x86_64 \
    libXrandr.x86_64 \
    libXScrnSaver.x86_64 \
    libXtst.x86_64 \
    pango.x86_64 \
    xorg-x11-fonts-100dpi \
    xorg-x11-fonts-75dpi \
    xorg-x11-fonts-cyrillic \
    xorg-x11-fonts-misc \
    xorg-x11-fonts-Type1 \
    xorg-x11-utils \
    nspr \
    nspr-devel \
    nss \
    nss-devel \
    nss-util \
    nss-util-devel \
    libdrm \
    mesa-libgbm \
    mesa-libGL \
    libX11 \
    libXcomposite \
    libXdamage \
    libXext \
    libXfixes \
    libXrandr \
    libXrender \
    libXtst \
    libXt \
    pango \
    atk \
    libcups \
    libxcb \
    GConf2 \
    dbus-glib \
    gtk3

# Create required directories
mkdir -p /tmp/chromium
mkdir -p /tmp/chromium-cache

# Set permissions
chmod -R 777 /tmp/chromium
chmod -R 777 /tmp/chromium-cache

# Create symlinks for libraries
ln -s /usr/lib64/libnspr4.so /usr/lib/libnspr4.so
ln -s /usr/lib64/libnss3.so /usr/lib/libnss3.so

# Set environment variables
export CHROME_PATH="$(which chromium-browser)"
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
export PUPPETEER_EXECUTABLE_PATH="$(which chromium-browser)"
