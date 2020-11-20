import $ from 'jquery';

const MEDIA_VIEWER_MAP_ATTRIBUTION_STYLES_CLASS = 'object-map__attribution';

const SHOW_LEGEND_EVENT = 'show-map-legend';
const NWN_LEGEND_SELECTOR = '[data-object-map-nwn-legend]';

const EVENT_SHOW_DRAWER = 'event-situatiekaart-show-drawer';
const EVENT_CLOSE_DRAWER = 'event-situatiekaart-close-drawer';

const $window = $(window);

export default class MapSituatiekaart {
    constructor(map, config, marker, mapId) {
        const component = this;

        component.map = map;
        component.config = config;
        component.marker = marker;
        component.mapId = mapId;

        component.isSituationMapAvailable = Boolean(
            component.config.projectSituatiekaart
        );
        component.isPolygonDataLoaded = false;

        component.bounds = new google.maps.LatLngBounds();

        if (component.isSituationMapAvailable) {
            component.image = component.config.projectSituatiekaart;
            component.imageBounds = new google.maps.LatLngBounds(
                new google.maps.LatLng(
                    component.config.projectSituatiekaartCoordinateSouthWest
                ),
                new google.maps.LatLng(
                    component.config.projectSituatiekaartCoordinateNorthEast
                )
            );

            component.loadPolygons();
            component.loadOverlayImage();

            component.bindEvents();
            component.setDataLayerProperties();
        }
    }

    bindEvents() {
        const component = this;

        $window.on(EVENT_CLOSE_DRAWER, () => {
            component.revertHighlightedPolygons();
        });

        google.maps.event.addListener(
            component.map,
            'maptypeid_changed',
            () => {
                if (component.map.getMapTypeId() == 'roadmap') {
                    component.showSituatiekaart();
                } else {
                    component.hideSituatiekaart();
                }
            }
        );
    }

    showSituatiekaart() {
        const component = this;

        component.overlay.setMap(component.map);
        component.map.data.setMap(component.map);

        component.addAttribution();
        component.hideMarker();

        $window.trigger(SHOW_LEGEND_EVENT + '-' + component.mapId, {
            legendSelector: NWN_LEGEND_SELECTOR,
        });
    }

    hideSituatiekaart() {
        const component = this;

        component.overlay.setMap(null);
        component.map.data.setMap(null);
    }

    loadOverlayImage() {
        const component = this;

        let groundOverlayOptions = {
            clickable: false,
            map: component.map,
        };

        component.overlay = new google.maps.GroundOverlay(
            component.image,
            component.imageBounds,
            groundOverlayOptions
        );
    }

    loadPolygons() {
        const component = this;

        if (component.isPolygonDataLoaded) {
            return;
        }

        component.map.data.loadGeoJson(
            component.config.projectSituatiekaartPolygons,
            null,
            () => {
                component.isPolygonDataLoaded = true;

                component.centerMap();
            }
        );

        component.map.data.setMap(component.map);
    }

    setDataLayerProperties() {
        const component = this;

        component.map.data.setStyle(feature => {
            let fillColor = feature.getProperty('fillColor');
            let strokeColor = feature.getProperty('strokeColor');
            let fillOpacity = feature.getProperty('isSelected') ? 0.8 : 0.4;

            return {
                fillColor: fillColor,
                fillOpacity: fillOpacity,
                strokeColor: strokeColor,
                strokeWeight: 2,
            };
        });

        component.map.data.addListener('click', event => {
            component.revertHighlightedPolygons();

            if (component.mapId === 'object-map') {
                window.location.hash = '#nwn-kaart';
            } else {
                $window.trigger(EVENT_SHOW_DRAWER, {
                    feature: event.feature,
                });

                event.feature.setProperty('isSelected', true);
            }
        });

        component.map.data.addListener('mouseover', event => {
            component.map.data.overrideStyle(event.feature, {
                fillOpacity: 0.6,
            });
        });

        component.map.data.addListener('mouseout', () => {
            component.map.data.revertStyle();
        });
    }

    revertHighlightedPolygons() {
        const component = this;

        component.map.data.forEach(feature => {
            feature.removeProperty('isSelected');
        });
    }

    centerMap() {
        const component = this;

        component.map.data.forEach(feature => {
            component.processPoints(
                feature.getGeometry(),
                component.bounds.extend,
                component.bounds
            );
        });

        component.map.fitBounds(component.bounds);
    }

    addAttribution() {
        const attributionText = `<a href="${
            this.config.projectAttributionUrl
        }" target="_blank" rel="nofollow">${
            this.config.projectAttributionText
        }</a>`;

        const element = document.createElement('div');
        element.classList.add(MEDIA_VIEWER_MAP_ATTRIBUTION_STYLES_CLASS);
        element.innerHTML = attributionText;

        this.map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(
            element
        );
    }

    hideMarker() {
        const component = this;

        component.marker.setMap(null);
    }

    processPoints(geometry, callback, thisArg) {
        const component = this;

        if (geometry instanceof google.maps.LatLng) {
            callback.call(thisArg, geometry);
        } else if (geometry instanceof google.maps.Data.Point) {
            callback.call(thisArg, geometry.get());
        } else {
            geometry.getArray().forEach(function(g) {
                component.processPoints(g, callback, thisArg);
            });
        }
    }
}
