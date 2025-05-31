# Roomie Rumble Tournament Website

## Overview

This website provides information for the "Roomie Rumble" online gaming tournament, an event by **Fuslie, Kkatamina, Valkyrae, and TinaKitten**. It displays their participating teams, player details with links to their channels, the tournament schedule with localized times, game formats, and current standings.

## Features

* **Team Showcase:** Displays team captains (Fuslie, Kkatamina, Valkyrae, TinaKitten) and their players with images and links.
* **Dynamic Schedule:** Shows weekly game schedule with event dates and times automatically localized to the viewer's timezone.
* **Google Calendar Integration:** Allows users to easily add tournament events to their Google Calendar.
* **Tournament Format Display:** Details the format for each game in the tournament.
* **Responsive Design:**
    * Desktop: Multi-column layouts for teams, schedule, and game formats.
    * Mobile: Content-switching display for teams and game formats using animated transitions and navigation controls.
* **Dark Theme:** Sleek and modern dark user interface.
* **Smooth Animations:** On-scroll reveal animations and smooth scrolling for navigation.
* **Standings Section:** Placeholder for updating tournament progress.

## Technologies Used

* HTML5
* CSS3 (with Flexbox and Grid for layout)
* JavaScript (for date/time localization, content switching, and animations)

## How to View

Simply open the `index.html` file in a web browser. Ensure that `style.css`, `script.js`, and the `assets` folder (containing images and favicon) are in the same directory.

## Customization

* **Team Information:** Edit player names, image paths (`./assets/your-image.ext`), and Twitch links directly in `index.html` within the `#teams` section. Team captains are Fuslie, Kkatamina, Valkyrae, and TinaKitten.
* **Schedule & Format:** Update game titles, descriptions, rules, and `data-*` attributes for dates in `index.html` within the `#schedule` and `#format` sections.
* **Images:** Replace placeholder images in the `assets` folder with your actual images, ensuring paths in `index.html` are updated.
* **Standings:** Modify the content within the `#standings` section in `index.html` as the tournament progresses.
