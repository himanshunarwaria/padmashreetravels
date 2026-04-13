BLOG IMAGES — Padma Shree Travels
==================================

Drop your blog images in this folder. Use the filenames below exactly
so the HTML placeholders pick them up automatically.

LISTING PAGE THUMBNAILS (blog/index.html cards)
------------------------------------------------
File name                              Recommended size    Subject
taj-mahal-visiting-guide.jpg           800 x 450 px        Taj Mahal at sunrise, iconic main-gate view
best-time-taj-mahal.jpg                800 x 450 px        Taj Mahal in golden winter light / mist
agra-one-day-sightseeing.jpg           800 x 450 px        Taj Mahal + Agra Fort collage / Agra skyline
mathura-vrindavan-guide.jpg            800 x 450 px        Prem Mandir at night / Banke Bihari Temple
agra-mathura-vrindavan-day-trip.jpg    800 x 450 px        Yamuna Ghat / route collage / highway view

ARTICLE HERO IMAGES (shown at top of each blog post)
-----------------------------------------------------
File name                              Recommended size    Subject
taj-mahal-visiting-guide.jpg           1200 x 630 px       Same as above (or use a separate hi-res version)
best-time-taj-mahal.jpg                1200 x 630 px       Taj Mahal seasonal light / mist
agra-one-day-sightseeing.jpg           1200 x 630 px       Monument collage or Taj Mahal sunrise
mathura-vrindavan-guide.jpg            1200 x 630 px       Prem Mandir night / Dwarkadhish Temple
agra-mathura-vrindavan-day-trip.jpg    1200 x 630 px       Route / Yamuna / temples

TIPS
----
- Format: JPG or WebP. WebP is faster (smaller file, same quality).
- Compress images before uploading (use squoosh.app or tinypng.com).
- Keep file size under 150 KB per image for fast loading.
- Use descriptive alt text in the HTML (already pre-filled with suggestions).

IN-ARTICLE IMAGES
-----------------
You can add more images anywhere inside a blog article body using:

  <figure class="article-img">
    <img src="../../blog/images/your-image.jpg" alt="Descriptive alt text" loading="lazy">
    <figcaption>Optional caption text here</figcaption>
  </figure>

For a full-width image that bleeds to the article edges, add class "article-img--wide":

  <figure class="article-img article-img--wide">
    ...
  </figure>
