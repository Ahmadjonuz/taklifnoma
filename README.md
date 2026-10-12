# Mehr — zamonaviy to‘y taklifnomasi

Next.js App Router + React + TypeScript. Mobil ekranlar uchun moslashtirilgan, o‘zbekcha/ruscha, musiqa va animatsiyali online taklifnoma.

**Muhim:** Ahmadjon/Madina ismlari, 12-iyun 2027 sanasi va Toshkent manzili — namuna. Ulashishdan oldin o‘zingiznikiga almashtiring. Hech qanday ma’lumotlar bazasi, akkaunt yoki maxfiy kalit talab qilinmaydi.

## 1. Ishga tushirish (Windows)

Node.js 22.13 yoki undan yangi versiyasini o‘rnating. ZIP faylni oching, `mehr-wedding` papkasini VS Code orqali oching. Terminalda:

```powershell
npm.cmd install
npm.cmd run dev
```

Brauzerda http://localhost:3000 manzilini oching. CMD, macOS yoki Linux terminalida `npm install` va `npm run dev` yoziladi. Tayyor build va tekshiruv:

```powershell
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
```

`npm run build` tugagach statik sayt `out/` papkasida hosil bo‘ladi. `out/index.html` ni file:// orqali ochmang; Next.js fayllari HTTP server orqali ishlaydi. Lokal tahrirlash uchun `npm run dev` yetarli. `node_modules` arxivga qo‘shilmagan; ilk o‘rnatishda internet kerak.

## 2. Ma’lumotlarni qayerdan o‘zgartiraman?

**Asosiy fayl: `config/wedding.ts`**. Kod ichida o‘zbekcha izohlar bor.

| O‘zgartirish | Sozlama |
|---|---|
| Kelin-kuyov ismi | `groom`, `bride`: `uz` va `ru` qiymatlari |
| Oilalar ismi | `families` |
| To‘y boshlanishi | `date` |
| To‘y tugashi | `endDate` |
| To‘yxona nomi va manzili | `venue.name`, `venue.address` |
| Xarita havolasi | `venue.mapUrl` |
| To‘g‘ridan-to‘g‘ri xarita | `venue.mapEmbedUrl` (ixtiyoriy) |
| Taklif matni | `invitation` |
| Muhabbat haqidagi matn | `quote` |
| Oqshom dasturi | `program` |
| Dress-kod ranglari | `dressCode.colors` |
| Dress-kodni o‘chirish | `dressCode.enabled: false` |
| Musiqa | `music.src`, `music.volume`, `music.credit` |
| Ochilishdagi gulbarglar | `celebration.enabled`, `celebration.durationSeconds` |
| Asosiy rasm | `heroImage` |
| Shaxsiy rasmlar | `gallery` |
| Telefon | `contactPhone` |
| Ishtirokni tasdiqlash formasi | `rsvpUrl` |
| Sayt domeni | `siteUrl` |
| Birinchi ochiladigan til | `defaultLanguage` |

### Sana namunasi

```ts
date: '2027-06-12T18:00:00+05:00',
endDate: '2027-06-12T23:00:00+05:00',
timeZone: 'Asia/Tashkent',
```

Bu 2027-yil 12-iyun, Toshkent vaqti bilan 18:00–23:00. `endDate` boshlanishdan keyin bo‘lsin. Formatdagi `T`, `+05:00` va qo‘shtirnoqlarni saqlang. Ismlar va sanalar sahifaning barcha bo‘limlarida avtomatik almashadi. Boshqa mamlakatdagi mehmon ham Toshkentdagi to‘y vaqtini to‘g‘ri ko‘radi.

### Xarita

Google Maps’da to‘yxonani qidiring → Share/Поделиться → havolani nusxalab `venue.mapUrl` ga yozing. Hozirgi namuna havola Toshkent shahrini qidiradi, haqiqiy to‘yxonani emas.

Ichki xarita uchun Google Maps → Share → Embed a map → HTML’dagi faqat `src="..."` ichidagi manzilni `mapEmbedUrl` ga yozing. `mapEmbedUrl` bo‘sh bo‘lsa koordinata deb ko‘rsatilmaydigan dekorativ xarita chiqadi; bosilganda `mapUrl` ochiladi. Ichki xarita internetga bog‘liq.

### Musiqa

Yangi musiqa: **“This Too Shall Pass” — Scott Buckley**, pianino va torli cholg‘ular ishtirokidagi instrumental. Fayl: `public/music/this-too-shall-pass.mp3`. MP3 loyiha ichida; streaming xizmatiga bog‘liq emas.

Kuy CC BY 4.0 litsenziyasida; sayt pastidagi muallif va litsenziya havolasini saqlang. Manba va tafsilotlar `public/music/CREDITS.txt` ichida. Fayl mobil yuklanish uchun 160 kbps ga o‘tkazilgan, kuy to‘liq saqlangan. Oldingi `our-moment.mp3` ixtiyoriy variant sifatida qoldirilgan.

Boshqa musiqa qo‘yish:

1. O‘zingiz foydalanishga haqli MP3 faylni `public/music/` papkasiga qo‘ying, masalan `wedding.mp3`.
2. `music.src: '/music/wedding.mp3'` yozing.
3. `volume` — 0 dan 1 gacha, masalan `0.5`.
4. Musiqani o‘zingiznikiga almashtirsangiz, `music.credit` ni yangi muallifga moslang; kredit talab qilinmasa `artist` ni bo‘sh qoldirib pastdagi yozuvni yashirishingiz mumkin.

Telefon brauzerlari avtomatik ovozni cheklaydi, shuning uchun musiqa **“Taklifnomani ochish” bosilganda** boshlanadi. “Ovozsiz ochish” ham bor. Pastdagi musiqa tugmasidan yoqish/to‘xtatish mumkin. Fayl ochilmasa sayt xabar chiqaradi. iPhone’da qurilma ovozi va ovozsiz rejimini ham tekshiring.

### Konvert ochilgandagi gulbarglar

Konvert ochilgach 14 soniya davomida fil suyagi rangidagi gulbarglar va mayda oltin zarralar yuqoridan tushadi. Telefonda 24 ta, kattaroq ekranda 40 ta yengil CSS element ishlaydi. Ular tugmalarni to‘smaydi va yakunda DOMdan olib tashlanadi. Tab yashirilsa yoki qurilmada harakatni kamaytirish (`prefers-reduced-motion`) yoqilgan bo‘lsa effekt to‘xtaydi.

`celebration.enabled: false` effektni o‘chiradi; `durationSeconds` davomiylikni belgilaydi (5–30 soniya oralig‘i).

### Rasmlar va galereya

Asosiy rasmni `public/images/` ga qo‘ying va `heroImage` ni yangilang. Vertikal 2:3 yoki 3:4 rasm tavsiya qilinadi. Hozirgi rasm loyiha uchun AI yordamida tayyorlangan gul kompozitsiyasi.

Galereya sukut bo‘yicha yashirilgan. O‘z rasmlaringizni qo‘shing:

```ts
gallery: [
  { src: '/images/photo-1.jpg', alt: { uz: 'Bizning birinchi suratimiz', ru: 'Наше первое фото' } },
  { src: '/images/photo-2.jpg', alt: { uz: 'Baxtli lahza', ru: 'Счастливое мгновение' } },
],
```

Rasm bosilganda kattalashadi, tugmalar va klaviatura strelkalari bilan almashadi. `Escape` yopadi. Fayl nomlarida lotin harflari, raqam va chiziqcha ishlating.

### Aloqa va RSVP

Telefon tugmasini chiqarish: `contactPhone: '+998901234567'`. Hozir bo‘sh; soxta raqam berilmagan.

Mehmonlarning javoblarini yig‘ish kerak bo‘lsa, Google Forms’da forma yarating va haqiqiy havolasini `rsvpUrl` ga yozing. Shunda “Ishtirokni tasdiqlash” tugmasi paydo bo‘ladi. Bu loyihada serverga yozuvchi yashirin forma yoki ma’lumotlar bazasi yo‘q; bo‘sh `rsvpUrl` da RSVP tugmasi ko‘rsatilmaydi. Javoblar siz ulagan formaning o‘zida saqlanadi.

## 3. Mehmon ismi bilan maxsus havola

```text
https://sizning-saytingiz.uz/?guest=Ali&lang=uz
https://sizning-saytingiz.uz/?guest=Анна&lang=ru
```

Bir nechta so‘z bo‘lsa bo‘shliq o‘rniga `%20` yozish mumkin. `guest` — ism, `lang` — `uz` yoki `ru`. URLdagi til saqlangan tanlovdan ustun turadi. Saytdagi “Ulashish” tugmasi mehmonning shaxsiy ismini umumiy ulashiladigan havoladan olib tashlaydi.

## 4. Vercel’ga joylash

1. Loyihani o‘zingizning GitHub repozitoriyingizga yuklang (`node_modules`, `.next`, `out` yuklanmaydi).
2. Vercel’da **Add New → Project** orqali repozitoriyni import qiling.
3. Framework: **Next.js**. Build command: `npm run build`.
4. Deploy tugmasini bosing. Maxfiy env o‘zgaruvchilari kerak emas.
5. Tayyor domenni `config/wedding.ts` dagi `siteUrl` ga yozib, yana push qiling. Masalan `https://bizning-toy.vercel.app`.
6. Ismlar, sana, manzil, xarita va musiqani haqiqiy telefonda tekshiring; so‘ng mehmonlarga yuboring.

`output: 'export'` ishlatilgani sabab `out/` papkasini oddiy statik hostingga ham joylashtirish mumkin. `npm start` kerak emas. Taklifnoma qidiruv tizimlarida indekslanmasligi uchun `robots: noindex` qo‘yilgan; bu parol yoki maxfiylik himoyasi hisoblanmaydi. Ommaviy hostingga qo‘yilgach havolani bilgan kishi ko‘ra oladi.

## 5. Dizaynni o‘zgartirish

Ranglar `app/globals.css` boshidagi `:root` ichida. Asosiy yashil — `--green`, fon — `--paper`, oltin aksent — `--gold`.

Fayllar:

```text
app/                 sahifa, global uslublar, metadata
components/          interaktiv taklifnoma
config/wedding.ts    barcha shaxsiy sozlamalar
lib/i18n.ts          interfeysning uz/ru tarjimalari
lib/event.mjs        hisoblagich va kalendar yordamchilari
public/images/       gul rasmi va o‘z rasmlaringiz
public/music/        almashtirish mumkin bo‘lgan MP3
public/fonts/        lokal shriftlar va OFL litsenziyalari
tests/               vaqt zonasi va kalendar testlari
scripts/             original musiqani qayta yaratish skripti
```

Mobil tartib 320px dan boshlab alohida moslangan. Tugmalar teginish uchun yetarli o‘lchamda. `prefers-reduced-motion`, klaviatura fokusi, dialoglar va `safe-area-inset-bottom` hisobga olingan. Musiqa, rasm va shriftlar lokal; xarita va tashqi forma internetga bog‘liq.

## Tekshiruv holati

- TypeScript tekshiruvi va production build tekshirildi.
- Hisoblagich, vaqt zonasi, ICS eksporti, ruscha UTF-8 qatorlari va Google Calendar uchun 6 ta test bor.
- Bu muhitda haqiqiy mobil/desktop brauzer QA vositasi mavjud bo‘lmagani sabab ekran va ovozning brauzerdagi yakuniy sinovi bajarilmadi. Ulashishdan oldin o‘z telefoningizda tekshiring.

Shriftlar: Cormorant Garamond, Manrope — SIL Open Font License (matnlari `public/fonts/` ichida). Asosiy gul tasviri: ImageGen’da shu loyiha uchun yaratilgan. Oldingi original instrumentalning yaratish kodi `scripts/create_music.py` ichida; uni qayta yaratish uchun Python, NumPy va FFmpeg kerak, saytni ishlatish uchun kerak emas.
