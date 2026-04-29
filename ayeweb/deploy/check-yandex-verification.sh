#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <domain>"
  echo "Example: $0 example.ru"
  exit 1
fi

DOMAIN="$1"
PATH_FILE="/yandex_aa0fe3341331d112.html"
URL_HTTPS="https://${DOMAIN}${PATH_FILE}"
URL_HTTP="http://${DOMAIN}${PATH_FILE}"
EXPECTED='Verification: aa0fe3341331d112'

echo "Checking HTTP URL: ${URL_HTTP}"
curl -sSIL "$URL_HTTP" | sed -n '1,20p'
echo

echo "Checking HTTPS URL: ${URL_HTTPS}"
curl -sSIL "$URL_HTTPS" | sed -n '1,20p'
echo

echo "Checking body contains expected token..."
BODY="$(curl -sS "$URL_HTTPS")"
if echo "$BODY" | grep -q "$EXPECTED"; then
  echo "OK: verification token found in body"
else
  echo "ERROR: verification token NOT found"
  echo "----- Response body preview -----"
  echo "$BODY" | sed -n '1,40p'
  exit 2
fi
