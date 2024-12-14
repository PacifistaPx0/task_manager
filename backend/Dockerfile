# Use the official Python image as a base
FROM python:3.12-slim


# Set this environment variable, for debugging purposes in development(remove for production)
ENV PYTHONUNBUFFERED = 1 

# Set the working directory in the container
WORKDIR /app

# Install dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend project files into the container
COPY . /app/

# Expose the application port
EXPOSE 8000

# Run the Django development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]