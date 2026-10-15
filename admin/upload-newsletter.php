<?php
// Admin newsletter upload. Requires PHP hosting (not GitHub Pages).
// Set ADMIN_PASSWORD_HASH in config.local.php (see config.sample.php).
// Protect this folder further (e.g. HTTP basic auth) on the server if possible.
$configFile = __DIR__ . '/../config.local.php';
if (file_exists($configFile)) { require_once $configFile; }

$root = dirname(__DIR__);
$dir = $root . '/newsletters';
$manifest = $dir . '/newsletters.json';
$message = '';
$ok = false;

function h($s) { return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $hash = defined('ADMIN_PASSWORD_HASH') ? ADMIN_PASSWORD_HASH : '';
  $title = trim(preg_replace('/\s+/', ' ', strip_tags($_POST['title'] ?? '')));
  $date = trim(preg_replace('/\s+/', ' ', strip_tags($_POST['date'] ?? '')));
  $file = $_FILES['pdf'] ?? null;

  if ($hash === '' || !password_verify($_POST['password'] ?? '', $hash)) {
    http_response_code(403);
    $message = 'Incorrect password, or admin password not configured.';
  } elseif ($title === '' || $date === '') {
    $message = 'Please enter a title and a date label.';
  } elseif (!$file || $file['error'] !== UPLOAD_ERR_OK || !is_uploaded_file($file['tmp_name'])) {
    $message = 'Please choose a PDF to upload.';
  } else {
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    if ($finfo->file($file['tmp_name']) !== 'application/pdf') {
      $message = 'Only PDF files are accepted.';
    } else {
      $slug = trim(preg_replace('/[^a-z0-9]+/', '-', strtolower($title . ' ' . $date)), '-');
      $name = $slug . '-' . substr(bin2hex(random_bytes(4)), 0, 8) . '.pdf';
      if (!is_dir($dir)) { mkdir($dir, 0755, true); }
      $items = file_exists($manifest) ? json_decode(file_get_contents($manifest), true) : [];
      if (!is_array($items)) { $items = []; }
      if (move_uploaded_file($file['tmp_name'], $dir . '/' . $name)) {
        array_unshift($items, ['title' => $title, 'date' => $date, 'file' => 'newsletters/' . $name]);
        file_put_contents($manifest, json_encode($items, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES), LOCK_EX);
        $ok = true;
        $message = 'Newsletter uploaded. It now appears in the archive.';
      } else {
        $message = 'Could not save the file. Check folder permissions on newsletters/.';
      }
    }
  }
}
?><!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <title>Upload newsletter</title>
  <link rel="stylesheet" href="../styles.css">
</head>
<body>
  <main class="section">
    <div class="container">
      <div class="section-head"><h1>Upload newsletter</h1></div>
      <?php if ($message): ?>
        <p class="form-status" role="status" style="color: <?= $ok ? 'inherit' : '#b03a3a' ?>"><?= h($message) ?></p>
      <?php endif; ?>
      <form class="contact-form" method="POST" enctype="multipart/form-data">
        <div class="field"><label for="title">Title</label><input id="title" name="title" type="text" required value="Wolserve Western Cape Newsletter"></div>
        <div class="field"><label for="date">Date label (e.g. November 2026)</label><input id="date" name="date" type="text" required></div>
        <div class="field"><label for="pdf">PDF file</label><input id="pdf" name="pdf" type="file" accept="application/pdf" required></div>
        <div class="field"><label for="password">Admin password</label><input id="password" name="password" type="password" required autocomplete="current-password"></div>
        <button class="btn btn-primary" type="submit">Upload</button>
      </form>
      <p><a href="../newsletter.html">← Back to newsletter</a></p>
    </div>
  </main>
</body>
</html>
