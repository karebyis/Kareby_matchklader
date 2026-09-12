# Kareby Matchkläder – Beställningssystem

Webbaserat beställningssystem för Kareby matchkläder.

Systemet används för att samla in beställningar av matchtröjor, målvaktströjor, shorts och strumpor via en egen webbsida.

## Funktioner

- Beställning av matchtröjor
- Beställning av målvaktströjor
- Beställning av shorts
- Beställning av strumpor
- Val av storlek och antal
- Nummer 2–29 för matchtröjor
- Nummer 1 och 30 för målvaktströjor
- Fritextfält för övriga önskemål
- Automatisk sammanställning av beställningen
- Automatiskt ordernummer
- Beställningar sparas i Google Sheets
- Automatisk bekräftelse via e-post
- Bekräftelse skickas till både beställaren och administratören
- Orderstatus:
  - Ny
  - Beställd
  - Levererad
  - Utlämnad
  - Makulerad
- Responsiv design för dator, surfplatta och mobil
- Sticky rubriker vid scrollning
- Sticky nummerkolumn vid horisontell scrollning

## Produkter

### Matchtröjor Herr

- Röd Matchtröja Herr
- Blå Matchtröja Herr
- Storlekar: XS, S, M, L, XL, XXL

### Matchtröjor Dam

- Röd Matchtröja Dam
- Blå Matchtröja Dam
- Storlekar: XS, S, M, L, XL, XXL

### Matchtröjor Junior

- Röd Matchtröja Junior
- Blå Matchtröja Junior
- Storlekar:
  - 122/128
  - 134/140
  - 146/152
  - 158/164

### Målvaktströjor Herr

- Gul Målvaktströja Herr
- Storlekar: XS, S, M, L, XL, XXL
- Nummer: 1 eller 30

### Målvaktströjor Dam

- Gul Målvaktströja Dam
- Storlekar: XS, S, M, L, XL, XXL
- Nummer: 1 eller 30

### Målvaktströjor Junior

- Gul Målvaktströja Junior
- Storlekar:
  - 122/128
  - 134/140
  - 146/152
  - 158/164
- Nummer: 1 eller 30

### Shorts

- Röd Shorts Herr
- Blå Shorts Herr
- Röd Shorts Dam
- Blå Shorts Dam
- Röd Shorts Junior
- Blå Shorts Junior
- Svarta Shorts Herr
- Svarta Shorts Dam
- Svarta Shorts Junior

Shorts beställs efter storlek och antal.

### Strumpor

Färger:

- Blå
- Röd
- Svarta
- Vita
- Gula

Storlekar:

- 28–30
- 31–33
- 34–36
- 37–39
- 40–42
- 43–45
- 46–48

## Hur systemet fungerar

### 1. Användaren fyller i beställningen

Användaren anger:

- E-postadress
- Namn
- Lag

Därefter väljs produkter, storlekar, antal och eventuella tröjnummer.

### 2. Sammanställning

Längst ner på sidan visas en sammanställning av beställningen innan den skickas.

Användaren kan:

- Skicka beställningen
- Rensa formuläret

Rensning kräver bekräftelse.

### 3. Beställningen skickas

När användaren klickar på "Skicka beställning" skickas informationen till Google Apps Script.

Beställningen skickas som JSON-data.

### 4. Google Apps Script

Google Apps Script fungerar som backend och hanterar beställningen.

Backend:

1. Tar emot beställningen.
2. Skapar ett nytt ordernummer.
3. Sparar beställningen i Google Sheets.
4. Skapar orderstatus.
5. Formaterar orderinformationen.
6. Skickar bekräftelse via e-post.

### 5. Google Sheets

Alla beställningar sparas i ett Google Sheet.

Varje order använder två kolumner och separeras från nästa order med en tom kolumn.

Exempel:

    A:B    Order 1001
    C      Tom kolumn
    D:E    Order 1002
    F      Tom kolumn
    G:H    Order 1003
    I      Tom kolumn
    J:K    Order 1004

På så sätt placeras nya beställningar horisontellt istället för under varandra.

## Ordernummer

Ordernummer skapas automatiskt av Google Apps Script.

Första ordernumret är:

    1001

Därefter ökas ordernumret automatiskt:

    1001
    1002
    1003
    1004
    ...

Ordernumret sparas tillsammans med beställningen.

## Orderstatus

Varje order har en status som kan ändras direkt i Google Sheets.

Tillgängliga statusar:

    Ny
    Beställd
    Levererad
    Utlämnad
    Makulerad

En order bör normalt inte raderas från kalkylarket.

Om en order inte längre ska genomföras används istället statusen:

    Makulerad

Det gör att orderhistoriken finns kvar.

## E-postbekräftelse

Efter att en beställning har skickats skickas en bekräftelse via e-post.

Bekräftelsen skickas till:

- Beställarens angivna e-postadress
- Administratörens e-postadress

Administratörens e-postadress anges i Google Apps Script.

## Projektstruktur

Projektet är uppbyggt enligt följande:

    Kareby_matchkläder_beställning/
    │
    ├── index.html
    │
    ├── google-apps-script/
    │   └── Code.gs
    │
    ├── README.md
    │
    └── .gitignore

### index.html

Innehåller hela beställningsformuläret och webbplatsens layout.

Här finns bland annat:

- HTML
- CSS
- JavaScript
- Produktlistor
- Storlekar
- Beställningslogik
- Sammanställning

### Code.gs

Google Apps Script som fungerar som backend.

Hanterar bland annat:

- Mottagning av beställningar
- Ordernummer
- Google Sheets
- Orderstatus
- E-postbekräftelser

### README.md

Den här filen innehåller dokumentation för projektet.

## Google Apps Script

För att använda systemet behöver Google Apps Script vara publicerat som en webbapp.

Grundprincipen är:

    Webbplats
        │
        │ Beställning
        ▼
    Google Apps Script
        │
        ├──► Google Sheets
        │
        └──► E-post

Webbappens URL används sedan av `index.html` när beställningen skickas.

## Google Sheets

Google Apps Script använder bladet:

    Beställningar

Varje order sparas som ett eget block med två kolumner.

Exempel:

    ┌───────────────────────────┐
    │ Order 1001               │
    ├─────────────┬─────────────┤
    │ Status      │ Ny          │
    │ Datum       │ ...         │
    │ Namn        │ ...         │
    │ E-post      │ ...         │
    │ Lag         │ ...         │
    │ Produkt     │ Antal       │
    │ ...         │ ...         │
    └─────────────┴─────────────┘

            TOM KOLUMN

    ┌───────────────────────────┐
    │ Order 1002               │
    ├─────────────┬─────────────┤
    │ Status      │ Ny          │
    │ Datum       │ ...         │
    │ Namn        │ ...         │
    │ E-post      │ ...         │
    │ Lag         │ ...         │
    │ Produkt     │ Antal       │
    │ ...         │ ...         │
    └─────────────┴─────────────┘

## Installation

### Webbplats

`index.html` kan publiceras på en webbserver eller via GitHub Pages.

### Google Apps Script

1. Skapa ett Google Sheet.
2. Öppna Google Sheets.
3. Gå till "Tillägg → Apps Script".
4. Lägg in innehållet från `Code.gs`.
5. Spara projektet.
6. Distribuera projektet som en webbapp.
7. Kopiera webbappens URL.
8. Lägg in URL:en i `index.html`.

## Uppdatera projektet

Efter ändringar i projektet kan ändringarna skickas till GitHub med:

    git add .
    git commit -m "Beskriv ändringen"
    git push

Exempel:

    git add .
    git commit -m "Uppdaterade mobil layout"
    git push

## GitHub

Projektet finns i GitHub-repositoryt:

    ludenrofv/Kareby_matchkl-der_best-llning

## Viktigt vid ändringar

Om Google Apps Script distribueras på nytt och webbappens URL ändras måste den nya URL:en även uppdateras i `index.html`.

Ändringar i webbplatsen påverkar inte automatiskt Google Apps Script.

Ändringar i `Code.gs` behöver däremot publiceras/uppdateras i Google Apps Script för att den aktiva webbappen ska använda den nya koden.

## Framtida utveckling

Möjliga framtida funktioner:

- Automatisk färgkodning av orderstatus
- Administratörsvy
- Sökning och filtrering av beställningar
- Statistik över beställda produkter och storlekar
- Lagerhantering
- Lagersaldo
- Export av beställningar
- PDF för enskilda beställningar
- Automatisk avisering vid ändrad orderstatus
- Inloggning för administratörer
- Möjlighet att öppna och stänga beställningsperioder

## Licens

Projektet är avsett för intern användning inom Kareby och är inte avsett för offentlig distribution.