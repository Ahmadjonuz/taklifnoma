import { test } from 'node:test';
import assert from 'node:assert/strict';
import { countdown, displayDate, eventIcs, googleCalendarUrl } from '../lib/event.mjs';

test('countdown handles Uzbekistan offset independently of viewer timezone', () => {
  const now = new Date('2027-06-11T11:57:56Z').getTime();
  assert.deepEqual(countdown('2027-06-12T18:00:00+05:00', now), { days:1, hours:1, minutes:2, seconds:4, remaining:90124000 });
});
test('elapsed events never produce negative countdown values', () => {
  assert.deepEqual(countdown('2020-01-01', Date.now()), { days:0,hours:0,minutes:0,seconds:0,remaining:0 });
});
test('both languages display the event in Tashkent at 18:00', () => {
  for (const language of ['uz','ru']) {
    const result=displayDate('2027-06-12T18:00:00+05:00',language,'Asia/Tashkent');
    assert.equal(result.day,'12'); assert.equal(result.year,'2027'); assert.equal(result.time,'18:00');
  }
});
const event={title:'Ахмаджон & Мадина — Приглашение на свадьбу',description:'Hello, friends;\nWelcome!',location:'Toshkent',start:'2027-06-12T18:00:00+05:00',end:'2027-06-12T23:00:00+05:00'};
test('calendar download exports accurate UTC instants and escaped text', () => {
  const ics=eventIcs(event);
  assert.ok(ics.includes('DTSTART:20270612T130000Z'));
  assert.ok(ics.includes('DTEND:20270612T180000Z'));
  assert.ok(ics.includes('Hello\\, friends\\;\\nWelcome!'));
  assert.ok(ics.endsWith('END:VCALENDAR\r\n'));
});
test('Cyrillic calendar lines respect the 75-byte RFC folding limit', () => {
  const ics=eventIcs({...event,title:event.title.repeat(4)});
  for (const line of ics.split('\r\n')) assert.ok(Buffer.byteLength(line)<=75);
  assert.ok(ics.replace(/\r\n /g,'').includes('SUMMARY:'+event.title.repeat(4)));
});
test('Google Calendar link preserves Unicode and encodes the correct event window', () => {
  const url=new URL(googleCalendarUrl(event));
  assert.equal(url.hostname,'calendar.google.com');
  assert.equal(url.searchParams.get('text'),event.title);
  assert.equal(url.searchParams.get('dates'),'20270612T130000Z/20270612T180000Z');
});
