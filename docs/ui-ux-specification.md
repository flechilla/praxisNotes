# PraxisNote UI/UX Specification

## Overview

This document outlines the user interface and experience design for PraxisNote, an application designed to help Registered Behavior Technicians (RBTs) document client sessions efficiently and accurately.

## Design Principles

- **Clarity**: Interfaces should be intuitive and self-explanatory
- **Efficiency**: Minimize clicks and time required for frequently used actions
- **Consistency**: Maintain visual and interaction patterns throughout the application
- **Accessibility**: Ensure the application is usable by people with diverse abilities
- **Mobile-First**: Design for mobile devices first, then enhance for larger screens

## User Journey Maps

### RBT User Journey

```
Login → Dashboard → Select Client → Create New Session →
Complete Session Form → Generate Report → Submit for Review
```

### BCBA User Journey

```
Login → Dashboard → Review Pending Reports →
Add Feedback → Approve Report
```

### Administrator User Journey

```
Login → Dashboard → Manage Users → Review Analytics →
Configure System Settings
```

## Core User Flows

### Session Documentation Flow

1. **Session Initialization**

   - Select client from list or search
   - Enter basic session information (date, time, location)
   - Begin documentation process

2. **Skill Acquisition Documentation**

   - Select programs from client's treatment plan
   - Record data on trials, prompting levels, and responses
   - Add notes on skill development

3. **Behavior Documentation**

   - Log target behaviors with frequency, duration, or intensity
   - Document antecedents and consequences
   - Add contextual notes

4. **Reinforcement Documentation**

   - Record reinforcers used during session
   - Document effectiveness of reinforcers
   - Note client preferences

5. **Note Addition**

   - Add general session notes
   - Record caregiver involvement or feedback
   - Document environmental factors

6. **Report Generation**
   - Preview automatically generated report
   - Make final edits or additions
   - Submit for BCBA review

### Review and Approval Flow

1. **Report Notification**

   - BCBA receives notification of pending review
   - Access report from dashboard or email link

2. **Report Review**

   - Review session details and data
   - Add comments or suggestions
   - Request revisions or approve report

3. **Feedback Processing**
   - RBT receives notification of feedback
   - Reviews comments and makes necessary changes
   - Resubmits or notes feedback for future sessions

## Interface Components

### Navigation System

- **Top Navigation Bar**

  - Logo/Home link
  - User profile menu
  - Notifications icon
  - Quick actions menu

- **Side Navigation (Desktop)**

  - Dashboard link
  - Clients section
  - Reports section
  - Analytics section
  - Settings section

- **Bottom Navigation (Mobile)**
  - Home icon
  - Clients icon
  - Reports icon
  - More menu (for additional options)

### Dashboard

- **RBT Dashboard Components**

  - Today's schedule
  - Recent clients list
  - Draft reports widget
  - Reports awaiting revision widget
  - Quick start new report button

- **BCBA Dashboard Components**
  - Reports pending review
  - Client progress summaries
  - Scheduled supervision sessions
  - Recent activity feed

### Form Components

- **Multi-step Form Layout**

  - Progress indicator
  - Section navigation
  - Save draft functionality
  - Back/Next buttons

- **Input Components**

  - Text fields with validation
  - Dropdown selects with search
  - Date and time pickers
  - Radio button groups
  - Checkbox groups
  - Numeric input with increment/decrement
  - Rich text editors for notes

- **Data Collection Components**
  - Counter with +/- buttons
  - Timer for duration recording
  - Rating scales for intensity
  - Trial tracker with success/failure toggles

### Report Preview

- **Layout**
  - Client information header
  - Session details summary
  - Tabbed sections for different data types
  - PDF export button
  - Submit for review button

## Wireframes

_Note: Actual wireframes would be included here as images or links to design files_

### Key Screen Mockups

1. **Login Screen**

   - Username/email field
   - Password field
   - Remember me checkbox
   - Login button
   - Forgot password link

2. **Dashboard**

   - Welcome message with user name
   - Date and upcoming schedule
   - Quick actions panel
   - Recent items list
   - Notifications panel

3. **New Session Form - Basic Info**

   - Client selector
   - Date picker
   - Time range selector
   - Location dropdown
   - Caregiver present toggle

4. **New Session Form - Skill Acquisition**

   - Program selector
   - Trial counter interface
   - Prompt level selector
   - Response type selector
   - Notes field
   - Add another skill button

5. **New Session Form - Behavior Tracking**

   - Behavior selector/creator
   - Frequency/duration/intensity inputs
   - Antecedent field
   - Consequence field
   - Notes field
   - Add another behavior button

6. **Report Preview**
   - Formatted report with all sections
   - Edit buttons for each section
   - Submit button
   - Save as draft button
   - Print/PDF export button

## Visual Design Guidelines

### Color Palette

- **Primary Colors**

  - Primary Blue: `#2563eb` (Accessible, professional)
  - Secondary Teal: `#0d9488` (Calming, healthcare-associated)

- **Secondary Colors**

  - Accent Yellow: `#fbbf24` (Attention, energy)
  - Accent Purple: `#8b5cf6` (Creativity, distinction)

- **Neutrals**
  - Dark Gray: `#1f2937` (Text, headers)
  - Medium Gray: `#6b7280` (Secondary text)
  - Light Gray: `#f3f4f6` (Backgrounds, dividers)
  - White: `#ffffff` (Card backgrounds, contrast)

### Typography

- **Headings**: Inter, Sans-serif

  - H1: 24px/1.5 bold
  - H2: 20px/1.5 bold
  - H3: 18px/1.5 semibold
  - H4: 16px/1.5 semibold

- **Body**: Inter, Sans-serif
  - Regular: 16px/1.5 regular
  - Small: 14px/1.5 regular
  - Caption: 12px/1.5 regular

### Component Styling

- **Buttons**

  - Primary: Fill with primary color, rounded corners
  - Secondary: Outlined with secondary color
  - Tertiary: Text only with hover state

- **Cards**

  - Light backgrounds with subtle shadows
  - Rounded corners (8px radius)
  - Consistent padding (16px)

- **Forms**
  - Clear labels above inputs
  - Validation states (error, success)
  - Helper text below inputs
  - Consistent spacing between fields

### Iconography

- **System Icons**

  - Outline style
  - 24x24px touch target
  - Consistent stroke width
  - Clear meaning without labels where possible

- **Custom Icons**
  - Consistent with system icon style
  - Relevant to ABA therapy concepts
  - Simple, recognizable shapes

## Responsive Design Specifications

### Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Responsive Behavior

- Single column layouts on mobile
- Sidebar hidden behind menu on mobile
- Multi-column forms collapse to single column on mobile
- Tables adapt to card-based layout on small screens
- Font sizes adjust slightly between breakpoints

## Accessibility Requirements

- **WCAG 2.1 AA Compliance**

  - Sufficient color contrast (minimum 4.5:1 for normal text)
  - Keyboard navigation support
  - Screen reader compatibility
  - Focus indicators for interactive elements

- **Additional Considerations**
  - No reliance on color alone for information
  - Alternative text for all images
  - Error identification beyond color
  - Resizable text without breaking layout

## Interaction Patterns

### Form Interactions

- Real-time validation with feedback
- Auto-save for long forms (every 30 seconds)
- Smooth transitions between form steps
- Clear error recovery paths

### Data Entry Optimizations

- Quick-add buttons for common entries
- Type-ahead suggestions
- Default values based on past usage
- Bulk operations where applicable

### Feedback Mechanisms

- Toast notifications for system actions
- Inline validation messages
- Progress indicators for long operations
- Success confirmations

## Usability Testing Plan

1. **Test Participants**

   - Practicing RBTs (primary)
   - BCBAs (secondary)
   - ABA therapy administrators (tertiary)

2. **Key Test Scenarios**

   - Complete a full session documentation process
   - Review and approve a submitted report
   - Navigate between clients and find specific information
   - Recover from errors in form submission

3. **Success Metrics**
   - Task completion rate
   - Time on task
   - Error rate
   - User satisfaction scores
   - System Usability Scale (SUS) assessment

## Implementation Guidelines

1. **Component Library**

   - Utilize ShadCN UI components as foundation
   - Extend with custom components as needed
   - Document component usage in Storybook

2. **Responsive Implementation**

   - Implement with mobile-first approach
   - Use TailwindCSS for responsive utilities
   - Test thoroughly across device sizes

3. **Accessibility Implementation**
   - Use semantic HTML elements
   - Implement ARIA attributes where needed
   - Ensure keyboard navigation works logically
   - Test with screen readers
