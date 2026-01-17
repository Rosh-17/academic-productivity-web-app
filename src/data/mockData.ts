import {
  Task,
  HandwrittenAssignment,
  OnlineAssignment,
  Exam,
  Project,
  Subject,
  TimetableEntry,
  Hackathon,
} from '@/types';
import { updateTaskCalculations } from '@/utils/taskUtils';

// ============================================
// MOCK DATA FOR DEMONSTRATION
// This simulates real college student data
// ============================================

// Helper to create dates relative to today
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const in2Days = new Date(today);
in2Days.setDate(today.getDate() + 2);
const in3Days = new Date(today);
in3Days.setDate(today.getDate() + 3);
const in5Days = new Date(today);
in5Days.setDate(today.getDate() + 5);
const in7Days = new Date(today);
in7Days.setDate(today.getDate() + 7);
const in10Days = new Date(today);
in10Days.setDate(today.getDate() + 10);
const in14Days = new Date(today);
in14Days.setDate(today.getDate() + 14);
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);

// ============================================
// TASKS (Core Engine)
// ============================================
const rawTasks: Omit<Task, 'status' | 'priority'>[] = [
  {
    id: '1',
    title: 'Data Structures Lab 5',
    category: 'Lab File',
    subject: 'Data Structures',
    deadline: tomorrow,
    progress: 65,
    sourceType: 'assignment',
    sourceId: '1',
  },
  {
    id: '2',
    title: 'DBMS Assignment - Normalization',
    category: 'Assignment',
    subject: 'Database Management',
    deadline: in3Days,
    progress: 40,
    sourceType: 'assignment',
    sourceId: '2',
  },
  {
    id: '3',
    title: 'Operating Systems Mid-Term Prep',
    category: 'Exam Prep',
    subject: 'Operating Systems',
    deadline: in5Days,
    progress: 55,
    sourceType: 'exam',
    sourceId: '1',
  },
  {
    id: '4',
    title: 'Machine Learning Project: Neural Networks',
    category: 'Project Task',
    subject: 'Machine Learning',
    deadline: in14Days,
    progress: 30,
    sourceType: 'project',
    sourceId: '1',
  },
  {
    id: '5',
    title: 'Algorithms Homework - Dynamic Programming',
    category: 'Homework',
    subject: 'Algorithms',
    deadline: in2Days,
    progress: 80,
  },
  {
    id: '6',
    title: 'Web Development PPT',
    category: 'PPT',
    subject: 'Web Development',
    deadline: yesterday,
    progress: 60,
  },
  {
    id: '7',
    title: 'Smart Campus Hackathon',
    category: 'Hackathon',
    deadline: in7Days,
    progress: 25,
    sourceType: 'hackathon',
    sourceId: '1',
  },
];

// Apply auto-calculations to tasks
export const mockTasks: Task[] = rawTasks.map(task => 
  updateTaskCalculations(task as Task)
);

// ============================================
// HANDWRITTEN ASSIGNMENTS
// ============================================
export const mockHandwrittenAssignments: HandwrittenAssignment[] = [
  {
    id: '1',
    subject: 'Data Structures',
    title: 'Data Structures Lab 5',
    deadline: tomorrow,
    progress: 65,
    taskId: '1',
  },
  {
    id: '3',
    subject: 'Computer Networks',
    title: 'Network Protocols Report',
    deadline: in10Days,
    progress: 20,
  },
];

// ============================================
// ONLINE ASSIGNMENTS
// ============================================
export const mockOnlineAssignments: OnlineAssignment[] = [
  {
    id: '2',
    subject: 'Database Management',
    title: 'DBMS Assignment - Normalization',
    deadline: in3Days,
    progress: 40,
    fileName: 'dbms_normalization.pdf',
    fileType: 'PDF',
    taskId: '2',
  },
];

// ============================================
// EXAMS
// ============================================
export const mockExams: Exam[] = [
  {
    id: '1',
    subject: 'Operating Systems',
    date: in5Days,
    time: '10:00 AM',
    topics: [
      { id: '1', name: 'Process Management', studied: true },
      { id: '2', name: 'Memory Management', studied: true },
      { id: '3', name: 'File Systems', studied: false },
      { id: '4', name: 'Deadlocks', studied: false },
      { id: '5', name: 'CPU Scheduling', studied: true },
    ],
  },
  {
    id: '2',
    subject: 'Database Management',
    date: in10Days,
    time: '2:00 PM',
    topics: [
      { id: '6', name: 'SQL Queries', studied: true },
      { id: '7', name: 'Normalization', studied: false },
      { id: '8', name: 'Transactions', studied: false },
      { id: '9', name: 'Indexing', studied: false },
    ],
  },
];

// ============================================
// PROJECTS
// ============================================
export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'ML Neural Network Classifier',
    category: 'Subject',
    githubUrl: 'https://github.com/username/ml-neural-net',
    localPath: '/projects/ml-neural-net',
    tasks: [
      { id: '1', title: 'Data Collection', completed: true },
      { id: '2', title: 'Data Preprocessing', completed: true },
      { id: '3', title: 'Model Training', completed: false, deadline: in14Days, taskId: '4' },
      { id: '4', title: 'Testing & Validation', completed: false },
      { id: '5', title: 'Documentation', completed: false },
    ],
  },
  {
    id: '2',
    name: 'Personal Portfolio Website',
    category: 'Personal',
    githubUrl: 'https://github.com/username/portfolio',
    localPath: '/projects/portfolio',
    tasks: [
      { id: '6', title: 'Design Mockups', completed: true },
      { id: '7', title: 'Frontend Development', completed: false },
      { id: '8', title: 'Deployment', completed: false },
    ],
  },
];

// ============================================
// SUBJECTS
// ============================================
export const mockSubjects: Subject[] = [
  {
    id: '1',
    name: 'Data Structures',
    code: 'CS201',
    topics: [
      { id: '1', name: 'Arrays & Linked Lists', studied: true },
      { id: '2', name: 'Stacks & Queues', studied: true },
      { id: '3', name: 'Trees', studied: true },
      { id: '4', name: 'Graphs', studied: false },
      { id: '5', name: 'Hashing', studied: false },
    ],
    notes: [
      { id: '1', title: 'DSA Unit 1 Notes', fileName: 'dsa_unit1.pdf', uploadDate: new Date('2026-01-10') },
      { id: '2', title: 'DSA Unit 2 Notes', fileName: 'dsa_unit2.pdf', uploadDate: new Date('2026-01-12') },
    ],
  },
  {
    id: '2',
    name: 'Operating Systems',
    code: 'CS301',
    topics: [
      { id: '6', name: 'Introduction to OS', studied: true },
      { id: '7', name: 'Process Management', studied: true },
      { id: '8', name: 'Memory Management', studied: true },
      { id: '9', name: 'File Systems', studied: false },
      { id: '10', name: 'Deadlocks', studied: false },
    ],
    notes: [
      { id: '3', title: 'OS Lecture Notes', fileName: 'os_notes.pdf', uploadDate: new Date('2026-01-08') },
    ],
  },
  {
    id: '3',
    name: 'Database Management',
    code: 'CS302',
    topics: [
      { id: '11', name: 'Introduction to DBMS', studied: true },
      { id: '12', name: 'SQL Basics', studied: true },
      { id: '13', name: 'Normalization', studied: false },
      { id: '14', name: 'Transactions', studied: false },
    ],
    notes: [],
  },
];

// ============================================
// TIMETABLE
// ============================================
export const mockTimetable: TimetableEntry[] = [
  {
    id: '1',
    subject: 'Data Structures',
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:00',
    type: 'Lecture',
  },
  {
    id: '2',
    subject: 'Operating Systems',
    day: 'Monday',
    startTime: '11:00',
    endTime: '12:00',
    type: 'Lecture',
  },
  {
    id: '3',
    subject: 'Database Management',
    day: 'Tuesday',
    startTime: '10:00',
    endTime: '11:00',
    type: 'Lecture',
  },
  {
    id: '4',
    subject: 'Data Structures',
    day: 'Tuesday',
    startTime: '14:00',
    endTime: '16:00',
    type: 'Lab',
  },
  {
    id: '5',
    subject: 'Machine Learning',
    day: 'Wednesday',
    startTime: '09:00',
    endTime: '10:00',
    type: 'Lecture',
  },
  {
    id: '6',
    subject: 'Algorithms',
    day: 'Wednesday',
    startTime: '11:00',
    endTime: '12:00',
    type: 'Tutorial',
  },
  {
    id: '7',
    subject: 'Operating Systems',
    day: 'Thursday',
    startTime: '10:00',
    endTime: '12:00',
    type: 'Lab',
  },
  {
    id: '8',
    subject: 'Web Development',
    day: 'Friday',
    startTime: '09:00',
    endTime: '10:00',
    type: 'Lecture',
  },
  {
    id: '9',
    subject: 'Database Management',
    day: 'Friday',
    startTime: '14:00',
    endTime: '16:00',
    type: 'Lab',
  },
];

// ============================================
// HACKATHONS
// ============================================
export const mockHackathons: Hackathon[] = [
  {
    id: '1',
    name: 'Smart Campus Hackathon',
    startDate: in5Days,
    endDate: in7Days,
    schedule: '9:00 AM - 6:00 PM',
    checklist: [
      { id: '1', label: 'Team Formation', completed: true },
      { id: '2', label: 'Idea Finalization', completed: false },
      { id: '3', label: 'Prototype Development', completed: false },
      { id: '4', label: 'Presentation Ready', completed: false },
    ],
    taskId: '7',
  },
];

// ============================================
// EXPORT ALL MOCK DATA
// ============================================
export const mockData = {
  tasks: mockTasks,
  handwrittenAssignments: mockHandwrittenAssignments,
  onlineAssignments: mockOnlineAssignments,
  exams: mockExams,
  projects: mockProjects,
  subjects: mockSubjects,
  timetable: mockTimetable,
  hackathons: mockHackathons,
};
