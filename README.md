# Kyberturvallisuuden itsearviointityökalu

[![Lisenssi: MIT](https://img.shields.io/badge/lisenssi-MIT-green)](LICENSE)
![NIS2](https://img.shields.io/badge/NIS2-itsearviointi-003399)
![Kielet](https://img.shields.io/badge/kielet-fi%20%7C%20en%20%7C%20sv-blue)
![Tiedot pysyvät selaimessa](https://img.shields.io/badge/tiedot-pysyv%C3%A4t%20selaimessa-1a847b)
![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript 6](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Vite 8](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS 3](https://img.shields.io/badge/Tailwind%20CSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![Node.js 24](https://img.shields.io/badge/Node.js-24-5FA04E?logo=nodedotjs&logoColor=white)
![pnpm 12](https://img.shields.io/badge/pnpm-12-F69220?logo=pnpm&logoColor=white)

Tämä työkalu on julkaistu osana [KYTEE-hanketta](https://www.roboai.fi/tutkimus-ja-tuotekehitys/projektit/kytee/).

Työkalun nykyinen täysi versio on käytettävissä osoitteessa [kyberarvio.roboai.fi](http://kyberarvio.roboai.fi/).

## KYTEE-hanke

Kyberturvaa Satakunnan teollisuuteen (Kytee) -hankkeen tavoitteena on levittää kyberturvallisuuteen ja EU-direktiiveihin (erityisesti NIS2) liittyvää tietoutta, tehdä kyberturvakartoituspilotteja, luoda SAMKiin kyberturvaharjoitusympäristö ja olla mukana valtakunnallisessa yhteistyöverkostossa.

Hankkeen tavoitteet:

1. Lisätä alueen teollisuuden tietoisuutta kyberuhista ja kyberturvallisuudesta
2. Parantaa alueen teollisuuden kyberturvallisuuden ja häiriönsietokyvyn tasoa
3. Rakentaa yhteistyöverkostoa
4. Varmistaa NIS2-direktiivin vaatimusten täyttyminen

|              |                                                             |
| :----------- | :---------------------------------------------------------- |
| Toteuttaja   | Satakunnan ammattikorkeakoulu (SAMK), RoboAI-tutkimuskeskus |
| Toteutusaika | 1.5.2024 - 31.5.2026                                        |
| Rahoitus     | Euroopan unioni, oikeudenmukaisen siirtymän rahasto (JTF)   |

<img src="https://github.com/RoboAI-Kytee/.github/blob/main/profile/euroopan-unionin-osarahoittama.png?raw=true" alt="Euroopan unionin osarahoittama" height="60"> <img src="https://github.com/RoboAI-Kytee/.github/blob/main/profile/satakuntaliitto.png?raw=true" alt="Satakuntaliitto" height="60">

## Mikä työkalu on

Selaimessa toimiva itsearviointityökalu, jolla organisaatio arvioi kyberturvallisuutensa kypsyystason suhteessa NIS2-direktiivin vaatimuksiin. Arviointimalli perustuu Kyberturvallisuuskeskuksen Kybermittarin 1. tason käytäntöihin.

Sovellus toimii kokonaan käyttäjän selaimessa. Arvioinnin vastaukset ja organisaation tiedot tallentuvat vain selaimen paikalliseen muistiin, eikä niitä lähetetä palvelimelle.

Tämä avoimen lähdekoodin versio sisältää työkalun perustoiminnot.

## Ominaisuudet

- Itsearviointi, jossa on 66 käytäntöä 11 osiossa
- Ohjeet jokaiselle osiolle
- Etenemisen seuranta osioittain ja koko arvioinnin tasolla
- Muistiinpanot ja kehityskohdemerkinnät yksittäisille käytännöille
- Tulosraportti neljällä näkymällä: yhteenveto, osiot, käytännöt ja vertailuarvot
- Kaavioiden lataaminen kuvina
- Arvioinnin tallennus Excel-tiedostoon ja tuonti aiemmin tallennetusta tiedostosta
- Vapaaehtoiset organisaation ja arvioinnin lisätiedot
- Kaikkien tallennettujen tietojen poistaminen selaimesta
- Kolme kieltä: suomi, englanti ja ruotsi
- Mukautuva asettelu ja säädettävä tekstikoko

## Oman arviointimallin lisääminen

Työkalun mukana tulee yksi arviointimalli (`roboai`). Oman mallin voi lisätä näin:

1. Lisää mallin sisältö tiedostoihin `src/data/assessment/<mallin-id>/i18n/{fi,en,sv}.json`. Rakenne on sama kuin `roboai`-mallissa: lista osioita, joilla on tavoitteita ja käytäntöjä.
2. Lisää halutessasi ohjeet tiedostoihin `src/docs/<mallin-id>/{fi,en,sv}/<osion-id>.mdx`.
3. Rekisteröi malli tiedostoon `src/data/models.json`: nimi, versio, tekijä, käytäntöjen määrä, ominaisuudet ja kuvaukset.
4. Lisää mallin tunniste `ALLOWED_MODELS`-listaan tiedostossa `src/store/appStore.ts`.

Kun malleja on rekisteröity useampi kuin yksi, käyttäjä voi valita mallin arviointimallit-sivulla ja sivupalkissa.

## Käyttöönotto

Vaatimukset: Node.js 24 ja [pnpm](https://pnpm.io/).

1. Kloonaa repositorio ja siirry projektikansioon.

2. Asenna riippuvuudet:

   ```bash
   pnpm install
   ```

3. Käynnistä kehityspalvelin:

   ```bash
   pnpm dev
   ```

4. Avaa selaimessa [http://localhost:5173](http://localhost:5173)

Sovellus ei tarvitse ympäristömuuttujia.

## Komennot

| Komento              | Toiminto                                                     |
| :------------------- | :----------------------------------------------------------- |
| `pnpm install`       | Asentaa riippuvuudet                                         |
| `pnpm dev`           | Käynnistää kehityspalvelimen osoitteeseen `localhost:5173`   |
| `pnpm build`         | Rakentaa tuotantoversion (TypeScript-tarkistus + Vite-build) |
| `pnpm preview`       | Esikatselee tuotantoversiota osoitteessa `localhost:4173`    |
| `pnpm test`          | Ajaa testit seurantatilassa                                  |
| `pnpm test:run`      | Ajaa testit kerran                                           |
| `pnpm test:coverage` | Ajaa testit ja tuottaa kattavuusraportin                     |
| `pnpm test:ui`       | Ajaa testit Vitestin käyttöliittymässä                       |
| `pnpm lint`          | Tarkistaa koodin oxlintillä                                  |
| `pnpm lint:fix`      | Tarkistaa koodin ja korjaa löydökset automaattisesti         |

## Julkaisu

`pnpm build` tuottaa staattisen sivuston kansioon `dist/`. Sen voi julkaista millä tahansa staattisten tiedostojen palvelimella. Koska kyseessä on yhden sivun sovellus, palvelin pitää määrittää palauttamaan `index.html` tuntemattomille poluille.

## Tekniikat

- [Vite](https://vitejs.dev/): build-työkalu ja kehityspalvelin
- [React 19](https://react.dev/): käyttöliittymäkirjasto
- [TypeScript](https://www.typescriptlang.org/): ohjelmointikieli
- [TanStack Router](https://tanstack.com/router): tyyppiturvallinen tiedostopohjainen reititys
- [TanStack Table](https://tanstack.com/table): taulukot
- [Tailwind CSS](https://tailwindcss.com/): tyylit
- [shadcn/ui](https://ui.shadcn.com/): käyttöliittymäkomponentit
- [Lucide Icons](https://lucide.dev/): kuvakkeet
- [ECharts](https://echarts.apache.org/): kaaviot
- [Zustand](https://zustand-demo.pmnd.rs/): tilanhallinta
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/): lomakkeet ja validointi
- [i18next](https://www.i18next.com/): kieliversiot
- [ExcelJS](https://github.com/exceljs/exceljs): Excel-tuonti ja -vienti
- [MDX](https://mdxjs.com/): ohjesisällöt
- [Vitest](https://vitest.dev/): testaus
- [oxlint](https://oxc.rs/docs/guide/usage/linter): koodin tarkistus

## Arkkitehtuuri

- **Käyttöliittymä**: yhden sivun sovellus (SPA), Vite + React 19
- **Reititys**: TanStack Router v1, tiedostopohjainen ja tyyppiturvallinen
- **Tyylit**: Tailwind CSS ja shadcn/ui-komponentit
- **Tila**: Zustand-storet, jotka tallentuvat selaimen paikalliseen muistiin
- **Ohjesisällöt**: MDX-tiedostot, jotka Vite käsittelee
- **Riippuvuudet**: toimitusketjun suojaus (asennusskriptien esto, julkaisujen vähimmäisikä) tiedostossa `pnpm-workspace.yaml`, viikoittaiset Dependabot-päivitykset

## Kansiorakenne

```text
/
├── public/                     # Staattiset tiedostot
│   └── locales/                # Käyttöliittymän käännökset (en/fi/sv)
├── src/
│   ├── app/                    # Sovelluksen toiminnot
│   │   ├── components/         # Komponentit aihepiireittäin
│   │   │   ├── badges/         # Merkit ja tunnisteet
│   │   │   ├── blocks/         # Käyttöliittymän osat (vastaukset, muistiinpanot, eteneminen, sivutus)
│   │   │   ├── charts/         # ECharts-kaaviot (pylväs, piirakka, tutka)
│   │   │   ├── docs/           # Osion ohjeiden näyttö
│   │   │   ├── exports/        # Excel-vienti
│   │   │   ├── markdown/       # MDX-ohjeiden käyttämät komponentit
│   │   │   ├── report/         # Raportin osat (kypsyystasokaaviot, taulukot, yhteenvedot)
│   │   │   ├── scroll/         # Vierityksen apukomponentit
│   │   │   ├── sidebar/        # Sivupalkin navigaatio
│   │   │   └── utils/          # Pienet yhteiset komponentit
│   │   ├── forms/              # Lomakkeet (React Hook Form + Zod)
│   │   ├── pages/              # Sivut
│   │   └── utils/              # Raportin laskenta ja mallin ominaisuudet
│   ├── assets/                 # Kuvat ja logot
│   ├── components/             # Koko sovelluksen yhteiset komponentit (Footer, Navigation, LanguageSwitcher)
│   │   └── ui/                 # shadcn/ui-komponentit
│   ├── data/                   # Arviointidata
│   │   ├── assessment/roboai/  # Arviointimalli kieliversioineen (en/fi/sv)
│   │   ├── framework/          # Viitekehysdata
│   │   └── *.json              # Taustadata (mallit, vastaavuudet, sanasto, vertailuarvot, toimialat)
│   ├── docs/roboai/            # MDX-ohjeet kielittäin (en/fi/sv)
│   ├── hooks/                  # React-hookit
│   ├── lib/                    # Apufunktiot
│   ├── routes/                 # TanStack Routerin reitit
│   ├── routeTree.gen.ts        # Automaattisesti luotu reittipuu (älä muokkaa käsin)
│   ├── schemas/                # Zod-validointiskeemat
│   ├── store/                  # Zustand-tila (sovellus, arviointi, malli, organisaatio)
│   └── types/                  # TypeScript-tyypit
├── index.html                  # Aloitussivu
├── vite.config.ts              # Viten asetukset
├── vitest.config.ts            # Vitestin asetukset
└── package.json
```

## Lisenssi

Projekti on julkaistu MIT-lisenssillä. Katso [LICENSE](LICENSE).

## Tietoturva

Ohjeet haavoittuvuuden ilmoittamiseen ovat tiedostossa [SECURITY.md](SECURITY.md).
