import { Component } from '../component.js';
const navbarCssPath = "/components/navbar/navbar.css";
const navbarHtmlPath = "/components/navbar/navbar.html";

function getPreferredTheme() {
    // get theme based on system preference
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;

    return prefersDarkScheme ? 'dark' : 'light';
}

function getCurrentTheme() {
    return document.body.getAttribute('data-theme');
}

function setPreferredTheme(theme = null) {
    if (theme) {
        document.body.setAttribute('data-theme', theme);
    }
    else {
        document.body.setAttribute('data-theme', getPreferredTheme());
    }
}

function toggleTheme() {
    if (document.body.getAttribute('data-theme') === 'dark') {
        setPreferredTheme('light');
    } else {
        setPreferredTheme('dark');
    }
}

export class Navbar extends Component {
    constructor() {
        super(navbarHtmlPath, navbarCssPath);
    }
    setupHtml(node, attributes) {
        this.navTitle = node.querySelector(".navbar-title");
        this.navTitle.textContent = attributes.navtitle;
        this.homeBtn = node.querySelector(".navbar-home-button");
        if (attributes.showhome != undefined) {
            this.homeBtn.classList.remove("hidden");
        }
        const themeSelector = node.querySelector(".toggle-theme-button");
        setPreferredTheme();
        this.lightIcon = node.querySelector("#navbar-sun-svg");
        this.darkIcon = node.querySelector("#navbar-moon-svg");
        // set theme on button click
        themeSelector.addEventListener('click', () => {
            toggleTheme();
            this.#updateThemeButton();
        });
        this.#updateThemeButton();
        this.user = node.querySelector(".navbar-user");
        this.userA = node.querySelector(".navbar-user-a");
    }

    #updateThemeButton() {
        this.lightIcon.classList.add("hidden");
        this.darkIcon.classList.add("hidden");
        if (getCurrentTheme() == 'dark') {
            this.darkIcon.classList.remove("hidden");
        }
        else {
            this.lightIcon.classList.remove("hidden");
        }
    }
    setTitle(title) {
        this.navTitle.textContent = title;
    }
    setUser(user) {
        this.user.textContent = user;
        this.userA.setAttribute("href", `/login?user=${user}`);
    }
}

customElements.define("navbar-comp", Navbar);