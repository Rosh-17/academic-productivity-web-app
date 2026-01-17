# 📘 Productivity Web App for College Students
**Frontend-Only | Academic Workflow Focused | UI/UX-Driven**

## 🧠 Project Overview
  Engineering and college students manage multiple academic responsibilities such as **assignments, labs, exams, projects, and hackathons**.  
  Most existing productivity tools are **generic**, cluttered, and not aligned with **academic workflows**.

  This project is a **frontend-only productivity web application** designed specifically for **college students**, with a strong focus on:
- 📌 Tasks  
- ⏰ Deadlines  
- 📊 Progress tracking  
  All of this is presented through a **clean, intuitive, and academic-first dashboard**.
  The core idea is to **centralize all academic activities into a single Task Scheduler**, which drives all insights shown on the dashboard.

## 🎯 Core Design Principle
**Everything revolves around tasks, deadlines, and progress — reflected centrally on the Dashboard**
  Instead of handling assignments, exams, and projects separately, **every academic activity is treated as a task**, enabling a **unified and simplified planning experience** for students.

## 🧩 Core Module: Task Scheduler
  The **Task Scheduler** is the **heart of the application**.
  - All other modules **create or update tasks**
  - The dashboard **visualizes and prioritizes tasks**

### 🔹 Task Attributes
  Each task contains:
  1. **Title**
  2. **Category**
     - Assignment  
     - Lab File  
     - Continuous Assessment  
     - PPT  
     - Homework  
     - Project Task  
  3. **Subject** (optional)
  4. **Deadline** (date & time)
  5. **Progress (%)**
  6. **Status**
     - Pending  
     - Overdue  
     - Completed  
  7. **Priority** (auto-calculated)

### 🔹 Task Behavior
  - Deadline + current date automatically updates task status
  - Progress updates are reflected visually
  - Priority is calculated based on:
      - Urgency
      - Task type

### 🔹 Dashboard Impact
  - Pending task count
  - Overdue task alerts (highlighted)
  - Suggested priority task (**“Do this next”**)

## 📂 Application Modules

### 1️⃣ Assignments
  - Handwritten and online assignments
  - Mock file upload support
  - Progress tracking
  - Each assignment automatically creates a task
  **Dashboard Impact:**
    - Assignment completion progress
    - Upcoming assignment deadlines

### 2️⃣ Exams
  - Exam schedule with subject and date
  - Topic-wise preparation tracking
  - Exam preparation percentage calculated per subject
  **Dashboard Impact:**
  - Next exam countdown
  - Subject-wise readiness indicators

### 3️⃣ Projects
  - Subject, personal, minor, and major projects
  - Project-specific task lists
  - GitHub link and local path (display only)
**Dashboard Impact:**
  - Project progress cards
  - Urgent project task highlights
    
### 4️⃣ Weekly Timetable
  - Day-wise lecture, lab, and tutorial schedule
  - Provides academic rhythm awareness
**Dashboard Impact:**
  - “Today’s Classes” section
  - Helps plan tasks around class schedules
  - 
### 5️⃣ Subjects
  - Topic checklist with completion tracking
  - Mock notes upload (PDF / DOC / Image)
**Cross-Module Sync:**
  - Topic completion affects:
    - Exam preparation
    - Subject progress
    - Dashboard metrics

### 6️⃣ Hackathons
  - Hackathon schedule and checklist
  - Tasks generated for submissions and milestones
**Dashboard Impact:**
  - Upcoming hackathon reminders
  - Event-based alerts
  - 
## 📊 Dashboard (Most Important Screen)
  The dashboard acts as the **decision-making center** of the app.
### 🔹 Dashboard Widgets
  - 📌 Priority Task
  - ⏰ Upcoming Deadlines
  - ❗ Overdue Tasks
  - 📊 Workload Overview
  - 🧠 Exam Preparation Progress
  - 📅 Today’s Classes
  - 🚀 Projects in Progress

### 🔹 Priority Logic (Frontend Only)
  - Near deadline
  - Low progress
  - High academic weight  
    *(Exam > Assignment > Homework)*

## 🧭 UI/UX Structure
 ```text
Dashboard
Tasks
Assignments
Exams
Projects
Subjects
Timetable
Hackathons
