# Vocabulary Trainer: Multi-Language Learning Tool

## Description

**Vocabulary Trainer** is a versatile study tool designed to help you learn languages efficiently. Whether you aim to improve your grades or achieve personal language goals, this app offers multiple modes of learning, including flashcards, written tests, memory match games, and quizzes.
The app is built using the latest technologies, including:

- **Next.js** 15.1.0
- **PostgreSQL**
- **TypeScript**
- **Tailwind CSS**
- Placeholder data, such as localization, languages, categories, and word pairs, is generated with the help of ChatGPT API.

### Features

- **Dynamic Language Selection:** Choose the app's interface language on the first page.
- **Study Language Selection:** Select a language to learn.
- **Category-Based Learning:** Learn vocabulary within specific categories.
- **Multiple Training Modes:** Choose from flashcards, memory match, quizzes, and writing exercises.
- **Progress Tracking:** Monitor your learning progress and track completion rates.

This project provides a complete environment setup with instructions and all necessary components for local development and testing.

## Getting Started

### Requirements

To run this project locally, ensure you have:

- **PostgreSQL** installed on your system (local or remote).
- Permissions to create users and databases in PostgreSQL.
- A `.env.local` file with the database connection details.

### Installation

1.  **Clone the Repository**
    Run the following command to clone the project:

        ```bash
        git clone https://github.com/sveteok/vocabulary-trainer.git
        ```

2.  **Set Up Environment Variables**
    Copy the `.env.example` file to `.env.local` in the project root and populate it with your database details:
    `bash
    DB_HOST=<postgres hostname>
    DB_USER=<postgres database user>
    DB_PASS=<postgres database password>
    DB_NAME=<postgres database name>
    `
3.  **Seed the Database**
    Populate the database with placeholder data:

    ```bash
    npx tsx scripts/seedLocalDB.ts
    ```

4.  **Start the Development Server**
    Use one of the following commands to start the server:
    `bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    `
5.  **Access the App**
    Open http://localhost:3000 in your browser to view the application.

## Project Structure

    vocabulary-trainer/
    ├── .gitignore          # Avoid pushing sensitive files like node_modules or secrets
    ├── README.md           # Project documentation
    ├── .env.local          # Environment variables for local development
    ├── envConfig.ts        # Handles environment variables
    ├── next.config.ts      # Next.js configuration
    ├── tsconfig.json       # TypeScript configuration
    ├── package.json        # Project dependencies and scripts
    ├── tailwind.config.ts  # Tailwind CSS configuration
    ├── scripts/
    │   ├── seedLocalDB.ts  # Database seeding script
    ├── app/                # Main application folder with dynamic routing
    │   ├── [lang_from]/[lang_to]/[cat_id]/
    │   │   ├── cards/      # Flashcards training mode
    │   │   ├── match/      # Memory match training mode
    │   │   ├── quize/      # Quiz training mode
    │   │   ├── write/      # Writing training mode
    ├── hooks/              # Custom React hooks for various components
    ├── ui/                 # UI components and layouts
    │   ├── basis/          # Common UI components (e.g., progress bars, buttons)
    │   ├── cards/          # Training mode components for cards
    │   ├── list/           # Word list components with search
    │   ├── store-provider/ # Store provider
    ├── store/              # Store global states
    ├── lib/                # Utility functions and placeholder data
    │   ├── data.ts         # Database interaction logic
    │   ├── definitions.ts  # Type definitions
    │   ├── placeholder-data.js # Placeholder data for local testing
    │   ├── utils.ts

## Database Structure

The app uses **PostgreSQL** for data management. Below is an overview of the database schema:

**Tables**

1. **Languages**: Stores available interface and study languages.
2. **Categories**: Manages vocabulary categories (e.g., Basic Phrases, Shopping).
3. **CategoryTranslations**: Stores category translation for all supported languages.
4. **Words**: Stores individual words and their translations.
5. **WordPairs**: Links translations of words between languages.
6. **Localization**: Stores localization of all supported languages.

**Initial Setup**
Install required PostgreSQL libraries:

```bash
npm install pg dotenv @types/pg
```

Seed the database using the provided script:

```bash
npx tsx scripts/seedLocalDB.ts
```

## Key Features

- **Dynamic Routes**: Navigate through languages, categories, and training modes using Next.js dynamic routing.
- **Interactive Training Modes**:
  - **Cards**: Flashcard-style learning.
  - **Match**: Memory card matching game.
  - **Quizzes**: Multiple-choice quizzes.
  - **Writing**: Fill-in-the-blank style exercises.
- **Progress Feedback**: Celebrate milestones with messages like "Well done! All words have been learned!"
- **Localization**: Support for multiple languages, including Russian, Finnish, Spanish, French, German, Chinese, Japanese, Korean, Arabic, Portuguese, and Hindi.

## Required Libraries

Install the following dependencies:

```bash
npm install @mui/icons-material @mui/material @emotion/react @emotion/styled
npm install @next/env
npm install motion
npm install react-card-flip
```

## Planned Features

1. **Cloud-Hosted Database**: Use a free PostgreSQL database hosted on Vercel.
2. **AI-Generated Content Expansion**:
   - Use AI to periodically add new word pairs and categories.
   - Schedule content updates every few months to keep the app fresh.

### Additional Notes

This app demonstrates the power of modern web technologies for educational purposes. Contributions, feedback, and feature suggestions are welcome!
