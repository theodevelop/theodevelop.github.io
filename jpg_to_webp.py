import os
from PIL import Image

INPUT_DIR = "./assets"
QUALITY = 85  # qualité WebP (0–100)

def convert_jpg_to_webp(root_dir):
    for root, _, files in os.walk(root_dir):
        for file in files:
            if file.lower().endswith((".jpg", ".jpeg")):
                jpg_path = os.path.join(root, file)
                webp_path = os.path.splitext(jpg_path)[0] + ".webp"

                try:
                    with Image.open(jpg_path) as img:
                        img = img.convert("RGB")  # sécurité pour WebP
                        img.save(webp_path, "WEBP", quality=QUALITY, method=6)

                    print(f"✔ Converti : {jpg_path} → {webp_path}")

                except Exception as e:
                    print(f"✖ Erreur sur {jpg_path} : {e}")

if __name__ == "__main__":
    convert_jpg_to_webp(INPUT_DIR)
