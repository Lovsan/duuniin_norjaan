# Deployment Guide

This guide will help you deploy the Duuniin Norjaan website to various hosting platforms.

## Option 1: GitHub Pages (Recommended - Free)

1. Go to your repository settings on GitHub
2. Navigate to "Pages" section
3. Under "Source", select your main branch
4. Select the root folder (`/`)
5. Click "Save"
6. Your site will be available at `https://lovsan.github.io/duuniin_norjaan/`

## Option 2: Netlify (Free)

1. Sign up at [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repository
4. Deploy settings:
   - Build command: (leave empty)
   - Publish directory: `/`
5. Click "Deploy"

## Option 3: Vercel (Free)

1. Sign up at [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Deploy settings will be automatically detected
5. Click "Deploy"

## Option 4: Traditional Web Hosting

1. Upload all files (`index.html`, `styles.css`, `script.js`) to your web hosting via FTP
2. Ensure `index.html` is in the root directory
3. Access your website via your domain name

## Custom Domain Setup

After deploying to any platform above:
1. Purchase a domain name (e.g., `worknorway.com`)
2. Follow your hosting platform's documentation to add a custom domain
3. Update DNS settings as instructed

## Post-Deployment

After deployment, consider:
- Setting up a backend for the contact form (currently client-side only)
- Adding analytics (Google Analytics, Plausible, etc.)
- Setting up email notifications for form submissions
- Adding multilingual support (Norwegian, Finnish, English, etc.)

## Contact Form Backend Options

To make the contact form functional, you can:

1. **Formspree** (easiest): Replace the form action with Formspree endpoint
2. **Netlify Forms**: If using Netlify, add `netlify` attribute to form
3. **Custom Backend**: Create an API endpoint to handle form submissions
4. **EmailJS**: Client-side email service

Example with Formspree:
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

## Updating the Site

After deployment, any changes pushed to the main branch will automatically redeploy (for GitHub Pages, Netlify, and Vercel).
