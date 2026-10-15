<?php
// admin/upload-newsletter.php - password-protected newsletter PDF upload (requires PHP hosting).
// Set NEWSLETTER_ADMIN_HASH in config.local.php (project root) to the output of:
//   php -r "echo password_hash('your-password', PASSWORD_DEFAULT);"
$configFile = dirname(__DIR__) . '/config.local.php';
if (file_exists($configFile)) {
  require $configFile;
}

$root = dirname(__DIR__);
$dir  = $root . '/newsletters';
$json = $dir . '/newsletters.json';
$message = '';
$ok = false;

function h($s) { return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $title = trim(preg_replace('/\s+/', ' ', strip_tags($_POST['title'] ?? '')));
  $date  = trim(preg_replace('/\s+/', ' ', strip_tags($_POST['date'] ?? '')));
  $pass  = $_POST['password'] ?? '';
  $file  = $_FILES['pdf'] ?? null;

  if (!defined('NEWSLETTER_ADMIN_HASH') || NEWSLETTER_ADMIN_HASH === '') {
    $message = 'Uploads are disabled: NEWSLETTER_ADMIN_HASH is not set in config.local.php.';
  } elseif (!password_verify($pass, NEWSLETTER_ADMIN_HASH)) {
    usleep(500000);
    $message = 'Incorrect password.';
  } elseif ($title === '' || $date === '') {
    $message = 'Please enter a title and a date label.';
  } elseif (!$file || $file['error'] !== UPLOAD_ERR_OK || !is_uploaded_file($file['tmp_name'])) {
    $message = 'Please choose a PDF file to upload.';
  } elseif ($file['size'] > 25 * 1024 * 1024) {
    $message = 'The PDF is larger than 25 MB.';
  } else {
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime  = $finfo->file($file['tmp_name']);
    $ext   = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if ($mime !== 'application/pdf' || $ext !== 'pdf') {
      $message = 'Only PDF files are accepted.';
    } else {
      $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9]+/', '-', $title . '-' . $date), '-'));
      $name = $slug . '-' . date('YmdHis') . '.pdf';
      if (!is_dir($dir) && !mkdir($dir, 0755, true)) {
        $message = 'Could not create the newsletters folder.';
      } elseif (!move_uploaded_file($file['tmp_name'], $dir . '/' . $name)) {
        $message = 'Could not save the uploaded file.';
      } else {
        $fh = fopen($json, 'c+');
        flock($fh, LOCK_EX);
        $items = json_decode(stream_get_contents($fh), true);
        if (!is_array($items)) { $items = []; }
        array_unshift($items, ['title' => $title, 'date' => $date, 'file' => 'newsletters/' . $name]);
        ftruncate($fh, 0);
        rewind($fh);
        fwrite($fh, json_encode($items, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . "\n");
        fflush($fh);
        flock($fh, LOCK_UN);
        fclose($fh);
        $ok = true;
        $message = 'Newsletter uploaded. It now appears in the archive on newsletter.html.';
      }
    }
  }
}
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <title>Upload newsletter — Wolserve Western Cape</title>
  <link rel="stylesheet" href="../styles.css">
</head>
<body class="contact-page">
  <main class="section">
    <div class="container contact-wrap">
      <div class="contact-panel">
        <h1 class="contact-subhead">Upload a newsletter PDF</h1>
        <?php if ($message): ?>
          <p class="form-status" role="status" style="<?php echo $ok ? '' : 'color:#b03a3a'; ?>"><?php echo h($message); ?></p>
        <?php endif; ?>
        <form class="contact-form" method="POST" enctype="multipart/form-data">
          <div class="field"><label for="title">Title</label><input id="title" name="title" type="text" required></div>
          <div class="field"><label for="date">Date label (e.g. November 2026)</label><input id="date" name="date" type="text" required></div>
          <div class="field"><label for="pdf">PDF file</label><input id="pdf" name="pdf" type="file" accept="application/pdf" required></div>
          <div class="field"><label for="password">Admin password</label><input id="password" name="password" type="password" required autocomplete="current-password"></div>
          <div class="form-actions"><button type="submit" class="btn btn-primary">Upload</button> <a href="../newsletter.html">Back to newsletter page</a></div>
        </form>
      </div>
    </div>
  </main>
</body>
</html>
