import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Calendar as CalendarIcon, Check, ArrowLeft, Clock, Plus, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, momentLocalizer, View, SlotInfo } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

// Event interface
interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource?: any;
}

// Initial events data - using current week dates
const getInitialEvents = (): CalendarEvent[] => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  return [
    {
      id: '1',
      title: 'Available: Morning Shift',
      start: new Date(today.getTime() + 8 * 60 * 60 * 1000), // 8 AM today
      end: new Date(today.getTime() + 12 * 60 * 60 * 1000), // 12 PM today
    },
    {
      id: '2',
      title: 'Available: Afternoon',
      start: new Date(today.getTime() + 13 * 60 * 60 * 1000), // 1 PM today
      end: new Date(today.getTime() + 17 * 60 * 60 * 1000), // 5 PM today
    },
    {
      id: '3',
      title: 'Available: Evening',
      start: new Date(today.getTime() + 24 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000), // 6 PM tomorrow
      end: new Date(today.getTime() + 24 * 60 * 60 * 1000 + 22 * 60 * 60 * 1000), // 10 PM tomorrow
    },
    {
      id: '4',
      title: 'Available: Full Day',
      start: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000), // 8 AM in 2 days
      end: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000 + 20 * 60 * 60 * 1000), // 8 PM in 2 days
    },
  ];
};

export function Schedule() {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Removed role-based protection - all logged-in users can access

  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Available: Morning Shift',
      start: new Date(),
      end: new Date(),
    },
  ]);

  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
  const [eventTitle, setEventTitle] = useState('');
  const [view, setView] = useState<View>('week');
  const [saved, setSaved] = useState(false);
  
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSelectSlot = useCallback((slotInfo: SlotInfo) => {
    setSelectedSlot({ start: slotInfo.start as Date, end: slotInfo.end as Date });
    setShowEventForm(true);
    setEventTitle('Available: ');
  }, []);

  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    if (window.confirm(`Delete "${event.title}"?`)) {
      setEvents((prev) => prev.filter((e) => e.id !== event.id));
    }
  }, []);

  const handleAddEvent = () => {
    if (!eventTitle.trim() || !selectedSlot) {
      alert('Please enter a title');
      return;
    }

    const newEvent: CalendarEvent = {
      id: `event-${Date.now()}`,
      title: eventTitle,
      start: selectedSlot.start,
      end: selectedSlot.end,
    };

    setEvents((prev) => [...prev, newEvent]);
    
    // Reset form
    setEventTitle('');
    setSelectedSlot(null);
    setShowEventForm(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      navigate('/profile/candidate');
    }, 2000);
  };

  const eventStyleGetter = () => {
    return {
      style: {
        backgroundColor: '#FF9800',
        borderRadius: '8px',
        opacity: 0.9,
        color: 'white',
        border: '0px',
        display: 'flex',
        alignItems: 'center',
        fontWeight: '500',
        padding: '2px 6px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      },
    };
  };

  if (saved) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-8 text-center border-2 border-[#4ADE80]/30 shadow-xl">
          <div className="w-20 h-20 bg-[#4ADE80]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-[#4ADE80]" />
          </div>
          <h2 className="text-[#263238] mb-2 text-2xl">Schedule Saved!</h2>
          <p className="text-[#263238]/70 mb-6">
            Your availability has been updated successfully.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#263238]/70 hover:text-[#FF9800] mb-6 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-[#FF9800] to-[#F57C00] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#FF9800]/30">
                <CalendarIcon className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-[#263238] mb-2 text-3xl">Manage Your Schedule</h1>
                <p className="text-[#263238]/70">
                  Set your availability to let employers know when you're free to work
                </p>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card className="p-4 border-2 border-[#FF9800]/20 bg-gradient-to-br from-[#FF9800]/5 to-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FF9800]/20 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[#FF9800]" />
                </div>
                <div>
                  <p className="text-2xl text-[#FF9800] font-bold">{events.length}</p>
                  <p className="text-xs text-[#263238]/60">Availability Slots</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 border-2 border-[#4FC3F7]/20 bg-gradient-to-br from-[#4FC3F7]/5 to-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#4FC3F7]/20 rounded-xl flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5 text-[#4FC3F7]" />
                </div>
                <div>
                  <p className="text-2xl text-[#4FC3F7] font-bold capitalize">{view}</p>
                  <p className="text-xs text-[#263238]/60">Current View</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Event Form */}
          {showEventForm && selectedSlot && (
            <Card className="p-6 mb-6 border-2 border-[#FF9800]/20 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#263238] flex items-center gap-2">
                  <Plus className="w-5 h-5 text-[#FF9800]" />
                  Add Availability Slot
                </h3>
                <button
                  onClick={() => setShowEventForm(false)}
                  className="text-[#263238]/50 hover:text-[#263238] transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[#263238] mb-2">Title</label>
                  <input
                    type="text"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder="e.g., Available: Morning Shift"
                    className="w-full h-12 px-4 border-2 border-[#263238]/20 rounded-xl focus:border-[#FF9800] focus:outline-none"
                    autoFocus
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[#263238] mb-2">Start Time</label>
                    <div className="h-12 px-4 border-2 border-[#263238]/20 rounded-xl bg-[#263238]/5 flex items-center text-[#263238]/70">
                      {moment(selectedSlot.start).format('MMM DD, YYYY h:mm A')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-[#263238] mb-2">End Time</label>
                    <div className="h-12 px-4 border-2 border-[#263238]/20 rounded-xl bg-[#263238]/5 flex items-center text-[#263238]/70">
                      {moment(selectedSlot.end).format('MMM DD, YYYY h:mm A')}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button
                    onClick={handleAddEvent}
                    className="flex-1 bg-[#4ADE80] hover:bg-[#22C55E] text-white rounded-xl"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Add Slot
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowEventForm(false)}
                    className="flex-1 border-2 border-[#263238]/20 hover:border-[#263238] rounded-xl"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Calendar */}
          <Card className="p-6 mb-6 border-2 border-[#263238]/10 shadow-xl">
            <div className="workhub-calendar">
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 600 }}
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                selectable
                eventPropGetter={eventStyleGetter}
                view={view}
                onView={setView}
                views={['month', 'week', 'day']}
                defaultView="week"
                step={60}
                showMultiDayTimes
                messages={{
                  next: 'Next',
                  previous: 'Previous',
                  today: 'Today',
                  month: 'Month',
                  week: 'Week',
                  day: 'Day',
                }}
              />
            </div>
          </Card>

          {/* How to Use Guide */}
          <Card className="p-6 mb-6 bg-gradient-to-br from-[#4FC3F7]/5 to-white border-2 border-[#4FC3F7]/20">
            <h3 className="text-[#263238] mb-4 flex items-center gap-2">
              <div className="w-6 h-1 bg-[#4FC3F7] rounded"></div>
              How to Use
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl border-2 border-[#FF9800] bg-gradient-to-br from-[#FF9800] to-[#F57C00] flex items-center justify-center flex-shrink-0">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-[#263238] font-medium mb-1">Add Availability</p>
                  <p className="text-[#263238]/60">Click and drag on empty calendar space to create a new availability slot</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl border-2 border-[#263238]/20 bg-white flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-[#263238]" />
                </div>
                <div>
                  <p className="text-[#263238] font-medium mb-1">Delete Events</p>
                  <p className="text-[#263238]/60">Click on any slot and confirm to remove it from your schedule</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleSave}
              className="flex-1 bg-[#FF9800] hover:bg-[#F57C00] text-white h-12 rounded-xl shadow-lg shadow-[#FF9800]/30"
            >
              <Check className="w-5 h-5 mr-2" />
              Save Schedule
            </Button>
            <Button
              variant="outline"
              className="flex-1 h-12 border-2 border-[#263238]/20 hover:border-[#263238] rounded-xl"
              onClick={() => navigate('/profile/candidate')}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>

      {/* Custom Styles for React Big Calendar */}
      <style>{`
        .workhub-calendar .rbc-calendar {
          border-radius: 12px;
        }
        
        .workhub-calendar .rbc-header {
          padding: 12px 8px;
          font-weight: 600;
          color: #263238;
          border-bottom: 2px solid rgba(38, 50, 56, 0.1);
          background: linear-gradient(to bottom, #FAFAFA, #FFFFFF);
        }
        
        .workhub-calendar .rbc-today {
          background-color: rgba(255, 152, 0, 0.05);
        }
        
        .workhub-calendar .rbc-toolbar {
          padding: 16px;
          border-radius: 12px 12px 0 0;
          background: linear-gradient(to right, rgba(255, 152, 0, 0.05), rgba(79, 195, 247, 0.05));
          margin-bottom: 0;
        }
        
        .workhub-calendar .rbc-toolbar button {
          color: #263238;
          border: 2px solid rgba(38, 50, 56, 0.2);
          border-radius: 8px;
          padding: 8px 16px;
          font-weight: 500;
          transition: all 0.2s;
        }
        
        .workhub-calendar .rbc-toolbar button:hover {
          background-color: #FF9800;
          color: white;
          border-color: #FF9800;
        }
        
        .workhub-calendar .rbc-toolbar button.rbc-active {
          background-color: #FF9800;
          color: white;
          border-color: #FF9800;
        }
        
        .workhub-calendar .rbc-event {
          background-color: #FF9800;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .workhub-calendar .rbc-event:hover {
          background-color: #F57C00;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);
        }
        
        .workhub-calendar .rbc-event.rbc-selected {
          background-color: #F57C00;
        }
        
        .workhub-calendar .rbc-event-label {
          font-size: 11px;
        }
        
        .workhub-calendar .rbc-event-content {
          font-weight: 500;
        }
        
        .workhub-calendar .rbc-time-slot {
          border-top: 1px solid rgba(38, 50, 56, 0.05);
        }
        
        .workhub-calendar .rbc-time-header-content {
          border-left: 2px solid rgba(38, 50, 56, 0.1);
        }
        
        .workhub-calendar .rbc-timeslot-group {
          border-left: 2px solid rgba(38, 50, 56, 0.1);
        }
        
        .workhub-calendar .rbc-current-time-indicator {
          background-color: #FF9800;
          height: 2px;
        }
        
        .workhub-calendar .rbc-day-slot .rbc-time-slot {
          border-top: 1px solid rgba(38, 50, 56, 0.05);
        }
        
        .workhub-calendar .rbc-time-content {
          border-top: 2px solid rgba(38, 50, 56, 0.1);
        }
        
        .workhub-calendar .rbc-allday-cell {
          background: rgba(79, 195, 247, 0.05);
        }
        
        .workhub-calendar .rbc-selected-cell {
          background-color: rgba(255, 152, 0, 0.15);
        }
        
        .workhub-calendar .rbc-off-range-bg {
          background-color: rgba(38, 50, 56, 0.02);
        }
      `}</style>
    </div>
  );
}