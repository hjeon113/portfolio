#!/bin/bash
# 이미지 폴더 감시 → 새 파일 추가 시 자동 WebP 변환
# 실행: ./watch-images.sh

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
IMAGES_DIR="$SCRIPT_DIR/images"

echo "이미지 감시 시작: $IMAGES_DIR"
echo "jpg/png/mp4/mov 파일 추가하면 자동으로 webp 변환됩니다."
echo "종료: Ctrl+C"
echo ""

/usr/local/bin/fswatch -0 "$IMAGES_DIR" | while IFS= read -r -d "" file; do
  case "${file##*.}" in
    jpg|jpeg|png|JPG|JPEG|PNG|mp4|mov|MP4|MOV)
      echo "감지: $file"
      "$SCRIPT_DIR/convert-to-webp.sh" "$file"
      ;;
  esac
done
