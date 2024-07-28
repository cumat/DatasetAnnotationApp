import { Component } from "../component.js";

const htmlPath = "/components/flexContainer/flexContainer.html";

// Define default values for flex properties
const DEFAULT_STYLE = {
    direction: 'row',           // Default flex-direction
    wrap: 'nowrap',            // Default flex-wrap
    justify: 'flex-start',     // Default justify-content
    alignItems: 'normal',     // Default align-items
    alignContent: 'normal',   // Default align-content
    alignSelf: 'auto'          // Default align-self
};

export class FlexContainer extends Component {
    constructor() {
        super(htmlPath);
    }
    setupHtml(node, attributes, children) {
        const container = node.querySelector(".flex-container");
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
        container.style.display = 'flex';
        container.style.flexDirection = style.flexDirection;
        container.style.flexWrap = style.flexWrap;
        container.style.justifyContent = style.justifyContent;
        container.style.alignItems = style.alignItems;
        container.style.alignContent = style.alignContent;

        // add children to container
        children.forEach(child => {
            container.appendChild(child);
        });
    }
}

customElements.define('flex-container', FlexContainer);