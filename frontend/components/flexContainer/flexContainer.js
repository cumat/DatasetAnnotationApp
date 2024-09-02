import { Component } from "../component.js";

// Define default values for flex properties
const DEFAULT_STYLE = {
    direction: 'row',           // Default flex-direction
    wrap: 'nowrap',            // Default flex-wrap
    justify: 'flex-start',     // Default justify-content
    alignItems: 'normal',     // Default align-items
    alignContent: 'normal',   // Default align-content
    alignSelf: 'auto'          // Default align-self
};

export class FlexContainer extends HTMLElement {
    constructor() {
        super();
        this.setupHtml(this.#getAttributes());
    }
    // Method to collect attributes as an object
    #getAttributes() {
        return Array.from(this.attributes).reduce((acc, attr) => {
            acc[attr.name] = attr.value;
            return acc;
        }, {});
    }
    setupHtml(attributes) {
        // define default values
        const style = {
            flexDirection: attributes.direction || DEFAULT_STYLE.direction,
            flexWrap: attributes.wrap || DEFAULT_STYLE.wrap,
            justifyContent: attributes.justify || DEFAULT_STYLE.justify,
            alignItems: attributes.alignitems || DEFAULT_STYLE.alignItems,
            alignContent: attributes.aligncontent || DEFAULT_STYLE.alignContent,
            alignSelf: attributes.alignself || DEFAULT_STYLE.alignSelf
        };

        // add styles
        this.style.display = 'flex';
        this.style.flexDirection = style.flexDirection;
        this.style.flexWrap = style.flexWrap;
        this.style.justifyContent = style.justifyContent;
        this.style.alignItems = style.alignItems;
        this.style.alignContent = style.alignContent;
    }
    addOnLoadListener(callback) {
        callback();
    }
}

customElements.define('flex-container', FlexContainer);