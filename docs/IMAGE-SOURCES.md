# Cultural and venue imagery

Images displayed by the application are URLs returned with resolved Qloo entities or Qloo place recommendations (`properties.image.url` / `properties.images`). They are not generated or substitute artworks. The UI links to the provided source image and attributes Qloo as the delivery source.

Qloo API access does not establish an open copyright license for every underlying photograph, cover or portrait. Underlying rights remain with their respective owners. We do not claim MIT covers these images, download an image library into the public repository, or publish raw Qloo response dumps. Missing or failed images receive an explicit unavailable label.

Before commercial distribution, verify display rights and any required original-creator attribution under the applicable Qloo agreement and image-source terms. Current provenance identifies the API source; original photographer and individual license metadata are not provided consistently and remain unverified.

Source-code MIT licensing applies to project code only. DM Sans is distributed under its bundled SIL Open Font License. OpenStreetMap tiles retain visible attribution in the map.

Observed during production verification: the Dieter Rams image endpoint returned a 30 × 30 image, unsuitable as a cultural preview. Images smaller than 64 pixels in either dimension are now rejected for display and use explicit typographic fallback. Browser image-load errors or a 12-second load timeout use the same fallback.

## Entry scene (2026-10-31 reference sprint)
The entry scene reuses the existing Qloo response image for Sahsya Kanetanaka: https://images.qloo.com/i/F5BB194F-7848-43EF-A7F8-9512D8F6A46A-420x-auto.jpg . Provenance: artifacts/gate1/response.private.json. The interface explicitly labels this a scene preview, not a current recommendation. It is not evidence of quietness or reading suitability. Qloo delivery identifies the source; it does not independently establish the underlying photograph's redistribution license. No Doubao avatar or generated venue imagery is used.
