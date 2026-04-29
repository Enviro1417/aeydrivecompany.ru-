# Nginx + HTTPS setup

1. Upload website files to:
`/var/www/aeydrive`

2. Copy config:
`sudo cp deploy/nginx/aeydrive.conf /etc/nginx/sites-available/aeydrive.conf`

3. Edit domain in config:
- `example.ru`
- `www.example.ru`

4. Enable site:
`sudo ln -s /etc/nginx/sites-available/aeydrive.conf /etc/nginx/sites-enabled/aeydrive.conf`

5. Test and reload:
`sudo nginx -t && sudo systemctl reload nginx`

6. Issue SSL cert:
`sudo certbot --nginx -d example.ru -d www.example.ru`

7. Reload nginx again:
`sudo systemctl reload nginx`

Notes:
- If form submit uses `/api/lead`, keep backend running on `127.0.0.1:3000`.
- If you deploy static-only site, remove `/api/` block.
