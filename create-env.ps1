$envContent = "VITE_FIREBASE_API_KEY=AIzaSyAiteO9PgdFDWrWK6gixSbkGlZB5Y904rU`r`n"
$envContent += "VITE_FIREBASE_AUTH_DOMAIN=anjali-672fc.firebaseapp.com`r`n"
$envContent += "VITE_FIREBASE_PROJECT_ID=anjali-672fc`r`n"
$envContent += "VITE_FIREBASE_STORAGE_BUCKET=anjali-672fc.firebasestorage.app`r`n"
$envContent += "VITE_FIREBASE_MESSAGING_SENDER_ID=865437591429`r`n"
$envContent += "VITE_FIREBASE_APP_ID=1:865437591429:web:88baa841420269876bc6ec`r`n"
$envContent += "`r`n"
$envContent += "VITE_RAZORPAY_KEY_ID=`r`n"

[System.IO.File]::WriteAllText("$PWD\.env", $envContent, [System.Text.Encoding]::UTF8)

Write-Host ".env file created with UTF-8 encoding!" -ForegroundColor Green
Write-Host "Restart your dev server now" -ForegroundColor Yellow
