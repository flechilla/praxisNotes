# Database Integration for Report Generation

## Overview

This implementation plan outlines how to extend the report generation feature to include database interactions. The goal is to save both the session form data and the final generated report in the database.

## Current Implementation

Currently, the report generation API (`apps/web/app/api/report/generate/route.ts`) does the following:

- Accepts form data and RBT name in the request body
- Validates the form data
- Gets client information from a mock data source
- Calculates session duration
- Generates a report using Claude 3.5 AI and streams it to the client
- Does not save any data to the database

## Database Schema

The database already has the necessary schemas for storing sessions and reports:

1. **Session Schema** (`packages/database/src/schema/session.table.ts`)

   - Fields: id, clientId, userId, sessionDate, startTime, endTime, location, isActivityBased, status, etc.
   - Relationships: Belongs to a Client and a User, has many Reports

2. **Report Schema** (`packages/database/src/schema/report.table.ts`)

   - Fields: id, sessionId, userId, clientId, summary, fullContent, status, etc.
   - Relationships: Belongs to a Session, a User, and a Client, has many ReportSections

3. **Report Section Schema** (`packages/database/src/schema/report_section.table.ts`)
   - Fields: id, reportId, title, content, order, etc.
   - Relationships: Belongs to a Report

## Implementation Tasks

1. ✅ Create a Session Service

   - Create `apps/web/lib/services/session.service.ts` with methods:
     - `createSession(formData, userId)`: Create a new session from form data
     - `getSessionById(id)`: Get a session by ID
     - `updateSessionStatus(id, status)`: Update the status of a session

2. ✅ Create a Report Service

   - Create `apps/web/lib/services/report.service.ts` with methods:
     - `createReport(sessionId, userId, clientId, reportData)`: Create a new report and its sections
     - `getReportById(id)`: Get a report by ID with all its sections
     - `updateReportStatus(id, status)`: Update the status of a report

3. ✅ Update the Report Generation API
   - Modify `apps/web/app/api/report/generate/route.ts` to:
     - Accept a `userId` in the request body
     - Save the session to the database using the Session Service
     - Generate the report content using Claude 3.5
     - Save the report to the database using the Report Service
     - Return the report ID to the client

## Technical Issues to Resolve

1. 🔧 Fix API Import Issues

   - The import paths for the database schema modules need to be corrected in the services:
     - `@praxisnotes/database/schema`
     - `@praxisnotes/database/schema/session.table`
     - `@praxisnotes/database/schema/report.table`

2. 🔧 Fix Anthropic Integration

   - There are compatibility issues with the Anthropic AI API:
     - Need to find a way to collect the full generated text while still streaming to the client
     - Fix type errors with `generateText` result handling

3. 🔧 Fix TypeScript Errors
   - In the Report Service, fix type errors related to:
     - Client data properties (`firstName`, `lastName`)
     - Handling of optional values
     - Type compatibility issues with `ReportSection`

## Client Side Changes Needed

1. Update the client-side code to send the user ID with the report generation request
2. Update the UI to handle the returned report ID
3. Add functionality to fetch saved reports by ID

## Testing Plan

1. Test session creation

   - Verify that sessions are properly saved to the database
   - Verify that form data is correctly mapped to the session schema

2. Test report generation and saving

   - Verify that reports are properly saved to the database
   - Verify that report sections are properly created and linked to the report
   - Verify that report content is correctly stored

3. Test streaming and response handling
   - Verify that the report content is still streamed to the client
   - Verify that the report ID is properly returned to the client

## Next Steps

1. Fix the technical issues mentioned above
2. Implement the client-side changes
3. Add proper error handling and recovery mechanisms
4. Add additional features like report retrieval, editing, and deletion
