# Getting Started with the React Project

This guide will help you set up and run the React frontend project, even if you're new to React.

---

## 📋 Prerequisites

Before you start, make sure you have these installed on your computer:

### 1. **Node.js** (JavaScript runtime)
- **Download**: [https://nodejs.org/](https://nodejs.org/)
- **Required Version**: 20.19+ or 22.12+ (Download the LTS version)
- **Check if installed**: Open PowerShell and type:
  ```powershell
  node --version
  ```
  You should see something like `v20.19.0` or higher

### 2. **npm** (Package manager - comes with Node.js)
- **Check if installed**:
  ```powershell
  npm --version
  ```
  You should see something like `10.8.2`


## 🚀 Step-by-Step Setup

### Step 1: Clone the Repository (If you haven't already)
```
```

### Step 3: Navigate to the Frontend Folder

The React app is inside the `frontend` folder:

```powershell
cd frontend
```

### Step 4: Install Dependencies

This downloads all the packages the project needs:

```powershell
npm install --legacy-peer-deps
```

⏳ **This might take a few minutes the first time.**

### Step 5: Run the Development Server

Start the React app:

```powershell
npm run dev
```

✅ **Success!** You should see something like:

```
  VITE v5.4.11  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Step 6: Open in Browser

1. Open your web browser (Chrome, Firefox, Edge, etc.)
2. Go to: **http://localhost:5173/**
3. You should see the website running! 🎉

---

## 🛠️ Common Commands

Once you're in the `frontend` folder, use these commands:

| Command | What it does |
|---------|--------------|
| `npm run dev` | Starts the development server (use this to run the app) |
| `npm run build` | Creates a production build (for deployment) |
| `npm run preview` | Preview the production build locally |
| `npm install` | Installs all project dependencies |

---

## 📁 Project Structure (What's What)

```
frontend/
├── src/                           # Source code (where you write code)
│   ├── pages/                     # Different pages of the website
│   │   ├── Home.jsx              # Home page
│   │   ├── DocumentDetails.jsx   # Document details page
│   │   └── AboutUs.jsx           # About Us page
│   │
│   ├── components/                # Reusable UI pieces
│   │   ├── common/               # Generic components (buttons, cards, etc.)
│   │   └── features/             # Feature-specific components
│   │
│   ├── routes/                    # Navigation/routing setup
│   │   └── AppRoutes.jsx         # Defines all page routes
│   │
│   ├── services/                  # API calls (backend communication)
│   ├── hooks/                     # Custom React hooks
│   ├── context/                   # Global state management
│   ├── utils/                     # Helper functions
│   ├── constants/                 # Constants and configuration
│   ├── layouts/                   # Page layouts
│   │
│   ├── App.jsx                    # Main app component
│   ├── main.jsx                   # App entry point
│   └── App.css                    # Global styles
│
├── public/                        # Static files (images, etc.)
├── package.json                   # Project dependencies and scripts
├── vite.config.js                # Vite configuration
└── index.html                     # HTML template
```

---

## 🎯 Your First Task: Making a Small Change

Let's make a simple change to verify everything works:

### 1. Open the project in VS Code:

```powershell
code .
```

### 2. Navigate to: `src/pages/Home.jsx`

### 3. Find this line (around line 34):
```jsx
<h1 style={{ marginBottom: '2rem' }}>Government Procedures</h1>
```

### 4. Change it to:
```jsx
<h1 style={{ marginBottom: '2rem' }}>Government Procedures - Welcome!</h1>
```

### 5. Save the file (Ctrl+S)

### 6. Check your browser - it should automatically update! ✨

This is called **Hot Module Replacement (HMR)** - changes appear instantly without refreshing!

---

## 🐛 Troubleshooting Common Issues

### ❌ Problem: "npm is not recognized"
**Solution**: You need to install Node.js. Download from [nodejs.org](https://nodejs.org/) and restart PowerShell.

### ❌ Problem: "Cannot find module" errors
**Solution**: Delete `node_modules` and reinstall:
```powershell
rm -r -Force node_modules
rm -Force package-lock.json
npm install --legacy-peer-deps
```

### ❌ Problem: Port 5173 is already in use
**Solution**: Another app is using that port. Either:
- Close the other app
- Or Vite will suggest a different port automatically (like 5174)

### ❌ Problem: Node.js version too old
**Solution**: Your Node.js version is below 20.19. Download the latest LTS version from [nodejs.org](https://nodejs.org/).

### ❌ Problem: Changes not appearing in browser
**Solution**: 
1. Hard refresh the browser (Ctrl+Shift+R or Ctrl+F5)
2. Check the PowerShell terminal for errors
3. Stop the server (Ctrl+C) and run `npm run dev` again

---

## 📚 Understanding React Basics

### What is React?
React is a JavaScript library for building user interfaces. Think of it as building blocks for websites.

### Key Concepts:

#### 1. **Components** (Building Blocks)
Components are reusable pieces of UI. Like LEGO blocks!

```jsx
// A simple component
function Welcome() {
  return <h1>Hello, World!</h1>;
}
```

#### 2. **JSX** (HTML-like syntax in JavaScript)
JSX lets you write HTML-like code in JavaScript:

```jsx
const element = <h1>This is JSX!</h1>;
```

#### 3. **Props** (Passing data to components)
Props are like function parameters for components:

```jsx
function Greeting(props) {
  return <h1>Hello, {props.name}!</h1>;
}

// Usage:
<Greeting name="Amel" />
```

#### 4. **State** (Component memory)
State lets components "remember" things:

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}
```

---

## 🔄 Git Workflow (Working with the Team)

### Daily Workflow:

#### 1. **Start of the day** - Get latest changes:
```powershell
git pull origin main
```

#### 2. **Make changes** - Edit files in VS Code

#### 3. **Save your work** - Commit changes:
```powershell
# See what files changed
git status

# Add all changes
git add .

# Commit with a message
git commit -m "Added new feature to Home page"
```

#### 4. **Share your work** - Push to GitHub:
```powershell
# Push to your branch
git push origin YourBranchName

# Example:
git push origin Saidouni-Amel
```

#### 5. **Before pushing** - Make sure the app still works:
```powershell
npm run dev
# Test in browser
# If everything works, push!
```

---

## 📖 Helpful Resources for Learning React

### Official Documentation:
- **React Docs**: [https://react.dev/](https://react.dev/)
- **React Router**: [https://reactrouter.com/](https://reactrouter.com/)

### Video Tutorials (Beginner-Friendly):
- **React Tutorial for Beginners**: [YouTube - Programming with Mosh](https://www.youtube.com/watch?v=SqcY0GlETPk)
- **React Course**: [YouTube - freeCodeCamp](https://www.youtube.com/watch?v=bMknfKXIFA8)

### Interactive Learning:
- **React Tutorial**: [https://react.dev/learn](https://react.dev/learn)
- **Scrimba React Course**: [https://scrimba.com/learn/learnreact](https://scrimba.com/learn/learnreact)

---

## 💡 Quick Tips

1. **Always work in your own branch** - Never commit directly to `main`
2. **Save often** (Ctrl+S) - React updates automatically when you save
3. **Check the terminal** - Errors appear there
4. **Read error messages** - They usually tell you what's wrong
5. **Ask for help** - No question is too small!
6. **Test before pushing** - Make sure your changes work

---

## 📞 Need Help?

If you're stuck:
1. Check the terminal for error messages
2. Read the error carefully - it often tells you the solution
3. Google the error message
4. Ask a teammate
5. Check the `ARCHITECTURE.md` file for project structure details

---

## ✅ Checklist: Are You Ready?

Before you start coding, make sure:

- [ ] Node.js is installed (version 20.19+)
- [ ] You've cloned the repository
- [ ] You're on your own branch (not `main`)
- [ ] You're in the `frontend` folder
- [ ] You've run `npm install --legacy-peer-deps`
- [ ] The dev server runs successfully (`npm run dev`)
- [ ] The website opens in your browser at `http://localhost:5173`
- [ ] You can see your changes when you edit files

---

**You're all set! Happy coding! 🚀**

Remember: Everyone was a beginner once. Don't be afraid to experiment and make mistakes - that's how you learn!
