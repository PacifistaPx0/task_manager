# Django Backend Setup

This guide will help you quickly set up and run the **Django REST Framework** backend for the **Task Management System**. By the end of these steps, you’ll have a working local environment configured for PostgreSQL (or any database supported by `dj_database_url`).

---

## 1. Prerequisites

1. **Python 3.9+**
2. **PostgreSQL** (or an alternative database if you have a remote/PostgreSQL server)
3. **Git** (to clone the repository)
4. An **.env** file or environment variables configured for secrets and DB credentials (using `python-decouple`)

---

## 2. Clone the Repository

If you haven’t already, clone the main repository (which contains both backend and frontend):

```bash
git clone https://github.com/PacifistaPx0/task_manager.git
cd backend
```

---

## 3. Create and Activate a Virtual Environment

It's recommended to create a Python virtual environment so dependencies don’t conflict with other projects:

```bash
# On macOS/Linux
python -m venv venv
source venv/bin/activate

# On Windows
python -m venv venv
venv\Scripts\activate
```

---

## 4. Install Dependencies

Navigate to the `backend/` folder and install the required packages from `requirements.txt`:

```bash
cd backend
pip install -r requirements.txt
```

This will install packages like Django, Django REST Framework, dj_database_url, python-decouple, and others:

```bash
asgiref==3.8.1
Django==5.0.7
djangorestframework==3.15.2
...
whitenoise==6.8.2
```

---

## 5. Configure Environment Variables

The project uses **python-decouple** to load environment variables from a file named **`.env`**. You’ll need to create a `.env` file in the **backend** directory (the same folder as `settings.py`). Below is an example of what it might include (adjust values for your local environment):

```bash
# .env file (do NOT commit real secrets to version control)
SECRET_KEY="django-insecure-replace-with-a-real-key"
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost

# PostgreSQL example (local)
DATABASE_URL="postgres://db_user:db_password@127.0.0.1:5432/task_management_db"

# Cloudinary (for media storage)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-cloudinary-key"
CLOUDINARY_API_SECRET="your-cloudinary-secret"

# Mailgun (for sending emails)
MAILGUN_API_KEY="your-mailgun-key"
MAILGUN_SENDER_DOMAIN="your-mailgun-domain"
FROM_EMAIL="no-reply@yourdomain.com"
```

**Note:**
- `SECRET_KEY`: Replace with a secure, randomly generated key.
- `DEBUG`: Should be `False` in production.
- `ALLOWED_HOSTS`: Comma-separated list of hosts or domains that can serve the project.
- `DATABASE_URL`: Points to your local or remote PostgreSQL instance.
- Never commit this `.env` file to public version control.

---

## 6. Database Setup

### Option A: Using `dj_database_url.config`

By default, `dj_database_url.config` in `settings.py` will read from your `DATABASE_URL` environment variable:

```python
DATABASES = {
    'default': dj_database_url.config(
        default=config("DATABASE_URL"), 
        conn_max_age=600
    )
}
```

Ensure that `DATABASE_URL` in your `.env` points to a valid PostgreSQL instance. For example:

```bash
DATABASE_URL="postgres://db_user:db_password@localhost:5432/task_management_db"
```

Confirm that PostgreSQL is running locally or that you have network access to the remote DB.

### Option B: Local DB Settings (Commented Out in `settings.py`)

If you prefer not to use `dj_database_url`, you can uncomment and use the following block in `settings.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST'),
        'PORT': config('DB_PORT', default='5432'),
    }
}
```

And in your `.env`:

```bash
DB_NAME="task_management_db"
DB_USER="postgres"
DB_PASSWORD="..."
DB_HOST="localhost"
DB_PORT="5432"
```

---

## 7. Migrate the Database

After configuring your `.env` and database settings, run migrations:

```bash
python manage.py migrate
```

This will create all the necessary tables for Django’s built-in apps as well as your custom apps (`api`, `task`, `userauths`).

Creating a superuser (for Django admin access), run:

```bash
python manage.py createsuperuser
```

---

## 8. Run the Development Server

Launch the local dev server:

```bash
python manage.py runserver
```

By default, Django will listen on `http://127.0.0.1:8000`. You can visit that URL in your browser to confirm everything is working. If you have Django REST Framework browsable API views configured, you’ll see them.

---

## 9. Static Files and Media

**Static Files:**
- The project uses WhiteNoise (`whitenoise.middleware.WhiteNoiseMiddleware`) for static file handling in production.
- Locally, Django’s dev server serves static files automatically.

**Media Files:**
- For media uploads, the project uses Cloudinary (`cloudinary_storage.storage.MediaCloudinaryStorage`) if `CLOUDINARY_*` env variables are set.
- Check `settings.py` for the `DEFAULT_FILE_STORAGE` configuration.

---

## 10. Useful Commands

- **Install a New Package:**
  ```bash
  pip install <package_name>
  pip freeze > requirements.txt  # update the requirements file
  ```

- **Run Tests:**
  ```bash
  python manage.py test
  # or to check coverage if you use the coverage library
  coverage run manage.py test
  coverage report -m
  ```

- **Compile Messages/Translations (if using i18n features):**
  ```bash
  django-admin makemessages
  django-admin compilemessages
  ```

---

## 11. Troubleshooting

- **Cannot connect to database:**
  - Check if PostgreSQL is running.
  - Verify your `DATABASE_URL` or local DB settings.

- **Missing .env variables:**
  - Make sure `.env` is in the correct directory (same as `settings.py`) and that you have `python-decouple` installed.

- **Static files not loading:**
  - Ensure `whitenoise.middleware.WhiteNoiseMiddleware` is in `MIDDLEWARE`.
  - Run `collectstatic` if you’re simulating a production environment.

- **Email sending issues:**
  - Double-check your Mailgun or other email provider credentials in `.env`.

---

## Conclusion

By following the steps above, you will have a fully functional Django REST backend for the Task Management System. Here’s a quick recap:

1. **Install Dependencies**
   - Use a dedicated Python virtual environment and run `pip install -r requirements.txt` in the `backend/` folder.

2. **Configure Environment Variables**
   - Create a `.env` file (using `python-decouple`) to store sensitive information like `SECRET_KEY`, `DATABASE_URL`, and any third-party credentials.

3. **Migrate the Database**
   - Run `python manage.py migrate` to set up your tables and `python manage.py createsuperuser` if you need admin access.

4. **Run the Server**
   - Launch with `python manage.py runserver` to start the dev server on `http://127.0.0.1:8000`.

5. **Additional Services**
   - WhiteNoise for static files and Cloudinary for media uploads (if configured).
   - CORS headers enabled for cross-origin requests from your React frontend.

At this point, your Django REST Framework API should be ready to handle requests from the frontend or any HTTP client. Refer back to this guide whenever you need to reinstall, reconfigure, or troubleshoot your backend environment. If you encounter any issues, be sure to consult the **Troubleshooting** section, the [Django](https://docs.djangoproject.com/en/5.1/) and [Django Rest Framework](https://www.django-rest-framework.org/) documentation, or your version control history for further clues.
