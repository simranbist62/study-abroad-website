# Northbound Study Abroad

A study abroad counselling site with public enquiry and appointment forms and an admin dashboard. The admin dashboard and public forms share data through a local JSON Server.

## Run locally

Use Node.js 20 or newer. Install dependencies from the project root:

```bash
npm install
```

Start the data server in one terminal:

```bash
cd backend
npm install
npm start
```

Start the website in a second terminal from the project root:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The API uses `http://localhost:5000` by default. Set `NEXT_PUBLIC_API_URL` if the data server runs elsewhere.

## Admin demo

Open [http://localhost:3000/admin/login](http://localhost:3000/admin/login) and sign in with `admin@northbound.example` / `admin123`. This is a demo-only browser-side login; use a real server-side authentication system before publishing the site or storing real student data.

## Available pages

- Public: `/`, `/home`, `/about`, `/services`, `/destinations`, `/destinations/[id]`, `/success-stories`, `/blog`, `/blog/[id]`, `/contact`, `/enquiry`, `/book`, `/privacy`, `/terms`
- Admin: `/admin/login`, `/admin`, `/admin/enquiries`, `/admin/appointments`, `/admin/pipeline`, `/admin/calendar`, `/admin/content`, `/admin/content/[collection]`, `/admin/content/[collection]/[id]`, `/admin/reports`, `/admin/activity`, `/admin/settings`

## Checks

```bash
npm run lint
npm run build
```
