#!/bin/bash
# 이미지 → WebP 자동 변환 스크립트
# 사용법:
#   단일 파일: ./convert-to-webp.sh ./images/foo/bar.jpg
#   전체 폴더: ./convert-to-webp.sh           (기본값: ./images 전체 스캔)
#
# 의존성: macOS 내장 sips (jpg/png→webp)
#         ffmpeg (선택, mp4/mov 포스터 이미지 추출) → brew install ffmpeg

convert_to_webp() {
  local src="$1"
  local dir="$(dirname "$src")"
  local base="$(basename "${src%.*}")"
  local dest="$dir/$base.webp"

  if [ -f "$dest" ]; then
    echo "  skip (already exists): $dest"
    return
  fi

  if command -v cwebp &>/dev/null; then
    cwebp -quiet -q 85 "$src" -o "$dest" 2>/dev/null
  else
    python3 - "$src" "$dest" <<'PY' 2>/dev/null
import sys
from PIL import Image
src, dest = sys.argv[1], sys.argv[2]
Image.open(src).save(dest, "WEBP", quality=85)
PY
  fi
  if [ $? -eq 0 ] && [ -f "$dest" ]; then
    echo "  converted: $src → $dest"
  else
    echo "  failed: $src"
  fi
}

extract_video_poster() {
  local src="$1"
  local dir="$(dirname "$src")"
  local base="$(basename "${src%.*}")"
  local dest="$dir/$base.webp"

  if [ -f "$dest" ]; then
    echo "  skip (poster exists): $dest"
    return
  fi

  if command -v ffmpeg &>/dev/null; then
    ffmpeg -y -i "$src" -ss 00:00:00.000 -vframes 1 "$dest" > /dev/null 2>&1
    if [ $? -eq 0 ]; then
      echo "  poster extracted: $src → $dest"
    else
      echo "  poster failed: $src"
    fi
  else
    echo "  skip poster (ffmpeg not found): $src  →  brew install ffmpeg"
  fi
}

# 단일 파일이 인자로 들어온 경우
if [ -n "$1" ] && [ -f "$1" ]; then
  src="$1"
  case "${src##*.}" in
    jpg|jpeg|png|JPG|JPEG|PNG)
      convert_to_webp "$src"
      ;;
    mp4|mov|MP4|MOV)
      extract_video_poster "$src"
      ;;
    *)
      echo "  skip (unsupported): $src"
      ;;
  esac
  exit 0
fi

# 폴더 전체 스캔
IMAGES_DIR="${1:-./images}"
echo "Scanning $IMAGES_DIR ..."

find "$IMAGES_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) | while read f; do
  convert_to_webp "$f"
done

find "$IMAGES_DIR" -type f \( -iname "*.mp4" -o -iname "*.mov" \) | while read f; do
  extract_video_poster "$f"
done

echo "Done."
