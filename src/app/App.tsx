import React, { useState } from 'react';
import { DataProvider } from '@/context/DataContext';
import Dashboard from '@/app/components/Dashboard';
import TaskScheduler from '@/app/components/TaskScheduler';
import Assignments from '@/app/components/Assignments';
import Exams from '@/app/components/Exams';
import Projects from '@/app/components/Projects';
import Subjects from '@/app/components/Subjects';
import Timetable from '@/app/components/Timetable';
import Hackathons from '@/app/components/Hackathons';
import { Button } from '@/app/components/ui/button';
import {
  LayoutDashboard,
  ListTodo,
  FileText,
  BookOpen,
  FolderKanban,
  GraduationCap,
  Calendar,
  Code,
  Menu,
  X,
} from 'lucide-react';

/**
 * ============================================
 * ACADEMIC PRODUCTIVITY APP
 * ============================================
 * 
 * A comprehensive productivity tool for college and engineering students
 * 
 * CORE ARCHITECTURE:
 * - Task Scheduler as the central engine
 * - All modules feed into Task Scheduler
 * - Dashboard intelligently reflects all data
 * 
 * MODULES:
 * 1. Dashboard - Overview and insights
 * 2. Task Scheduler - Core task management engine
 * 3. Assignments - Handwritten & online assignments
 * 4. Exams - Schedule and preparation tracking
 * 5. Projects - Project and task management
 * 6. Subjects - Topic and notes tracking
 * 7. Timetable - Weekly class schedule
 * 8. Hackathons - Competition tracking
 * 
 * All data is automatically synchronized and calculated
 */

type Page = 
  | 'dashboard' 
  | 'tasks' 
  | 'assignments' 
  | 'exams' 
  | 'projects' 
  | 'subjects' 
  | 'timetable' 
  | 'hackathons';

interface NavItem {
  id: Page;
  label: string;
  icon: React.ReactNode;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Navigation items
  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: 'tasks', label: 'Task Scheduler', icon: <ListTodo className="h-5 w-5" /> },
    { id: 'assignments', label: 'Assignments', icon: <FileText className="h-5 w-5" /> },
    { id: 'exams', label: 'Exams', icon: <BookOpen className="h-5 w-5" /> },
    { id: 'projects', label: 'Projects', icon: <FolderKanban className="h-5 w-5" /> },
    { id: 'subjects', label: 'Subjects', icon: <GraduationCap className="h-5 w-5" /> },
    { id: 'timetable', label: 'Timetable', icon: <Calendar className="h-5 w-5" /> },
    { id: 'hackathons', label: 'Hackathons', icon: <Code className="h-5 w-5" /> },
  ];

  // Render current page
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'tasks':
        return <TaskScheduler />;
      case 'assignments':
        return <Assignments />;
      case 'exams':
        return <Exams />;
      case 'projects':
        return <Projects />;
      case 'subjects':
        return <Subjects />;
      case 'timetable':
        return <Timetable />;
      case 'hackathons':
        return <Hackathons />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <DataProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo and Title */}
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">StudyFlow</h1>
                  <p className="text-xs text-gray-600">Academic Productivity Suite</p>
                </div>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      currentPage === item.id
                        ? 'bg-blue-100 text-blue-700 font-semibold'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {item.icon}
                    <span className="text-sm">{item.label}</span>
                  </button>
                ))}
              </nav>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 text-gray-600" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-600" />
                )}
              </button>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
              <nav className="lg:hidden pb-4 space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentPage(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      currentPage === item.id
                        ? 'bg-blue-100 text-blue-700 font-semibold'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {item.icon}
                    <span className="text-sm">{item.label}</span>
                  </button>
                ))}
              </nav>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderPage()}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center text-sm text-gray-600">
              <p>
                <strong>StudyFlow</strong> - Academic Productivity for College Students
              </p>
              <p className="mt-1 text-xs">
                All tasks automatically sync with the central Task Scheduler
              </p>
            </div>
          </div>
        </footer>
      </div>
    </DataProvider>
  );
}
