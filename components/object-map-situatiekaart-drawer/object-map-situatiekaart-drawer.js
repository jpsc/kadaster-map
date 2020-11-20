// require this module where needed, either in a specific view or component or generically in src/index.js
import $ from 'jquery';
import browserSupportsAnimations from '../app-utils/app-utils-browser-supports-animations';

const COMPONENT_SELECTOR = '[data-object-map-situatiekaart-drawer]';

const COMPONENT_CLOSE_BUTTON = '[data-situatiekaart-close-button]';
const COMPONENT_CONTENT = '[data-situatiekaart-drawer-content]';

const COMPONENT_OBJECT_IMAGE = '[data-situatiekaart-drawer-image]';
const COMPONENT_OBJECT_LABEL = '[data-situatiekaart-drawer-label]';
const COMPONENT_OBJECT_TITLE = '[data-situatiekaart-drawer-title]';
const COMPONENT_OBJECT_PRICE = '[data-situatiekaart-drawer-price]';
const COMPONENT_OBJECT_SURFACE = '[data-situatiekaart-drawer-surface]';
const COMPONENT_OBJECT_ROOMS = '[data-situatiekaart-drawer-rooms]';
const COMPONENT_OBJECT_URL = '[data-situatiekaart-drawer-url]';

const EVENT_SHOW_DRAWER = 'event-situatiekaart-show-drawer';
const EVENT_CLOSE_DRAWER = 'event-situatiekaart-close-drawer';

const ANIMATION_END_EVENTS =
    'webkitAnimationEnd oAnimationEnd msAnimationEnd animationend';

const IS_UPDATING_CLASS = 'is-updating';
const IS_OPENED_CLASS = 'is-opened';
const IS_CLOSING_CLASS = 'is-closing';

const $window = $(window);

export default class ObjectMapSituatiekaartDrawer {
    constructor(element) {
        const component = this;

        component.$element = $(element);

        component.$closeButton = component.$element.find(
            COMPONENT_CLOSE_BUTTON
        );
        component.$content = component.$element.find(COMPONENT_CONTENT);

        component.$objectImage = component.$element.find(
            COMPONENT_OBJECT_IMAGE
        );
        component.$objectLabel = component.$element.find(
            COMPONENT_OBJECT_LABEL
        );
        component.$objectTitle = component.$element.find(
            COMPONENT_OBJECT_TITLE
        );
        component.$objectPrice = component.$element.find(
            COMPONENT_OBJECT_PRICE
        );
        component.$objectSurface = component.$element.find(
            COMPONENT_OBJECT_SURFACE
        );
        component.$objectRooms = component.$element.find(
            COMPONENT_OBJECT_ROOMS
        );
        component.$objectUrl = component.$element.find(COMPONENT_OBJECT_URL);

        component.animationsSupported = browserSupportsAnimations();

        component.$closeButton.on('click', () => {
            $window.trigger(EVENT_CLOSE_DRAWER);
        });

        component.bindGlobalEvents();
    }

    bindGlobalEvents() {
        const component = this;

        $window.on(EVENT_SHOW_DRAWER, (event, data) => {
            component.updateDrawer(data.feature);
        });

        $window.on(EVENT_CLOSE_DRAWER, () => {
            component.closeDrawer();
        });
    }

    openDrawer() {
        const component = this;

        if (component.isOpen()) {
            return;
        }

        component.$element.addClass(IS_OPENED_CLASS);
    }

    closeDrawer() {
        const component = this;

        if (component.isOpen()) {
            component.$element
                .removeClass(IS_OPENED_CLASS)
                .addClass(IS_CLOSING_CLASS);

            let onAnimationEndHandler = () => {
                component.$element.removeClass(IS_CLOSING_CLASS);
                component.$element.attr('aria-hidden', 'true');
                component.$element.off(ANIMATION_END_EVENTS);
            };

            if (component.animationsSupported) {
                component.$element.one(
                    ANIMATION_END_EVENTS,
                    onAnimationEndHandler
                );
            } else {
                onAnimationEndHandler();
            }
        }
    }

    updateDrawer(feature) {
        const component = this;

        component.$content.addClass(IS_UPDATING_CLASS);

        if (feature.getProperty('StatusLabel') !== null) {
            component.$objectLabel
                .removeClass()
                .addClass(feature.getProperty('StatusClassName'));
            component.$objectLabel.html(feature.getProperty('StatusLabel'));
        } else {
            component.$objectLabel.removeClass();
            component.$objectLabel.html('');
        }

        component.$objectImage.attr('src', feature.getProperty('HoofdFoto'));
        component.$objectImage.attr(
            'srcset',
            feature.getProperty('HoofdFotoSrcSet')
        );
        component.$objectTitle.html(feature.getProperty('Adres'));
        component.$objectPrice.html(feature.getProperty('Prijs'));
        component.$objectSurface.html(feature.getProperty('Woonoppervlakte'));
        component.$objectRooms.html(feature.getProperty('AantalKamers'));
        component.$objectUrl.attr('href', feature.getProperty('DetailUrl'));

        setTimeout(() => {
            component.$content.removeClass(IS_UPDATING_CLASS);
        }, 250);

        component.openDrawer();
    }

    isOpen() {
        return this.$element.hasClass(IS_OPENED_CLASS);
    }
}

$(COMPONENT_SELECTOR).each(
    (index, element) => new ObjectMapSituatiekaartDrawer(element)
);
