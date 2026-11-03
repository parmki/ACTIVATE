# ACTIVATE — portfolio notes

## Implemented

ACTIVATE is a local-first productivity prototype built with Next.js, React, and custom CSS. It combines task tracking, scheduled habit check-ins, goal milestones, and a blue activity heatmap. It includes date-only calendar calculations and tests for streaks, daylight-saving boundaries, and duplicate habit activity. A multi-stage Dockerfile and Compose file are included but have not been run in this environment.

## Architecture and security

The browser stores data in localStorage. There is no authentication, server-side database, account isolation, or cloud deployment yet. Do not use this prototype for sensitive information. AWS Amplify, Cognito, and DynamoDB are planned, not implemented. See the README for the proposed architecture and cost precautions.

## Accurate example resume bullets

- Built a responsive productivity prototype in Next.js and React with tasks, recurring habits, goal milestones, and an activity heatmap.
- Implemented and tested calendar-based habit streaks and completion aggregation, including unscheduled days and daylight-saving boundaries.
- Prepared a multi-stage Docker configuration and documented a proposed AWS architecture for future authenticated, per-user persistence.
