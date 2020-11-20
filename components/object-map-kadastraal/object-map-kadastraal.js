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
            'kadastraal',
            ObjectMapKadastraal.getKadasterBaseLayer(this.config.kadasterBgUrl)
        );
        this.pandenLayer = ObjectMapKadastraal.getKadasterLayer(
            this.map,
            this.config.kadasterPandenUrl
        );
        this.percelenLayer = ObjectMapKadastraal.getKadasterLayer(
            this.map,
            this.config.kadasterPercelenUrl
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

        this.map.overlayMapTypes.push(this.pandenLayer);
        this.map.overlayMapTypes.push(this.percelenLayer);
        this.map.setMapTypeId('kadastraal');

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

    static getKadasterBaseLayer(url) {
        return new google.maps.ImageMapType({
            getTileUrl: function(coord, zoom) {
                var temp = url.replace('{zoom}', zoom);
                temp = temp.replace('{x}', coord.x);
                temp = temp.replace('{y}', coord.y);
                return temp;
            },
            tileSize: new google.maps.Size(256, 256),
            maxZoom: 21,
            minZoom: 17,
            name: 'Kadastrale Base Layer',
        });
    }

    static getKadasterLayer(map, url) {
        return new google.maps.ImageMapType({
            getTileUrl: function(coord, zoom) {
                const zfactor = Math.pow(2, zoom);
                const projection = map.getProjection();
                const top = projection.fromPointToLatLng(
                    new google.maps.Point(
                        (coord.x * 256) / zfactor,
                        (coord.y * 256) / zfactor
                    )
                );
                const bot = projection.fromPointToLatLng(
                    new google.maps.Point(
                        ((coord.x + 1) * 256) / zfactor,
                        ((coord.y + 1) * 256) / zfactor
                    )
                );
                const bbox =
                    top.lng() +
                    ',' +
                    bot.lat() +
                    ',' +
                    bot.lng() +
                    ',' +
                    top.lat();
                return url.replace('{bbox}', bbox);
            },
            tileSize: new google.maps.Size(256, 256),
            name: 'Bebouwing',
            maxZoom: 21,
            minZoom: 17,
        });
    }
}
