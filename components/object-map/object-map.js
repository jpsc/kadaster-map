import $ from 'jquery';
import throttle from 'lodash/throttle';
import debounce from 'lodash/debounce';

import gmapsAsyncLoad from '../gmaps-async/gmaps-async';
import ObjectMapKadastraal from '../object-map-kadastraal/object-map-kadastraal';
import ObjectMapStreetview from '../object-map-streetview/object-map-streetview';
import MapSituatiekaart from '../object-map-situatiekaart/object-map-situatiekaart';
import MapTypeEventLogger from '../gtm-event-logger/event-loggers/map-type-event-logger';
import MapCreationEventLogger from '../gtm-event-logger/event-loggers/map-creation-event-logger';

export default ObjectMap;

const COMPONENT_ATTR = 'data-object-map';
const COMPONENT_SELECTOR = '[' + COMPONENT_ATTR + ']';
const CANVAS_SELECTOR = '[data-object-map-canvas]';
const CONFIG_SELECTOR = '[data-object-map-config]';
const ENHANCED_CLASS = 'is-interactive-map';
const EVENT_NAMESPACE = '.object-map';

const LEGENDS_SELECTOR = '[data-object-map-legend]';
const MAP_ZOOM_CONTROLS_SELECTOR = '[data-object-map-zoom-controls]';
const MAP_ZOOM_ZOOMIN_SELECTOR = '[data-object-map-zoom-controls-in]';
const MAP_ZOOM_ZOOMOUT_SELECTOR = '[data-object-map-zoom-controls-out]';
const MAP_TYPE_TOGGLE_SELECTOR = '[data-object-map-type-select]';
const MAP_FORCE_LOAD_ATTR = 'data-object-map-force-load';

const DEFAULT_ZOOM_LEVEL = 14;
const MIN_ZOOM_LEVEL = 0;
const MAX_ZOOM_LEVEL = 21;

const IS_VISIBLE_CLASS = 'is-visible';
const IS_HIDDEN_CLASS = 'is-hidden';

const EVENT_COMPONENT_NAMESPACE = 'object-map';
const EVENT_MAP_TYPE_SELECT = `map-type-select-event-${EVENT_COMPONENT_NAMESPACE}`;
const EVENT_SHOW_LEGEND = `show-map-legend-${EVENT_COMPONENT_NAMESPACE}`;
const EVENT_MAP_ZOOM_CONTROLS = 'event-map-zoom-controls';

const $window = $(window);

function ObjectMap(element) {
    const component = this;

    component.$element = $(element);
    component.$canvas = component.$element.find(CANVAS_SELECTOR);
    component.mapId = component.$element.attr(COMPONENT_ATTR);
    component.config = JSON.parse(
        component.$element.find(CONFIG_SELECTOR).text()
    );
    component.$mapLegend = component.$element.find(LEGENDS_SELECTOR);
    component.$mapZoomControls = component.$element.find(
        MAP_ZOOM_CONTROLS_SELECTOR
    );
    component.$mapTypeToggle = component.$element.find(
        MAP_TYPE_TOGGLE_SELECTOR
    );
    component.mapTypeEventLogger = new MapTypeEventLogger();
    component.mapCreationEventLogger = new MapCreationEventLogger();

    component.bindEvents(component);
    component.$element.addClass(ENHANCED_CLASS);

    if (component.useLazyLoad()) {
        // check once to see if the page was (re)loaded with the map already in view.
        component.loadMapIfVisible();
    } else {
        // load map as soon as the page is loaded
        component.loadMap();
    }
}

ObjectMap.prototype.bindEvents = function() {
    const component = this;

    component.$element
        .on('click', MAP_ZOOM_ZOOMIN_SELECTOR, event => {
            component.zoomIn(event);
        })
        .on('click', MAP_ZOOM_ZOOMOUT_SELECTOR, event => {
            component.zoomOut(event);
        });

    $window
        .on(EVENT_MAP_TYPE_SELECT, (event, data) => {
            component.switchMapType(data.value);
        })
        .on(EVENT_SHOW_LEGEND, (event, data) => {
            component.showLegend(data.legendSelector);
        })
        .on(EVENT_MAP_ZOOM_CONTROLS, (event, data) => {
            component.$mapZoomControls.toggleClass(
                IS_HIDDEN_CLASS,
                data.hidden
            );
        });

    if (component.useLazyLoad()) {
        $window
            .on(
                'scroll' + EVENT_NAMESPACE,
                throttle(() => {
                    component.loadMapIfVisible();
                }, 50)
            )
            .on(
                'resize' + EVENT_NAMESPACE,
                debounce(() => {
                    component.loadMapIfVisible();
                }, 200)
            );
    }
};

/**
 * Checks whether the map should be loaded only when it's inside viewport or always on page load
 */
ObjectMap.prototype.useLazyLoad = function() {
    return !this.$element[0].hasAttribute(MAP_FORCE_LOAD_ATTR);
};

/**
 * Checks whether the map is inside the view and if so, creates te map
 */
ObjectMap.prototype.loadMapIfVisible = function() {
    const component = this;
    const mapOffset = component.$canvas.offset();
    const mapHeight = component.$canvas.height() / 4; // Load when map quarter scrolled in
    const isInView =
        $window.scrollTop() + $window.height() > mapOffset.top + mapHeight;

    if (isInView) {
        $window.off('scroll' + EVENT_NAMESPACE);
        $window.off('resize' + EVENT_NAMESPACE);
        component.loadMap();
    }
};

ObjectMap.prototype.loadMap = function() {
    const component = this;

    if (component.config.useStubbedMapsApi) {
        // assuming window.google is a stubbed Maps API
        component.createMap();
        return;
    }

    gmapsAsyncLoad().then(function() {
        component.createMap();
        component.switchMapType(component.config.defaultMapType);
    });
};

/**
 * Create and insert map on component's canvas element.
 * @return {*} component's Google Map instance.
 */
ObjectMap.prototype.createMap = function() {
    const component = this;
    const google = window.google;
    const latLng = new google.maps.LatLng(
        component.config.lat,
        component.config.lng
    );

    component.mapCreationEventLogger.log('object-detail');
    component.map = new google.maps.Map(
        component.$canvas[0],
        component.getMapOptions()
    );
    component.marker = component.getMarker(latLng);
    component.kadasterPlugin = new ObjectMapKadastraal(
        component.map,
        component.config
    );
    component.streetviewPlugin = new ObjectMapStreetview(
        component.map,
        component.config,
        component.marker
    );
    component.situatiekaartPlugin = new MapSituatiekaart(
        component.map,
        component.config,
        component.marker,
        component.mapId
    );

    return component.map;
};

ObjectMap.prototype.getMarker = function(latLng) {
    const component = this;
    const markerIcon = {
        url: component.config.markerUrl,
        anchor: new google.maps.Point(30, 54),
        scaledSize: new google.maps.Size(60, 62),
    };

    return new google.maps.Marker({
        position: latLng,
        map: component.map,
        title: component.config.markerTitle,
        icon: markerIcon,
    });
};

ObjectMap.prototype.switchMapType = function(mapType) {
    const component = this;

    component.map.overlayMapTypes.clear();
    component.map.data.setMap(null);
    component.streetviewPlugin.setStreetview(false);
    component.hideLegends();
    component.removeAttributions();

    switch (mapType) {
        case 'roadmap':
            component.map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
            break;

        case 'satellite':
            component.map.setMapTypeId(google.maps.MapTypeId.HYBRID);
            break;

        case 'cadastral':
            component.kadasterPlugin.enableKadaster(EVENT_COMPONENT_NAMESPACE);
            break;

        case 'street_view':
            component.streetviewPlugin.setStreetview(true);
            break;
    }
    component.updateGTMMapType(mapType);
};

ObjectMap.prototype.removeAttributions = function() {
    this.map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].clear();
};

ObjectMap.prototype.showLegend = function(selector) {
    this.$element.find(selector).addClass(IS_VISIBLE_CLASS);
};

ObjectMap.prototype.hideLegends = function() {
    this.$mapLegend.removeClass(IS_VISIBLE_CLASS);
};

ObjectMap.prototype.updateGTMMapType = function(mapTypeName) {
    const component = this;
    component.mapTypeEventLogger.log(mapTypeName);
};

/**
 * Create and return map options based on component's configuration.
 * @returns {Object} map options
 */
ObjectMap.prototype.getMapOptions = function() {
    const config = this.config;
    const google = window.google;

    return {
        zoom: config.zoom || DEFAULT_ZOOM_LEVEL,
        center: new google.maps.LatLng(config.lat, config.lng),
        scrollwheel: false,
        gestureHandling: 'cooperative',
        // Map control options
        disableDefaultUI: true,
        mapTypeControlOptions: {
            mapTypeIds: [
                google.maps.MapTypeId.ROADMAP,
                google.maps.MapTypeId.SATELLITE,
                'kadastraal',
            ],
        },
        mapTypeId: config.defaultMapType,

        scaleControl: true,
        overviewMapControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.SMALL,
        },

        // Remove POI
        styles: [
            {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }],
            },
        ],
    };
};

ObjectMap.prototype.zoomIn = function(event) {
    const component = this;
    event.preventDefault();
    const currentZoomLevel = component.map.getZoom();

    if (currentZoomLevel !== MAX_ZOOM_LEVEL) {
        component.map.setZoom(currentZoomLevel + 1);
    }
};

ObjectMap.prototype.zoomOut = function(event) {
    const component = this;
    event.preventDefault();
    const currentZoomLevel = component.map.getZoom();

    if (currentZoomLevel !== MIN_ZOOM_LEVEL) {
        component.map.setZoom(currentZoomLevel - 1);
    }
};

// turn all elements with the default selector into components
$(COMPONENT_SELECTOR).each((index, element) => new ObjectMap(element));
