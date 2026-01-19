# julia

A web application for creating 4x6" recipe cards optimized for thermal printer output.

## Features

- **Import from URL** - Paste a recipe URL to automatically extract recipe data
- **URL Parameter Import** - Share links that auto-import recipes via `?recipe_url=`
- **Browser Omnibox Integration** - Import recipes directly from Chrome's address bar
- **4x6" Recipe Cards** - Sized perfectly for standard thermal printer paper
- **Live Preview** - See your recipe card update as you type
- **Auto-scaling Text** - Long recipes automatically reduce font size to fit the card
- **Thermal Printer Optimized** - Heavy font weights, pure black text, and minimal margins for best print quality
- **Dynamic Page Title** - Browser tab shows the recipe name
- **SEO Optimized** - Open Graph and Twitter Card metadata for social sharing

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
docker build -t julia .
```

### Run the container

```bash
docker run -p 8080:80 julia
```

The app will be available at http://localhost:8080

## Usage

### Import from URL

1. Paste a recipe URL into the import field
2. Click **Import** to extract the recipe data
3. The form will be populated with the recipe details

Most recipe websites use structured data (JSON-LD with schema.org Recipe) which the app can parse automatically.

### URL Parameter Import

You can share links that automatically import a recipe by adding the `recipe_url` parameter:

```
https://yoursite.com/?recipe_url=https://example.com/recipe
```

When someone opens this link, the recipe will be automatically imported and displayed.

### Browser Omnibox Integration

Julia supports OpenSearch, which enables importing recipes directly from Chrome's address bar:

1. Visit the Julia app at least once so Chrome discovers the search provider
2. Type the site URL in Chrome's address bar (e.g., `yoursite.com`)
3. Press **Tab** when Chrome shows "Search Julia"
4. Paste a recipe URL and press **Enter**

The recipe will be automatically imported.

### Manual Entry

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
