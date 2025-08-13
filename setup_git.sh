#!/bin/bash

# Script to set up git repository and push to GitHub

echo "🚀 Setting up Git repository..."

# Navigate to project directory
cd /Users/globalactionmarketing/Downloads/hoops-prospect-c30b1e20

# Initialize git if not already initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing new git repository..."
    git init
else
    echo "✅ Git repository already exists"
fi

# Add remote origin
echo "🔗 Adding remote origin..."
git remote remove origin 2>/dev/null  # Remove if exists
git remote add origin https://github.com/TechEqualizer/Sportlink.git

# Show current status
echo "📊 Current git status:"
git status

# Add all files
echo "📝 Adding all files to git..."
git add .

# Create commit with all changes
echo "💾 Creating commit..."
git commit -m "Complete application update: Badge system, remove dark mode, clean up demo data

- Add comprehensive badge achievement system in Performance tab
- Remove dark mode functionality for cleaner interface  
- Remove demo data loading options
- Add player benchmark visualization
- Implement achievement statistics and progress tracking"

# Set up main branch
git branch -M main

# Push to GitHub
echo "🚀 Pushing to GitHub..."
echo "You'll need to enter your GitHub username and personal access token"
git push -u origin main

echo "✅ Done! Your code should now be on GitHub!"