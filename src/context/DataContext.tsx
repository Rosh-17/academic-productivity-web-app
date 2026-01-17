import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
import { mockData } from '@/data/mockData';

// ============================================
// DATA CONTEXT - Central State Management
// All modules feed into the Task Scheduler through this context
// ============================================

interface DataContextType {
  // Tasks (Core Engine)
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'status' | 'priority'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  
  // Assignments
  handwrittenAssignments: HandwrittenAssignment[];
  addHandwrittenAssignment: (assignment: Omit<HandwrittenAssignment, 'id' | 'taskId'>) => void;
  updateHandwrittenAssignment: (id: string, updates: Partial<HandwrittenAssignment>) => void;
  deleteHandwrittenAssignment: (id: string) => void;
  
  onlineAssignments: OnlineAssignment[];
  addOnlineAssignment: (assignment: Omit<OnlineAssignment, 'id' | 'taskId'>) => void;
  updateOnlineAssignment: (id: string, updates: Partial<OnlineAssignment>) => void;
  deleteOnlineAssignment: (id: string) => void;
  
  // Exams
  exams: Exam[];
  addExam: (exam: Omit<Exam, 'id'>) => void;
  updateExam: (id: string, updates: Partial<Exam>) => void;
  deleteExam: (id: string) => void;
  
  // Projects
  projects: Project[];
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  // Subjects
  subjects: Subject[];
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  
  // Timetable
  timetable: TimetableEntry[];
  addTimetableEntry: (entry: Omit<TimetableEntry, 'id'>) => void;
  updateTimetableEntry: (id: string, updates: Partial<TimetableEntry>) => void;
  deleteTimetableEntry: (id: string) => void;
  
  // Hackathons
  hackathons: Hackathon[];
  addHackathon: (hackathon: Omit<Hackathon, 'id' | 'taskId'>) => void;
  updateHackathon: (id: string, updates: Partial<Hackathon>) => void;
  deleteHackathon: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// ============================================
// DATA PROVIDER COMPONENT
// ============================================

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize with mock data
  const [tasks, setTasks] = useState<Task[]>(mockData.tasks);
  const [handwrittenAssignments, setHandwrittenAssignments] = useState<HandwrittenAssignment[]>(mockData.handwrittenAssignments);
  const [onlineAssignments, setOnlineAssignments] = useState<OnlineAssignment[]>(mockData.onlineAssignments);
  const [exams, setExams] = useState<Exam[]>(mockData.exams);
  const [projects, setProjects] = useState<Project[]>(mockData.projects);
  const [subjects, setSubjects] = useState<Subject[]>(mockData.subjects);
  const [timetable, setTimetable] = useState<TimetableEntry[]>(mockData.timetable);
  const [hackathons, setHackathons] = useState<Hackathon[]>(mockData.hackathons);

  // Auto-update task calculations when tasks change
  useEffect(() => {
    setTasks(prevTasks => prevTasks.map(updateTaskCalculations));
  }, []);

  // ============================================
  // TASK OPERATIONS (Core Engine)
  // ============================================
  
  const addTask = (taskData: Omit<Task, 'id' | 'status' | 'priority'>): Task => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      status: 'Pending',
      priority: 'Low',
    };
    const calculatedTask = updateTaskCalculations(newTask);
    setTasks(prev => [...prev, calculatedTask]);
    return calculatedTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? updateTaskCalculations({ ...task, ...updates }) : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  // ============================================
  // HANDWRITTEN ASSIGNMENT OPERATIONS
  // Auto-creates task in Task Scheduler
  // ============================================
  
  const addHandwrittenAssignment = (assignmentData: Omit<HandwrittenAssignment, 'id' | 'taskId'>) => {
    const newAssignment: HandwrittenAssignment = {
      ...assignmentData,
      id: Date.now().toString(),
    };
    
    // Auto-create task
    const task = addTask({
      title: assignmentData.title,
      category: 'Assignment',
      subject: assignmentData.subject,
      deadline: assignmentData.deadline,
      progress: assignmentData.progress,
      sourceType: 'assignment',
      sourceId: newAssignment.id,
    });
    
    newAssignment.taskId = task.id;
    setHandwrittenAssignments(prev => [...prev, newAssignment]);
  };

  const updateHandwrittenAssignment = (id: string, updates: Partial<HandwrittenAssignment>) => {
    setHandwrittenAssignments(prev =>
      prev.map(assignment => {
        if (assignment.id === id) {
          const updated = { ...assignment, ...updates };
          
          // Sync with task
          if (updated.taskId) {
            updateTask(updated.taskId, {
              title: updated.title,
              subject: updated.subject,
              deadline: updated.deadline,
              progress: updated.progress,
            });
          }
          
          return updated;
        }
        return assignment;
      })
    );
  };

  const deleteHandwrittenAssignment = (id: string) => {
    const assignment = handwrittenAssignments.find(a => a.id === id);
    if (assignment?.taskId) {
      deleteTask(assignment.taskId);
    }
    setHandwrittenAssignments(prev => prev.filter(a => a.id !== id));
  };

  // ============================================
  // ONLINE ASSIGNMENT OPERATIONS
  // ============================================
  
  const addOnlineAssignment = (assignmentData: Omit<OnlineAssignment, 'id' | 'taskId'>) => {
    const newAssignment: OnlineAssignment = {
      ...assignmentData,
      id: Date.now().toString(),
    };
    
    // Auto-create task
    const task = addTask({
      title: assignmentData.title,
      category: 'Assignment',
      subject: assignmentData.subject,
      deadline: assignmentData.deadline,
      progress: assignmentData.progress,
      sourceType: 'assignment',
      sourceId: newAssignment.id,
    });
    
    newAssignment.taskId = task.id;
    setOnlineAssignments(prev => [...prev, newAssignment]);
  };

  const updateOnlineAssignment = (id: string, updates: Partial<OnlineAssignment>) => {
    setOnlineAssignments(prev =>
      prev.map(assignment => {
        if (assignment.id === id) {
          const updated = { ...assignment, ...updates };
          
          // Sync with task
          if (updated.taskId) {
            updateTask(updated.taskId, {
              title: updated.title,
              subject: updated.subject,
              deadline: updated.deadline,
              progress: updated.progress,
            });
          }
          
          return updated;
        }
        return assignment;
      })
    );
  };

  const deleteOnlineAssignment = (id: string) => {
    const assignment = onlineAssignments.find(a => a.id === id);
    if (assignment?.taskId) {
      deleteTask(assignment.taskId);
    }
    setOnlineAssignments(prev => prev.filter(a => a.id !== id));
  };

  // ============================================
  // EXAM OPERATIONS
  // ============================================
  
  const addExam = (examData: Omit<Exam, 'id'>) => {
    const newExam: Exam = {
      ...examData,
      id: Date.now().toString(),
    };
    setExams(prev => [...prev, newExam]);
  };

  const updateExam = (id: string, updates: Partial<Exam>) => {
    setExams(prev =>
      prev.map(exam => (exam.id === id ? { ...exam, ...updates } : exam))
    );
  };

  const deleteExam = (id: string) => {
    setExams(prev => prev.filter(exam => exam.id !== id));
  };

  // ============================================
  // PROJECT OPERATIONS
  // Project tasks auto-sync with Task Scheduler
  // ============================================
  
  const addProject = (projectData: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
    };
    setProjects(prev => [...prev, newProject]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev =>
      prev.map(project => {
        if (project.id === id) {
          const updated = { ...project, ...updates };
          
          // Sync project tasks with Task Scheduler
          if (updates.tasks) {
            updates.tasks.forEach(projectTask => {
              if (projectTask.deadline && !projectTask.taskId) {
                const task = addTask({
                  title: `${updated.name}: ${projectTask.title}`,
                  category: 'Project Task',
                  deadline: projectTask.deadline,
                  progress: projectTask.completed ? 100 : 0,
                  sourceType: 'project',
                  sourceId: projectTask.id,
                });
                projectTask.taskId = task.id;
              }
            });
          }
          
          return updated;
        }
        return project;
      })
    );
  };

  const deleteProject = (id: string) => {
    // Delete associated tasks
    const project = projects.find(p => p.id === id);
    if (project) {
      project.tasks.forEach(projectTask => {
        if (projectTask.taskId) {
          deleteTask(projectTask.taskId);
        }
      });
    }
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  // ============================================
  // SUBJECT OPERATIONS
  // ============================================
  
  const addSubject = (subjectData: Omit<Subject, 'id'>) => {
    const newSubject: Subject = {
      ...subjectData,
      id: Date.now().toString(),
    };
    setSubjects(prev => [...prev, newSubject]);
  };

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    setSubjects(prev =>
      prev.map(subject => (subject.id === id ? { ...subject, ...updates } : subject))
    );
  };

  const deleteSubject = (id: string) => {
    setSubjects(prev => prev.filter(subject => subject.id !== id));
  };

  // ============================================
  // TIMETABLE OPERATIONS
  // ============================================
  
  const addTimetableEntry = (entryData: Omit<TimetableEntry, 'id'>) => {
    const newEntry: TimetableEntry = {
      ...entryData,
      id: Date.now().toString(),
    };
    setTimetable(prev => [...prev, newEntry]);
  };

  const updateTimetableEntry = (id: string, updates: Partial<TimetableEntry>) => {
    setTimetable(prev =>
      prev.map(entry => (entry.id === id ? { ...entry, ...updates } : entry))
    );
  };

  const deleteTimetableEntry = (id: string) => {
    setTimetable(prev => prev.filter(entry => entry.id !== id));
  };

  // ============================================
  // HACKATHON OPERATIONS
  // Auto-creates task in Task Scheduler
  // ============================================
  
  const addHackathon = (hackathonData: Omit<Hackathon, 'id' | 'taskId'>) => {
    const newHackathon: Hackathon = {
      ...hackathonData,
      id: Date.now().toString(),
    };
    
    // Auto-create task for hackathon
    const task = addTask({
      title: hackathonData.name,
      category: 'Hackathon',
      deadline: hackathonData.endDate,
      progress: 0,
      sourceType: 'hackathon',
      sourceId: newHackathon.id,
    });
    
    newHackathon.taskId = task.id;
    setHackathons(prev => [...prev, newHackathon]);
  };

  const updateHackathon = (id: string, updates: Partial<Hackathon>) => {
    setHackathons(prev =>
      prev.map(hackathon => {
        if (hackathon.id === id) {
          const updated = { ...hackathon, ...updates };
          
          // Sync with task
          if (updated.taskId) {
            const completedItems = updated.checklist.filter(item => item.completed).length;
            const progress = Math.round((completedItems / updated.checklist.length) * 100);
            
            updateTask(updated.taskId, {
              title: updated.name,
              deadline: updated.endDate,
              progress: progress,
            });
          }
          
          return updated;
        }
        return hackathon;
      })
    );
  };

  const deleteHackathon = (id: string) => {
    const hackathon = hackathons.find(h => h.id === id);
    if (hackathon?.taskId) {
      deleteTask(hackathon.taskId);
    }
    setHackathons(prev => prev.filter(h => h.id !== id));
  };

  // ============================================
  // CONTEXT VALUE
  // ============================================
  
  const value: DataContextType = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    
    handwrittenAssignments,
    addHandwrittenAssignment,
    updateHandwrittenAssignment,
    deleteHandwrittenAssignment,
    
    onlineAssignments,
    addOnlineAssignment,
    updateOnlineAssignment,
    deleteOnlineAssignment,
    
    exams,
    addExam,
    updateExam,
    deleteExam,
    
    projects,
    addProject,
    updateProject,
    deleteProject,
    
    subjects,
    addSubject,
    updateSubject,
    deleteSubject,
    
    timetable,
    addTimetableEntry,
    updateTimetableEntry,
    deleteTimetableEntry,
    
    hackathons,
    addHackathon,
    updateHackathon,
    deleteHackathon,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

// ============================================
// CUSTOM HOOK TO USE DATA CONTEXT
// ============================================

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
