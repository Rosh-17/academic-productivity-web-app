import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { HandwrittenAssignment, OnlineAssignment } from '@/types';
import { formatDate } from '@/utils/taskUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Progress } from '@/app/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Slider } from '@/app/components/ui/slider';
import { Plus, Edit, Trash2, FileText, Upload, BookOpen } from 'lucide-react';

/**
 * ASSIGNMENTS MODULE
 * 
 * Manages two types of assignments:
 * 1. Handwritten Assignments - Traditional pen & paper work
 * 2. Online Assignments - Digital submissions (PDF/DOC/ZIP)
 * 
 * All assignments automatically create tasks in the Task Scheduler
 * Progress syncs between assignments and tasks
 */

const Assignments: React.FC = () => {
  const {
    handwrittenAssignments,
    addHandwrittenAssignment,
    updateHandwrittenAssignment,
    deleteHandwrittenAssignment,
    onlineAssignments,
    addOnlineAssignment,
    updateOnlineAssignment,
    deleteOnlineAssignment,
  } = useData();

  // ============================================
  // STATE MANAGEMENT
  // ============================================
  
  const [isHandwrittenDialogOpen, setIsHandwrittenDialogOpen] = useState(false);
  const [isOnlineDialogOpen, setIsOnlineDialogOpen] = useState(false);
  const [editingHandwritten, setEditingHandwritten] = useState<HandwrittenAssignment | null>(null);
  const [editingOnline, setEditingOnline] = useState<OnlineAssignment | null>(null);

  // Form states
  const [handwrittenForm, setHandwrittenForm] = useState({
    subject: '',
    title: '',
    deadline: '',
    progress: 0,
  });

  const [onlineForm, setOnlineForm] = useState({
    subject: '',
    title: '',
    deadline: '',
    progress: 0,
    fileName: '',
    fileType: 'PDF',
  });

  // ============================================
  // HANDWRITTEN ASSIGNMENT HANDLERS
  // ============================================
  
  const resetHandwrittenForm = () => {
    setHandwrittenForm({
      subject: '',
      title: '',
      deadline: '',
      progress: 0,
    });
    setEditingHandwritten(null);
  };

  const handleAddHandwritten = () => {
    if (!handwrittenForm.subject || !handwrittenForm.title || !handwrittenForm.deadline) {
      alert('Please fill in all required fields');
      return;
    }

    addHandwrittenAssignment({
      subject: handwrittenForm.subject,
      title: handwrittenForm.title,
      deadline: new Date(handwrittenForm.deadline),
      progress: handwrittenForm.progress,
    });

    resetHandwrittenForm();
    setIsHandwrittenDialogOpen(false);
  };

  const handleEditHandwritten = (assignment: HandwrittenAssignment) => {
    setEditingHandwritten(assignment);
    setHandwrittenForm({
      subject: assignment.subject,
      title: assignment.title,
      deadline: assignment.deadline.toISOString().split('T')[0],
      progress: assignment.progress,
    });
    setIsHandwrittenDialogOpen(true);
  };

  const handleUpdateHandwritten = () => {
    if (!editingHandwritten || !handwrittenForm.subject || !handwrittenForm.title || !handwrittenForm.deadline) {
      alert('Please fill in all required fields');
      return;
    }

    updateHandwrittenAssignment(editingHandwritten.id, {
      subject: handwrittenForm.subject,
      title: handwrittenForm.title,
      deadline: new Date(handwrittenForm.deadline),
      progress: handwrittenForm.progress,
    });

    resetHandwrittenForm();
    setIsHandwrittenDialogOpen(false);
  };

  const handleDeleteHandwritten = (id: string) => {
    if (window.confirm('Delete this assignment? This will also remove the associated task.')) {
      deleteHandwrittenAssignment(id);
    }
  };

  // ============================================
  // ONLINE ASSIGNMENT HANDLERS
  // ============================================
  
  const resetOnlineForm = () => {
    setOnlineForm({
      subject: '',
      title: '',
      deadline: '',
      progress: 0,
      fileName: '',
      fileType: 'PDF',
    });
    setEditingOnline(null);
  };

  const handleAddOnline = () => {
    if (!onlineForm.subject || !onlineForm.title || !onlineForm.deadline) {
      alert('Please fill in all required fields');
      return;
    }

    addOnlineAssignment({
      subject: onlineForm.subject,
      title: onlineForm.title,
      deadline: new Date(onlineForm.deadline),
      progress: onlineForm.progress,
      fileName: onlineForm.fileName || undefined,
      fileType: onlineForm.fileType || undefined,
    });

    resetOnlineForm();
    setIsOnlineDialogOpen(false);
  };

  const handleEditOnline = (assignment: OnlineAssignment) => {
    setEditingOnline(assignment);
    setOnlineForm({
      subject: assignment.subject,
      title: assignment.title,
      deadline: assignment.deadline.toISOString().split('T')[0],
      progress: assignment.progress,
      fileName: assignment.fileName || '',
      fileType: assignment.fileType || 'PDF',
    });
    setIsOnlineDialogOpen(true);
  };

  const handleUpdateOnline = () => {
    if (!editingOnline || !onlineForm.subject || !onlineForm.title || !onlineForm.deadline) {
      alert('Please fill in all required fields');
      return;
    }

    updateOnlineAssignment(editingOnline.id, {
      subject: onlineForm.subject,
      title: onlineForm.title,
      deadline: new Date(onlineForm.deadline),
      progress: onlineForm.progress,
      fileName: onlineForm.fileName || undefined,
      fileType: onlineForm.fileType || undefined,
    });

    resetOnlineForm();
    setIsOnlineDialogOpen(false);
  };

  const handleDeleteOnline = (id: string) => {
    if (window.confirm('Delete this assignment? This will also remove the associated task.')) {
      deleteOnlineAssignment(id);
    }
  };

  const handleMockFileUpload = () => {
    const mockFileName = `assignment_${Date.now()}.pdf`;
    setOnlineForm(prev => ({ ...prev, fileName: mockFileName }));
    alert('Mock file uploaded: ' + mockFileName);
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
        <p className="text-gray-600 mt-1">Manage handwritten and online assignments</p>
      </div>

      {/* Tabs for Handwritten vs Online */}
      <Tabs defaultValue="handwritten" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="handwritten">
            <FileText className="h-4 w-4 mr-2" />
            Handwritten
          </TabsTrigger>
          <TabsTrigger value="online">
            <Upload className="h-4 w-4 mr-2" />
            Online
          </TabsTrigger>
        </TabsList>

        {/* ============================================
            HANDWRITTEN ASSIGNMENTS TAB
            ============================================ */}
        <TabsContent value="handwritten" className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Handwritten Assignments</h2>
            <Dialog open={isHandwrittenDialogOpen} onOpenChange={setIsHandwrittenDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { resetHandwrittenForm(); setIsHandwrittenDialogOpen(true); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Handwritten
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingHandwritten ? 'Edit Handwritten Assignment' : 'Add Handwritten Assignment'}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="hw-subject">Subject *</Label>
                    <Input
                      id="hw-subject"
                      value={handwrittenForm.subject}
                      onChange={(e) => setHandwrittenForm(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="e.g., Data Structures"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hw-title">Title *</Label>
                    <Input
                      id="hw-title"
                      value={handwrittenForm.title}
                      onChange={(e) => setHandwrittenForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Lab 5 - Binary Trees"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hw-deadline">Deadline *</Label>
                    <Input
                      id="hw-deadline"
                      type="date"
                      value={handwrittenForm.deadline}
                      onChange={(e) => setHandwrittenForm(prev => ({ ...prev, deadline: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hw-progress">Progress: {handwrittenForm.progress}%</Label>
                    <Slider
                      id="hw-progress"
                      value={[handwrittenForm.progress]}
                      onValueChange={(value) => setHandwrittenForm(prev => ({ ...prev, progress: value[0] }))}
                      max={100}
                      step={5}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button 
                      onClick={editingHandwritten ? handleUpdateHandwritten : handleAddHandwritten}
                      className="flex-1"
                    >
                      {editingHandwritten ? 'Update' : 'Add Assignment'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => { resetHandwrittenForm(); setIsHandwrittenDialogOpen(false); }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Handwritten Assignments List */}
          <div className="space-y-4">
            {handwrittenAssignments.length > 0 ? (
              handwrittenAssignments.map(assignment => (
                <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <BookOpen className="h-5 w-5 text-blue-600" />
                            <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                          </div>
                          <p className="text-sm text-gray-600">{assignment.subject}</p>
                          <p className="text-sm text-gray-500 mt-1">Due: {formatDate(assignment.deadline)}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditHandwritten(assignment)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteHandwritten(assignment.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Completion</span>
                          <span className="font-semibold">{assignment.progress}%</span>
                        </div>
                        <Progress value={assignment.progress} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-500 py-8">
                    No handwritten assignments yet. Add one to get started!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* ============================================
            ONLINE ASSIGNMENTS TAB
            ============================================ */}
        <TabsContent value="online" className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Online Assignments</h2>
            <Dialog open={isOnlineDialogOpen} onOpenChange={setIsOnlineDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { resetOnlineForm(); setIsOnlineDialogOpen(true); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Online
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingOnline ? 'Edit Online Assignment' : 'Add Online Assignment'}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="on-subject">Subject *</Label>
                    <Input
                      id="on-subject"
                      value={onlineForm.subject}
                      onChange={(e) => setOnlineForm(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="e.g., Database Management"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="on-title">Title *</Label>
                    <Input
                      id="on-title"
                      value={onlineForm.title}
                      onChange={(e) => setOnlineForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., SQL Assignment"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="on-deadline">Deadline *</Label>
                    <Input
                      id="on-deadline"
                      type="date"
                      value={onlineForm.deadline}
                      onChange={(e) => setOnlineForm(prev => ({ ...prev, deadline: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="on-file">File Upload (Mock)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="on-file"
                        value={onlineForm.fileName}
                        placeholder="No file uploaded"
                        disabled
                      />
                      <Button type="button" variant="outline" onClick={handleMockFileUpload}>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="on-progress">Progress: {onlineForm.progress}%</Label>
                    <Slider
                      id="on-progress"
                      value={[onlineForm.progress]}
                      onValueChange={(value) => setOnlineForm(prev => ({ ...prev, progress: value[0] }))}
                      max={100}
                      step={5}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button 
                      onClick={editingOnline ? handleUpdateOnline : handleAddOnline}
                      className="flex-1"
                    >
                      {editingOnline ? 'Update' : 'Add Assignment'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => { resetOnlineForm(); setIsOnlineDialogOpen(false); }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Online Assignments List */}
          <div className="space-y-4">
            {onlineAssignments.length > 0 ? (
              onlineAssignments.map(assignment => (
                <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Upload className="h-5 w-5 text-green-600" />
                            <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                          </div>
                          <p className="text-sm text-gray-600">{assignment.subject}</p>
                          <p className="text-sm text-gray-500 mt-1">Due: {formatDate(assignment.deadline)}</p>
                          {assignment.fileName && (
                            <p className="text-sm text-blue-600 mt-1">📎 {assignment.fileName}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditOnline(assignment)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteOnline(assignment.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Completion</span>
                          <span className="font-semibold">{assignment.progress}%</span>
                        </div>
                        <Progress value={assignment.progress} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-500 py-8">
                    No online assignments yet. Add one to get started!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Assignments;
