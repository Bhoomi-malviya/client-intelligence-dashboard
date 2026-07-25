#!/bin/bash
echo "🚀 Pushing to GitHub..."
git push https://Bhoomi-malviya:$GITHUB_TOKEN@github.com/Bhoomi-malviya/client-intelligence-dashboard.git main
if [ $? -eq 0 ]; then
  echo "✅ Successfully pushed to GitHub!"
  echo "👉 View your repo: https://github.com/Bhoomi-malviya/client-intelligence-dashboard"
else
  echo "❌ Push failed. Please make sure GITHUB_TOKEN secret is set with a valid token."
fi
