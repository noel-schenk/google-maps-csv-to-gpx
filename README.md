# Google Maps CSV (Takeout) to GPX

Convert the Google Maps CSV you get from https://takeout.google.com to a GPX file.

This script is slow (~10s per coordinates) and may not work with a slow internet connection.

## Installation

Clone the project

```bash
  npm i
  node index.js "C:\Users\WhatEverPath\YourFile.csv"
```

It will save the file to the path where "YourFile.csv" is.
The default filename is "export-google-maps-to-gpx.gpx".
