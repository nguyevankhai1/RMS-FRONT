#!/bin/bash
npm i
echo "building....."
npm run build
echo "Start server"
pm2 start ecosystem.config.js