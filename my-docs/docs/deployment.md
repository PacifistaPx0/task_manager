# Deployment

This guide explains how to deploy the **Task Manager Application**—consisting of a **Django REST** backend and a **React + Vite** frontend—to **Render** (for the backend) and **Netlify** (for the frontend).

---

## 1. Overview

- **Frontend**: Deployed as a static site on **Netlify**, pointing to your compiled React + Vite `dist/` folder.
- **Backend**: Deployed on **Render** as a **Web Service**. It runs Django, handles API requests, and interacts with the PostgreSQL database and external services like Cloudinary.

---

## 2. Prerequisites

1. **Render Account**: [Render Sign-up](https://render.com/)
2. **Netlify Account**: [Netlify Sign-up](https://www.netlify.com/)
3. **Repository on GitHub** containing both frontend and backend folders.

---

## 3. Backend Deployment (Render)

### 3.1. Prepare Your Django Backend

1. **Requirements**: Make sure `requirements.txt` is up to date.
    - Include `gunicorn`, `whitenoise`, and any other production dependencies.
2. **Procfile (Optional)**: If needed, specify how to run your app.
    ```bash
    web: gunicorn backend.wsgi:application --log-file -
    ```
    This is often optional if Render can infer the command from your settings.

### 3.2. Render Project Setup

1. **Create a New Web Service**
     - Log in to Render and choose “New” → “Web Service”.
     - Connect it to your Git repo.
     - Select the `backend/` folder if Render asks for a root directory (or specify in the build command).
2. **Build & Start Commands**
     - **Build Command**:
     ```bash
     pip install -r requirements.txt
     python manage.py collectstatic --noinput
     python manage.py migrate
     ```
     - **Start Command**:
     ```bash
     gunicorn backend.wsgi:application
     ```
     - Adjust the path to `manage.py` if your Django files aren’t in the root.

3. **Environment Variables**
     - In Render’s “Environment” tab, add variables like:
          - `SECRET_KEY`
          - `DATABASE_URL`
          - `DEBUG=False`
          - `CLOUDINARY_*` keys (if you store media on Cloudinary)
          - `MAILGUN_*` (if you send emails)
     - Important: Mark them as “Secret Files” if needed and never commit real secrets to Git.

### 3.3. Database (PostgreSQL)

- Either:
     - Use Render’s managed PostgreSQL (create a new DB in Render).
     - Or link to an external DB service.
- Ensure `DATABASE_URL` is set accordingly in your Render environment variables.

### 3.4. Verify & Deploy

1. Deploy the service (Render will run the build command, then the start command).
2. Check Logs to confirm:
     - Pip installed dependencies
     - Migrations ran successfully
     - `gunicorn` started without error

Once it’s live, Render provides a unique subdomain (e.g., `your-app.onrender.com`). That URL will serve the Django API endpoints.

---

## 4. Frontend Deployment (Netlify)

### 4.1. Prepare Your React + Vite App

1. **Build Script**: Ensure `package.json` has:
     ```json
     {
        "scripts": {
          "build": "vite build",
          "dev": "vite"
        }
     }
     ```
2. **Environment Variables**:
     - If you need a different API base URL in production, you can set a Netlify environment variable `VITE_REACT_APP_API_BASE_URL` to point to the Render domain (e.g., `https://your-backend.onrender.com/api/v1/`).

### 4.2. Create a New Netlify Site

1. **Netlify Dashboard** → “New site from Git”.
2. **Connect Repo**: Authorize GitHub/GitLab and pick your repo.
3. **Build Command**: `yarn build` or `npm run build` (depending on your package manager).
4. **Publish Directory**: `dist` (Vite’s default build output).
5. **Environment Variables (Optional)**:
     - If you want the frontend to call your Render domain, add:
     ```bash
     VITE_REACT_APP_API_BASE_URL="https://your-backend.onrender.com/api/v1/"
     ```
6. **Deploy**: Netlify will automatically install dependencies, run build, and serve the `dist/` folder at a generated subdomain (e.g., `https://my-app.netlify.app`).

---

## 5. Connecting Frontend & Backend

Once both services are live:

1. Set the API Base URL in the frontend environment variable:
     - `VITE_REACT_APP_API_BASE_URL = https://your-backend.onrender.com/api/v1/`
2. Redeploy the frontend so that it uses the correct base URL for API calls.

---

## 6. Testing the Production Setup

1. **Open Your Netlify URL**: `https://my-app.netlify.app`
2. **Attempt to Log In / Fetch Data**: The React app should successfully call the Render API.
3. **Check Browser DevTools** if there are CORS or network errors. If so:
     - Ensure you have `django-cors-headers` configured and `CORS_ALLOW_ALL_ORIGINS` or the appropriate domain whitelisting in `settings.py`.

---

## 7. Common Issues

1. **Free Tier Cold Start (Render)**
     - If you’re on Render’s free tier, your backend may go to sleep if inactive. This can cause a brief startup delay (30-50 seconds).
     - You might display a small loading message in the frontend or note this in your docs.
2. **Incorrect Build Commands**
     - Double-check that your Netlify build command matches your `package.json` script name.
     - Confirm that Render’s build command is installing Python dependencies, migrating, and collecting static files.
3. **Missing Environment Variables**
     - If your app fails to connect to the database or use third-party services, confirm env vars are set on the correct platform (Render for backend, Netlify for frontend).
4. **CORS Errors**
     - Make sure your Django settings include:
     ```python
     INSTALLED_APPS = [
          ...
          'corsheaders',
     ]
     MIDDLEWARE = [
          'corsheaders.middleware.CorsMiddleware',
          ...
     ]
     CORS_ALLOW_ALL_ORIGINS = True  # or restrict to your Netlify domain
     ```
     Redeploy if you make changes to these settings.

---

## 8. Wrapping Up

By following these steps:

1. **Backend on Render**: You have a live Django REST API with a PostgreSQL database, environment variables, static files managed by WhiteNoise, and optional Cloudinary for media.
2. **Frontend on Netlify**: You have a React + Vite project that’s compiled and served as static files with environment variables pointing to the Render backend.

Users access the Netlify URL, which loads the React app, then communicates with the Render-based Django API. For further automation, you can enable continuous deployment on both Netlify and Render so that every push to main triggers a new build and deploy.

