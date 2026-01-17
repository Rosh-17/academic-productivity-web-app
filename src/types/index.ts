// ============================================
// TYPE DEFINITIONS FOR ACADEMIC PRODUCTIVITY APP
// ============================================

// Task Categories - Core types for task classification
export type TaskCategory = 
  | 'Assignment' 
  | 'Lab File' 
  | 'Continuous Assessment' 
  | 'PPT' 
  | 'Homework' 
  | 'Project Task'
  | 'Exam Prep'
  | 'Hackathon';

// Task Status - Auto-calculated based on deadline and progress
export type TaskStatus = 'Pending' | 'Overdue' | 'Completed';

// Task Priority - Auto-calculated based on deadline proximity and category weight
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical';

// ============================================
// CORE TASK INTERFACE (Heart of the App)
// ============================================
export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  subject?: string;
  deadline: Date;
  progress: number; // 0-100
  status: TaskStatus; // Auto-calculated
  priority: TaskPriority; // Auto-calculated
  description?: string;
  sourceType?: 'assignment' | 'exam' | 'project' | 'hackathon'; // Where task originated from
  sourceId?: string; // ID of source item
}

// ============================================
// ASSIGNMENT INTERFACES
// ============================================
export interface HandwrittenAssignment {
  id: string;
  subject: string;
  title: string;
  deadline: Date;
  progress: number;
  taskId?: string; // Reference to Task Scheduler
}

export interface OnlineAssignment {
  id: string;
  subject: string;
  title: string;
  deadline: Date;
  progress: number;
  fileName?: string;
  fileType?: string;
  taskId?: string;
}

// ============================================
// EXAM INTERFACES
// ============================================
export interface Exam {
  id: string;
  subject: string;
  date: Date;
  time: string;
  topics: ExamTopic[];
}

export interface ExamTopic {
  id: string;
  name: string;
  studied: boolean;
}

// ============================================
// PROJECT INTERFACES
// ============================================
export type ProjectCategory = 'Subject' | 'Personal' | 'Minor' | 'Major';

export interface Project {
  id: string;
  name: string;
  category: ProjectCategory;
  githubUrl?: string;
  localPath?: string;
  tasks: ProjectTask[];
}

export interface ProjectTask {
  id: string;
  title: string;
  completed: boolean;
  deadline?: Date;
  taskId?: string; // Reference to Task Scheduler
}

// ============================================
// SUBJECT INTERFACES
// ============================================
export interface Subject {
  id: string;
  name: string;
  code: string;
  topics: SubjectTopic[];
  notes: Note[];
}

export interface SubjectTopic {
  id: string;
  name: string;
  studied: boolean;
}

export interface Note {
  id: string;
  title: string;
  fileName?: string;
  uploadDate: Date;
}

// ============================================
// TIMETABLE INTERFACES
// ============================================
export type ClassType = 'Lecture' | 'Lab' | 'Tutorial';
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export interface TimetableEntry {
  id: string;
  subject: string;
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  type: ClassType;
}

// ============================================
// HACKATHON INTERFACES
// ============================================
export interface Hackathon {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  schedule?: string;
  checklist: HackathonChecklistItem[];
  taskId?: string; // Reference to Task Scheduler
}

export interface HackathonChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}
