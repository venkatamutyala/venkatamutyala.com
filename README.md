# venkatamutyala.com RSS Feed Reader
# venkatamutyala.com

A modern, responsive RSS feed reader built with React, Vite, and Tailwind CSS. This single-page application aggregates and displays multiple RSS feeds in an elegant card-based layout.

## Features

- 📰 Multi-feed RSS reader with tab-based navigation
- 🎨 Modern UI with Tailwind CSS styling
- 📱 Fully responsive design (mobile, tablet, desktop)
- ⚡ Lightning-fast with Vite build tool
- 🔄 Auto-refresh functionality
- 🖼️ Image previews with fallback handling
- 🚀 Automated deployment to GitHub Pages

## Local Development

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Setup

1. Clone the repository:
```bash
git clone https://github.com/venkatamutyala/venkatamutyala.com.git
cd venkatamutyala.com
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## GitHub Pages Deployment

### Initial Setup (One-Time Configuration)

To enable automatic deployment to GitHub Pages, follow these steps:

1. **Enable GitHub Pages in your repository:**
   - Go to your repository on GitHub: https://github.com/venkatamutyala/venkatamutyala.com
   - Click on **Settings** → **Pages** (in the left sidebar)
   - Under **Source**, select **GitHub Actions** from the dropdown
   - Click **Save**

2. **Push your code to the main branch:**
```bash
git add .
git commit -m "Initial commit: RSS feed reader"
git push origin main
```

3. **Monitor the deployment:**
   - Go to the **Actions** tab in your GitHub repository
   - You'll see the "Deploy to GitHub Pages" workflow running
   - Once completed (green checkmark), your site will be live

4. **Access your site:**
   - Your site will be available at: `https://venkatamutyala.github.io/venkatamutyala.com/`
   - The first deployment typically takes 2-3 minutes

### Subsequent Deployments

After the initial setup, every push to the `main` branch will automatically trigger a new deployment. Just commit and push your changes:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

## Custom Domain Configuration (Optional)

If you want to use your custom domain `venkatamutyala.com`:

1. **Add a CNAME file:**
```bash
echo "venkatamutyala.com" > public/CNAME
git add public/CNAME
git commit -m "Add custom domain"
git push origin main
```

2. **Configure DNS:**
   - Add a CNAME record in your domain registrar pointing to `venkatamutyala.github.io`
   - Or add A records pointing to GitHub Pages IPs:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`

3. **Update vite.config.js:**
   - Change `base: '/venkatamutyala.com/'` to `base: '/'`

4. **Enable custom domain in GitHub:**
   - Go to Settings → Pages
   - Enter your custom domain
   - Enable "Enforce HTTPS"

## Project Structure

```
venkatamutyala.com/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── src/
│   ├── App.jsx                 # Main RSS feed reader component
│   ├── main.jsx                # React entry point
│   └── index.css               # Tailwind CSS imports
├── index.html                  # HTML template
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
└── postcss.config.js           # PostCSS configuration
```

## Technologies Used

- **React 18** - UI framework
- **Vite 5** - Build tool and dev server
- **Tailwind CSS 3** - Utility-first CSS framework
- **Lucide React** - Icon library
- **GitHub Actions** - CI/CD for automated deployment
- **GitHub Pages** - Static site hosting

## Customizing Feeds

To add or modify RSS feeds, edit the `INITIAL_FEEDS` array in [src/App.jsx](src/App.jsx):

```javascript
const INITIAL_FEEDS = [
  { id: '1', name: 'Your Feed Name', url: 'https://your-feed-url.json' },
  // Add more feeds here
];
```

## License

MIT License - feel free to use this project for your own RSS reader!

## Author

Venkata Mutyala
- Website: [venkatamutyala.com](https://venkatamutyala.com)
- GitHub: [@venkatamutyala](https://github.com/venkatamutyala)
