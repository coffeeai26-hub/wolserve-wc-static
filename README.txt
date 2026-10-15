Wolserve Western Cape — static site

Pages:
- index.html               Home
- about.html               Meet the Team (portraits side by side)
- services.html            Services overview hub: service tabs, service selector and links to each service page
- homecare.html            Wolserve WC Homecare (comparison table, WHO link, careers)
- consulting.html          Wolserve WC Consulting
- cleaning-equipment.html  Cleaning equipment repairs, maintenance & inspection
- medical-equipment.html   Sales / rental of homecare medical equipment
- stone-masonry.html       Stone masonry with photo gallery
- newsletter.html          Newsletter archive
- contact.html             Contact and callback form

Scripts and styles:
- styles.css, scripts.js (nav, lightbox, callback form), selector.js (service selector),
  gallery.js (masonry gallery), newsletter.js (newsletter archive)

Content:
- images/                  Site images (Picture 1-14; use the .jpg files for Picture 3, 4, 9 and 14)
- images/masonry/          Masonry photos; list them in images/masonry/gallery.json
- newsletters/newsletters.json  Newsletter archive list

PHP (needs PHP hosting, not GitHub Pages):
- sendmail.php             Callback form mailer (name/phone validation + honeypot)
- admin/upload-newsletter.php  Upload a newsletter PDF and add it to the archive
- config.sample.php        Copy to config.local.php and set MAIL_RECIPIENT and ADMIN_PASSWORD_HASH

Usage:
1) Download or clone this repository.
2) Open index.html in a browser. (The gallery and archive lists are also rendered from their JSON files when served over HTTP.)
