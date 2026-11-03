# Architecture and security

Today: Next.js/React client interface and browser localStorage. Core calendar logic is in `lib/tracking.mjs`. Tests use Node's built-in test runner. Docker configuration exists but requires validation on a machine with Docker.

Future: Amplify Hosting, Cognito authentication, server-side authorization, and DynamoDB for user data. These are design intentions, not completed services. Do not expose secrets or trust user IDs supplied by a browser. Validate ownership on every server-side operation.

Cloud resources can cost money. Verify current AWS rates and free-tier eligibility, configure budget alerts, and obtain approval before provisioning paid resources.
