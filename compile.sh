#!/bin/bash	
babel config/constants.js js/ --out-file bundle.min.js --presets env -w --no-comments --minified --compact --source-maps
