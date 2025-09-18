#!/bin/bash

# Build script for Render deployment
echo "Installing dependencies..."
npm install

echo "Installing dev dependencies for build..."
npm install --include=dev

echo "Generating Prisma client..."
npx prisma generate

echo "Running database migrations..."
npx prisma db push

echo "Building Next.js application..."
npm run build

echo "Build completed successfully!"
