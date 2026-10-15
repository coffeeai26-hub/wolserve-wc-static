Wolserve Western Cape — static site

Pages:
- index.html               Home
- about.html               Meet the Team (portraits side by side)
- services.html            Services overview hub: service tabs, service selector (selector.js), links to each service page
- homecare.html            Wolserve WC Homecare (comparison table, WHO link, careers)
- consulting.html          Consulting, Auditing & Quality
- cleaning-equipment.html  Cleaning equipment repairs, maintenance & inspection
- medical-equipment.html   Sales / rental of homecare medical equipment
- stone-masonry.html       Stone masonry + "Completed stone masonry projects" gallery (gallery.js)
- newsletter.html          Newsletter page and PDF archive (newsletter.js)
- contact.html             Contact and callback form

Other files:
- styles.css, scripts.js (nav, dropdown, lightbox, callback form), selector.js, gallery.js, newsletter.js
- images/                  Site pictures (use the .jpg/.png variants referenced by the pages)
- images/masonry/          Masonry photos; list them in images/masonry/gallery.json (src, alt, caption)
- newsletters/newsletters.json   Newsletter archive list (title, date, file)
- admin/upload-newsletter.php    Newsletter PDF upload (needs PHP hosting; set NEWSLETTER_ADMIN_HASH in config.local.php)
- sendmail.php, config.sample.php  Callback form mailer (PHP hosting; copy config.sample.php to config.local.php)

Usage:
1) Download or clone this repository.
2) Open index.html in a browser. Pages work without a server; the gallery and newsletter archive
   fall back to built-in markup, and the callback form and newsletter upload need PHP hosting.
3) Add masonry photos to images/masonry/ and list them in images/masonry/gallery.json.
