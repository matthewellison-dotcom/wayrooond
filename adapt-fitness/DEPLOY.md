# Adapt Fitness — Deployment Guide

## What you're deploying
- Next.js app (React frontend you already built)
- One serverless API route at /api/ai that talks to Anthropic
- Hosted free on Vercel
- Your API key stays on the server, never exposed to users

---

## Step 1 — Install Node.js (if you don't have it)

Go to https://nodejs.org and download the LTS version.
To check it's working, open Terminal and type:
  node --version

You should see something like v20.x.x

---

## Step 2 — Get your Anthropic API key

1. Go to https://console.anthropic.com
2. Sign in or create an account
3. Click "API Keys" in the left sidebar
4. Click "Create Key"
5. Copy the key — it starts with sk-ant-
6. Keep this secret. Never share it, never put it in GitHub.

---

## Step 3 — Set up the project

Open Terminal and run these commands one by one:

  cd ~/Desktop
  mv adapt-fitness adapt-fitness-app   # rename the folder you got
  cd adapt-fitness-app
  npm install

This installs all dependencies. Takes 1-2 minutes.

---

## Step 4 — Add your API key locally

Open the file called .env.local in the project folder.
Replace the placeholder with your real key:

  ANTHROPIC_API_KEY=sk-ant-your-actual-key-here

Save the file.

---

## Step 5 — Test it locally first

In Terminal, from inside the project folder:

  npm run dev

Open your browser and go to http://localhost:3000
The app should load and the AI features should work.

If it works locally, you're good to deploy.
Press Ctrl+C to stop the local server.

---

## Step 6 — Push to GitHub

You need a GitHub account. Create one free at https://github.com

In Terminal:
  git init
  git add .
  git commit -m "Initial commit"

Then on GitHub:
1. Click the + button top right
2. New repository
3. Name it adapt-fitness
4. Click Create repository
5. Follow the instructions GitHub gives you to push existing repo
   (it'll be two commands starting with git remote add...)

IMPORTANT: Make sure .gitignore includes .env.local
Your API key must NOT go to GitHub.

---

## Step 7 — Deploy to Vercel

1. Go to https://vercel.com and sign in with GitHub
2. Click "Add New Project"
3. Import your adapt-fitness repository
4. Vercel auto-detects Next.js — don't change any settings
5. Before clicking Deploy, click "Environment Variables"
6. Add:
   Name:  ANTHROPIC_API_KEY
   Value: sk-ant-your-actual-key-here
7. Click Deploy

It takes about 60 seconds. You'll get a URL like:
  https://adapt-fitness-xyz.vercel.app

That's your live app.

---

## Step 8 — Custom domain (optional, free)

In Vercel dashboard:
1. Go to your project settings
2. Click Domains
3. Add your domain if you have one
   OR use the free .vercel.app URL for now

---

## Costs

Vercel hosting:       Free (Hobby tier is plenty)
Anthropic API:        ~$0.003 per AI conversation
                      1000 users/day = ~£2/month
Domain (optional):    ~£10/year from Namecheap or Cloudflare

Total to run this:    Basically £0 until you have real users

---

## When something breaks

Check Vercel dashboard -> your project -> Functions tab
It shows logs for every API call and any errors.

Most common issue: API key wrong or not set in Vercel env vars.
Fix: Vercel dashboard -> Settings -> Environment Variables -> check it's there.

---

## Making updates

Every time you push to GitHub, Vercel auto-deploys in ~60 seconds.

  # Make your changes in the code
  git add .
  git commit -m "describe what you changed"
  git push

That's it. Live in a minute.

---

## File structure reference

adapt-fitness/
├── src/
│   ├── app/
│   │   ├── layout.js          # HTML wrapper
│   │   ├── page.js            # Root page (renders App)
│   │   └── api/
│   │       └── ai/
│   │           └── route.js   # THE IMPORTANT ONE - handles all AI calls
│   └── components/
│       └── App.js             # Your entire frontend
├── .env.local                 # API key (never commit this)
├── .gitignore                 # Tells git to ignore .env.local
├── next.config.js
└── package.json
