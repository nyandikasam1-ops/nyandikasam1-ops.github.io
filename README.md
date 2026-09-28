# Samson Nyandika Orina — Official Website

Samson Nyandika Orina's official website, featuring his research on chemotherapy-induced neutropenia and treatment delays at Moi Teaching and Referral Hospital (MTRH), Eldoret, and his poster presentation at KICC 2026.

Built with React, Vite, Tailwind CSS, Recharts, Framer Motion and Vercel Blob. The responsive research portfolio includes a password-protected media manager for publishing PDFs and images.

## Run locally

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
npm run preview
```

## Publish

For Vercel, import the source repository (rather than uploading only the old static ZIP) and use `npm run build` as the build command and `dist` as the output directory. Importing the source is required because media uploads use Vercel Functions in `api/`. The repository also has a GitHub Pages workflow for deployments from `master`; that static workflow does not run the upload API.

## Vercel Blob media uploads

The public Research Library displays published posters, PDFs and approved educational images. The private manager is at `/admin`. Uploads go directly from the browser to Vercel Blob; this app does not put file data in browser local storage. Uploads accept PDF, JPEG, PNG and WebP files up to 10 MB. Published files and their catalog are public, so only publish materials cleared for public distribution. Never upload identifiable patient data or clinical records.

1. In Vercel, open the project’s **Storage** page, choose **Create Storage → Blob**, set access to **Public**, create the store, and connect it to this project for Production (and Preview if wanted). Vercel adds `BLOB_READ_WRITE_TOKEN` automatically.
2. In **Project → Settings → Environment Variables**, add `MEDIA_ADMIN_PASSWORD` with a unique, high-entropy passphrase of at least 20 characters. Do not commit this password or share it in chat.
3. Import/deploy the Git repository to Vercel so its `/api` functions are built. Set `npm run build` and `dist` if Vercel does not detect them automatically, then redeploy after setting the password and connecting Blob.
4. Visit `https://your-project.vercel.app/admin`, sign in with the environment password, and publish files. Admin sessions use an HttpOnly cookie that expires after eight hours. Published items show in the public Research Library section.

The plain Vite dev server previews the frontend only; the protected upload API is available on Vercel deployments (or through the Vercel CLI after linking the project and pulling its environment variables). Check Vercel Blob usage and pricing for your plan before publishing large amounts of media.

Study ethics approval was granted by Moi University IREC; patient data are anonymised. Study outcomes are displayed as separate bars because categories may overlap.
