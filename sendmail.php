<?php
// sendmail.php - contact form mailer
header('Content-Type: application/json; charset=utf-8');

// Load secrets from config.local.php (not committed to git)
$configFile = __DIR__ . '/config.local.php';
if (file_exists($configFile)) {
  require $configFile;
}
if (!defined('MAIL_RECIPIENT')) {
  define('MAIL_RECIPIENT', 'Corine@wolservewc.co.za');
}

function respond($success, $error = null) {
  $out = ['success' => $success];
  if ($error) { $out['error'] = $error; }
  echo json_encode($out);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  respond(false, 'Invalid request method.');
}

// Honeypot
if (!empty($_POST['_gotcha'])) {
  respond(false, 'Spam detected.');
}

// Collect fields
$name    = trim($_POST['name'] ?? '');
$phone   = trim($_POST['phone'] ?? '');
$email   = trim($_POST['email'] ?? '');
$time    = trim($_POST['preferred_time'] ?? '');
$message = trim($_POST['message'] ?? '');

if ($name === '' || $phone === '') {
  respond(false, 'Name and phone number are required.');
}

// Strip line breaks from single-line fields to prevent header injection
$clean = function ($s) {
  return trim(preg_replace('/[\r\n]+/', ' ', strip_tags($s)));
};
$name  = $clean($name);
$phone = $clean($phone);
$time  = $clean($time);
$validEmail = filter_var($email, FILTER_VALIDATE_EMAIL) ? $email : '';
$message = strip_tags($message);

$subject = 'Website callback request from ' . $name;
$body  = "New callback request:\n\n";
$body .= "Name: $name\n";
$body .= "Phone: $phone\n";
$body .= 'Email: ' . ($validEmail ?: 'not provided') . "\n";
$body .= 'Preferred time: ' . ($time ?: 'Anytime') . "\n\n";
$body .= "Note:\n" . ($message ?: '-') . "\n";

$host = preg_replace('/^www\./', '', $_SERVER['SERVER_NAME'] ?? 'localhost');
$headers = [
  'From: Wolserve Website <no-reply@' . $host . '>',
  'Content-Type: text/plain; charset=UTF-8'
];
if ($validEmail) {
  $headers[] = 'Reply-To: ' . $validEmail;
}

$sent = mail(MAIL_RECIPIENT, $subject, $body, implode("\r\n", $headers));

if (!$sent) {
  http_response_code(500);
  respond(false, 'Could not send the message. Please phone us instead.');
}

// Optional confirmation copy to the visitor
if ($validEmail) {
  $copyBody = "Hi $name,\n\nThank you - we received your callback request and will contact you soon.\n\nWolserve Western Cape (Pty) Ltd";
  @mail($validEmail, 'We received your callback request', $copyBody,
    'From: Wolserve Website <no-reply@' . $host . ">\r\nContent-Type: text/plain; charset=UTF-8");
}

respond(true);
