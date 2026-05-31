# Drivy — Istruzioni per pubblicare la tua copia

Drivy è una web app (installabile come app sul telefono) per monitorare consumi, costi e manutenzione dell'auto. Questo pacchetto è la versione "pulita": **nessun dato di altre persone**, parte vuota e pronta per i tuoi dati.

Ti servono solo due account gratuiti: **Google** (per Firebase, il database) e **GitHub** (per pubblicare il sito). Tempo richiesto: ~15 minuti. Non serve saper programmare.

---

## Passo 1 — Firebase (il database dove vengono salvati i dati)

1. Vai su https://console.firebase.google.com e accedi col tuo account Google.
2. **Crea un nuovo progetto** → dagli un nome (es. `Drivy`) → puoi disattivare Google Analytics → **Crea progetto**.
3. Nella panoramica del progetto, clicca **Aggiungi app** e scegli l'icona **Web** `</>`.
   - Dai un nickname (es. `Drivy Web`), **non** spuntare Firebase Hosting → **Registra app**.
4. Comparirà un blocco di codice con `const firebaseConfig = { ... }`. **Copia quei valori** (apiKey, authDomain, projectId, ecc.).
5. Apri il file **`config.js`** di questo pacchetto e incolla i tuoi valori al posto delle virgolette vuote. Esempio:
   ```js
   window.DRIVY_CONFIG = {
     apiKey: "AIza....",
     authDomain: "tuo-progetto.firebaseapp.com",
     projectId: "tuo-progetto",
     storageBucket: "tuo-progetto.firebasestorage.app",
     messagingSenderId: "1234567890",
     appId: "1:1234567890:web:abcdef...",
   };
   ```
6. Nel menu a sinistra: **Build → Firestore Database → Crea database**.
   - Versione **Standard** → località **eur3 (Europe)** → **Avvia in modalità test** → **Crea**.
7. Apri la scheda **Regole** (Rules) e sostituisci tutto con queste 6 righe, poi **Pubblica**:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} { allow read, write: if true; }
     }
   }
   ```
   > ⚠️ Queste regole rendono il database **aperto** (chiunque abbia il link dell'app può leggere/scrivere). Va bene per uso personale. Se vuoi proteggerlo, si può aggiungere il login Google: chiedi a chi ti ha passato l'app.

---

## Passo 2 — GitHub (per pubblicare il sito gratis)

1. Vai su https://github.com e accedi (o registrati).
2. In alto a destra **+ → New repository** → nome `drivy` → **Public** → **Create repository**.
3. Nella pagina del repo vuoto, clicca **uploading an existing file** (o **Add file → Upload files**).
4. **Trascina TUTTI i file di questo pacchetto** nella pagina (incluso il tuo `config.js` modificato). Poi **Commit changes**.
   - I file: `index.html`, `app.css`, `app.js`, `store.js`, `seed.js`, `stats.js`, `charts.js`, `config.js`, `manifest.webmanifest`, `sw.js`, `icon.svg`, `icon-maskable.svg`.
5. Vai su **Settings → Pages**.
   - Source: **Deploy from a branch** → Branch: **main** → cartella **/ (root)** → **Save**.
6. Dopo ~1 minuto, in cima alla pagina Pages comparirà l'indirizzo del tuo sito, tipo:
   `https://TUO-UTENTE.github.io/drivy/`

---

## Passo 3 — Usa l'app

1. Apri quell'indirizzo dal telefono. Per installarla come app: menu del browser → **Aggiungi a schermata Home**.
2. La prima volta è vuota: vai su **Garage → Aggiungi veicolo** e inserisci la tua auto (nome, modello, data e prezzo d'acquisto, foto, km iniziali).
3. Poi usa il pulsante **+ Aggiungi** per registrare rifornimenti e manutenzioni.

### Hai già lo storico su Drivvo?
Puoi importarlo: in Drivvo fai l'export CSV, poi nell'app vai su **Impostazioni → Importa CSV Drivvo** e seleziona il file. I movimenti verranno aggiunti al veicolo attivo.

---

## Note
- Il sito si aggiorna da solo quando ricarichi; se hai già aperto l'app e non vedi una modifica, ricarica un paio di volte.
- I dati stanno **solo** nel tuo Firebase: chi ti ha passato l'app non li vede.
- Tutto gratis: sia GitHub Pages sia il piano Spark di Firebase non hanno costi per questo tipo di utilizzo.
