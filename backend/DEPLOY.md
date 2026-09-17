# Deploying CashFlow API to Vercel

Step-by-step guide for deploying the Flask backend to Vercel.

## Prerequisites

- GitHub account with the repository pushed
- Vercel account (free tier works)
- Python 3.12+ installed locally

## Step 1: Push to GitHub

Make sure all files are committed and pushed:

```bash
git add .
git commit -m "ready for deployment"
git push
```

## Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Click **"Import Git Repository"**
4. Select `Omatsulijoshua/Wema-Cash-Flow`
5. Click **"Import"**

## Step 3: Configure the Project

Vercel should auto-detect the configuration from `vercel.json`. If not, set these manually:

**Framework Preset:** Other

**Root Directory:** `./`

**Build Command:** *(leave empty)*

**Output Directory:** *(leave empty)*

**Install Command:**

```bash
pip install -r requirements.txt
```

## Step 4: Environment Variables

No environment variables are required for the basic deployment. The `PORT` variable is automatically set by Vercel.

## Step 5: Deploy

1. Click **"Deploy"**
2. Wait for the build to complete
3. Vercel will provide a URL like `https://wema-cash-flow-xxxxx.vercel.app`

## Step 6: Verify

Test the deployed endpoints:

```bash
curl https://your-deployment-url.vercel.app/
curl https://your-deployment-url.vercel.app/api/health
curl https://your-deployment-url.vercel.app/api/test
```

Expected response from `/api/health`:

```json
{
  "status": "ok",
  "service": "cashflow-api"
}
```

## How It Works

The `vercel.json` configuration routes all requests to `backend/api/index.py`, which imports the Flask app from `backend/app.py`:

```
Request → vercel.json → backend/api/index.py → Flask app
```

## Updating the Deployment

Every push to `master` automatically triggers a new deployment on Vercel.

```bash
git add .
git commit -m "your changes"
git push
```

## Custom Domain (Optional)

1. Go to your project settings on Vercel
2. Click **"Domains"**
3. Add your custom domain
4. Update your DNS records as instructed

## Troubleshooting

**500 Error:**
- Check that `requirements.txt` is in the root directory
- Verify `vercel.json` points to `backend/api/index.py`

**404 Error:**
- Ensure `vercel.json` routes are correct
- Check that `backend/api/index.py` exists

**Build Failed:**
- Make sure all dependencies are listed in `requirements.txt`
- Check the Vercel build logs for errors

## Local Testing Before Deploy

```bash
# From the project root
python backend/app.py

# Test in another terminal
curl http://localhost:5000/api/health
```
