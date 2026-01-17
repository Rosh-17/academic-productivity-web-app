import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Project, ProjectCategory, ProjectTask } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Progress } from '@/app/components/ui/progress';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Badge } from '@/app/components/ui/badge';
import { Plus, Edit, Trash2, CheckCircle, Github, Folder, Target } from 'lucide-react';

const Projects: React.FC = () => {
  const { projects, addProject, updateProject, deleteProject } = useData();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Subject' as ProjectCategory,
    githubUrl: '',
    localPath: '',
    tasks: [] as { title: string; completed: boolean }[],
    newTask: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Subject',
      githubUrl: '',
      localPath: '',
      tasks: [],
      newTask: '',
    });
    setEditingProject(null);
  };

  const handleAddTask = () => {
    if (formData.newTask.trim()) {
      setFormData(prev => ({
        ...prev,
        tasks: [...prev.tasks, { title: prev.newTask, completed: false }],
        newTask: '',
      }));
    }
  };

  const handleAddProject = () => {
    if (!formData.name) {
      alert('Please enter project name');
      return;
    }

    const tasks: ProjectTask[] = formData.tasks.map((t, idx) => ({
      id: Date.now().toString() + idx,
      title: t.title,
      completed: t.completed,
    }));

    addProject({
      name: formData.name,
      category: formData.category,
      githubUrl: formData.githubUrl || undefined,
      localPath: formData.localPath || undefined,
      tasks: tasks,
    });

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      category: project.category,
      githubUrl: project.githubUrl || '',
      localPath: project.localPath || '',
      tasks: project.tasks.map(t => ({ title: t.title, completed: t.completed })),
      newTask: '',
    });
    setIsDialogOpen(true);
  };

  const handleUpdateProject = () => {
    if (!editingProject || !formData.name) {
      alert('Please enter project name');
      return;
    }

    const tasks: ProjectTask[] = formData.tasks.map((t, idx) => ({
      id: Date.now().toString() + idx,
      title: t.title,
      completed: t.completed,
    }));

    updateProject(editingProject.id, {
      name: formData.name,
      category: formData.category,
      githubUrl: formData.githubUrl || undefined,
      localPath: formData.localPath || undefined,
      tasks: tasks,
    });

    resetForm();
    setIsDialogOpen(false);
  };

  const handleToggleTask = (projectId: string, taskId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const updatedTasks = project.tasks.map(t =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );

    updateProject(projectId, { tasks: updatedTasks });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">Track your academic and personal projects</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Project Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., ML Neural Network"
                />
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: ProjectCategory) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Subject">Subject</SelectItem>
                    <SelectItem value="Personal">Personal</SelectItem>
                    <SelectItem value="Minor">Minor Project</SelectItem>
                    <SelectItem value="Major">Major Project</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>GitHub URL</Label>
                <Input
                  value={formData.githubUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                  placeholder="https://github.com/..."
                />
              </div>

              <div className="space-y-2">
                <Label>Local Path</Label>
                <Input
                  value={formData.localPath}
                  onChange={(e) => setFormData(prev => ({ ...prev, localPath: e.target.value }))}
                  placeholder="/projects/my-project"
                />
              </div>

              <div className="space-y-2">
                <Label>Project Tasks</Label>
                <div className="flex gap-2">
                  <Input
                    value={formData.newTask}
                    onChange={(e) => setFormData(prev => ({ ...prev, newTask: e.target.value }))}
                    placeholder="Add a task"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                  />
                  <Button type="button" onClick={handleAddTask}>Add</Button>
                </div>
                <div className="space-y-1 mt-2">
                  {formData.tasks.map((task, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{task.title}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setFormData(prev => ({ ...prev, tasks: prev.tasks.filter((_, i) => i !== idx) }))}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={editingProject ? handleUpdateProject : handleAddProject}
                  className="flex-1"
                >
                  {editingProject ? 'Update' : 'Add Project'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => { resetForm(); setIsDialogOpen(false); }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {projects.length > 0 ? (
          projects.map(project => {
            const completedTasks = project.tasks.filter(t => t.completed).length;
            const totalTasks = project.tasks.length;
            const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

            return (
              <Card key={project.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-5 w-5 text-indigo-600" />
                        <CardTitle className="text-xl">{project.name}</CardTitle>
                        <Badge className="bg-indigo-100 text-indigo-800">
                          {project.category}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600 mt-2">
                        {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline">
                            <Github className="h-4 w-4" />
                            <span>GitHub</span>
                          </a>
                        )}
                        {project.localPath && (
                          <div className="flex items-center gap-1">
                            <Folder className="h-4 w-4" />
                            <span className="text-xs">{project.localPath}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProject(project)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (window.confirm('Delete this project?')) deleteProject(project.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold">{progress}% ({completedTasks}/{totalTasks} tasks)</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Tasks:</h4>
                    {project.tasks.length > 0 ? (
                      <div className="space-y-2">
                        {project.tasks.map(task => (
                          <div key={task.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                            <Checkbox
                              checked={task.completed}
                              onCheckedChange={() => handleToggleTask(project.id, task.id)}
                            />
                            <span className={`flex-1 text-sm ${task.completed ? 'line-through text-gray-500' : ''}`}>
                              {task.title}
                            </span>
                            {task.completed && <CheckCircle className="h-4 w-4 text-green-600" />}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No tasks added yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500 py-8">
                No projects yet. Add one to start tracking!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Projects;
