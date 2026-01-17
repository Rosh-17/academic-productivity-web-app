import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Subject } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Progress } from '@/app/components/ui/progress';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Plus, BookOpen, FileText, Edit, Trash2 } from 'lucide-react';

const Subjects: React.FC = () => {
  const { subjects, addSubject, updateSubject, deleteSubject } = useData();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    topics: [] as { name: string; studied: boolean }[],
    newTopic: '',
  });

  const resetForm = () => {
    setFormData({ name: '', code: '', topics: [], newTopic: '' });
    setEditingSubject(null);
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

  const handleAddSubject = () => {
    if (!formData.name || !formData.code) {
      alert('Please fill in required fields');
      return;
    }

    addSubject({
      name: formData.name,
      code: formData.code,
      topics: formData.topics.map((t, idx) => ({
        id: Date.now().toString() + idx,
        name: t.name,
        studied: t.studied,
      })),
      notes: [],
    });

    resetForm();
    setIsDialogOpen(false);
  };

  const handleToggleTopic = (subjectId: string, topicId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    if (!subject) return;

    const updatedTopics = subject.topics.map(t =>
      t.id === topicId ? { ...t, studied: !t.studied } : t
    );

    updateSubject(subjectId, { topics: updatedTopics });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subjects</h1>
          <p className="text-gray-600 mt-1">Track topics and study materials</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Subject
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Subject</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Subject Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Data Structures"
                />
              </div>

              <div className="space-y-2">
                <Label>Subject Code *</Label>
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                  placeholder="e.g., CS201"
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
                        onClick={() => setFormData(prev => ({ ...prev, topics: prev.topics.filter((_, i) => i !== idx) }))}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleAddSubject} className="flex-1">
                  Add Subject
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subjects.length > 0 ? (
          subjects.map(subject => {
            const studiedTopics = subject.topics.filter(t => t.studied).length;
            const totalTopics = subject.topics.length;
            const progress = totalTopics > 0 ? Math.round((studiedTopics / totalTopics) * 100) : 0;

            return (
              <Card key={subject.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <BookOpen className="h-5 w-5 text-teal-600" />
                        <CardTitle>{subject.name}</CardTitle>
                      </div>
                      <p className="text-sm text-gray-600">{subject.code}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (window.confirm('Delete this subject?')) deleteSubject(subject.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold">{progress}% ({studiedTopics}/{totalTopics})</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    {subject.topics.length > 0 ? (
                      <div className="space-y-1">
                        {subject.topics.map(topic => (
                          <div key={topic.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                            <Checkbox
                              checked={topic.studied}
                              onCheckedChange={() => handleToggleTopic(subject.id, topic.id)}
                            />
                            <span className={`text-sm ${topic.studied ? 'line-through text-gray-500' : ''}`}>
                              {topic.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No topics added</p>
                    )}
                  </div>

                  {subject.notes.length > 0 && (
                    <div className="space-y-1 pt-2 border-t">
                      <h4 className="text-sm font-medium flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        Notes ({subject.notes.length})
                      </h4>
                      {subject.notes.map(note => (
                        <div key={note.id} className="text-xs text-gray-600 pl-5">
                          📄 {note.title}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card className="col-span-full">
            <CardContent className="pt-6">
              <p className="text-center text-gray-500 py-8">
                No subjects yet. Add one to start tracking!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Subjects;
