# OpenStreetMap iD Editor - Opening Hours UI (PoC) 

### GSoC 2026 Proposal Prototype

This repository contains a **Proof of Concept (PoC)** frontend prototype for the `opening_hours` tag editor, proposed for the OpenStreetMap iD editor.

**Live Interactive Demo:** []
**Video Demonstration:** []

### 🎯 Objective
The current `opening_hours` syntax is notoriously complex for mappers. This prototype demonstrates a new, intuitive graphical interface that abstracts the syntax, allowing users to visually build schedules while the tool generates the correct OSM string format in the real-time preview.

### 🛠️ Tech Stack
* Pure HTML5
* Vanilla CSS3 (Matching iD editor's native design system)
* Vanilla JavaScript (DOM manipulation and string generation)

### ⚠️ Note for Reviewers
*This is purely a frontend UX/UI prototype.* It is built to validate the user workflow and interaction model. In the final GSoC implementation, this will be integrated with the robust `opening_hours.js` parser to handle complex edge cases (e.g., proper comma grouping vs. semicolons for identical days).