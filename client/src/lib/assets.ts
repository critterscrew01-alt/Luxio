const SUPABASE_BASE =
  'https://xllmacobisbbmyggbkwo.supabase.co/storage/v1/object/public/Background';

const galleryBase = `${SUPABASE_BASE}/Gallery`;

export const BACKGROUND_IMAGES = {
  image1: `${SUPABASE_BASE}/Background%20images/Image1.JPG`,
  image2: `${SUPABASE_BASE}/Background%20images/image2.jpg`,
};

// 30 images: IMG_1440.JPG → IMG_1469.JPG
export const GALLERY_IMAGES: string[] = Array.from({ length: 30 }, (_, i) =>
  `${galleryBase}/IMG_${1440 + i}.JPG`
);
