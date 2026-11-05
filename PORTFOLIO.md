# ACTIVATE — portfolio notes

## Implemented

ACTIVATE is a local-first productivity prototype built with Next.js, React, and custom CSS. It combines task tracking, scheduled habit check-ins, goal milestones, and a blue activity heatmap. It includes date-only calendar calculations and tests for streaks, daylight-saving boundaries, and duplicate habit activity. A multi-stage Dockerfile and Compose configuration were created. The container image was built and its homepage and public assets were tested locally with a Docker-compatible container runtime; Docker Compose itself was not verified here.

## Architecture and security

The browser stores tasks and settings in localStorage and motivation entries and media in IndexedDB. There is no authentication, server-side database, or account isolation. Do not use this prototype for sensitive information. The application was deployed to AWS Amplify Hosting as a learning exercise and later deployed to Vercel. Cognito authentication and DynamoDB persistence are proposed future work; neither is implemented. See the README for the proposed architecture and cost precautions.

## Accurate example resume bullets

- Built a responsive productivity prototype in Next.js and React with tasks, recurring habits, goal milestones, and an activity heatmap.
- Implemented and tested calendar-based habit streaks and completion aggregation, including unscheduled days and daylight-saving boundaries.
- Packaged the app with a multi-stage Dockerfile, verified the image locally, and deployed the frontend to AWS Amplify Hosting.
