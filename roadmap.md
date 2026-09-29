# terpDESK: Master Architecture & Migration Roadmap

## 1. Project Overview
*   **Objective:** Decouple the terpDESK prototype from Lovable's proprietary cloud and rebuild it as a secure, standalone, production-ready web application.
*   **Infrastructure:** Standardized cloud architecture, ultimately deployed on AWS for full data ownership and cost efficiency. 
*   **Core Value:** Eliminate manual dispatch bottlenecks and automate complex billing for ASL interpreting agencies.

## 2. Core User Roles & Workflows
*   **Agency Dashboard (Command Center):** Centralized hub to manage appointments, track unfilled jobs, monitor pending offers, and handle staff follow-ups.
*   **Interpreter Workflow (The Loop):** Secure portal to accept/decline job offers, submit actual hours worked, manage availability schedules, and upload credentials.
*   **Client Interface (Front-Facing):** Frictionless web form allowing external clients to request interpreters directly without requiring a portal login.

## 3. Critical Automations & Business Logic
*   **Smart Dispatching:** Offer expiration timers automatically pull back unfilled jobs. Autofill scheduling blocks assignments within 24 hours of start time.
*   **Notification Engine:** Automated in-app and email alerts triggered by job offers, status updates, and schedule changes.

## 4. Client-Approved Deliverables & Acceptance Criteria (SOW)

### Deliverable 1: Audit & Architecture (Phase 1 Focus)
*   Identify current published version vs. unpublished changes.
*   Identify all Lovable dependencies to replace.
*   Finalize AWS architecture (hosting, DB, auth, storage, email, cron jobs, logs).
*   Provide one-time implementation cost and monthly infrastructure estimate.
*   *Action:* Provide reviewed architecture, cost breakdown, and migration task list to client.

### Deliverable 2: Independent Staging Environment
*   App runs entirely outside Lovable on an independent AWS/test URL.
*   Uses a completely separate test database, auth, storage, and secrets (no prod data).
*   Background notifications work without an open browser.
*   *Acceptance:* Client can sign in as agency staff and interpreter on the test URL.

### Deliverable 3: Workflow Verification
*   Demonstrate: Request → offer → acceptance → calendar.
*   Verify cross-agency conflict protection, Auto Fill, give-backs, and cancellations.
*   Verify hours, mileage, signatures, agency review, and credential uploads.
*   *Acceptance:* Automated checks pass, and client completes manual walkthrough without touching real records.

### Deliverable 4: Production Rehearsal & Launch
*   Create migration plan (including password-reset fallback) and rollback procedure.
*   Perform database/file backup and successful restore rehearsal.
*   Set up monitoring, alert recipients, and recovery instructions.
*   *Acceptance:* Schedule cutover, switch domain, verify records, and begin limited pilot.

### Deliverable 5: Feature Expansion (Post-Launch Phase 2)
*   **State Intake (ODHH):** Import redacted ODHH requests, identify duplicates by SRN, and support agency review.
*   **Billing Engine:** Calculate interpreter pay and client charges separately.
*   **QuickBooks:** Scope QBO integration separately once accounting direction is confirmed.