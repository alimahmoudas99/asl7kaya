# Netlify Deployment Guide - أصل الحكاية

## 🚨 مشكلة مهمة جداً - CRITICAL

الموقع حالياً يعرض `localhost:3000` في:
- ❌ robots.txt
- ❌ sitemap.xml
- ❌ جميع الروابط الداخلية

## ✅ الحل - إضافة Environment Variable

### الخطوات:

1. **اذهب إلى Netlify Dashboard**
   - افتح: https://app.netlify.com
   - اختر موقعك: `aslel7kaya`

2. **أضف Environment Variable**
   - اذهب إلى: **Site settings** → **Environment variables**
   - اضغط **Add a variable**
   - أضف:
     ```
     Key: NEXT_PUBLIC_SITE_URL
     Value: https://aslel7kaya.netlify.app
     ```
   - اضغط **Save**

3. **أعد نشر الموقع (Redeploy)**
   - اذهب إلى: **Deploys**
   - اضغط **Trigger deploy** → **Deploy site**
   - انتظر حتى ينتهي البناء (Build)

4. **تحقق من النتيجة**
   - افتح: `https://aslel7kaya.netlify.app/sitemap.xml`
   - يجب أن ترى الرابط الصحيح بدلاً من localhost

---

## 🔧 إصلاح مشكلة Manifest (404)

المشكلة: Next.js ينشئ `/manifest.webmanifest` لكن الرابط يجب أن يكون بدون `.webmanifest`

### الحل:

الملف موجود بالفعل في `app/manifest.ts` وسيعمل تلقائياً بعد إعادة النشر.

الرابط الصحيح سيكون:
- ✅ `https://stalwart-tiramisu-c3ecda.netlify.app/manifest.json`

أو يمكن الوصول إليه من خلال:
- ✅ `https://stalwart-tiramisu-c3ecda.netlify.app/site.webmanifest`

---

## 📋 Checklist بعد إضافة Environment Variable

بعد إعادة النشر، تحقق من:

### ✅ Robots.txt
```
https://aslel7kaya.netlify.app/robots.txt
```
يجب أن يعرض:
```
User-Agent: *
Allow: /
Disallow: /api/
Disallow: /dashboard/
Disallow: /_next/
Disallow: /admin/

User-Agent: Googlebot
Allow: /
Disallow: /api/
Disallow: /dashboard/
Disallow: /admin/

User-Agent: Googlebot-Image
Allow: /

Sitemap: https://aslel7kaya.netlify.app/sitemap.xml
Host: https://aslel7kaya.netlify.app
```

### ✅ Sitemap.xml
```
https://aslel7kaya.netlify.app/sitemap.xml
```
يجب أن تبدأ جميع الروابط بـ:
```
https://aslel7kaya.netlify.app/
```

### ✅ Manifest
```
https://aslel7kaya.netlify.app/manifest.json
```
أو
```
https://aslel7kaya.netlify.app/site.webmanifest
```

---

## 🎯 بعد إضافة Domain مخصص

إذا اشتريت دومين مثل `asl7kaya.com`:

1. **أضف الدومين في Netlify**
   - Site settings → Domain management → Add custom domain

2. **حدّث Environment Variable**
   ```
   NEXT_PUBLIC_SITE_URL = https://asl7kaya.com
   ```

3. **أعد النشر**

---

## 🔍 اختبار SEO بعد الإصلاح

### 1. Google Search Console
- اذهب إلى: https://search.google.com/search-console
- أضف الموقع: `https://aslel7kaya.netlify.app`
- أرسل Sitemap: `https://aslel7kaya.netlify.app/sitemap.xml`

### 2. Google Rich Results Test
- اذهب إلى: https://search.google.com/test/rich-results
- اختبر أي صفحة فيديو

### 3. PageSpeed Insights
- اذهب إلى: https://pagespeed.web.dev/
- اختبر الموقع

---

## 📸 Screenshots للخطوات

### إضافة Environment Variable في Netlify:

1. **Site settings**
   ```
   Dashboard → Site settings → Environment variables
   ```

2. **Add variable**
   ```
   Key: NEXT_PUBLIC_SITE_URL
   Value: https://aslel7kaya.netlify.app
   Scopes: All scopes
   ```

3. **Trigger deploy**
   ```
   Deploys → Trigger deploy → Deploy site
   ```

---

## ⚠️ ملاحظات مهمة

1. **لا تنسى إعادة النشر** بعد إضافة Environment Variable
2. **الانتظار 2-5 دقائق** حتى ينتهي البناء
3. **مسح الكاش** في المتصفح بعد إعادة النشر
4. **التحقق من جميع الملفات** (robots.txt, sitemap.xml, manifest)

---

## 🚀 الخطوة التالية

بعد إصلاح هذه المشكلة:
1. ✅ أرسل Sitemap إلى Google Search Console
2. ✅ اختبر Structured Data
3. ✅ راقب الفهرسة في Search Console
4. ✅ انتظر 1-2 أسبوع لبدء ظهور النتائج

---

## 📞 الدعم

إذا واجهت أي مشكلة:
1. تحقق من Build Logs في Netlify
2. تأكد من إضافة Environment Variable بشكل صحيح
3. تأكد من إعادة النشر بعد الإضافة
