# Security Policy

## Supported Versions

Currently, only the latest deployment of LinguaPro AI is supported.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of LinguaPro AI seriously. If you discover a security vulnerability, please follow these steps:

1.  **Do not** open a public issue on GitHub or social media regarding critical security flaws.
2.  Email the security team (Note: This is a demo project, please use standard channels for the hosting platform).
3.  Include a detailed description of the vulnerability and steps to reproduce it.

## API Keys and Secrets Management

### Google Gemini API Key
This application relies on the Google Gemini API to generate content.
*   **Injection**: The API key is injected at runtime via `process.env.API_KEY`.
*   **Storage**: The key should strictly be stored in environment variables and never hardcoded in the source files (`.tsx`, `.ts`, `.html`).
*   **Client-Side Caution**: As this is a client-side React application (SPA), the API key is theoretically exposed to the user's browser network tab.
    *   *Recommendation for Production*: In a real-world production environment, you should route all AI requests through a secure backend proxy (Node.js/Python) to keep the API Key hidden from the client browser.

## Data Privacy

### AI Interactions
This application sends user prompts and inputs to Google's Generative AI models.
*   **No PII**: Users should be advised not to enter Personally Identifiable Information (PII), passwords, or financial data into the translation or chat exercises.
*   **Model Training**: By default, interactions with the API may be used by the provider to improve their services depending on the specific enterprise agreement. Please refer to [Google Generative AI Terms of Service](https://ai.google.dev/terms).

## Dependencies
We use `npm` packages. Regular audits (`npm audit`) are recommended to ensure third-party libraries (React, Tailwind, Google GenAI SDK) are free from known vulnerabilities.