#!/bin/bash
# One-time script: uploads your CURRENT 18 project photos/videos into R2
# so the live Projects section shows exactly what it shows today.
#
# Run this ONCE, after you've created the R2 bucket and logged in with:
#   npx wrangler login
#
# Usage:
#   BUCKET_NAME=primefix-media ./seed-existing-media.sh
# (replace primefix-media with your actual bucket name if different)

set -e

BUCKET="${BUCKET_NAME:-primefix-media}"

echo "Seeding bucket: $BUCKET"
echo "This uploads your 18 existing project photos/videos so nothing on the live site changes."
echo ""

# Order matters: uploaded LAST = shown FIRST on the site.
# This order was chosen so the final result matches the current layout exactly.

# --- Extra / collapsible items (uploaded first = show lowest in the list) ---
npx wrangler r2 object put "$BUCKET/projects/whatsapp-video-07-39-38.mp4" --file="Videos/WhatsApp Video 2025-12-30 at 07.39.38.mp4" --content-type="video/mp4"
npx wrangler r2 object put "$BUCKET/projects/whatsapp-video-07-39-37.mp4" --file="Videos/WhatsApp Video 2025-12-30 at 07.39.37.mp4" --content-type="video/mp4"
npx wrangler r2 object put "$BUCKET/projects/whatsapp-video-07-39-36.mp4" --file="Videos/WhatsApp Video 2025-12-30 at 07.39.36.mp4" --content-type="video/mp4"
npx wrangler r2 object put "$BUCKET/projects/whatsapp-video-07-39-35.mp4" --file="Videos/WhatsApp Video 2025-12-30 at 07.39.35.mp4" --content-type="video/mp4"
npx wrangler r2 object put "$BUCKET/projects/whatsapp-video-07-39-03.mp4" --file="Videos/WhatsApp Video 2025-12-30 at 07.39.03.mp4" --content-type="video/mp4"
npx wrangler r2 object put "$BUCKET/projects/video-6.mp4" --file="Videos/video 6.mp4" --content-type="video/mp4"
npx wrangler r2 object put "$BUCKET/projects/video-4.mp4" --file="Videos/video 4.mp4" --content-type="video/mp4"
npx wrangler r2 object put "$BUCKET/projects/whatsapp-image-07-39-38.jpeg" --file="Videos/WhatsApp Image 2025-12-30 at 07.39.38.jpeg" --content-type="image/jpeg"
npx wrangler r2 object put "$BUCKET/projects/whatsapp-image-07-39-37.jpeg" --file="Videos/WhatsApp Image 2025-12-30 at 07.39.37.jpeg" --content-type="image/jpeg"
npx wrangler r2 object put "$BUCKET/projects/whatsapp-image-2.jpeg" --file="Videos/whatsapp image 2.jpeg" --content-type="image/jpeg"

# --- Main visible items (uploaded last = show at the top) ---
npx wrangler r2 object put "$BUCKET/projects/featured-project.jpg" --file="Images/featured-project.jpg" --content-type="image/jpeg"
npx wrangler r2 object put "$BUCKET/projects/gallery-07.jpg" --file="Images/gallery-07.jpg" --content-type="image/jpeg"
npx wrangler r2 object put "$BUCKET/projects/gallery-06.jpg" --file="Images/gallery-06.jpg" --content-type="image/jpeg"
npx wrangler r2 object put "$BUCKET/projects/gallery-05.jpg" --file="Images/gallery-05.jpg" --content-type="image/jpeg"
npx wrangler r2 object put "$BUCKET/projects/gallery-04.jpg" --file="Images/gallery-04.jpg" --content-type="image/jpeg"
npx wrangler r2 object put "$BUCKET/projects/gallery-03.jpg" --file="Images/gallery-03.jpg" --content-type="image/jpeg"
npx wrangler r2 object put "$BUCKET/projects/gallery-02.jpg" --file="Images/gallery-02.jpg" --content-type="image/jpeg"
npx wrangler r2 object put "$BUCKET/projects/gallery-01.jpg" --file="Images/gallery-01.jpg" --content-type="image/jpeg"

echo ""
echo "Done. Your Projects section should now show exactly what it showed before."
