RBT Daily Report Assistant App

Overview

This app helps RBT (Registered Behavior Technician) professionals efficiently document daily session data. It streamlines data collection, supports input from analysts (BCBA), and auto-generates a comprehensive daily report for each client session. The app is full-stack, built with modern tools for performance and ease of use.

⸻

Tech Stack
• Framework: Full-stack (Next.js 15 with App Router)
• Frontend: React, TailwindCSS, ShadCN UI, Lucide Icons
• Database: PostgreSQL (via Supabase)
• ORM: Drizzle
• Deployment: Vercel

⸻

Initial Input Form: Daily Session Entry

Use ShadCN components like Form, Textarea, Select, Switch, and Input to build the form UI.

1. Session Info
   • date: Date Picker – default to today
   • technician_name: Input (or auto-filled from user profile)
   • client_name: Input or Select (from saved clients)
   • location: Select (Home, Clinic, School, Other)
   • start_time: Time Picker
   • end_time: Time Picker
   • duration: Auto-calculated (start → end)

⸻

2. Skill Acquisition
   • programs_run: Repeatable list
   • Program Name
   • Prompt Level (Dropdown: Full, Partial, Gesture, Visual, Verbal, Independent)
   • Client Response (Dropdown: Independent, Prompted, No Response)
   • Notes

⸻

3. Maladaptive Behaviors
   • behavior_logs: Repeatable list
   • Behavior Type (Input)
   • Frequency (Number)
   • Duration (Minutes)
   • Antecedent (Textarea)
   • Consequence (Textarea)

⸻

4. Reinforcement
   • reinforcers: Repeatable list
   • Reinforcer Used
   • Schedule (Input)
   • Response to Reinforcer (Dropdown or Input)

⸻

5. General Notes
   • session_notes: Textarea
   • parent_involvement: Textarea
   • incident_reported: Switch + Conditional Textarea (if true)
   • recommendations: Textarea

⸻

6. Analyst Input (Optional Section)
   • analyst_notes: Textarea
   • goals_next_session: Textarea
   • clinical_recommendations: Textarea
