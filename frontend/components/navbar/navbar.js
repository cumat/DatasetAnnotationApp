import { Component } from '../component.js';
const navbarCssPath = "/components/navbar/navbar.css";
const navbarHtmlPath = "/components/navbar/navbar.html";

function getPreferredTheme() {
    const t = localStorage.getItem("preferred-theme");
    if (t) {
        return t;
    }
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
        localStorage.setItem("preferred-theme", theme);
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
        this.dwonloadButton = node.querySelector(".download-button");
        this.dwonloadButton.addEventListener("click", () => {
            this.#onDownload();
        })
        if (attributes.showdownload != undefined) {
            this.dwonloadButton.classList.remove("hidden");
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

        this.backButton = node.querySelector(".navbar-back-button");
        this.backButton.addEventListener("click", () => {
            history.back();
        })
        if (attributes.showback != undefined) {
            this.backButton.classList.remove("hidden");
        }
    }
    #onDownload() {
        if (this.onDownload)
            this.onDownload();
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

    setOnDownloadListener(callback) {
        this.onDownload = callback;
    }
}

customElements.define("navbar-comp", Navbar);