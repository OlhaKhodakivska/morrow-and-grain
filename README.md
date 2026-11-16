# Morrow & Grain

**Room for the life you love.**

A responsive website for an interior design studio, bringing together the studio’s approach, services, project collection, and consultation information. Warm photography, editorial typography, and a grounded colour palette give the four pages a consistent visual identity.

## Pages

| Page | Content |
| --- | --- |
| **Home** | Studio introduction, selected projects, services, and project brief form |
| **About Us** | Design philosophy, core values, and the process from discovery to final details |
| **Projects** | Interior collection with descriptions and category filters |
| **Consultation** | Consultation overview, preparation checklist, frequently asked questions, and project brief form |

## Features

- Responsive layouts for desktop, tablet, and mobile screens.
- Shared navigation with a current-page indicator and a mobile menu.
- Project filtering by residential and hospitality categories.
- Scroll-triggered reveals with directional movement, scaling, and staggered timing.
- Shorter animation durations and travel distances on mobile screens.
- Support for the system’s reduced-motion preference.
- Expandable FAQ using native HTML disclosure elements.
- A project brief form with required-field and email validation.
- Downloadable text briefs generated directly in the browser.
- Keyboard navigation, visible focus indicators, an accessible menu toggle, and a skip link.
- Descriptive image alternative text and status announcements for interactive features.

## Built with

| Technology | Use |
| --- | --- |
| **HTML5** | Semantic page structure, navigation, forms, and native `details` / `summary` elements |
| **CSS3** | Shared design tokens, responsive spacing, fluid typography, and interactive states |
| **CSS Grid & Flexbox** | Page composition, project galleries, service columns, and navigation |
| **JavaScript** | Menu controls, project filters, form handling, and animation coordination |
| **Intersection Observer API** | Starting reveal effects when content enters the viewport |
| **Web Animations API** | Directional movement, opacity changes, and scaling |
| **Media Queries & `matchMedia()`** | Responsive navigation and motion preferences |
| **FormData, Blob & URL APIs** | Collecting form values and creating a downloadable project brief |

The site uses plain HTML, CSS, and JavaScript. It runs without a build step, a framework, or third-party runtime dependencies. Typography uses Georgia and Arial system font stacks.

## Design

The interface combines large serif headings with a readable sans-serif body, balanced content widths, arched image frames, and generous spacing. Project layouts use three columns on wide screens, two on tablets, and one on smaller screens.

| Colour | Hex | Role |
| --- | --- | --- |
| Burgundy | `#8D230F` | Primary actions and footer |
| Forest | `#1E434C` | Headings and dark sections |
| Rust | `#9B4F0F` | Secondary accents and hover states |
| Gold | `#C99E10` | Highlight sections and actions on dark backgrounds |
| Cream | `#FFF9EF` | Page backgrounds and light text |

Colour tokens are defined in `:root` at the beginning of `styles.css`. Layout and typography are shared across all four pages.

## Getting started

### VS Code

1. Open the project folder in VS Code.
2. Open `index.html`.
3. Use **Open with Live Server** if the Live Server extension is installed.

You can also open `index.html` directly in a modern browser.

### Local server

With Python 3 installed, run this command from the project folder:

```bash
python3 -m http.server 8000
```

Open [localhost:8000](http://localhost:8000). Press `Ctrl+C` in the terminal to stop the server.

## Project structure

```text
interiospark/
├── index.html        # Home
├── about.html        # About the studio
├── projects.html     # Filterable project collection
├── landing.html      # Consultation
├── styles.css        # Design system and responsive styles
├── script.js         # Navigation, filtering, forms, and motion
├── images/           # Photography and favicon
└── README.md
```

## How the interactions work

### Navigation

The mobile menu updates `aria-expanded` when toggled. Selecting a navigation link or pressing `Escape` closes the menu. Page links remain available when JavaScript is disabled.

### Project filters

Filter buttons match each card’s `data-category` value. Unmatched cards are hidden, the selected button updates its `aria-pressed` state, and a live region announces the number of visible projects.

### Scroll animations

Intersection Observer detects when a block enters the viewport. The Web Animations API then runs the reveal once for that block. Motion settings include direction, duration, and staggered delay. Content remains visible when these APIs are unavailable. Reduced-motion preferences disable reveals, and keyboard focus cancels an active animation on the focused block.

### Project brief

The form validates a name, email address, and project description. It creates a `morrow-and-grain-project-brief.txt` file containing the entered information. Processing happens in the browser; saving a brief does not send an email, submit an enquiry, or book an appointment.

## Editing the site

- Update page copy directly in the corresponding HTML file.
- Change colours and font stacks through the variables in `styles.css`.
- Replace photography in `images/`, updating the file path, dimensions, and alternative text in HTML.
- Adjust reveal directions and timing in the scroll animation section of `script.js`.
- Keep shared header and footer changes consistent across the four HTML files.

## Deployment

Serve `index.html`, `about.html`, `projects.html`, `landing.html`, `styles.css`, `script.js`, and `images/` from a static web host. Preserve their relative paths. No compilation or server-side application is required.
