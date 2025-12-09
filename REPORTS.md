# Report di Progetto: LinguaPro AI

## Panoramica
LinguaPro AI è una piattaforma di apprendimento linguistico professionale ("Duolingo Professional") che utilizza l'intelligenza artificiale generativa per creare lezioni personalizzate, adattate al livello e alla lingua madre dell'utente.

## Caratteristiche Principali

### 1. Apprendimento Adattivo & Generativo
A differenza delle app tradizionali con contenuti statici, LinguaPro AI utilizza **Google Gemini (`gemini-2.5-flash`)** per generare esercizi in tempo reale.
- **Prompt Dinamici**: Ogni lezione (es. "Email Etiquette") viene creata al momento, garantendo che gli esercizi siano sempre vari.
- **Contestualizzazione**: L'AI riceve istruzioni per adattare il contenuto alla lingua madre dell'utente (es. spiegare la grammatica tedesca a un utente italiano).

### 2. Supporto Multilingua Totale
L'architettura supporta una matrice N x N di lingue.
- **Lingua Target (Cosa impari)**: Inglese, Spagnolo, Francese, Tedesco, Cinese, Giapponese, Russo, Turco, ecc.
- **Lingua Base (Cosa parli)**: L'utente può scegliere la propria lingua madre. Tutta l'interfaccia e, soprattutto, le **spiegazioni degli errori** vengono fornite in questa lingua.

### 3. Correzione Intelligente (AI Tutor)
Quando l'utente commette un errore:
1. Il sistema rileva la risposta errata.
2. Viene inviata una richiesta specifica all'AI includendo la domanda, la risposta dell'utente e la risposta corretta.
3. L'AI genera una spiegazione concisa (max 50 parole) nella lingua madre dell'utente per chiarire il "perché" dell'errore (sfumature grammaticali, tono formale/informale, ecc.).

## Architettura Tecnica

### Stack Tecnologico
- **Frontend**: React 19, TypeScript.
- **Styling**: Tailwind CSS per un design pulito, responsive e professionale ("Inter" font family).
- **AI Integration**: Google GenAI SDK (`@google/genai`).
- **Icons**: Lucide React.

### Flusso dei Dati
1. **Configurazione**: L'utente seleziona Lingua Base e Lingua Target nella Dashboard.
2. **Generazione**: Al click su una lezione, `geminiService.ts` invia un prompt strutturato richiedendo un JSON con 5 esercizi (`Exercise[]`).
3. **Esecuzione**: `LessonRunner.tsx` renderizza gli esercizi (Scelta multipla, Traduzione, Completamento).
4. **Validazione**: La validazione avviene lato client per velocità, ma le spiegazioni sono asincrone via AI.

## Stato del Progetto
L'applicazione è un prototipo funzionale (MVP).
- **Funzionante**: Navigazione, selezione lingue, generazione esercizi, validazione, spiegazione errori, calcolo XP.
- **Futuri Sviluppi**: Persistenza dati (Database), modalità vocale (usando Gemini Live API), generazione di scenari di roleplay complessi.