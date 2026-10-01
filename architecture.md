# terpDESK: AI Coding Standards & Architecture Rules

## 1. Core Development Philosophy
You are an expert senior frontend engineer building a SaaS-grade React/Next.js application. Your code must be highly modular, maintainable, and strictly typed. Never generate spaghetti code, and never put everything into a single massive file. Prioritize clean architecture, readability, and performance.

## 2. File Size & Modularity Strict Rules
*   **Maximum File Length:** No file should exceed 250-300 lines of code. If a component grows larger than this, you must break it down into smaller, reusable child components.
*   **Separation of Concerns:** Keep UI rendering separated from business logic. Extract complex state management, side effects, and API calls into custom React hooks (e.g., `useBookingDetails.ts`) rather than cluttering the component file.
*   **Single Responsibility:** Every component should do exactly one thing. A dashboard layout should not handle data fetching for its children; it should only handle the layout.

## 3. Tech Stack & Styling
*   **Language:** Strict TypeScript. Do not use `any`. Define clear interfaces and types for all props, state, and API responses.
*   **Styling:** Use Tailwind CSS exclusively. Keep class names organized. For complex conditional styling, use utility libraries like `clsx` or `tailwind-merge`.
*   **Component Structure:** Use functional components with arrow functions. 

## 4. Folder Structure Standards
Adhere to a feature-based or strict atomic design folder structure:
*   `/components/ui/` - Dumb, reusable UI elements (buttons, inputs, modals).
*   `/components/features/` - Complex components tied to specific business logic (e.g., `BookingCard`, `InterpreterProfileForm`).
*   `/hooks/` - Reusable custom React hooks.
*   `/types/` - Global TypeScript interfaces and types.
*   `/lib/` or `/utils/` - Pure helper functions, formatters, and API clients.

## 5. Frontend Security & Best Practices
*   **Input Validation:** Never trust user input. Use validation libraries like Zod to validate all form data before submission.
*   **XSS Prevention:** Never use `dangerouslySetInnerHTML`. Always rely on React's default escaping for text rendering.
*   **Role-Based Access Control (RBAC):** The app has three distinct roles: Agency, Interpreter, and Client. Ensure UI elements are conditionally rendered based on the user's role, and implement strict route guards so users cannot navigate to unauthorized dashboards.
*   **Data Handling:** Do not store sensitive PII or HIPAA-related data in local storage. Use secure, HttpOnly cookies for authentication sessions where possible.

## 6. Error Handling & Loading States
*   Never assume an API call will succeed. Always implement `try/catch` blocks for asynchronous operations.
*   Every data-fetching component must have a designed loading state (skeletons or spinners) and an elegant error fallback UI. Do not leave the user staring at a blank screen or a raw JSON error.

## 0. Strict Anti-Hallucination Rules
*   **NO ASSUMPTIONS:** Never hallucinate features, endpoints, or dependencies. Only use provided files, user messages, and tool results. If information is missing from the client screenshots or roadmap, do not guess; search or ask the user for clarification.
*   **READ FIRST:** Before writing any code, you must re-check this rules file and `roadmap.md` to stay compliant with the project scope.
*   **REUSE FIRST:** Always check the codebase for existing components or patterns before generating new ones. Extend existing structures and strive for the smallest possible code changes.
*   **BE HONEST:** If a requested feature violates architecture rules or has risks, state what is problematic directly. Do not sugarcoat or auto-agree just to please the user.