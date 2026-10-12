'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, ArrowDown, CalendarDays, Check, ChevronLeft, ChevronRight, Clock3, Heart, MapPin, Music2, Pause, Phone, Share2, Sparkles, Utensils, Wine, X } from 'lucide-react';
import { wedding } from '@/config/wedding';
import { translations, type Language } from '@/lib/i18n';
import { countdown, displayDate, eventIcs, googleCalendarUrl } from '@/lib/event.mjs';
import OpeningPetals from '@/components/opening-petals';

function Sprig({ className = '' }: { className?: string }) {
  return <svg className={`sprig ${className}`} viewBox="0 0 120 180" fill="none" aria-hidden="true"><path d="M28 172C66 133 53 67 98 8" stroke="currentColor" strokeWidth="1.2"/><path d="M47 145C12 142 17 113 17 113C43 114 51 131 47 145ZM56 119C82 118 99 97 96 86C70 92 60 104 56 119ZM60 98C32 95 26 74 30 63C52 70 61 84 60 98ZM70 68C96 68 109 49 108 37C84 43 75 54 70 68ZM82 43C63 35 65 16 71 9C84 20 87 32 82 43Z" fill="currentColor" fillOpacity=".13" stroke="currentColor" strokeWidth=".8"/></svg>;
}

function LanguageSwitch({ language, onChange }: { language: Language; onChange: (value: Language) => void }) {
  return <div className="language-switch" role="group" aria-label="Til / Язык"><button type="button" lang="uz" aria-label="O‘zbek tili" aria-pressed={language === 'uz'} onClick={() => onChange('uz')}>UZ</button><span aria-hidden="true"/><button type="button" lang="ru" aria-label="Русский язык" aria-pressed={language === 'ru'} onClick={() => onChange('ru')}>RU</button></div>;
}

const programIcons = { welcome: Wine, rings: Heart, dinner: Utensils, music: Music2 };

export default function Invitation() {
  const [language, setLanguage] = useState<Language>(wedding.defaultLanguage);
  const [opened, setOpened] = useState(false);
  const [opening, setOpening] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [guest, setGuest] = useState('');
  const [remaining, setRemaining] = useState<ReturnType<typeof countdown> | null>(null);
  const [toast, setToast] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [photo, setPhoto] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const coverRef = useRef<HTMLElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const calendarRef = useRef<HTMLDialogElement>(null);
  const shareRef = useRef<HTMLDialogElement>(null);
  const galleryRef = useRef<HTMLDialogElement>(null);
  const openingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t = translations[language];
  const groom = wedding.groom[language];
  const bride = wedding.bride[language];
  const date = displayDate(wedding.date, language, wedding.timeZone);
  const initials = `${groom.charAt(0)} & ${bride.charAt(0)}`;
  const numericMonth = new Intl.DateTimeFormat('en', { month: '2-digit', timeZone: wedding.timeZone }).format(new Date(wedding.date));

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    let savedLanguage: string | null = null;
    try { savedLanguage = localStorage.getItem('mehr-language'); } catch { /* Storage can be disabled in private browsers. */ }
    const preferred = query.get('lang') || savedLanguage;
    if (preferred === 'uz' || preferred === 'ru') setLanguage(preferred);
    setGuest((query.get('guest') || '').trim().slice(0, 80));
    openButtonRef.current?.focus({ preventScroll: true });
    return () => { if (openingTimer.current) clearTimeout(openingTimer.current); };
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = `${groom} & ${bride} — ${t.title}`;
  }, [language, groom, bride, t.title]);

  useEffect(() => {
    if (opened) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [opened]);

  useEffect(() => {
    const tick = () => setRemaining(countdown(wedding.date));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!opened) return;
    headingRef.current?.focus({ preventScroll: true });
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    document.documentElement.classList.add('reveal-enabled');
    const observer = new IntersectionObserver((entries) => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('revealed'); observer.unobserve(entry.target); }
    }), { threshold: .08, rootMargin: '0px 0px -16px 0px' });
    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
    return () => { observer.disconnect(); document.documentElement.classList.remove('reveal-enabled'); };
  }, [opened]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(''), 4500);
    return () => clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    if (photo !== null) galleryRef.current?.showModal();
  }, [photo]);

  function changeLanguage(value: Language) {
    setLanguage(value);
    try { localStorage.setItem('mehr-language', value); } catch { /* Optional preference only. */ }
    const url = new URL(window.location.href);
    url.searchParams.set('lang', value);
    window.history.replaceState(null, '', url);
  }

  function playMusic() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = Math.min(1, Math.max(0, wedding.music.volume));
    void audio.play().catch(() => { setPlaying(false); setToast(t.musicError); });
  }

  function toggleMusic() {
    if (playing) audioRef.current?.pause(); else playMusic();
  }

  function openInvitation(withMusic: boolean) {
    if (opening || opened) return;
    if (withMusic) playMusic();
    setOpening(true);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    openingTimer.current = setTimeout(() => { setOpened(true); setOpening(false); }, reduceMotion ? 0 : 850);
  }

  function trapCoverFocus(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === 'Escape') { openInvitation(false); return; }
    if (event.key !== 'Tab') return;
    const controls = coverRef.current?.querySelectorAll<HTMLButtonElement>('button:not([disabled])');
    if (!controls?.length) return;
    const first = controls[0], last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  const calendarEvent = {
    title: `${groom} & ${bride} — ${t.title}`,
    description: wedding.invitation[language],
    location: `${wedding.venue.name[language]}, ${wedding.venue.address[language]}`,
    start: wedding.date,
    end: wedding.endDate,
  };

  function downloadCalendar() {
    const url = URL.createObjectURL(new Blob([eventIcs(calendarEvent)], { type: 'text/calendar;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url; link.download = 'wedding-invitation.ics';
    document.body.appendChild(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    calendarRef.current?.close();
  }

  async function shareInvitation() {
    const url = new URL(wedding.siteUrl || window.location.href);
    url.hash = ''; url.searchParams.set('lang', language);
    // A personalised guest name is not forwarded when sharing the public invitation.
    url.searchParams.delete('guest');
    const data = { title: `${groom} & ${bride}`, text: t.shareText, url: url.href };
    if (navigator.share) {
      try { await navigator.share(data); return; }
      catch (error) { if (error instanceof Error && error.name === 'AbortError') return; }
    }
    try { await navigator.clipboard.writeText(url.href); setToast(t.copied); }
    catch { setShareLink(url.href); shareRef.current?.showModal(); }
  }

  const countValues = [remaining?.days, remaining?.hours, remaining?.minutes, remaining?.seconds];
  const countLabels = [t.days, t.hours, t.minutes, t.seconds];
  const eventEnded = remaining?.remaining === 0 && Date.now() > new Date(wedding.endDate).getTime();

  return <>
    {opened && wedding.celebration.enabled && <OpeningPetals durationSeconds={wedding.celebration.durationSeconds} />}
    <audio ref={audioRef} src={wedding.music.src} preload="none" loop onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => { setPlaying(false); if (opened || opening) setToast(t.musicError); }} />
    {!opened && <section ref={coverRef} role="dialog" aria-modal="true" aria-labelledby="cover-title" className={`cover ${opening ? 'opening' : ''}`} onKeyDown={trapCoverFocus}>
      <div className="cover-top"><span className="brand-word">mehr<span>•</span></span><LanguageSwitch language={language} onChange={changeLanguage}/></div>
      <div className="cover-content">
        <span className="eyebrow">{t.coverEyebrow}</span>
        <h1 id="cover-title">{t.coverTitle}<br/><em>{t.coverSubtitle}</em></h1>
        <div className="envelope-scene" aria-hidden="true">
          <Sprig className="envelope-sprig left"/><Sprig className="envelope-sprig right"/>
          <div className="envelope"><div className="envelope-letter"><Heart size={20} strokeWidth={1}/><span>{groom}<i>&</i>{bride}</span></div><div className="envelope-front"/><div className="envelope-flap"/><div className="wax-seal"><span>{initials}</span></div></div>
        </div>
        {guest && <p className="cover-guest">{guest}</p>}
        <button ref={openButtonRef} className="button primary cover-open" onClick={() => openInvitation(true)} aria-disabled={opening}>{t.open}<ArrowUpRight size={17}/></button>
        <p className="sound-hint"><Music2 size={12}/>{t.soundHint}</p>
        <button className="text-button silent-button" onClick={() => openInvitation(false)} aria-disabled={opening}>{t.silent}</button>
      </div>
      <span className="cover-footer">{date.day} · {numericMonth} · {date.year}</span>
    </section>}

    <div className={`site-shell ${opened ? 'is-open' : ''}`} inert={!opened}>
      <header className="site-header">
        <a className="monogram" href="#home" aria-label={`${groom} & ${bride}`}>{initials}</a>
        <nav aria-label={t.navLabel}><a href="#invitation">{t.invitation}</a><a href="#program">{t.program}</a><a href="#venue">{t.venue}</a></nav>
        <LanguageSwitch language={language} onChange={changeLanguage}/>
      </header>
      <main>
        <section id="home" className="hero">
          <div className="hero-copy">
            <div className="eyebrow hero-eyebrow"><span/>{t.heroEyebrow}</div>
            <h1 ref={headingRef} tabIndex={-1} className="hero-names"><span>{groom}</span><i>&</i><span>{bride}</span></h1>
            <div className="hero-message"><h2>{t.heroTitle}</h2><p>{t.heroSubtitle}</p></div>
            <div className="hero-date"><span>{date.day}</span><div><strong>{date.month} {date.year}</strong><small>{date.weekday} · {date.time}</small></div></div>
            <a className="button primary" href="#invitation">{t.heroCta}<ArrowDown size={17}/></a>
          </div>
          <div className="hero-art">
            <div className="arch-outline"/>
            <div className="hero-image-wrap"><Image className="hero-image" src={wedding.heroImage} alt="" width={1024} height={1536} priority sizes="(max-width: 700px) 88vw, 45vw"/><div className="art-caption"><span>{date.day} / {numericMonth}</span><i>{date.year}</i></div></div>
            <div className="love-stamp"><Heart size={20} strokeWidth={1}/><span>{language === 'uz' ? 'bir umr' : 'навсегда'}</span></div>
            <span className="art-side-note">{t.madeWith} — {date.year}</span>
          </div>
          <a href="#invitation" className="hero-scroll"><span>{t.scroll}</span><ArrowDown size={14}/></a>
        </section>

        <section id="invitation" className="invitation-section section-pad">
          <Sprig className="invitation-sprig left"/><Sprig className="invitation-sprig right"/>
          <div className="invitation-inner" data-reveal>
            <span className="eyebrow">{t.chapterOne}</span>
            <div className="tiny-ornament"><span/><Heart size={15} strokeWidth={1}/><span/></div>
            <h2>{guest ? (language === 'uz' ? `Aziz ${guest}!` : `${guest}, ждём вас!`) : t.dear}</h2>
            <p className="invitation-text">{wedding.invitation[language]}</p>
            <p className="family-signature"><span>{t.withLove}</span><strong>{wedding.families[language]}</strong></p>
          </div>
        </section>

        <section className="countdown-section section-pad">
          <div className="countdown-inner" data-reveal>
            <span className="eyebrow">{t.countdownEyebrow}</span>
            <h2>{remaining?.remaining === 0 ? (eventEnded ? t.passed : t.today) : t.countdownTitle}</h2>
            <div className="countdown" role="timer" aria-label={t.countdownTitle}>
              {countValues.map((value, i) => <div className="countdown-part" key={countLabels[i]}><span className="count-number">{value === undefined ? '—' : String(value).padStart(2, '0')}</span><span className="count-label">{countLabels[i]}</span></div>)}
            </div>
            <button className="button outline-light" onClick={() => calendarRef.current?.showModal()}><CalendarDays size={16}/>{t.calendar}</button>
          </div>
          <div className="countdown-circle one"/><div className="countdown-circle two"/>
        </section>

        <section id="program" className="program-section section-pad">
          <div className="section-heading" data-reveal><span className="eyebrow">{t.chapterTwo}</span><h2>{t.programTitle}</h2><p>{t.programSubtitle}</p></div>
          <div className="timeline">
            {wedding.program.map((event, index) => { const Icon = programIcons[event.icon as keyof typeof programIcons] || Heart; return <article className="timeline-item" data-reveal key={`${event.time}-${index}`} style={{ transitionDelay: `${index * 60}ms` }}><time>{event.time}</time><div className="timeline-symbol"><Icon size={22} strokeWidth={1.25}/></div><div><h3>{event.title[language]}</h3><p>{event.description[language]}</p></div><span className="timeline-index">0{index + 1}</span></article>; })}
          </div>
        </section>

        <section className="quote-section" data-reveal><span className="quote-mark" aria-hidden="true">“</span><blockquote>{wedding.quote[language]}</blockquote><div className="tiny-ornament"><span/><Heart size={14} strokeWidth={1}/><span/></div></section>

        <section id="venue" className="venue-section section-pad">
          <div className="venue-copy" data-reveal><span className="eyebrow">{t.chapterThree}</span><h2>{t.venueTitle}</h2><h3>{wedding.venue.name[language]}</h3><div className="venue-detail"><MapPin size={20} strokeWidth={1.3}/><div><span>{t.address}</span><p>{wedding.venue.address[language]}</p></div></div><div className="venue-detail"><Clock3 size={20} strokeWidth={1.3}/><div><span>{t.time}</span><p>{date.full} · {date.time}</p></div></div><a className="button primary" href={wedding.venue.mapUrl} target="_blank" rel="noopener noreferrer">{t.map}<ArrowUpRight size={17}/></a></div>
          <div className="venue-map" data-reveal>
            {wedding.venue.mapEmbedUrl ? <iframe src={wedding.venue.mapEmbedUrl} title={wedding.venue.name[language]} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade"/> : <a className="map-illustration" href={wedding.venue.mapUrl} target="_blank" rel="noopener noreferrer" aria-label={t.map}>
              <svg className="map-lines" viewBox="0 0 500 440" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="500" height="440" fill="#e8e9de"/><path d="M-20 90 150 120 220 40 550 85M-20 345 180 240 310 260 540 180M100-10 130 160 80 460M370-20 340 140 400 460" stroke="#faf9f3" strokeWidth="24" fill="none"/><path d="M-20 90 150 120 220 40 550 85M-20 345 180 240 310 260 540 180M100-10 130 160 80 460M370-20 340 140 400 460" stroke="#d5d7c8" strokeWidth="1" fill="none"/><path d="M-40 430Q100 360 190 400T550 330" stroke="#c4d7cf" strokeWidth="36" fill="none"/><path d="M170 160h95v55h-95zM200 285h112v55H200zM410 95h60v45h-60zM15 170h65v85H15z" fill="#d2d9c3" rx="10"/></svg>
              <div className="map-pin"><MapPin size={25} strokeWidth={1.5}/><span>{wedding.venue.name[language]}</span></div><span className="map-open"><ArrowUpRight size={18}/></span><span className="map-caption">{t.mapCaption}</span>
            </a>}
          </div>
        </section>

        {wedding.dressCode.enabled && <section className="dress-section section-pad"><div data-reveal><span className="eyebrow">{t.chapterFour}</span><h2>{t.dressTitle}</h2><p>{wedding.dressCode.text[language]}</p><div className="palette" aria-label={t.dressTitle}>{wedding.dressCode.colors.map((color, i) => <span key={`${color}-${i}`} style={{ backgroundColor: color, animationDelay: `${i * .15}s` }} aria-label={color}/>)}</div><span className="small-label">{t.dressLabel}</span></div><Sprig className="dress-sprig"/></section>}

        {wedding.gallery.length > 0 && <section className="gallery-section section-pad"><div className="section-heading" data-reveal><span className="eyebrow"><Sparkles size={14}/></span><h2>{t.gallery}</h2></div><div className="gallery-grid">{wedding.gallery.map((item, index) => <button className="gallery-item" key={`${item.src}-${index}`} onClick={() => setPhoto(index)} aria-label={`${t.photo}: ${item.alt[language]}`} data-reveal><Image src={item.src} alt={item.alt[language]} width={600} height={800} sizes="(max-width:700px) 44vw, 28vw"/></button>)}</div></section>}

        <section className="closing-section section-pad"><div data-reveal><div className="closing-monogram">{initials}</div><span className="eyebrow">{date.day} · {numericMonth} · {date.year}</span><h2>{t.closing}</h2><p>{t.closingText}</p><div className="closing-actions">{wedding.rsvpUrl && <a className="button primary" href={wedding.rsvpUrl} target="_blank" rel="noopener noreferrer"><Check size={17}/>{t.rsvp}</a>}{wedding.contactPhone && <a className="button secondary" href={`tel:${wedding.contactPhone.replace(/[^+\d]/g, '')}`}><Phone size={16}/>{t.contact}</a>}<button className="share-button" onClick={() => void shareInvitation()}><Share2 size={16}/>{t.share}</button></div></div></section>
      </main>
      <footer className="site-footer"><span>{groom} <i>&</i> {bride}</span><div className="footer-details"><span className="made-with">{t.madeWith}<Heart size={11}/></span>{wedding.music.credit.artist && <small className="music-credit">{t.music}: <a href={wedding.music.credit.url} target="_blank" rel="noopener noreferrer">{wedding.music.title[language]} — {wedding.music.credit.artist}</a> · <a href={wedding.music.credit.licenseUrl} target="_blank" rel="noopener noreferrer">{wedding.music.credit.license}</a></small>}</div></footer>
      <div className="floating-controls"><a className="floating-map" href={wedding.venue.mapUrl} target="_blank" rel="noopener noreferrer"><MapPin size={16}/><span>{t.venue}</span><ArrowUpRight size={13}/></a><span className="controls-divider"/><button className={`music-toggle ${playing ? 'playing' : ''}`} aria-label={playing ? t.musicOff : t.musicOn} aria-pressed={playing} onClick={toggleMusic}><span className="equalizer" aria-hidden="true"><i/><i/><i/><i/></span><span>{t.music}</span>{playing ? <Pause size={13}/> : <Music2 size={13}/>}</button></div>
    </div>

    {toast && <div className="toast" role="status">{toast}</div>}
    <dialog ref={calendarRef} className="modal calendar-modal" onClick={event => { if (event.target === event.currentTarget) calendarRef.current?.close(); }} aria-labelledby="calendar-title"><button className="modal-close" onClick={() => calendarRef.current?.close()} aria-label={t.close}><X size={20}/></button><CalendarDays size={30} strokeWidth={1}/><h2 id="calendar-title">{t.calendar}</h2><p>{groom} & {bride}<br/>{date.full} · {date.time}</p><a className="button primary" href={googleCalendarUrl(calendarEvent)} target="_blank" rel="noopener noreferrer" onClick={() => calendarRef.current?.close()}>{t.calendarGoogle}<ArrowUpRight size={16}/></a><button className="button secondary" onClick={downloadCalendar}>{t.calendarApple}<ArrowDown size={16}/></button></dialog>
    <dialog ref={shareRef} className="modal" aria-labelledby="share-title"><button className="modal-close" onClick={() => shareRef.current?.close()} aria-label={t.close}><X size={20}/></button><h2 id="share-title">{t.shareError}</h2><input className="share-input" value={shareLink} readOnly onFocus={e => e.target.select()} aria-label={t.share}/><button className="button primary" onClick={() => shareRef.current?.close()}>{t.close}</button></dialog>
    <dialog ref={galleryRef} className="lightbox" aria-label={t.gallery} onClose={() => setPhoto(null)} onClick={event => { if (event.target === event.currentTarget) galleryRef.current?.close(); }} onKeyDown={event => { if (photo === null) return; if (event.key === 'ArrowRight') { event.preventDefault(); setPhoto((photo + 1) % wedding.gallery.length); } if (event.key === 'ArrowLeft') { event.preventDefault(); setPhoto((photo - 1 + wedding.gallery.length) % wedding.gallery.length); } }}><button className="modal-close" onClick={() => galleryRef.current?.close()} aria-label={t.close}><X size={22}/></button>{photo !== null && <><button className="gallery-arrow previous" aria-label={t.previous} onClick={() => setPhoto((photo - 1 + wedding.gallery.length) % wedding.gallery.length)}><ChevronLeft/></button><Image src={wedding.gallery[photo].src} alt={wedding.gallery[photo].alt[language]} width={1200} height={1600} sizes="90vw"/><button className="gallery-arrow next" aria-label={t.next} onClick={() => setPhoto((photo + 1) % wedding.gallery.length)}><ChevronRight/></button></>}</dialog>
    <noscript><div className="noscript-notice">Taklifnomani ochish uchun JavaScript&apos;ni yoqing. / Для просмотра приглашения включите JavaScript.</div></noscript>
  </>;
}
