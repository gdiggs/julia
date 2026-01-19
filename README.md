# dee

A web application for creating 4x6" recipe cards optimized for thermal printer output.

## Features

- **4x6" Recipe Cards** - Sized perfectly for standard thermal printer paper
- **Live Preview** - See your recipe card update as you type
- **Auto-scaling Text** - Long recipes automatically reduce font size to fit the card
- **Thermal Printer Optimized** - Heavy font weights, pure black text, and minimal margins for best print quality
- **Dynamic Page Title** - Browser tab shows the recipe name

## Technologies

- [React](https://react.dev/) - UI framework
- [Vite](https://vite.dev/) - Build tool and dev server
- [Docker](https://www.docker.com/) - Containerization
- [nginx](https://nginx.org/) - Production web server

## Development

### Prerequisites

- Node.js 20+
- npm

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

The app will be available at http://localhost:5173

### Build for production

```bash
npm run build
```

Static files will be output to the `dist/` directory.

## Docker

### Build the image

```bash
docker build -t dee .
```

### Run the container

```bash
docker run -p 8080:80 dee
```

The app will be available at http://localhost:8080

## Usage

1. Enter your recipe details:
   - **Title** - Name of the recipe
   - **Servings** - How many servings the recipe makes
   - **Prep Time** - Time to prepare ingredients
   - **Cook Time** - Time to cook
   - **Ingredients** - One ingredient per line
   - **Instructions** - One step per line

2. Preview your recipe card on the right side of the screen

3. Click **Print Card** to print the recipe card

## Thermal Printer Notes

The app is optimized for thermal printers:

- Uses bold fonts (Arial Black, weight 600-900) for consistent heat transfer
- All text is pure black (#000) since thermal printers are binary (no grayscale)
- Minimal margins (0.1") since thermal printers can print edge-to-edge
- Font smoothing disabled in print mode to preserve stroke weight
