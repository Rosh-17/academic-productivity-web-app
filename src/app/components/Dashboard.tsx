import React from 'react';
import { useData } from '@/context/DataContext';
import {
  getTopPriorityTask,
  getUpcomingDeadlines,
  getOverdueTasks,
  formatDate,
  getCountdown,
  isToday,
  getDayOfWeek,
} from '@/utils/taskUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Progress } from '@/app/components/ui/progress';
import { Badge } from '@/app/components/ui/badge';
import {
  AlertCircle,
  Calendar,
  Clock,
  BookOpen,
  CheckCircle,
  TrendingUp,
  AlertTriangle,
  Target,
  Zap,
} from 'lucide-react';

/**
 * DASHBOARD - THE MOST IMPORTANT MODULE
 * 
 * This is the central hub that intelligently displays:
 * - Priority Task (auto-selected based on urgency)
 * - Upcoming Deadlines
 * - Overdue Tasks
 * - Workload Overview
 * - Exam Preparation Progress
 * - Today's Classes
 * - Projects in Progress
 * 
 * All data is dynamically calculated from the Task Scheduler and other modules
 */

const Dashboard: React.FC = () => {
  const {
    tasks,
    exams,
    projects,
    subjects,
    timetable,
  } = useData();

  // ============================================
  // CALCULATE DASHBOARD METRICS
  // ============================================

  // Get priority task (highest priority, earliest deadline)
  const priorityTask = getTopPriorityTask(tasks);

  // Get upcoming deadlines (next 7 days)
  const upcomingDeadlines = getUpcomingDeadlines(tasks, 7).slice(0, 5);

  // Get overdue tasks
  const overdueTasks = getOverdueTasks(tasks);

  // Calculate workload (tasks by status)
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const pendingTasks = tasks.filter(t => t.status === 'Pending').length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Calculate exam preparation progress
  const upcomingExams = exams
    .filter(exam => exam.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 3);

  const examPrepStats = upcomingExams.map(exam => {
    const studiedTopics = exam.topics.filter(t => t.studied).length;
    const totalTopics = exam.topics.length;
    const progress = totalTopics > 0 ? Math.round((studiedTopics / totalTopics) * 100) : 0;
    return { exam, progress, studiedTopics, totalTopics };
  });

  // Get today's classes
  const todayDayName = getDayOfWeek(new Date()) as any;
  const todaysClasses = timetable
    .filter(entry => entry.day === todayDayName)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Get projects in progress
  const activeProjects = projects.filter(project => {
    const incompleteTasks = project.tasks.filter(task => !task.completed);
    return incompleteTasks.length > 0;
  });

  // Calculate overall subject progress
  const subjectStats = subjects.map(subject => {
    const studiedTopics = subject.topics.filter(t => t.studied).length;
    const totalTopics = subject.topics.length;
    const progress = totalTopics > 0 ? Math.round((studiedTopics / totalTopics) * 100) : 0;
    return { subject, progress };
  });

  // ============================================
  // PRIORITY BADGE COMPONENT
  // ============================================
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Overdue':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  // ============================================
  // RENDER DASHBOARD
  // ============================================

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Your academic overview at a glance</p>
      </div>

      {/* Priority Task - Hero Section */}
      {priorityTask && (
        <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">Priority Task</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{priorityTask.title}</h3>
                  {priorityTask.subject && (
                    <p className="text-sm text-gray-600 mt-1">{priorityTask.subject}</p>
                  )}
                </div>
                <Badge className={getPriorityColor(priorityTask.priority)}>
                  {priorityTask.priority}
                </Badge>
              </div>
              
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{formatDate(priorityTask.deadline)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="font-semibold">{getCountdown(priorityTask.deadline)}</span>
                </div>
                <Badge className={getStatusColor(priorityTask.status)}>
                  {priorityTask.status}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-semibold">{priorityTask.progress}%</span>
                </div>
                <Progress value={priorityTask.progress} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alerts Section */}
      {overdueTasks.length > 0 && (
        <Card className="border-2 border-red-200 bg-red-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <CardTitle className="text-lg text-red-900">
                Overdue Tasks ({overdueTasks.length})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {overdueTasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{task.title}</p>
                    <p className="text-sm text-gray-600">{task.subject || task.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-red-600">
                      {formatDate(task.deadline)}
                    </p>
                    <p className="text-xs text-gray-500">{task.progress}% complete</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Workload Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-base">Workload Overview</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">{completionRate}%</div>
                <p className="text-sm text-gray-600 mt-1">Completion Rate</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total Tasks</span>
                  <span className="font-semibold">{totalTasks}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Completed</span>
                  <span className="font-semibold text-green-600">{completedTasks}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Pending</span>
                  <span className="font-semibold text-orange-600">{pendingTasks}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Overdue</span>
                  <span className="font-semibold text-red-600">{overdueTasks.length}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-base">Upcoming Deadlines</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingDeadlines.length > 0 ? (
                upcomingDeadlines.map(task => (
                  <div key={task.id} className="flex items-start justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900">{task.title}</p>
                      <p className="text-xs text-gray-500">{task.category}</p>
                    </div>
                    <div className="text-right ml-2">
                      <p className="text-xs font-semibold text-purple-600">
                        {getCountdown(task.deadline)}
                      </p>
                      <Badge className={`mt-1 text-xs ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No upcoming deadlines</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Today's Classes */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-600" />
              <CardTitle className="text-base">Today's Classes</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaysClasses.length > 0 ? (
                todaysClasses.map(entry => (
                  <div key={entry.id} className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900">{entry.subject}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          {entry.startTime} - {entry.endTime}
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-300">
                        {entry.type}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No classes today</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Exam Preparation Progress */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-base">Exam Preparation</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {examPrepStats.length > 0 ? (
                examPrepStats.map(({ exam, progress, studiedTopics, totalTopics }) => (
                  <div key={exam.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm text-gray-900">{exam.subject}</p>
                        <p className="text-xs text-gray-500">
                          {formatDate(exam.date)} at {exam.time}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-orange-600">{progress}%</p>
                        <p className="text-xs text-gray-500">
                          {studiedTopics}/{totalTopics} topics
                        </p>
                      </div>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No upcoming exams</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Projects in Progress */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-indigo-600" />
              <CardTitle className="text-base">Projects in Progress</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeProjects.length > 0 ? (
                activeProjects.map(project => {
                  const completedTasks = project.tasks.filter(t => t.completed).length;
                  const totalTasks = project.tasks.length;
                  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
                  
                  return (
                    <div key={project.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-900">{project.name}</p>
                          <Badge className="mt-1 text-xs bg-indigo-100 text-indigo-800 border-indigo-300">
                            {project.category}
                          </Badge>
                        </div>
                        <div className="text-right ml-2">
                          <p className="text-sm font-semibold text-indigo-600">{progress}%</p>
                          <p className="text-xs text-gray-500">
                            {completedTasks}/{totalTasks} tasks
                          </p>
                        </div>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No active projects</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject Progress */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-teal-600" />
            <CardTitle className="text-base">Subject Progress</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjectStats.map(({ subject, progress }) => (
              <div key={subject.id} className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-sm text-gray-900">{subject.name}</p>
                    <p className="text-xs text-gray-500">{subject.code}</p>
                  </div>
                  <span className="text-lg font-bold text-teal-600">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
