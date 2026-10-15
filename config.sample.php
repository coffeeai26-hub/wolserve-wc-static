<?php
// Copy this file to config.local.php on your server and fill in real values.
// config.local.php is git-ignored so your settings are never committed.

define('MAIL_RECIPIENT', 'Corine@wolservewc.co.za');

// Newsletter upload (admin/upload-newsletter.php). Generate the hash with:
//   php -r "echo password_hash('your-password', PASSWORD_DEFAULT);"
define('NEWSLETTER_ADMIN_HASH', '');
