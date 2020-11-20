// require this module where needed, either in a specific view or component or generically in src/index.js
import $ from 'jquery';

// constant definitions
const MAP_TYPE_ATTR = 'data-object-map-type-select';
const MAP_TYPE_SELECTOR = `[${MAP_TYPE_ATTR}]`;
const MAP_TYPE_SELECT_RADIO = '[data-object-map-type-select-radio]';

const MENU_TOGGLE_SELECTOR = '[data-menu-toggle]';
const MENU_TITLE_SELECTOR = '[data-menu-title]';
const MENU_ITEM = 'data-menu-item';
const MENU_ITEM_SELECTOR = '[' + MENU_ITEM + ']';

const OPEN_CLASS = 'open';

const $window = $(window);

export default class ObjectMapTypeSelect {
    constructor(element) {
        this.$element = $(element);

        this.mapId = this.$element.attr(MAP_TYPE_ATTR);
        this.mapTypeSelectEvent = `map-type-select-event-${this.mapId}`;

        this.$menuToggle = this.$element.find(MENU_TOGGLE_SELECTOR);
        this.$menuTitle = this.$element.find(MENU_TITLE_SELECTOR);
        this.$menuItems = this.$element.find(MENU_ITEM_SELECTOR);

        this.$selectRadios = this.$element.find(MAP_TYPE_SELECT_RADIO);

        this.bindEvents();
    }

    bindEvents() {
        this.$element.on('change', this.$selectRadios, event =>
            this.updateMenuItem(event)
        );

        this.$menuToggle.on('click', event => this.toggleMenuVisibility(event));

        $window.on('click', () => this.closeMenu());

        $window.on(this.mapTypeSelectEvent, (event, data) =>
            this.onMapTypeSelectEvent(data)
        );
    }

    onMapTypeSelectEvent(data) {
        this.$selectRadios.map((index, item) => {
            const $item = $(item);

            $item.prop('checked', false);

            if ($item.val() == data.value) {
                $item.prop('checked', true);

                this.updateMenuTitle($item);
            }
        });
    }

    toggleMenuVisibility(event) {
        this.$element.toggleClass(OPEN_CLASS);
        event.stopPropagation();
    }

    closeMenu() {
        this.$element.removeClass(OPEN_CLASS);
    }

    updateMenuItem(event) {
        event.preventDefault();

        this.$element.removeClass(OPEN_CLASS);

        $window.trigger(this.mapTypeSelectEvent, {
            value: event.target.value
        });
    }

    updateMenuTitle($item) {
        const $label = this.$element.find(`label[for="${$item.attr('id')}"]`);

        this.$menuTitle.html($label.text().trim());
    }
}

$(MAP_TYPE_SELECTOR).each((index, element) => new ObjectMapTypeSelect(element));
