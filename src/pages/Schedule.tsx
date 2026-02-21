import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Calendar as CalendarIcon,
  Check,
  ArrowLeft,
  Clock,
  Plus,
  X,
  Edit2,
  Trash2,
  Loader2,
} from "lucide-react";
import {
  Calendar,
  momentLocalizer,
  View,
  SlotInfo,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { toast } from "sonner";
import {
  ScheduleViewDTO,
  CreateScheduleDTO,
  UpdateScheduleDTO,
} from "../types/DTOs/ModelDTOs/ScheduleDTOs";

const API_URL = import.meta.env.VITE_API_URL;
const localizer = momentLocalizer(moment);

// Event interface
interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource?: any;
}

export function Schedule() {
  const navigate = useNavigate();

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    start: Date;
    end: Date;
  } | null>(null);
  const [eventTitle, setEventTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [view, setView] = useState<View>("week");
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [showEventActions, setShowEventActions] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ------ API: Fetch schedules ------
  const fetchSchedules = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_URL}/api/Schedule`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) {
          const mapped: CalendarEvent[] = (result.data as ScheduleViewDTO[]).map(
            (s) => {
              const start = new Date(s.startTime);
              let end = new Date(s.endTime);
              // Ensure minimum 30-minute visual duration
              if (end.getTime() - start.getTime() < 30 * 60 * 1000) {
                end = new Date(start.getTime() + 30 * 60 * 1000);
              }
              return {
                id: s.id.toString(),
                title: s.title,
                start,
                end,
              };
            }
          );
          setEvents(mapped);
        }
      } else {
        toast.error("Failed to load schedules");
      }
    } catch (err) {
      console.error("Failed to fetch schedules", err);
      toast.error("An error occurred while loading schedules");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  // ------ Calendar handlers ------
  const handleSelectSlot = useCallback((slotInfo: SlotInfo) => {
    const start = slotInfo.start as Date;
    let end = slotInfo.end as Date;

    // Ensure minimum 30-minute duration
    const diffMs = end.getTime() - start.getTime();
    if (diffMs < 30 * 60 * 1000) {
      end = new Date(start.getTime() + 30 * 60 * 1000);
    }

    setSelectedSlot({ start, end });
    setStartTime(moment(start).format("YYYY-MM-DDTHH:mm"));
    setEndTime(moment(end).format("YYYY-MM-DDTHH:mm"));
    setShowEventForm(true);
    setEventTitle("Available: ");
    setEditingEventId(null);
  }, []);

  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventActions(true);
  }, []);

  // ------ API: Create or Update ------
  const handleAddEvent = async () => {
    if (!eventTitle.trim() || !startTime || !endTime) {
      toast.error("Please enter all required fields");
      return;
    }

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    if (endDate <= startDate) {
      toast.error("End time must be after start time");
      return;
    }

    setSaving(true);
    const token = localStorage.getItem("access_token");

    try {
      if (editingEventId) {
        // --- UPDATE ---
        const updateDTO: UpdateScheduleDTO = {
          id: parseInt(editingEventId),
          title: eventTitle,
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
        };

        const res = await fetch(`${API_URL}/api/Schedule`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateDTO),
        });

        if (res.ok) {
          toast.success("Schedule updated successfully!");
          // Update local state
          setEvents((prev) =>
            prev.map((event) =>
              event.id === editingEventId
                ? { ...event, title: eventTitle, start: startDate, end: endDate }
                : event
            )
          );
        } else {
          const errText = await res.text();
          console.error("Update failed", errText);
          toast.error("Failed to update schedule");
        }
        setEditingEventId(null);
      } else {
        // --- CREATE ---
        const createDTO: CreateScheduleDTO = {
          title: eventTitle,
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
        };

        const res = await fetch(`${API_URL}/api/Schedule`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(createDTO),
        });

        if (res.ok) {
          const result = await res.json();
          if (result.success && result.data) {
            const newEvent: CalendarEvent = {
              id: result.data.id.toString(),
              title: result.data.title,
              start: new Date(result.data.startTime),
              end: new Date(result.data.endTime),
            };
            setEvents((prev) => [...prev, newEvent]);
            toast.success("Schedule created successfully!");
          }
        } else {
          const errText = await res.text();
          console.error("Create failed", errText);
          toast.error("Failed to create schedule");
        }
      }
    } catch (err) {
      console.error("Error saving schedule", err);
      toast.error("An error occurred while saving");
    } finally {
      setSaving(false);
      // Reset form
      setEventTitle("");
      setStartTime("");
      setEndTime("");
      setSelectedSlot(null);
      setShowEventForm(false);
    }
  };

  const handleEditEvent = () => {
    if (!selectedEvent) return;

    setEditingEventId(selectedEvent.id);
    setEventTitle(selectedEvent.title);
    setStartTime(moment(selectedEvent.start).format("YYYY-MM-DDTHH:mm"));
    setEndTime(moment(selectedEvent.end).format("YYYY-MM-DDTHH:mm"));
    setSelectedSlot({ start: selectedEvent.start, end: selectedEvent.end });
    setShowEventActions(false);
    setShowEventForm(true);
    setSelectedEvent(null);
  };

  // ------ API: Delete ------
  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;

    if (!window.confirm(`Delete "${selectedEvent.title}"?`)) {
      setShowEventActions(false);
      setSelectedEvent(null);
      return;
    }

    const token = localStorage.getItem("access_token");

    try {
      const res = await fetch(
        `${API_URL}/api/Schedule/${selectedEvent.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        setEvents((prev) => prev.filter((e) => e.id !== selectedEvent.id));
        toast.success("Schedule deleted successfully!");
      } else {
        toast.error("Failed to delete schedule");
      }
    } catch (err) {
      console.error("Error deleting schedule", err);
      toast.error("An error occurred while deleting");
    }

    setShowEventActions(false);
    setSelectedEvent(null);
  };

  const eventStyleGetter = () => {
    return {
      style: {
        backgroundColor: "#FF9800",
        borderRadius: "8px",
        opacity: 0.9,
        color: "white",
        border: "0px",
        display: "flex",
        alignItems: "center",
        fontWeight: "500",
        padding: "2px 6px",
        cursor: "pointer",
        transition: "all 0.2s ease",
      },
    };
  };

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
                <h1 className="text-[#263238] mb-2 text-3xl">
                  Manage Your Schedule
                </h1>
                <p className="text-[#263238]/70">
                  Set your availability to let employers know
                  when you're free to work
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
                  <p className="text-2xl text-[#FF9800] font-bold">
                    {events.length}
                  </p>
                  <p className="text-xs text-[#263238]/60">
                    Availability Slots
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 border-2 border-[#4FC3F7]/20 bg-gradient-to-br from-[#4FC3F7]/5 to-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#4FC3F7]/20 rounded-xl flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5 text-[#4FC3F7]" />
                </div>
                <div>
                  <p className="text-2xl text-[#4FC3F7] font-bold capitalize">
                    {view}
                  </p>
                  <p className="text-xs text-[#263238]/60">
                    Current View
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Event Form */}
          {showEventForm && selectedSlot && (
            <Card className="p-6 mb-6 border-2 border-[#FF9800]/20 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#263238] flex items-center gap-2">
                  {editingEventId ? (
                    <>
                      <Edit2 className="w-5 h-5 text-[#4FC3F7]" />
                      Update Availability Slot
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 text-[#FF9800]" />
                      Add Availability Slot
                    </>
                  )}
                </h3>
                <button
                  onClick={() => {
                    setShowEventForm(false);
                    setEditingEventId(null);
                  }}
                  className="text-[#263238]/50 hover:text-[#263238] transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[#263238] mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={eventTitle}
                    onChange={(e) =>
                      setEventTitle(e.target.value)
                    }
                    placeholder="e.g., Available: Morning Shift"
                    className="w-full h-12 px-4 border-2 border-[#263238]/20 rounded-xl focus:border-[#FF9800] focus:outline-none"
                    autoFocus
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[#263238] mb-2">
                      Start Time
                    </label>
                    <input
                      type="datetime-local"
                      value={startTime}
                      onChange={(e) =>
                        setStartTime(e.target.value)
                      }
                      className="w-full h-12 px-4 border-2 border-[#263238]/20 rounded-xl focus:border-[#FF9800] focus:outline-none text-[#263238]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#263238] mb-2">
                      End Time
                    </label>
                    <input
                      type="datetime-local"
                      value={endTime}
                      onChange={(e) =>
                        setEndTime(e.target.value)
                      }
                      className="w-full h-12 px-4 border-2 border-[#263238]/20 rounded-xl focus:border-[#FF9800] focus:outline-none text-[#263238]"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleAddEvent}
                    disabled={saving}
                    className={`flex-1 ${editingEventId
                      ? "bg-[#4FC3F7] hover:bg-[#0398D4]"
                      : "bg-[#4ADE80] hover:bg-[#22C55E]"
                      } text-white rounded-xl`}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        {editingEventId ? "Update Slot" : "Add Slot"}
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowEventForm(false);
                      setEditingEventId(null);
                    }}
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
            {loading ? (
              <div className="flex items-center justify-center h-[600px]">
                <Loader2 className="w-8 h-8 text-[#FF9800] animate-spin" />
                <span className="ml-3 text-[#263238]/60">Loading schedules...</span>
              </div>
            ) : (
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
                  views={["month", "week", "day"]}
                  defaultView="week"
                  step={30}
                  timeslots={2}
                  showMultiDayTimes
                  scrollToTime={new Date(1970, 1, 1, 8, 0, 0)}
                  messages={{
                    next: "Next",
                    previous: "Previous",
                    today: "Today",
                    month: "Month",
                    week: "Week",
                    day: "Day",
                  }}
                />
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Event Actions Modal */}
      {showEventActions && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md p-6 border-2 border-[#FF9800]/30 shadow-2xl">
            <div className="mb-6">
              <h3 className="text-[#263238] text-xl font-semibold mb-2">
                {selectedEvent.title}
              </h3>
              <div className="text-sm text-[#263238]/60 space-y-1">
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {moment(selectedEvent.start).format("MMM D, YYYY h:mm A")} -{" "}
                  {moment(selectedEvent.end).format("h:mm A")}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleEditEvent}
                className="w-full bg-[#4FC3F7] hover:bg-[#0398D4] text-white h-11 rounded-xl shadow-md"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Event
              </Button>
              <Button
                onClick={handleDeleteEvent}
                className="w-full bg-red-500 hover:bg-red-600 text-white h-11 rounded-xl shadow-md"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Event
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowEventActions(false);
                  setSelectedEvent(null);
                }}
                className="w-full h-11 border-2 border-[#263238]/20 hover:border-[#263238] rounded-xl"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Custom Styles for React Big Calendar */}
      <style>{`
        .workhub-calendar .rbc-calendar {
          border-radius: 12px;
        }

        .workhub-calendar .rbc-time-gutter,
        .workhub-calendar .rbc-time-header-gutter {
          min-width: 85px !important;
          width: 85px !important;
          max-width: 85px !important;
        }

        .workhub-calendar .rbc-label-cell {
          min-width: 85px !important;
        }

        .workhub-calendar .rbc-time-gutter .rbc-timeslot-group {
          min-width: 85px !important;
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
          min-height: 20px !important;
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