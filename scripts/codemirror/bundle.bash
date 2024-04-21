#!/bin/bash
set -e
# Run this script from the root of the repository

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# This loads nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm

# Select a version
nvm install 20

# verifies the right Node.js version is in the environment
node -v
# verifies the right NPM version is in the environment
npm -v

# The CodeMirror packages used in our script
npm i codemirror @codemirror/language-data
# Themes
npm i @uiw/codemirror-themes-all @babel/runtime

# Install Rollup and its plugin
npm i rollup @rollup/plugin-node-resolve @rollup/plugin-terser

# Clear target dir
rm -rf ../../nicegui/elements/lib/codemirror/*
npx rollup -c rollup.config.mjs --validate
