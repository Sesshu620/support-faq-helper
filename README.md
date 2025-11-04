# Crypto Station - Contact Form Setup Guide

## 📁 Files Created

1. **privacy-policy.html** - Privacy Policy page
2. **about.html** - About Us page
3. **contact.html** - Contact form page
4. **send-contact.php** - PHP script to handle form submissions

## 🚀 Installation Instructions for Xserver

### Step 1: Upload Files

1. Connect to your Xserver via FTP (FileZilla, FFFTP, etc.)

   - Host: Your Xserver FTP hostname
   - Username: Your FTP username
   - Password: Your FTP password

2. Navigate to your website's public directory (usually `public_html` or `www`)

3. Upload all 4 files:
   - privacy-policy.html
   - about.html
   - contact.html
   - send-contact.php

### Step 2: Set File Permissions

Set the correct permissions for the PHP file:

- **send-contact.php**: Set to `644` or `755`

You can set permissions via:

- FTP client (right-click → File Permissions)
- Xserver file manager
- SSH command: `chmod 644 send-contact.php`

### Step 3: Test the Contact Form

1. Visit: `https://crypto-station.org/contact.html`
2. Fill out the form with test data
3. Click "Send Message"
4. Check your email at info@crypto-station.org

### Step 4: Update Existing Pages

Add the new navigation links to your existing pages (index.html, cards.html, crypto-tax.html, ada-comparison.html):

```html
<nav class="nav-menu">
  <div class="nav-container">
    <ul class="nav-links">
      <li><a href="index.html">Home</a></li>
      <li><a href="cards.html">Crypto Cards</a></li>
      <li><a href="crypto-tax.html">Tax Information</a></li>
      <li><a href="ada-comparison.html">ADA Comparison</a></li>
      <li><a href="about.html">About</a></li>
      <li><a href="contact.html">Contact</a></li>
      <li><a href="privacy-policy.html">Privacy Policy</a></li>
    </ul>
  </div>
</nav>
```

### Step 5: Add Footer to Existing Pages

Add this footer section to your existing pages before the closing `</body>` tag:

```html
<footer class="footer">
  <div class="footer-links">
    <a href="index.html">Home</a>
    <a href="about.html">About</a>
    <a href="contact.html">Contact</a>
    <a href="privacy-policy.html">Privacy Policy</a>
  </div>
  <p>&copy; 2025 Crypto Station. All rights reserved.</p>
</footer>
```

And add the footer CSS to your existing pages' style sections:

```css
.footer {
  text-align: center;
  padding: 2rem 0;
  color: var(--text-secondary);
  border-top: 1px solid var(--border-color);
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.footer-links a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.footer-links a:hover {
  text-decoration: underline;
}
```

## ⚙️ Xserver-Specific Configuration

### Option A: Using Xserver's Default PHP Mail Function (Recommended)

The provided `send-contact.php` uses PHP's standard `mail()` function, which works out-of-the-box on Xserver.

**No additional configuration needed!**

### Option B: Enhanced Configuration (Optional)

If you want to improve deliverability, you can:

1. **SPF Record**: Add SPF record to your domain DNS
2. **DKIM**: Enable DKIM in Xserver control panel
3. **SMTP**: Use Xserver's SMTP server (requires additional PHP configuration)

## 🔒 Security Features Included

✅ Input sanitization
✅ Email validation
✅ Honeypot spam protection (hidden field)
✅ XSS protection
✅ IP address logging
✅ Timestamp logging

## 📝 Optional Enhancements

### 1. Add Honeypot Field (Spam Protection)

Add this hidden field to contact.html (inside the form):

```html
<div style="position: absolute; left: -5000px;">
  <input type="text" name="website" tabindex="-1" autocomplete="off" />
</div>
```

### 2. Add reCAPTCHA (Google Protection)

1. Get reCAPTCHA keys from: https://www.google.com/recaptcha/
2. Add reCAPTCHA script to contact.html
3. Update send-contact.php to verify reCAPTCHA token

### 3. Email Notification Customization

Edit `send-contact.php` line 60 to change the recipient:

```php
$to = "info@crypto-station.org"; // Change this to your email
```

### 4. Auto-reply to Users

Add this code after line 79 in `send-contact.php`:

```php
// Send auto-reply to user
$user_subject = "Thank you for contacting Crypto Station";
$user_message = "Hello " . $name . ",\n\n";
$user_message .= "Thank you for contacting Crypto Station. We have received your message and will respond within 24-48 hours.\n\n";
$user_message .= "Your message:\n" . $message . "\n\n";
$user_message .= "Best regards,\nCrypto Station Team";

$user_headers = "From: info@crypto-station.org\r\n";
mail($email, $user_subject, $user_message, $user_headers);
```

## 🐛 Troubleshooting

### Problem: Form not sending emails

**Solution 1**: Check PHP error logs in Xserver control panel
**Solution 2**: Verify email address in send-contact.php
**Solution 3**: Check spam folder
**Solution 4**: Contact Xserver support to ensure mail() function is enabled

### Problem: 500 Internal Server Error

**Solution**: Check file permissions (should be 644 or 755)

### Problem: Emails going to spam

**Solution**: Set up SPF and DKIM records in your domain DNS settings

## 📧 Testing Checklist

- [ ] Form loads correctly
- [ ] All fields are required
- [ ] Email validation works
- [ ] Form submission shows success message
- [ ] Email is received at info@crypto-station.org
- [ ] Reply-To address is set correctly
- [ ] Form resets after successful submission
- [ ] Error messages display correctly
- [ ] Dark mode works properly

## 🎯 Google AdSense Requirements

All three pages include:

- ✅ Clear navigation
- ✅ Professional design
- ✅ Privacy Policy with AdSense disclosure
- ✅ Contact information
- ✅ About page with site purpose
- ✅ Working contact form
- ✅ Footer with links

## 📊 Monitoring

The PHP script creates a log file: `contact_logs.txt`

This file tracks:

- Timestamp
- Name
- Email
- Subject

**Note**: Make sure this file is not publicly accessible. Add to .htaccess:

```
<Files "contact_logs.txt">
    Order Allow,Deny
    Deny from all
</Files>
```

## 🔗 Support

For additional help:

- Xserver Support: https://www.xserver.ne.jp/support/
- PHP Mail Function: https://www.php.net/manual/en/function.mail.php

---

**Created for**: Crypto Station (crypto-station.org)
**Date**: November 4, 2025
**Version**: 1.0
