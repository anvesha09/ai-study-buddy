# AI Study Buddy & Quiz Generator

An intelligent web application that leverages the Google Gemini API to automatically generate quizzes and flashcards from any given text, making studying more efficient and interactive.

---

## Core Features

### 1. AI-Powered Content Generation: Paste any text and let the Gemini API create relevant study materials.

### 2. Quiz Generation: Automatically creates multiple-choice questions based on the provided content.

### 3. Flashcard Creation: Generates flashcards with key terms and definitions for quick revision.

### 4. Responsive UI: A clean and modern user interface built with React and Tailwind CSS.

### 5. Containerized & Serverless: Easily deployable anywhere as a Docker container, optimized for Google Cloud Run.
--- 

## Tech Stack

### Frontend: React, Vite, TypeScript

###  Styling: Tailwind CSS

### AI: Google Gemini API

### Containerization: Docker & Nginx

### Deployment: Google Cloud Run, Google Cloud Build, Google Artifact Registry

### Security: Google Secret Manager
---

# Getting Started (Local Development)

## Prerequisites

### 1. Node.js (v20.x or later)
### 2. Git
### 3. A Google Gemini API Key

##Installation & Setup

### 1. Clone the repository:

```git clone https://github.com/anvesha09/ai-study-buddy.git 
cd ai-study-buddy
```

### 2. Install NPM packages:
 
```npm install```

### 3. Set up environment variables:

Create a new file named .env in the root of the project and add your Gemini API key.

``` VITE_GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"```

### 4. Run the development server:

``` npm run dev```

Open (http://localhost:5173) to view it in your browser.
---

##  Deployment to Google Cloud Run

This project is configured for a seamless deployment to Google Cloud Run using Cloud Build.

### Prerequisites

- **A Google Cloud Project with billing enabled.
- **The gcloud CLI installed and authenticated.

## Deployment Steps
### 1. Set up your environment:

Make sure your gcloud CLI is pointing to the correct project.

``` gcloud config set project [YOUR_PROJECT_ID]```
### 2. Store your API Key in Secret Manager:
This command creates a secret named gemini-api-key and stores your key in it.

``` gcloud secrets create gemini-api-key --replication-policy="automatic" 
echo -n "[YOUR_GEMINI_API_KEY_HERE]" | gcloud secrets versions add gemini-api-key --data-file=-
```

### 3. Build the container image using Cloud Build:
This command uses the cloudbuild.yaml file to build your container, passing the API key securely at build-time.
 ``` gcloud builds submit . \ 
  --config=cloudbuild.yaml \
  --substitutions=_GEMINI_API_KEY=$(gcloud secrets versions access latest --secret=gemini-api-key)
```

### 4. Deploy the container to Cloud Run:

This process involves two commands: one to grant permissions and one to deploy the service.

- **First, grant the Cloud Run service account access to the secret. You will need your Project Number for this, which you can get by running gcloud projects describe [YOUR_PROJECT_ID] --format="value(projectNumber)".
``` gcloud secrets add-iam-policy-binding gemini-api-key \
  --member="serviceAccount:[YOUR_PROJECT_NUMBER]-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

- **Finally, deploy the service. This command uses the image you just built and tells Cloud Run to connect to port 80 inside the container. 
``` gcloud run deploy ai-study-buddy-service \
  --image=us-central1-docker.pkg.dev/[YOUR_PROJECT_ID]/my-app-repo/ai-study-buddy \
  --allow-unauthenticated \
  --region=us-central1 \
  --platform=managed \
  --port=80
```
---

### Architecture

- **The frontend is a static single-page application (SPA) built by Vite. The Gemini API key is securely embedded into the static JavaScript files during the build process.

- **The Dockerfile creates a multi-stage build.

- **The builder stage installs dependencies and runs npm run build to create the static dist/ directory.

- **The final stage uses a lightweight Nginx server to serve the static files.

- **Cloud Build reads the cloudbuild.yaml file to automate the entire Docker build process.

- **The final container is deployed as a serverless service on Cloud Run, which automatically handles scaling.



