/**
 * FAQAT SHU FAYLNI O‘ZGARTIRSANGIZ YETARLI.
 * Barcha ism, sana, manzil va matnlar bu yerdan olinadi.
 * Quyidagi ma’lumotlar NAMUNA. Haqiqiy to‘y ma’lumotlariga almashtiring.
 */
export const wedding = {
  // O‘zbekcha va ruscha yozilishini alohida yozishingiz mumkin.
  groom: { uz: 'Ahmadjon', ru: 'Ахмаджон' },
  bride: { uz: 'Madina', ru: 'Мадина' },
  families: { uz: 'Karimovlar va Rasulovlar oilasi', ru: 'Семьи Каримовых и Расуловых' },
  // +05:00 — O‘zbekiston vaqt zonasi. Formatni saqlang!
  date: '2027-06-12T18:00:00+05:00',
  endDate: '2027-06-12T23:00:00+05:00',
  timeZone: 'Asia/Tashkent',
  defaultLanguage: 'uz' as 'uz' | 'ru',
  venue: {
    name: { uz: 'Sizning to‘yxonangiz', ru: 'Ваш банкетный зал' },
    address: { uz: 'Toshkent shahri · To‘liq manzilni shu yerga yozing', ru: 'Город Ташкент · Укажите здесь полный адрес' },
    // Google Maps dan joy havolasini nusxalab, shu yerga qo‘ying.
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Tashkent',
    mapEmbedUrl: '', // ixtiyoriy Google Maps iframe src; bo‘sh bo‘lsa chiroyli dekorativ xarita chiqadi.
  },
  invitation: {
    uz: 'Hayotimizning eng go‘zal sahifasi boshlanmoqda. Ushbu unutilmas kunning quvonchini biz bilan baham ko‘rishingizni va to‘y oqshomimizning aziz mehmoni bo‘lishingizni chin dildan istaymiz.',
    ru: 'В нашей жизни начинается самая прекрасная глава. Мы от всего сердца приглашаем вас разделить с нами радость этого незабываемого дня и стать дорогими гостями нашего свадебного вечера.',
  },
  quote: {
    uz: 'Baxt — bir-birini topish. Muhabbat — bir umr birga qolishni tanlash.',
    ru: 'Счастье — найти друг друга. Любовь — каждый день выбирать быть вместе.',
  },
  program: [
    { time: '17:30', icon: 'welcome', title: { uz: 'Xush kelibsiz', ru: 'Добро пожаловать' }, description: { uz: 'Mehmonlarni kutib olish va samimiy uchrashuvlar', ru: 'Встреча гостей и тёплые объятия' } },
    { time: '18:00', icon: 'rings', title: { uz: 'Baxtli onlar', ru: 'Счастливые мгновения' }, description: { uz: 'Kelin-kuyovning tantanali kirib kelishi', ru: 'Торжественное появление молодожёнов' } },
    { time: '18:30', icon: 'dinner', title: { uz: 'Bayram dasturxoni', ru: 'Праздничный ужин' }, description: { uz: 'Ezgu tilaklar, tabriklar va lazzatli taomlar', ru: 'Добрые пожелания, поздравления и угощения' } },
    { time: '20:00', icon: 'music', title: { uz: 'Unutilmas oqshom', ru: 'Незабываемый вечер' }, description: { uz: 'Jonli musiqa, raqs va unutilmas lahzalar', ru: 'Музыка, танцы и самые счастливые моменты' } },
  ],
  dressCode: {
    enabled: true,
    text: { uz: 'O‘zingizni go‘zal va qulay his qiladigan libosda keling. Istasangiz, oqshomimizning tabiiy ranglaridan ilhom oling.', ru: 'Выберите наряд, в котором вам красиво и комфортно. При желании вдохновитесь естественными оттенками нашего вечера.' },
    colors: ['#e9e0d0', '#b8baa4', '#77836d', '#415447', '#c8ad88'],
  },
  // Konvert ochilgandan keyin gulbarg va oltin zarralar 14 soniya tushadi.
  celebration: { enabled: true, durationSeconds: 14 },
  music: {
    // Scott Buckley — CC BY 4.0. Shu kuy ishlatilsa, pastdagi muallif havolasini saqlang.
    src: '/music/this-too-shall-pass.mp3',
    title: { uz: 'This Too Shall Pass', ru: 'This Too Shall Pass' },
    volume: 0.5,
    credit: {
      artist: 'Scott Buckley',
      url: 'https://www.scottbuckley.com.au/library/this-too-shall-pass/',
      license: 'CC BY 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    },
  },
  // Rasmlarni public/images/ papkasiga qo‘yib, manzilini yozing.
  heroImage: '/images/wedding-arch.webp',
  // O‘zingizning fotosuratlaringiz bo‘lsa kiriting; bo‘sh ro‘yxatda galereya ko‘rinmaydi.
  gallery: [] as { src: string; alt: { uz: string; ru: string } }[],
  // Aloqa uchun telefonni xalqaro formatda kiriting. Bo‘sh qiymat tugmani yashiradi.
  contactPhone: '',
  contactName: { uz: 'Tashkilotchi', ru: 'Организатор' },
  // Ixtiyoriy Google Form yoki boshqa haqiqiy RSVP formasi URL. Bo‘sh bo‘lsa tugma yashiriladi.
  rsvpUrl: '',
  // Vercel yoki o‘z domeningizni joylashtirgach yozing. Bo‘sh bo‘lsa joriy havola ulashiladi.
  siteUrl: '',
};
