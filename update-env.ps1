$envContent = @"
VITE_FIREBASE_API_KEY=AIzaSyAiteO9PgdFDWrWK6gixSbkGlZB5Y904rU
VITE_FIREBASE_AUTH_DOMAIN=anjali-672fc.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=anjali-672fc
VITE_FIREBASE_STORAGE_BUCKET=anjali-672fc.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=865437591429
VITE_FIREBASE_APP_ID=1:865437591429:web:88baa841420269876bc6ec

VITE_RAZORPAY_KEY_ID=
"@

$envContent | Out-File -FilePath ".env" -Encoding UTF8 -NoNewline
Write-Host ".env file updated successfully!" -ForegroundColor Green
Write-Host "Please restart your development server." -ForegroundColor Yellow
