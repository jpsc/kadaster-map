import $ from 'jquery';

export default class ObjectMapStreetview {
    constructor(map, config, marker) {
        this.map = map;
        this.config = config;
        this.marker = marker;

        this.latLng = new google.maps.LatLng(this.config.lat, this.config.lng);
    }

    /**
     * Turn streetview on/off
     * @param {boolean} state - true = on
     */
    setStreetview(state) {
        if (!state && !this.panorama) {
            return;
        } else if (!this.panorama) {
            this.loadStreetView();
            this.panorama.setVisible(state);
        } else {
            this.panorama.setVisible(state);
        }
    }

    loadStreetView() {
        const service = new google.maps.StreetViewService();
        const panoramaOptions = {
            addressControl: false,
            linksControl: true,
            panControl: true,
            zoomControl: true,
            fullscreenControl: false,
            enableCloseButton: false,
        };

        this.panorama = this.map.getStreetView();
        this.panorama.setOptions(panoramaOptions);
        this.panorama.setPosition(this.latLng);

        const panoramaRequest = {
            location: this.panorama.getPosition(),
            preference: google.maps.StreetViewPreference.NEAREST,
            radius: 100,
            source: google.maps.StreetViewSource.OUTDOOR,
        };

        service.getPanorama(panoramaRequest, (panoramaData, status) => {
            if (status === google.maps.StreetViewStatus.OK) {
                const panoramaCenter = panoramaData.location.latLng;
                const panoramaHeading = google.maps.geometry.spherical.computeHeading(
                    panoramaCenter,
                    this.panorama.getPosition()
                );
                const panoramaPov = this.panorama.getPov();

                panoramaPov.heading = panoramaHeading;

                this.panorama.setPano(panoramaData.location.pano);
                this.panorama.setPov(panoramaPov);
            }
        });
        // Only show the marker and zoom controls when we're not in Street View
        google.maps.event.addListener(
            this.map.getStreetView(),
            'visible_changed',
            () => {
                const $window = $(window);
                const MAP_ZOOM_CONTROLS_EVENT = 'event-map-zoom-controls';
                if (this.map.getStreetView().getVisible()) {
                    $window.trigger(MAP_ZOOM_CONTROLS_EVENT, { hidden: true });

                    this.marker.setMap(null);
                } else {
                    $window.trigger(MAP_ZOOM_CONTROLS_EVENT, { hidden: false });

                    this.marker.setMap(this.map);
                }
            }
        );
    }
}
