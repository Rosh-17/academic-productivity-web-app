import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Exam, ExamTopic } from '@/types';
import { formatDate, getCountdown } from '@/utils/taskUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle,DialogTrigger } from '@/app/components/ui/dialog';
import { Progress } from '@/app/components/ui/progress';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Badge } from '@/app/components/ui/badge';
import { Plus, Calendar, Clock, CheckCircle, Edit, Trash2, BookOpen } from 'lucide-react';

/**
 * EXAMS MODULE
 * Manages exam schedules and preparation tracking
 */

const Exams: React.FC = () => {
  const { exams, addExam, updateExam, deleteExam } = useData();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [formData, setFormData] = useState({
    subject: '',
    date: '',
    time: '',
    topics: [] as { name: string; studied: boolean }[],
    newTopic: '',
  });

  const resetForm = () => {
    setFormData({
      subject: '',
      date: '',
      time: '',
      topics: [],
      newTopic: '',
    });
    setEditingExam(null);
  };

  const handleAddTopic = () => {
    if (formData.newTopic.trim()) {
      setFormData(prev => ({
        ...prev,
        topics: [...prev.topics, { name: prev.newTopic, studied: false }],
        newTopic: '',
      }));
    }
  };

  const handleRemoveTopic = (index: number) => {
    setFormData(prev => ({
      ...prev,
      topics: prev.topics.filter((_, i) => i !== index),
    }));
  };

  const handleAddExam = () => {
    if (!formData.subject || !formData.date || !formData.time) {
      alert('Please fill in all required fields');
      return;
    }

    const topics: ExamTopic[] = formData.topics.map((t, idx) => ({
      id: Date.now().toString() + idx,
      name: t.name,
      studied: t.studied,
    }));

    addExam({
      subject: formData.subject,
      date: new Date(formData.date),
      time: formData.time,
      topics: topics,
    });

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEditExam = (exam: Exam) => {
    setEditingExam(exam);
    setFormData({
      subject: exam.subject,
      date: exam.date.toISOString().split('T')[0],
      time: exam.time,
      topics: exam.topics.map(t => ({ name: t.name, studied: t.studied })),
      newTopic: '',
    });
    setIsDialogOpen(true);
  };

  const handleUpdateExam = () => {
    if (!editingExam || !formData.subject || !formData.date || !formData.time) {
      alert('Please fill in all required fields');
      return;
    }

    const topics: ExamTopic[] = formData.topics.map((t, idx) => ({
      id: Date.now().toString() + idx,
      name: t.name,
      studied: t.studied,
    }));

    updateExam(editingExam.id, {
      subject: formData.subject,
      date: new Date(formData.date),
      time: formData.time,
      topics: topics,
    });

    resetForm();
    setIsDialogOpen(false);
  };

  const handleDeleteExam = (id: string) => {
    if (window.confirm('Delete this exam?')) {
      deleteExam(id);
    }
  };

  const handleToggleTopic = (examId: string, topicId: string) => {
    const exam = exams.find(e => e.id === examId);
    if (!exam) return;

    const updatedTopics = exam.topics.map(t =>
      t.id === topicId ? { ...t, studied: !t.studied } : t
    );

    updateExam(examId, { topics: updatedTopics });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Exams</h1>
          <p className="text-gray-600 mt-1">Exam schedule and preparation tracking</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Exam
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingExam ? 'Edit Exam' : 'Add New Exam'}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Subject *</Label>
                <Input
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="e.g., Operating Systems"
                />
              </div>

              <div className="space-y-2">
                <Label>Date *</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Time *</Label>
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Topics</Label>
                <div className="flex gap-2">
                  <Input
                    value={formData.newTopic}
                    onChange={(e) => setFormData(prev => ({ ...prev, newTopic: e.target.value }))}
                    placeholder="Add a topic"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTopic()}
                  />
                  <Button type="button" onClick={handleAddTopic}>Add</Button>
                </div>
                <div className="space-y-1 mt-2">
                  {formData.topics.map((topic, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{topic.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveTopic(idx)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={editingExam ? handleUpdateExam : handleAddExam}
                  className="flex-1"
                >
                  {editingExam ? 'Update' : 'Add Exam'}
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
        {exams.length > 0 ? (
          exams.map(exam => {
            const studiedTopics = exam.topics.filter(t => t.studied).length;
            const totalTopics = exam.topics.length;
            const progress = totalTopics > 0 ? Math.round((studiedTopics / totalTopics) * 100) : 0;
            const isPast = exam.date < new Date();

            return (
              <Card key={exam.id} className={`hover:shadow-md transition-shadow ${isPast ? 'opacity-60' : ''}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="h-5 w-5 text-orange-600" />
                        <CardTitle className="text-xl">{exam.subject}</CardTitle>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(exam.date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{exam.time}</span>
                        </div>
                        {!isPast && (
                          <Badge className="bg-orange-100 text-orange-800">
                            {getCountdown(exam.date)}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditExam(exam)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteExam(exam.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Preparation Progress</span>
                      <span className="font-semibold">{progress}% ({studiedTopics}/{totalTopics} topics)</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Topics:</h4>
                    {exam.topics.length > 0 ? (
                      <div className="space-y-2">
                        {exam.topics.map(topic => (
                          <div key={topic.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                            <Checkbox
                              checked={topic.studied}
                              onCheckedChange={() => handleToggleTopic(exam.id, topic.id)}
                            />
                            <span className={`flex-1 text-sm ${topic.studied ? 'line-through text-gray-500' : ''}`}>
                              {topic.name}
                            </span>
                            {topic.studied && <CheckCircle className="h-4 w-4 text-green-600" />}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No topics added yet</p>
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
                No exams scheduled. Add one to start tracking!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Exams;
