@echo off
echo Creating .env file with correct Firebase configuration...
(
echo # Firebase Configuration - Your Actual Values
echo VITE_FIREBASE_API_KEY=AIzaSyAiteO9PgdFDWrWK6gixSbkGlZB5Y904rU
echo VITE_FIREBASE_AUTH_DOMAIN=anjali-672fc.firebaseapp.com
echo VITE_FIREBASE_PROJECT_ID=anjali-672fc
echo VITE_FIREBASE_STORAGE_BUCKET=anjali-672fc.firebasestorage.app
echo VITE_FIREBASE_MESSAGING_SENDER_ID=865437591429
echo VITE_FIREBASE_APP_ID=1:865437591429:web:88baa841420269876bc6ec
echo.
echo # Razorpay Configuration (Leave empty for now)
echo VITE_RAZORPAY_KEY_ID=
) > .env

echo .env file created successfully!
echo Please restart your development server (npm run dev)
pause
