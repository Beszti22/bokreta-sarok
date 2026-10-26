# Bokréta Sarok Virágüzlet

Statikus HTML/CSS/JS weboldal a Bokréta Sarok Virágüzlet (Budapest, Mester u.–Bokréta u. sarok) számára.

## Felépítés

- `index.html` — az oldal teljes tartalma
- `styles.css` — CSS egyéni tulajdonságok (változók) alapú stílusrendszer
- `main.js` — nyelvváltó (HU/EN, localStorage), galéria lightbox, kapcsolati űrlap
- `i18n.js` — HU/EN fordítási kulcsok
- `api/contact.js` — Vercel serverless function, Resenden keresztül küldi tovább a kapcsolati űrlapot
- `images/` — a galéria és hero képek (WebP, valódi üzleti fotókból)

## Deploy

A `main` branch-re pusholt commit automatikusan deployol a Vercelen keresztül.

## Teendők a teljes éleshez

- [x] Képek feltöltése az `images/` mappába (hero.webp, shop-1..5.webp + thumbnail verziók) — valódi üzleti fotókból
- [x] Nyitvatartás pontosítása (H–P 9–19, Szo 8–16, V zárva — Google Maps bejegyzés alapján)
- [x] Karácsonyi díszes kép (IMG_0696) kihagyva — nem évkörtől független; dolgozós kép (IMG_0697) bekerült 5. galériaelemként
- [ ] Domain regisztrálása és Vercelhez kötése
- [ ] Resend domain-verifikáció (DNS rekordok — ellenőrizd, hol vannak a nameserverek, mielőtt bármit módosítasz)
- [ ] Vercel env változók: `RESEND_API_KEY`, `CONTACT_FROM_ADDRESS`, `CONTACT_TO_ADDRESS` (Config típusként, nem Secret)
