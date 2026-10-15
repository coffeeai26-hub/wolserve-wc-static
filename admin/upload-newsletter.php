<?php
// Admin newsletter upload (needs PHP hosting; GitHub Pages cannot run this).
// Setup: add define('NEWSLETTER_ADMIN_TOKEN', 'a-long-random-secret'); to config.local.php
// (see config.sample.php). Upload a PDF with a title and a month; it is stored in
// /newsletters and added to newsletters/newsletters.json, which newsletter.html lists.
// Protect /admin with HTTP auth on the server as well if possible.

declare(strict_types=1);

$root = dirname(__DIR__);
if (file_exists($root . '/config.local.php')) {
    require $root . '/config.local.php';
}

$dir = $root . '/newsletters';
$manifest = $dir . '/newsletters.json';
$maxBytes = 25 * 1024 * 1024;
$message = '';
$ok = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $token = defined('NEWSLETTER_ADMIN_TOKEN') ? (string) NEWSLETTER_ADMIN_TOKEN : '';
    $given = (string) ($_POST['token'] ?? '');
    $title = trim((string) ($_POST['title'] ?? ''));
    $month = (string) ($_POST['month'] ?? '');
    $file = $_FILES['pdf'] ?? null;

    if ($token === '' || !hash_equals($token, $given)) {
        http_response_code(403);
        $message = 'Not authorised.';
    } elseif ($title === '' || strlen($title) > 120 || !preg_match('/^\d{4}-(0[1-9]|1[0-2])$/', $month)) {
        $message = 'Enter a title (max 120 characters) and a valid month.';
    } elseif (!$file || $file['error'] !== UPLOAD_ERR_OK || $file['size'] > $maxBytes || !is_uploaded_file($file['tmp_name'])) {
        $message = 'Upload failed or file is larger than 25 MB.';
    } elseif (file_get_contents($file['tmp_name'], false, null, 0, 5) !== '%PDF-') {
        $message = 'Only PDF files are accepted.';
    } else {
        $slug = trim(strtolower((string) preg_replace('/[^A-Za-z0-9]+/', '-', $title)), '-');
        $name = $month . '-' . ($slug !== '' ? $slug : 'newsletter') . '.pdf';
        $fh = fopen($manifest, 'c+');
        if ($fh && flock($fh, LOCK_EX)) {
            $data = json_decode((string) stream_get_contents($fh), true);
            $issues = is_array($data['issues'] ?? null) ? $data['issues'] : [];
            if (move_uploaded_file($file['tmp_name'], $dir . '/' . $name)) {
                $issues = array_values(array_filter($issues, fn($i) => ($i['file'] ?? '') !== 'newsletters/' . $name));
                $issues[] = ['title' => $title, 'date' => $month, 'file' => 'newsletters/' . $name];
                ftruncate($fh, 0);
                rewind($fh);
                fwrite($fh, json_encode(['issues' => $issues], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
                $ok = true;
                $message = 'Newsletter uploaded.';
            } else {
                $message = 'Could not save the file.';
            }
            flock($fh, LOCK_UN);
        } else {
            $message = 'Could not update the newsletter list.';
        }
        if ($fh) {
            fclose($fh);
        }
    }
}
?><!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex">
<title>Upload newsletter</title><link rel="stylesheet" href="../styles.css"></head>
<body><main class="section"><div class="container" style="max-width:520px">
<h1>Upload newsletter</h1>
<?php if ($message): ?><p role="status" style="color:<?= $ok ? 'inherit' : '#b03a3a' ?>"><?= htmlspecialchars($message) ?></p><?php endif; ?>
<form method="post" enctype="multipart/form-data">
  <p><label>Admin token<br><input type="password" name="token" required autocomplete="off"></label></p>
  <p><label>Title<br><input type="text" name="title" maxlength="120" required></label></p>
  <p><label>Month<br><input type="month" name="month" required></label></p>
  <p><label>PDF<br><input type="file" name="pdf" accept="application/pdf" required></label></p>
  <button class="btn btn-primary" type="submit">Upload</button>
</form>
<p><a href="../newsletter.html">Back to newsletter page</a></p>
</div></main></body></html>
