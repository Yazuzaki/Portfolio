# Adding security response headers via Cloudflare

The site already ships a strict **Content-Security-Policy** and referrer policy through
`<meta>` tags in `index.html`. A few important protections can only be delivered as HTTP
**response headers**, which GitHub Pages does not let you set. This guide adds them by
putting the site behind Cloudflare (free tier).

## Prerequisite: a custom domain

Cloudflare **cannot** proxy a `*.github.io` subdomain — that DNS zone belongs to GitHub, not
you. You need a domain you own (e.g. `patrickgarcia.dev`). This is also a resume upgrade: a
custom domain reads far more professionally than `yazuzaki.github.io`.

If you don't want to buy a domain, skip this entire guide — the `<meta>` CSP already covers the
single most valuable protection, and the remaining headers are low-risk for a static portfolio
with no login or state-changing actions.

## Step 1 — Point the custom domain at GitHub Pages

1. Buy a domain (Cloudflare Registrar, Namecheap, Porkbun, etc.).
2. In the repo: **Settings → Pages → Custom domain** → enter your domain → **Save**.
   This commits a `CNAME` file to the repo automatically.
3. Leave **Enforce HTTPS** checked (may take a few minutes to become available).

## Step 2 — Put the domain on Cloudflare

1. Create a free Cloudflare account and **Add a site** → your domain.
2. Cloudflare gives you two nameservers — set them at your registrar. (If you bought the domain
   at Cloudflare Registrar, this is already done.)
3. Add DNS records so the domain resolves to GitHub Pages, **Proxied** (orange cloud) so traffic
   flows through Cloudflare:

   | Type  | Name | Content                | Proxy    |
   |-------|------|------------------------|----------|
   | CNAME | www  | yazuzaki.github.io     | Proxied  |
   | A     | @    | 185.199.108.153        | Proxied  |
   | A     | @    | 185.199.109.153        | Proxied  |
   | A     | @    | 185.199.110.153        | Proxied  |
   | A     | @    | 185.199.111.153        | Proxied  |

   (These four A records are GitHub Pages' published IPs.)

## Step 3 — Add the security headers (Transform Rules — free, no Workers)

Cloudflare dashboard → **Rules → Transform Rules → Modify Response Header → Create rule**.
Set the rule to match all requests (`Hostname` `equals` your domain, or "All incoming requests"),
then **Set static** header for each of the following:

| Header | Value |
|--------|-------|
| `Content-Security-Policy` | `default-src 'self'; base-uri 'none'; object-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'none'; form-action 'none'; frame-ancestors 'none'; upgrade-insecure-requests` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `geolocation=(), camera=(), microphone=(), payment=(), usb=()` |
| `X-Frame-Options` | `DENY` |

Notes:
- As a **header**, CSP can include `frame-ancestors 'none'` — this is the real clickjacking
  fix that a `<meta>` CSP can't provide, and it supersedes `X-Frame-Options` on modern browsers
  (the `X-Frame-Options: DENY` line is kept for older ones).
- Once the header CSP is live you can delete the `<meta http-equiv="Content-Security-Policy">`
  line from `index.html` to avoid maintaining two copies, or keep it as a fallback — both are
  fine. If you keep both, make sure they stay identical.

## Step 4 — Turn on HSTS

Cloudflare dashboard → **SSL/TLS → Edge Certificates → HTTP Strict Transport Security (HSTS)** →
**Enable**. Suggested settings: max-age 6 months, include subdomains, preload off (only turn on
preload once you're sure every subdomain will always be HTTPS — it's hard to undo).

Also set **SSL/TLS → Overview → encryption mode** to **Full**, and enable **Always Use HTTPS**.

## Step 5 — Verify

After DNS propagates (minutes to a couple of hours):

```bash
curl -sI https://yourdomain.com | grep -iE 'content-security-policy|x-frame|x-content-type|referrer|permissions-policy|strict-transport'
```

You should see every header above. For a graded report, run the domain through
<https://securityheaders.com> and <https://observatory.mozilla.org> — with the config above you
should score an A/A+.
