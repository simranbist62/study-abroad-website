# Northbound Study Abroad

A study abroad counselling site with public enquiry and appointment forms and an admin dashboard. The admin dashboard and public forms share data through a local JSON Server.

## Run locally

Use Node.js 20 or newer. Install the website and data server dependencies once:

```bash
npm install
npm --prefix backend install
```

Start the website and data server together from the project root:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The API uses `http://localhost:5000` by default. Set `NEXT_PUBLIC_API_URL` if the data server runs elsewhere.

## Admin demo

Open [http://localhost:3000/login](http://localhost:3000/login) to choose a Student / customer or Administrator account. Admins can also use `/admin/login`, which opens the same login interface with the admin role selected.

- Administrator: `admin@northbound.example` / `admin123`
- Student demo: `student@northbound.example` / `student123`

Successful student sign-in opens `/account`, where the student can view requests linked to their account email. These are demonstration-only browser-side credentials, not production authentication. Use a secure server-side identity system before publishing the site or storing real student data.

## Available pages

- Public: `/`, `/home` (redirects to `/`), `/about`, `/services`, `/destinations`, `/destinations/[id]`, `/success-stories`, `/blog`, `/blog/[id]`, `/contact`, `/enquiry`, `/book`, `/privacy`, `/terms`, `/login`, `/account`
- Admin: `/admin/login`, `/admin`, `/admin/enquiries`, `/admin/appointments`, `/admin/pipeline`, `/admin/calendar`, `/admin/content`, `/admin/content/[collection]`, `/admin/content/[collection]/[id]`, `/admin/reports`, `/admin/activity`, `/admin/settings`

## Checks

```bash
npm run lint
npm run build
```
