'use strict'

import { initializeGame, terminateGame } from "./app.js"

const DEFAULT_PAGE_TITLE = "JS SPA Router";

const ROUTES = {
	404: {
		template: "../templates/404.html",
		title: "404 | " + DEFAULT_PAGE_TITLE,
		description: "Page not found",
	},
	"/": {
		template: "../templates/index.html",
		title: "Home | " + DEFAULT_PAGE_TITLE,
		description: "This is the home page",
	},
	"/about": {
		template: "../templates/about.html",
		title: "About Us | " + DEFAULT_PAGE_TITLE,
		description: "This is the about page",
	},
	"/contact": {
		template: "../templates/contact.html",
		title: "Contact Us | " + DEFAULT_PAGE_TITLE,
		description: "This is the contact page",
	},
	"/game": {
		template: "../templates/pong.html",
		title: "Game | " + DEFAULT_PAGE_TITLE,
		description: "This is the Pong Game",
	}
};

window.onpopstate = loadWindowLocation; // Event listener for url changes
window.onload = loadWindowLocation; // Handle the initial url

// Custom navigation event for links with the class spa-route
document.addEventListener("click", (event) => {
	if (!event.target.matches(".spa-route"))
		return;
	navigationEventHandler(event);
});

// Handles navigation events by setting the new window location and calling loadWindowLocation
function navigationEventHandler(event) {
	event.preventDefault();
	window.history.pushState({}, "", event.target.href); // Set window location
	loadWindowLocation();
}

// Load the template html for the current window location
async function loadWindowLocation() {
	const location = window.location;
	const locationPath = (location.length === 0) ? "/" : location.pathname;
	const route = ROUTES[locationPath] || ROUTES["404"];
	
	try {
		const response = await fetch(route.template);
		if (!response.ok) throw new Error('Network response was not ok');
		const html = await response.text();
	
		document.getElementById("spa-template-content").innerHTML = html;
		document.title = route.title;
		document.querySelector('meta[name="description"]').setAttribute("content", route.description);
	
		// Manejo de scripts
		terminateGame();
		if (locationPath === "/game") {
			initializeGame();
		}
	} catch (error) {
	  	console.error('Error fetching template:', error);
	}
}
