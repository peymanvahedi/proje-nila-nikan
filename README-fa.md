
# استک آماده‌ی Medusa (بک‌اند + Next.js Storefront)

این مخزن، همه‌چیز برای راه‌اندازی **صفر تا صد** مدوسا را آماده کرده: دیتابیس‌ها با Docker،
اسکافولد پروژه‌ها با `create-medusa-app`، اسکریپت‌های اجرا، CI گیت‌هاب و فایل نمونه‌ی دیپلوی روی Render.

## پیش‌نیازها
- Node.js **۲۰** یا بالاتر (`.nvmrc` = 20)
- Docker و Docker Compose
- Git
- پورت‌های آزاد: `5432` برای Postgres و `6379` برای Redis

## شروع سریع
```bash
# ۱) دیتابیس‌ها را بالا بیاورید
npm run db:up

# ۲) پروژه‌ها را اسکافولد کنید (بک‌اند و storefront)
npm run bootstrap

# ۳) اجرای همزمان توسعه
npm run dev
```

پس از بوت‌استرپ:
- بک‌اند روی `http://localhost:9000`
- فروشگاه Next.js روی پورت پیش‌فرض آن (طبق اسکریپت‌های داخلی Starter)

## تنظیمات محیط
- `apps/backend/.env` شامل `DATABASE_URL`, `REDIS_URL`, `ADMIN_CORS`, `STORE_CORS`, `JWT_SECRET`, `COOKIE_SECRET`
- `apps/storefront/.env.local` شامل `NEXT_PUBLIC_MEDUSA_URL=http://localhost:9000`

## گیت و CI
- بعد از `npm run bootstrap` یک کامیت اولیه ساخته می‌شود.
- ریموت را اضافه کنید و پوش کنید:
```bash
git branch -M main
git remote add origin <YOUR_REPO_URL>
git push -u origin main
```
- ورک‌فلو‌ی CI در `.github/workflows/ci.yml` بیلد و چک‌ها را انجام می‌دهد.

## دیپلوی روی Render
- فایل `render.yaml` آماده است (سرور، ورکر، و storefront جدا).
- `DATABASE_URL` و `REDIS_URL` و `NEXT_PUBLIC_MEDUSA_URL` را در تنظیمات Render ست کنید.
- طبق مستندات مدوسا، بیلد پروداکشن در `.medusa/server` اجرا می‌شود و سپس `npm start` می‌زنیم.

## نکات
- Worker Mode برای تسک‌های پس‌زمینه ضروری‌ست (در Render با `MEDUSA_WORKER_MODE=true` فعال شده).
- برای محیط پروداکشن توصیه می‌شود Redis استفاده شود.

موفق باشی! 🚀
