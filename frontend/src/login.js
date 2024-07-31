// import { getComponentWithId } from "../components/component.js";

// // get the component by id
// const x = getComponentWithId("id1");

// console.log("component with id1", x);
// x.addOnLoadListener(() => x.setOnSubmitCallback(onSubmit));
// function onSubmit(value) {
//     console.log("submitted value", value);
// }

// function setTheme(theme) {
//     const themeLink = document.getElementById('theme-style');
//     themeLink.href = theme === 'dark' ? '/styles/colors-dark.css' : '/styles/colors-light.css';
// }

// // Automatically set theme based on system preference
// const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
// setTheme(prefersDarkScheme ? 'dark' : 'light');

// // Optional: Toggle theme based on user action
// document.getElementById('theme-toggle').addEventListener('click', () => {
//     const currentTheme = document.getElementById('theme-style').href.includes('dark') ? 'dark' : 'light';
//     setTheme(currentTheme === 'dark' ? 'light' : 'dark');
// });