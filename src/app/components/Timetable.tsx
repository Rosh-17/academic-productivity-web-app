import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { TimetableEntry, DayOfWeek, ClassType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Badge } from '@/app/components/ui/badge';
import { Plus, Clock, Calendar, Trash2 } from 'lucide-react';

const Timetable: React.FC = () => {
  const { timetable, addTimetableEntry, deleteTimetableEntry } = useData();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    day: 'Monday' as DayOfWeek,
    startTime: '',
    endTime: '',
    type: 'Lecture' as ClassType,
  });

  const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const resetForm = () => {
    setFormData({
      subject: '',
      day: 'Monday',
      startTime: '',
      endTime: '',
      type: 'Lecture',
    });
  };

  const handleAddEntry = () => {
    if (!formData.subject || !formData.startTime || !formData.endTime) {
      alert('Please fill in all fields');
      return;
    }

    addTimetableEntry({
      subject: formData.subject,
      day: formData.day,
      startTime: formData.startTime,
      endTime: formData.endTime,
      type: formData.type,
    });

    resetForm();
    setIsDialogOpen(false);
  };

  const getTypeColor = (type: ClassType) => {
    switch (type) {
      case 'Lecture': return 'bg-blue-100 text-blue-800';
      case 'Lab': return 'bg-purple-100 text-purple-800';
      case 'Tutorial': return 'bg-green-100 text-green-800';
    }
  };

  // Group timetable by day
  const timetableByDay = days.map(day => ({
    day,
    entries: timetable
      .filter(entry => entry.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime)),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Weekly Timetable</h1>
          <p className="text-gray-600 mt-1">Your class schedule for workload planning</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Class
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Class to Timetable</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Subject *</Label>
                <Input
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="e.g., Data Structures"
                />
              </div>

              <div className="space-y-2">
                <Label>Day *</Label>
                <Select
                  value={formData.day}
                  onValueChange={(value: DayOfWeek) => setFormData(prev => ({ ...prev, day: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {days.map(day => (
                      <SelectItem key={day} value={day}>{day}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Time *</Label>
                  <Input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>End Time *</Label>
                  <Input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: ClassType) => setFormData(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lecture">Lecture</SelectItem>
                    <SelectItem value="Lab">Lab</SelectItem>
                    <SelectItem value="Tutorial">Tutorial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleAddEntry} className="flex-1">
                  Add to Timetable
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {timetableByDay.map(({ day, entries }) => (
          <Card key={day}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">{day}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {entries.length > 0 ? (
                <div className="space-y-3">
                  {entries.map(entry => (
                    <div key={entry.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-gray-900">{entry.subject}</h4>
                          <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
                            <Clock className="h-3 w-3" />
                            <span>{entry.startTime} - {entry.endTime}</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => {
                            if (window.confirm('Remove this class?')) deleteTimetableEntry(entry.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3 text-red-600" />
                        </Button>
                      </div>
                      <Badge className={`text-xs ${getTypeColor(entry.type)}`}>
                        {entry.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No classes</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Timetable;
