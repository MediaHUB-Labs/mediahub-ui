#!/bin/bash
echo "Building minified CSS..."
./tailwindcss -i ./input.css -o ./assets/output.css --minify
echo "Build complete! output.css is ready."