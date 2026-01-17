import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Hackathon } from '@/types';
import { formatDate, getCountdown } from '@/utils/taskUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Progress } from '@/app/components/ui/progress';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Badge } from '@/app/components/ui/badge';
import { Plus, Code, Calendar, Clock, Edit, Trash2 } from 'lucide-react';

const Hackathons: React.FC = () => {
  const { hackathons, addHackathon, updateHackathon, deleteHackathon } = useData();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHackathon, setEditingHackathon] = useState<Hackathon | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    schedule: '',
    checklist: [] as { label: string; completed: boolean }[],
    newItem: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      startDate: '',
      endDate: '',
      schedule: '',
      checklist: [
        { label: 'Team Formation', completed: false },
        { label: 'Idea Finalization', completed: false },
        { label: 'Prototype Development', completed: false },
        { label: 'Presentation Ready', completed: false },
      ],
      newItem: '',
    });
    setEditingHackathon(null);
  };

  const handleAddHackathon = () => {
    if (!formData.name || !formData.startDate || !formData.endDate) {
      alert('Please fill in required fields');
      return;
    }

    addHackathon({
      name: formData.name,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      schedule: formData.schedule || undefined,
      checklist: formData.checklist.map((item, idx) => ({
        id: Date.now().toString() + idx,
        label: item.label,
        completed: item.completed,
      })),
    });

    resetForm();
    setIsDialogOpen(false);
  };

  const handleToggleChecklistItem = (hackathonId: string, itemId: string) => {
    const hackathon = hackathons.find(h => h.id === hackathonId);
    if (!hackathon) return;

    const updatedChecklist = hackathon.checklist.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );

    updateHackathon(hackathonId, { checklist: updatedChecklist });
  };

  const handleAddItem = () => {
    if (formData.newItem.trim()) {
      setFormData(prev => ({
        ...prev,
        checklist: [...prev.checklist, { label: prev.newItem, completed: false }],
        newItem: '',
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hackathons</h1>
          <p className="text-gray-600 mt-1">Track hackathons and competition readiness</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Hackathon
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Hackathon</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Hackathon Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Smart Campus Hackathon"
                />
              </div>

              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>End Date *</Label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Schedule (Optional)</Label>
                <Input
                  value={formData.schedule}
                  onChange={(e) => setFormData(prev => ({ ...prev, schedule: e.target.value }))}
                  placeholder="e.g., 9:00 AM - 6:00 PM"
                />
              </div>

              <div className="space-y-2">
                <Label>Preparation Checklist</Label>
                <div className="flex gap-2">
                  <Input
                    value={formData.newItem}
                    onChange={(e) => setFormData(prev => ({ ...prev, newItem: e.target.value }))}
                    placeholder="Add checklist item"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
                  />
                  <Button type="button" onClick={handleAddItem}>Add</Button>
                </div>
                <div className="space-y-1 mt-2">
                  {formData.checklist.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{item.label}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setFormData(prev => ({ ...prev, checklist: prev.checklist.filter((_, i) => i !== idx) }))}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleAddHackathon} className="flex-1">
                  Add Hackathon
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
        {hackathons.length > 0 ? (
          hackathons.map(hackathon => {
            const completedItems = hackathon.checklist.filter(item => item.completed).length;
            const totalItems = hackathon.checklist.length;
            const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
            const isOngoing = hackathon.startDate <= new Date() && hackathon.endDate >= new Date();
            const isPast = hackathon.endDate < new Date();

            return (
              <Card key={hackathon.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Code className="h-5 w-5 text-purple-600" />
                        <CardTitle className="text-xl">{hackathon.name}</CardTitle>
                        {isOngoing && (
                          <Badge className="bg-green-100 text-green-800">Live</Badge>
                        )}
                        {isPast && (
                          <Badge className="bg-gray-100 text-gray-800">Completed</Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(hackathon.startDate)} - {formatDate(hackathon.endDate)}</span>
                        </div>
                        {hackathon.schedule && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{hackathon.schedule}</span>
                          </div>
                        )}
                        {!isPast && (
                          <Badge className="bg-purple-100 text-purple-800">
                            {getCountdown(hackathon.endDate)}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (window.confirm('Delete this hackathon? This will also remove the associated task.')) {
                          deleteHackathon(hackathon.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Preparation</span>
                      <span className="font-semibold">{progress}% ({completedItems}/{totalItems})</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Checklist:</h4>
                    <div className="space-y-2">
                      {hackathon.checklist.map(item => (
                        <div key={item.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                          <Checkbox
                            checked={item.completed}
                            onCheckedChange={() => handleToggleChecklistItem(hackathon.id, item.id)}
                          />
                          <span className={`flex-1 text-sm ${item.completed ? 'line-through text-gray-500' : ''}`}>
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500 py-8">
                No hackathons yet. Add one to start tracking!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Hackathons;
