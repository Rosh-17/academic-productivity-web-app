import { Task, TaskStatus, TaskPriority, TaskCategory } from '@/types';

// ============================================
// TASK STATUS CALCULATION
// Auto-calculate status based on deadline and progress
// ============================================
export const calculateTaskStatus = (task: Task): TaskStatus => {
  // Completed if progress is 100%
  if (task.progress === 100) {
    return 'Completed';
  }
  
  // Overdue if deadline has passed
  const now = new Date();
  if (task.deadline < now) {
    return 'Overdue';
  }
  
  // Otherwise pending
  return 'Pending';
};

// ============================================
// TASK PRIORITY CALCULATION
// Auto-calculate priority based on:
// 1. Deadline proximity
// 2. Progress level
// 3. Category weight
// ============================================

// Category weights (higher = more important)
const CATEGORY_WEIGHTS: Record<TaskCategory, number> = {
  'Exam Prep': 10,
  'Continuous Assessment': 9,
  'Project Task': 8,
  'Lab File': 7,
  'Assignment': 6,
  'PPT': 5,
  'Homework': 4,
  'Hackathon': 8,
};

export const calculateTaskPriority = (task: Task): TaskPriority => {
  // Completed tasks have no priority
  if (task.progress === 100) {
    return 'Low';
  }
  
  const now = new Date();
  const timeUntilDeadline = task.deadline.getTime() - now.getTime();
  const daysUntilDeadline = timeUntilDeadline / (1000 * 60 * 60 * 24);
  const hoursUntilDeadline = timeUntilDeadline / (1000 * 60 * 60);
  
  // Get category weight
  const categoryWeight = CATEGORY_WEIGHTS[task.category] || 5;
  
  // Calculate priority score
  let priorityScore = 0;
  
  // 1. Deadline proximity scoring
  if (daysUntilDeadline < 0) {
    priorityScore += 40; // Overdue
  } else if (hoursUntilDeadline < 24) {
    priorityScore += 35; // Less than 24 hours
  } else if (daysUntilDeadline < 3) {
    priorityScore += 25; // Less than 3 days
  } else if (daysUntilDeadline < 7) {
    priorityScore += 15; // Less than a week
  } else {
    priorityScore += 5; // More than a week
  }
  
  // 2. Progress scoring (low progress = higher priority)
  if (task.progress < 25) {
    priorityScore += 20;
  } else if (task.progress < 50) {
    priorityScore += 15;
  } else if (task.progress < 75) {
    priorityScore += 10;
  }
  
  // 3. Category weight scoring
  priorityScore += categoryWeight;
  
  // Map score to priority level
  if (priorityScore >= 50) return 'Critical';
  if (priorityScore >= 35) return 'High';
  if (priorityScore >= 20) return 'Medium';
  return 'Low';
};

// ============================================
// UPDATE TASK WITH AUTO-CALCULATIONS
// ============================================
export const updateTaskCalculations = (task: Task): Task => {
  return {
    ...task,
    status: calculateTaskStatus(task),
    priority: calculateTaskPriority(task),
  };
};

// ============================================
// TASK FILTERING AND SORTING
// ============================================

// Get overdue tasks
export const getOverdueTasks = (tasks: Task[]): Task[] => {
  return tasks.filter(task => task.status === 'Overdue');
};

// Get pending tasks
export const getPendingTasks = (tasks: Task[]): Task[] => {
  return tasks.filter(task => task.status === 'Pending');
};

// Get completed tasks
export const getCompletedTasks = (tasks: Task[]): Task[] => {
  return tasks.filter(task => task.status === 'Completed');
};

// Get tasks by priority
export const getTasksByPriority = (tasks: Task[], priority: TaskPriority): Task[] => {
  return tasks.filter(task => task.priority === priority);
};

// Sort tasks by deadline (earliest first)
export const sortTasksByDeadline = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => a.deadline.getTime() - b.deadline.getTime());
};

// Sort tasks by priority (highest first)
const PRIORITY_ORDER: Record<TaskPriority, number> = {
  'Critical': 4,
  'High': 3,
  'Medium': 2,
  'Low': 1,
};

export const sortTasksByPriority = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority]);
};

// Get top priority task
export const getTopPriorityTask = (tasks: Task[]): Task | null => {
  const incompleteTasks = tasks.filter(task => task.status !== 'Completed');
  if (incompleteTasks.length === 0) return null;
  
  const sortedByPriority = sortTasksByPriority(incompleteTasks);
  const criticalTasks = sortedByPriority.filter(t => t.priority === 'Critical');
  
  if (criticalTasks.length > 0) {
    // If multiple critical tasks, return the one with earliest deadline
    return sortTasksByDeadline(criticalTasks)[0];
  }
  
  return sortedByPriority[0];
};

// Get upcoming deadlines (next 7 days)
export const getUpcomingDeadlines = (tasks: Task[], days: number = 7): Task[] => {
  const now = new Date();
  const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  
  return tasks.filter(task => {
    return task.status !== 'Completed' && 
           task.deadline >= now && 
           task.deadline <= futureDate;
  });
};

// ============================================
// DATE UTILITIES
// ============================================

// Format date for display
export const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('en-US', options);
};

// Format date and time
export const formatDateTime = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return date.toLocaleDateString('en-US', options);
};

// Calculate countdown
export const getCountdown = (date: Date): string => {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  
  if (diff < 0) {
    return 'Overdue';
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};

// Check if date is today
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
};

// Get day of week
export const getDayOfWeek = (date: Date): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
};
