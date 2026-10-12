export function countdown(target, now = Date.now()) {
  const remaining = Math.max(0, new Date(target).getTime() - now);
  return { days: Math.floor(remaining / 86400000), hours: Math.floor(remaining / 3600000) % 24, minutes: Math.floor(remaining / 60000) % 60, seconds: Math.floor(remaining / 1000) % 60, remaining };
}
const utcStamp = (value) => new Date(value).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const icsEscape = (value) => String(value).replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
// RFC 5545: lines are folded at 75 UTF-8 bytes (important for Cyrillic names).
function foldLine(line) {
  let result = '', current = '', bytes = 0;
  for (const character of line) {
    const size = new TextEncoder().encode(character).length;
    if (bytes + size > 75) { result += current + '\r\n'; current = ' '; bytes = 1; }
    current += character; bytes += size;
  }
  return result + current;
}
export function eventIcs({ title, description, location, start, end }) {
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Mehr//Wedding Invitation//UZ', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT',
    `UID:mehr-${new Date(start).getTime()}@wedding.local`, `DTSTAMP:${utcStamp(new Date())}`, `DTSTART:${utcStamp(start)}`, `DTEND:${utcStamp(end)}`,
    `SUMMARY:${icsEscape(title)}`, `DESCRIPTION:${icsEscape(description)}`, `LOCATION:${icsEscape(location)}`, 'END:VEVENT', 'END:VCALENDAR'].map(foldLine).join('\r\n') + '\r\n';
}
export function googleCalendarUrl({ title, description, location, start, end }) {
  return 'https://calendar.google.com/calendar/render?' + new URLSearchParams({ action:'TEMPLATE', text:title, details:description, location, dates:`${utcStamp(start)}/${utcStamp(end)}` }).toString();
}
export function displayDate(value, language, timeZone) {
  const locale = language === 'uz' ? 'uz-Latn-UZ' : 'ru-RU';
  return {
    day: new Intl.DateTimeFormat(locale, { day: '2-digit', timeZone }).format(new Date(value)),
    month: new Intl.DateTimeFormat(locale, { month: 'long', timeZone }).format(new Date(value)),
    year: new Intl.DateTimeFormat(locale, { year: 'numeric', timeZone }).format(new Date(value)),
    weekday: new Intl.DateTimeFormat(locale, { weekday: 'long', timeZone }).format(new Date(value)),
    time: new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone }).format(new Date(value)),
    full: new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone }).format(new Date(value)),
  };
}
