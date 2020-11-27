import $ from 'jquery';

export default class ObjectMapKadastraal {
    constructor(googleMap, config) {
        this.MIN_ZOOM_LEVEL_KADASTRAAL = 19;
        this.ATTRIBUTION_STYLES_CLASS = 'object-map__attribution';
        this.SHOW_LEGEND_EVENT = 'show-map-legend';
        this.KADASTER_LEGEND_SELECTOR = '[data-object-map-kadaster-legend]';

        this.map = googleMap;
        this.config = config;

        this.map.mapTypes.set(
            'roadmap',
            this.map.setMapTypeId(google.maps.MapTypeId.ROADMAP)
        );
        this.pandenpercelenLayer = ObjectMapKadastraal.getMapTilerLayer (
            this.config.mapTilerUrl
        );
    }

    enableKadaster(location) {
        if (this.map.getZoom() < this.MIN_ZOOM_LEVEL_KADASTRAAL) {
            this.map.setZoom(this.MIN_ZOOM_LEVEL_KADASTRAAL);
        }

        let markerLocation;
        markerLocation = new google.maps.LatLng(
            this.config.lat,
            this.config.lng
        );

        const bounds = this.map.getBounds();
        if (typeof bounds === 'object') {
            if (!bounds.contains(markerLocation)) {
                this.map.setCenter(markerLocation);
            }
        }

        this.map.overlayMapTypes.push(this.pandenpercelenLayer);
        this.map.setMapTypeId('roadmap');

        $(window).trigger(this.SHOW_LEGEND_EVENT + '-' + location, {
            legendSelector: this.KADASTER_LEGEND_SELECTOR,
        });

        this.addAttribution();
    }

    addAttribution() {
        const element = document.createElement('div');
        element.classList.add(this.ATTRIBUTION_STYLES_CLASS);
        element.innerHTML = this.config.kadasterAttributionText;

        this.map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(
            element
        );
    }

    static getMapTilerLayer(url) {
        return new google.maps.ImageMapType({
            getTileUrl: function(coord, zoom) {
                var resolvedUrl = url
                  .replace('{x}', coord.x)
                  .replace('{y}', coord.y)
                  .replace('{z}', zoom);
                return resolvedUrl;
            },
            tileSize: new google.maps.Size(256, 256),
            name: 'Kadastrale kaart',
            maxZoom: 21,
            minZoom: 17,
        });
    }
}
