# Object Map, formerly know as as mapLoader

## Functionality

Allows users to see an embedded Google Maps widget on the Object Detail page. 

## Usage

### Options
Passed via an inline `<script>` containing JSON.

- lat:          latitude as float, so *without "quotes"*
- lng:          longitude as float, so *without "quotes"*
- markerTitle:  title when hovering the map marker
- markerUrl:    url to the map marker image 
- polygonData:  polygon data, if present *NOTE: currently disabled per OBJ-1827*
- baseKadasterUrl:      kadaster percelen layer
- baseKadasterBgUrl:    kadaster street layer
- basePandenUrl:        kadaster panden layer
- defaultMapType:       which map type to load initially

### no-JS fallback
The size parameter within the `<noscript>` element is set to 500x192 @ retina, resulting in a 1000x384 image that matches 
the design and size of the object-map JS component
