cd website
rm -rf build
rm -rf ../server/website_build
npm run build
mv build ../server/website_build/
