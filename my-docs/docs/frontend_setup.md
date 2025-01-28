# Frontend Setup (React + Vite)

This document explains how to install and run the **React + Vite** frontend of the Task Management System. By the end, you’ll have a local development environment running at `http://127.0.0.1:5173` (or a different port if Vite chooses one dynamically).

---

## Prerequisites

- **Node.js 14+** (recommended: Node 16+)
- **Yarn** (instead of npm)
- **Git** (to clone the repository)

---

## Cloning the Repository

If you haven’t already, clone the main repository (which contains both frontend and backend). The frontend code is in the **`frontend/`** directory:

```bash
git clone https://github.com/PacifistaPx0/task_manager
cd frontend
```

---

## Install Dependencies with Yarn

Inside the `frontend/` folder, install dependencies via Yarn:

```bash
yarn
```

This command reads `package.json` and fetches all necessary libraries like React, Vite, Tailwind, and so on:

```json
{
    "dependencies": {
        "react": "^18.2.0",
        "axios": "^1.6.5",
        "react-router-dom": "6.10.0"
    },
    "devDependencies": {
        "@vitejs/plugin-react": "^4.0.3",
        "tailwindcss": "^3.4.10",
        "vite": "^4.4.5"
    }
}
```

---

## Configure Environment Variables

Create or modify your `.env` file in the `frontend/` folder to set the API base URL. For example:

```bash
VITE_REACT_APP_API_BASE_URL=https://your-api-end-point/
# or for local dev:
# VITE_REACT_APP_API_BASE_URL=http://127.0.0.1:8000/api/v1/
```

**Notes on Vite Environment Variables:**

- All variables must start with `VITE_` to be exposed in the client bundle.
- Access them in your React code via `import.meta.env.VITE_REACT_APP_API_BASE_URL`.

---

## Tailwind CSS Configuration

Your `tailwind.config.js` might look like this:

```js
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {}
    },
    plugins: []
}
```

And `postcss.config.js` might look like:

```js
export default {
    plugins: {
        tailwindcss: {},
        autoprefixer: {}
    }
};
```

Ensure you’ve imported your main CSS (e.g., `index.css`) in your React entry file (often `main.jsx` or `App.jsx`) and that it includes the Tailwind directives:

```css
/* index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## Development Server

To start the local development server, run:

```bash
yarn dev
```

Vite defaults to `http://127.0.0.1:5173` (or another port if 5173 is busy). Make sure your backend is running (if you need live API calls).

---

## Building for Production

When you’re ready to create a production build:

```bash
yarn build
```

This will generate a `dist/` folder containing optimized, minified static files. You can deploy `dist/` to any static hosting service (e.g., Netlify, GitHub Pages, or a custom server).

---

## Common Troubleshooting

- **API Calls Fail**
    - Check `VITE_REACT_APP_API_BASE_URL` in `.env`.
    - Ensure your backend is live and your CORS settings allow requests from `127.0.0.1:5173`.
- **Tailwind Styles Not Applying**
    - Verify `@tailwind base; @tailwind components; @tailwind utilities;` in your main CSS file.
    - Check content paths in `tailwind.config.js` so Tailwind can parse your JSX files.
- **Environment Variables Not Detected**
    - Make sure your variable names begin with `VITE_`.
    - Confirm you’re referencing them correctly in React code: `import.meta.env.VITE_REACT_APP_API_BASE_URL`.
- **Port Conflicts**
    - If 5173 is taken, Vite will pick another. Watch the console output for the actual dev server URL.

---

## Conclusion

With these steps, you should be able to:

1. Install dependencies via Yarn.
2. Configure `.env` for your API base URL and any other environment vars.
3. Use Tailwind CSS by importing it in your `index.css` or `App.css`.
4. Run the app locally with `yarn dev`.
5. Build for production with `yarn build`, and optionally deploy to Netlify or another static hosting provider.

If you need more details on Vite or Yarn, refer to the official [Vite](https://vitejs.dev/) and [Yarn](https://yarnpkg.com/) documentation. For styling references, consult the [Tailwind CSS](https://tailwindcss.com/) docs.
