import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Task, TaskCategory, TaskPriority, TaskStatus } from '@/types';
import { formatDate, getCountdown, sortTasksByDeadline, sortTasksByPriority } from '@/utils/taskUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Progress } from '@/app/components/ui/progress';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Slider } from '@/app/components/ui/slider';
import { Plus, Calendar, Clock, Tag, TrendingUp, Trash2, Edit, Filter } from 'lucide-react';

/**
 * TASK SCHEDULER - CORE ENGINE OF THE APP
 * 
 * This is the heart of the application where all tasks from:
 * - Assignments
 * - Exams
 * - Projects
 * - Hackathons
 * 
 * Are displayed and managed. Tasks have:
 * - Auto-calculated status (Pending/Overdue/Completed)
 * - Auto-calculated priority (Low/Medium/High/Critical)
 * - Progress tracking (0-100%)
 * - Deadline tracking with countdowns
 */

const TaskScheduler: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask } = useData();
  
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [sortBy, setSortBy] = useState<'deadline' | 'priority'>('deadline');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'All'>('All');
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'All'>('All');
  
  // Form state for add/edit
  const [formData, setFormData] = useState({
    title: '',
    category: 'Assignment' as TaskCategory,
    subject: '',
    deadline: '',
    progress: 0,
    description: '',
  });

  // ============================================
  // FILTERING AND SORTING
  // ============================================
  
  const filteredTasks = tasks.filter(task => {
    if (filterStatus !== 'All' && task.status !== filterStatus) return false;
    if (filterPriority !== 'All' && task.priority !== filterPriority) return false;
    return true;
  });

  const sortedTasks = sortBy === 'deadline' 
    ? sortTasksByDeadline(filteredTasks)
    : sortTasksByPriority(filteredTasks);

  // ============================================
  // FORM HANDLERS
  // ============================================
  
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: 'Assignment',
      subject: '',
      deadline: '',
      progress: 0,
      description: '',
    });
    setEditingTask(null);
  };

  const handleAddTask = () => {
    if (!formData.title || !formData.deadline) {
      alert('Please fill in required fields');
      return;
    }

    addTask({
      title: formData.title,
      category: formData.category,
      subject: formData.subject || undefined,
      deadline: new Date(formData.deadline),
      progress: formData.progress,
      description: formData.description || undefined,
    });

    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      category: task.category,
      subject: task.subject || '',
      deadline: task.deadline.toISOString().split('T')[0],
      progress: task.progress,
      description: task.description || '',
    });
    setIsAddDialogOpen(true);
  };

  const handleUpdateTask = () => {
    if (!editingTask || !formData.title || !formData.deadline) {
      alert('Please fill in required fields');
      return;
    }

    updateTask(editingTask.id, {
      title: formData.title,
      category: formData.category,
      subject: formData.subject || undefined,
      deadline: new Date(formData.deadline),
      progress: formData.progress,
      description: formData.description || undefined,
    });

    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleDeleteTask = (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(id);
    }
  };

  const handleProgressChange = (taskId: string, newProgress: number) => {
    updateTask(taskId, { progress: newProgress });
  };

  // ============================================
  // STATISTICS
  // ============================================
  
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    pending: tasks.filter(t => t.status === 'Pending').length,
    overdue: tasks.filter(t => t.status === 'Overdue').length,
    critical: tasks.filter(t => t.priority === 'Critical').length,
    high: tasks.filter(t => t.priority === 'High').length,
  };

  // ============================================
  // HELPER FUNCTIONS
  // ============================================
  
  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'Overdue': return 'bg-red-100 text-red-800 border-red-300';
      case 'Completed': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const getCategoryIcon = (category: TaskCategory) => {
    return <Tag className="h-4 w-4" />;
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Task Scheduler</h1>
          <p className="text-gray-600 mt-1">Core engine - All tasks in one place</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsAddDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter task title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Assignment">Assignment</SelectItem>
                    <SelectItem value="Lab File">Lab File</SelectItem>
                    <SelectItem value="Continuous Assessment">Continuous Assessment</SelectItem>
                    <SelectItem value="PPT">PPT</SelectItem>
                    <SelectItem value="Homework">Homework</SelectItem>
                    <SelectItem value="Project Task">Project Task</SelectItem>
                    <SelectItem value="Exam Prep">Exam Prep</SelectItem>
                    <SelectItem value="Hackathon">Hackathon</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject (Optional)</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  placeholder="Enter subject name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline *</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => handleInputChange('deadline', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="progress">Progress: {formData.progress}%</Label>
                <Slider
                  id="progress"
                  value={[formData.progress]}
                  onValueChange={(value) => handleInputChange('progress', value[0])}
                  max={100}
                  step={5}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter description"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={editingTask ? handleUpdateTask : handleAddTask}
                  className="flex-1"
                >
                  {editingTask ? 'Update Task' : 'Add Task'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => { resetForm(); setIsAddDialogOpen(false); }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.pending}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
              <div className="text-sm text-gray-600">Overdue</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
              <div className="text-sm text-gray-600">Critical</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.high}</div>
              <div className="text-sm text-gray-600">High Priority</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Sorting */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            
            <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterPriority} onValueChange={(value: any) => setFilterPriority(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Priority</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm font-medium">Sort by:</span>
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deadline">Deadline</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <div className="space-y-4">
        {sortedTasks.length > 0 ? (
          sortedTasks.map(task => (
            <Card key={task.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Task Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <Badge className={getStatusColor(task.status)}>
                          {task.status}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          {getCategoryIcon(task.category)}
                          <span>{task.category}</span>
                        </div>
                        {task.subject && (
                          <div className="flex items-center gap-1">
                            <span className="font-medium">{task.subject}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(task.deadline)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span className="font-semibold">{getCountdown(task.deadline)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditTask(task)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold">{task.progress}%</span>
                    </div>
                    <Progress value={task.progress} className="h-2" />
                    
                    {/* Quick Progress Update */}
                    <div className="flex items-center gap-2 pt-2">
                      <span className="text-xs text-gray-500">Quick update:</span>
                      <div className="flex gap-1">
                        {[0, 25, 50, 75, 100].map(value => (
                          <Button
                            key={value}
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={() => handleProgressChange(task.id, value)}
                          >
                            {value}%
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {task.description && (
                    <p className="text-sm text-gray-600 pt-2 border-t">{task.description}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500 py-8">
                No tasks found. Add your first task to get started!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TaskScheduler;
