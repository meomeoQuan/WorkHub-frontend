import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Link } from 'react-router';
import { Plus, Trash2, Upload, Briefcase, Calendar, FileText, Settings, X } from 'lucide-react';
import { toast } from 'sonner';

// Experience Section
export function ExperienceSection({
  experience,
  editedExperience,
  isEditing,
  setEditedExperience
}: any) {
  return (
    (experience.length > 0 || isEditing) && (
      <Card className="p-6 border-[#263238]/10 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#4FC3F7]" />
            <h2 className="text-[#263238]">Experience</h2>
          </div>
          {isEditing && (
            <Button
              onClick={() => {
                const newExp = {
                  id: Date.now().toString(),
                  company: '',
                  position: '',
                  startDate: '',
                  endDate: '',
                  description: ''
                };
                setEditedExperience([...editedExperience, newExp]);
              }}
              size="sm"
              className="bg-[#4FC3F7] hover:bg-[#0288D1] text-white rounded-lg"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Experience
            </Button>
          )}
        </div>
        <div className="space-y-4">
          {isEditing ? (
            editedExperience.length > 0 ? (
              editedExperience.map((exp: any, index: number) => (
                <div key={exp.id} className="p-4 border border-[#263238]/10 rounded-lg space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-[#263238] font-semibold">Experience #{index + 1}</Label>
                    <Button
                      onClick={() => {
                        setEditedExperience(editedExperience.filter((_: any, i: number) => i !== index));
                      }}
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-[#263238] text-sm">Position/Title</Label>
                      <Input
                        value={exp.position}
                        onChange={(e) => {
                          const updated = [...editedExperience];
                          updated[index].position = e.target.value;
                          setEditedExperience(updated);
                        }}
                        className="h-9 border-[#263238]/20 rounded-lg mt-1"
                        placeholder="e.g., Software Developer"
                      />
                    </div>
                    <div>
                      <Label className="text-[#263238] text-sm">Company</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) => {
                          const updated = [...editedExperience];
                          updated[index].company = e.target.value;
                          setEditedExperience(updated);
                        }}
                        className="h-9 border-[#263238]/20 rounded-lg mt-1"
                        placeholder="e.g., Tech Solutions Inc."
                      />
                    </div>
                    <div>
                      <Label className="text-[#263238] text-sm">Start Date</Label>
                      <Input
                        value={exp.startDate}
                        onChange={(e) => {
                          const updated = [...editedExperience];
                          updated[index].startDate = e.target.value;
                          setEditedExperience(updated);
                        }}
                        className="h-9 border-[#263238]/20 rounded-lg mt-1"
                        placeholder="Jan 2020"
                      />
                    </div>
                    <div>
                      <Label className="text-[#263238] text-sm">End Date</Label>
                      <Input
                        value={exp.endDate}
                        onChange={(e) => {
                          const updated = [...editedExperience];
                          updated[index].endDate = e.target.value;
                          setEditedExperience(updated);
                        }}
                        className="h-9 border-[#263238]/20 rounded-lg mt-1"
                        placeholder="Present"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-[#263238] text-sm">Description (Optional)</Label>
                    <Textarea
                      value={exp.description}
                      onChange={(e) => {
                        const updated = [...editedExperience];
                        updated[index].description = e.target.value;
                        setEditedExperience(updated);
                      }}
                      className="border-[#263238]/20 rounded-lg mt-1 min-h-[80px]"
                      placeholder="Describe your responsibilities and achievements..."
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[#263238]/50 text-sm text-center py-4">No experience added yet. Click "Add Experience" to add one.</p>
            )
          ) : (
            experience.map((exp: any) => (
              <div key={exp.id} className="pb-4 border-b border-[#263238]/10 last:border-0 last:pb-0">
                <h3 className="font-semibold text-[#263238]">{exp.position}</h3>
                <p className="text-[#263238]/80">{exp.company}</p>
                <p className="text-sm text-[#263238]/60">{exp.startDate} - {exp.endDate}</p>
                {exp.description && (
                  <p className="text-sm text-[#263238]/70 mt-2 break-all [overflow-wrap:anywhere]">{exp.description}</p>
                )}
              </div>
            ))
          )}
        </div>
      </Card>
    )
  );
}

// Weekly Availability Section
export function WeeklyAvailabilitySection({ weeklyAvailability, isEditing }: any) {
  // Get the current week's dates
  const getCurrentWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const monday = new Date(today);
    monday.setDate(today.getDate() - currentDay + (currentDay === 0 ? -6 : 1)); // Get Monday of current week

    const dates: { [key: string]: string } = {};
    const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    dayNames.forEach((dayName, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      dates[dayName] = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    });

    return dates;
  };

  const weekDates = getCurrentWeekDates();

  return (
    (Object.values(weeklyAvailability).some((day: any) => day.available) || isEditing) && (
      <Card className="p-6 border-[#263238]/10 shadow-md overflow-hidden min-w-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#4ADE80]" />
            <h2 className="text-[#263238]">Weekly Availability</h2>
          </div>
          {isEditing && (
            <Link to="/schedule">
              <Button
                size="sm"
                className="bg-[#4ADE80] hover:bg-[#22C55E] text-white rounded-lg"
              >
                <Calendar className="w-4 h-4 mr-1" />
                Edit Schedule
              </Button>
            </Link>
          )}
        </div>
        <div className="space-y-2">
          {Object.entries(weeklyAvailability).map(([day, info]: [string, any]) =>
            info.available && (
              <div key={day} className="flex items-center justify-between py-3 px-4 bg-[#FAFAFA] rounded-lg border border-[#263238]/5">
                <div className="flex flex-col">
                  <span className="font-medium text-[#263238] capitalize">{day}</span>
                  <span className="text-xs text-[#263238]/50 mt-0.5">{weekDates[day]}</span>
                </div>
                <span className="text-sm text-[#263238]/70 font-medium">{info.hours}</span>
              </div>
            )
          )}
        </div>
        {isEditing && !Object.values(weeklyAvailability).some((day: any) => day.available) && (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-[#263238]/20 mx-auto mb-3" />
            <p className="text-[#263238]/50 text-sm mb-3">No availability set yet</p>
            <Link to="/schedule">
              <Button
                size="sm"
                className="bg-[#4ADE80] hover:bg-[#22C55E] text-white rounded-lg"
              >
                Set Your Schedule
              </Button>
            </Link>
          </div>
        )}
      </Card>
    )
  );
}

// Resume Section  
export function ResumeSection({ resume, isEditing, setResume }: any) {
  const handleFileUpload = () => {
    // Simulate file upload
    toast.success('Resume uploaded successfully!');
    setResume({
      fileName: 'Updated_Resume.pdf',
      fileUrl: '#',
      uploadedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    });
  };

  const handleRemoveResume = () => {
    setResume({
      fileName: '',
      fileUrl: '',
      uploadedDate: ''
    });
    toast.success('Resume removed');
  };

  return (
    (resume?.fileName || isEditing) && (
      <Card className="p-6 border-[#263238]/10 shadow-md overflow-hidden min-w-0">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-[#FF9800]" />
          <h2 className="text-[#263238]">Resume</h2>
        </div>
        {resume?.fileName ? (
          <div className="flex items-center justify-between p-4 bg-[#FAFAFA] rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FF9800]/20 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#FF9800]" />
              </div>
              <div>
                <p className="font-medium text-[#263238]">{resume.fileName}</p>
                <p className="text-xs text-[#263238]/60">Uploaded {resume.uploadedDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#FF9800] text-[#FF9800] hover:bg-[#FF9800] hover:text-white rounded-xl"
                >
                  Download
                </Button>
              )}
              {isEditing && (
                <>
                  <Button
                    onClick={handleFileUpload}
                    variant="outline"
                    size="sm"
                    className="border-[#4FC3F7] text-[#4FC3F7] hover:bg-[#4FC3F7] hover:text-white rounded-xl"
                  >
                    <Upload className="w-4 h-4 mr-1" />
                    Replace
                  </Button>
                  <Button
                    onClick={handleRemoveResume}
                    variant="outline"
                    size="sm"
                    className="border-red-500 text-red-600 hover:bg-red-50 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Remove
                  </Button>
                </>
              )}
            </div>
          </div>
        ) : (
          isEditing && (
            <div className="text-center py-8 border-2 border-dashed border-[#263238]/20 rounded-lg">
              <FileText className="w-12 h-12 text-[#263238]/20 mx-auto mb-3" />
              <p className="text-[#263238]/50 text-sm mb-3">No resume uploaded yet</p>
              <Button
                onClick={handleFileUpload}
                className="bg-[#FF9800] hover:bg-[#F57C00] text-white rounded-lg"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Resume
              </Button>
            </div>
          )
        )}
      </Card>
    )
  );
}

// Job Preferences Section
export function JobPreferencesSection({ jobPreferences, editedJobPreferences, isEditing, setEditedJobPreferences }: any) {
  const availableJobTypes = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Seasonal', 'Temporary'];

  const toggleJobType = (type: string) => {
    const updated = { ...editedJobPreferences };
    if (updated.jobTypes.includes(type)) {
      updated.jobTypes = updated.jobTypes.filter((t: string) => t !== type);
    } else {
      updated.jobTypes = [...updated.jobTypes, type];
    }
    setEditedJobPreferences(updated);
  };

  const addLocation = (location: string) => {
    if (location && !editedJobPreferences.preferredLocations.includes(location)) {
      setEditedJobPreferences({
        ...editedJobPreferences,
        preferredLocations: [...editedJobPreferences.preferredLocations, location]
      });
    }
  };

  const removeLocation = (index: number) => {
    setEditedJobPreferences({
      ...editedJobPreferences,
      preferredLocations: editedJobPreferences.preferredLocations.filter((_: string, i: number) => i !== index)
    });
  };

  return (
    (jobPreferences.jobTypes.length > 0 || isEditing) && (
      <Card className="p-6 border-[#263238]/10 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5 text-[#4FC3F7]" />
          <h2 className="text-[#263238]">Job Preferences</h2>
        </div>
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <Label className="text-[#263238] text-sm mb-2 block">Job Types</Label>
              <div className="flex flex-wrap gap-2">
                {availableJobTypes.map((type) => (
                  <Badge
                    key={type}
                    onClick={() => toggleJobType(type)}
                    className={`cursor-pointer rounded-xl transition ${editedJobPreferences.jobTypes.includes(type)
                      ? 'bg-[#4FC3F7] text-white border-[#4FC3F7] hover:bg-[#0288D1]'
                      : 'bg-[#FAFAFA] text-[#263238]/70 border-[#263238]/20 hover:bg-[#263238]/5'
                      }`}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
            <Separator className="bg-[#263238]/10" />
            <div>
              <Label className="text-[#263238] text-sm">Expected Salary</Label>
              <Input
                value={editedJobPreferences.expectedSalary}
                onChange={(e) => setEditedJobPreferences({ ...editedJobPreferences, expectedSalary: e.target.value })}
                className="h-9 border-[#263238]/20 rounded-lg mt-1"
                placeholder="e.g., $40-60/hr"
              />
            </div>
            <Separator className="bg-[#263238]/10" />
            <div>
              <Label className="text-[#263238] text-sm mb-2 block">Preferred Locations</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {editedJobPreferences.preferredLocations.map((location: string, index: number) => (
                  <Badge
                    key={index}
                    className="bg-[#4ADE80]/20 text-[#4ADE80] border-[#4ADE80]/30 rounded-xl cursor-pointer hover:bg-red-100 hover:text-red-600 hover:border-red-300 transition"
                    onClick={() => removeLocation(index)}
                  >
                    {location} ×
                  </Badge>
                ))}
              </div>
              <Input
                placeholder="Add location and press Enter"
                className="h-9 border-[#263238]/20 rounded-lg"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const input = e.currentTarget;
                    addLocation(input.value);
                    input.value = '';
                  }
                }}
              />
            </div>
            <Separator className="bg-[#263238]/10" />
            <div>
              <Label className="text-[#263238] text-sm mb-2 block">Willing to Relocate</Label>
              <div className="flex gap-2">
                <Badge
                  onClick={() => setEditedJobPreferences({ ...editedJobPreferences, willingToRelocate: true })}
                  className={`cursor-pointer rounded-xl ${editedJobPreferences.willingToRelocate
                    ? 'bg-[#4ADE80] text-white border-[#4ADE80]'
                    : 'bg-[#FAFAFA] text-[#263238]/70 border-[#263238]/20'
                    }`}
                >
                  Yes
                </Badge>
                <Badge
                  onClick={() => setEditedJobPreferences({ ...editedJobPreferences, willingToRelocate: false })}
                  className={`cursor-pointer rounded-xl ${!editedJobPreferences.willingToRelocate
                    ? 'bg-[#263238] text-white border-[#263238]'
                    : 'bg-[#FAFAFA] text-[#263238]/70 border-[#263238]/20'
                    }`}
                >
                  No
                </Badge>
              </div>
            </div>
            <Separator className="bg-[#263238]/10" />
            <div>
              <Label className="text-[#263238] text-sm">Start Date</Label>
              <Input
                value={editedJobPreferences.startDate}
                onChange={(e) => setEditedJobPreferences({ ...editedJobPreferences, startDate: e.target.value })}
                className="h-9 border-[#263238]/20 rounded-lg mt-1"
                placeholder="e.g., Immediately or 2 weeks"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-[#263238]/70 mb-2">Job Types</p>
              <div className="flex flex-wrap gap-2">
                {jobPreferences.jobTypes.map((type: string, index: number) => (
                  <Badge key={index} className="bg-[#4FC3F7]/20 text-[#4FC3F7] border-[#4FC3F7]/30 rounded-xl">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
            <Separator className="bg-[#263238]/10" />
            <div>
              <p className="text-sm font-medium text-[#263238]/70">Expected Salary</p>
              <p className="text-[#263238]">{jobPreferences.expectedSalary}</p>
            </div>
            <Separator className="bg-[#263238]/10" />
            <div>
              <p className="text-sm font-medium text-[#263238]/70 mb-2">Preferred Locations</p>
              <div className="flex flex-wrap gap-2">
                {jobPreferences.preferredLocations.map((location: string, index: number) => (
                  <Badge key={index} className="bg-[#4ADE80]/20 text-[#4ADE80] border-[#4ADE80]/30 rounded-xl">
                    {location}
                  </Badge>
                ))}
              </div>
            </div>
            <Separator className="bg-[#263238]/10" />
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[#263238]/70">Willing to Relocate</p>
              <Badge className={`${jobPreferences.willingToRelocate ? 'bg-[#4ADE80]/20 text-[#4ADE80] border-[#4ADE80]/30' : 'bg-[#263238]/20 text-[#263238]/70 border-[#263238]/30'} rounded-xl`}>
                {jobPreferences.willingToRelocate ? 'Yes' : 'No'}
              </Badge>
            </div>
            <Separator className="bg-[#263238]/10" />
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[#263238]/70">Start Date</p>
              <p className="text-[#263238]">{jobPreferences.startDate}</p>
            </div>
          </div>
        )}
      </Card>
    )
  );
}