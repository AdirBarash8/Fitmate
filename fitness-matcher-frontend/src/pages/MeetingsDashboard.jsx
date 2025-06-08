import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "../utils/axiosInstance";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import { format, parseISO, startOfWeek, getDay } from "date-fns";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import enUS from "date-fns/locale/en-US";
import "../styles/MeetingsDashboard.css";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse: parseISO,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

const MeetingsDashboard = () => {
  const { user } = useContext(AuthContext);
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newPlace, setNewPlace] = useState("");

  useEffect(() => {
    if (!user?.user_id) return;

    const fetchMeetings = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`/meetings?user_id=${user.user_id}`);
        const rawMeetings = res.data.meetings || [];

        const parsed = rawMeetings.map((m) => {
          const isSent = m.user_1 === user.user_id;
          return {
            id: m._id,
            title: `${isSent ? "To" : "From"}: User #${isSent ? m.user_2 : m.user_1}`,
            datetime: m.datetime,
            start: new Date(m.datetime),
            end: new Date(new Date(m.datetime).getTime() + 60 * 60 * 1000),
            location: m.location,
            status: m.status,
            type: isSent ? "sent" : "received",
            user1: m.user_1,
            user2: m.user_2,
          };
        });

        setMeetings(parsed);
      } catch (err) {
        console.error("Failed to fetch meetings:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeetings();
  }, [user]);

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`/meetings/${id}/status`, { status });
      setMeetings((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status } : m))
      );
      setModalOpen(false);
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleSuggestSubmit = () => {
    console.log("Suggesting new date/location:", {
      meeting_id: selectedEvent.id,
      suggested_datetime: newDate,
      suggested_location: newPlace,
    });

    setModalOpen(false);
    setNewDate("");
    setNewPlace("");
  };

  const eventPropGetter = (event) => {
    const baseColor = event.type === "sent" ? "#e3f2fd" : "#f3e5f5"; // Light blue or purple
    let border = "#ccc";
    let textColor = "#1e1e1e"; // Dark text
  
    switch (event.status) {
      case "Confirmed":
        border = "#4caf50"; break;
      case "Declined":
        border = "#f44336"; break;
      case "Pending":
        border = "#ff9800"; break;
    }
  
    return {
      style: {
        backgroundColor: baseColor,
        border: `2px solid ${border}`,
        color: textColor,
        borderRadius: "6px",
        padding: "4px",
      }
    };
  };
  

  return (
    <div className="meetings-dashboard">
      <h1>📅 My Meetings</h1>

      {isLoading ? (
        <div className="loader-container">
          <Loader className="loading-icon" />
        </div>
      ) : (
        <div className="calendar-container">
          <Calendar
            localizer={localizer}
            events={meetings}
            startAccessor="start"
            endAccessor="end"
            onSelectEvent={(event) => {
              setSelectedEvent(event);
              setModalOpen(true);
            }}
            eventPropGetter={eventPropGetter}
            style={{ height: "75vh" }}
          />
        </div>
      )}

      {/* Modal for event details */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="meeting-modal">
          <DialogHeader>
            <DialogTitle>📄 Meeting Details</DialogTitle>
          </DialogHeader>

          {selectedEvent && (
            <div className="meeting-details-body">
              <div className="details-section">
                <p>
                  <span className="label">With:</span>
                  <span className="value">User #{selectedEvent.type === "sent" ? selectedEvent.user2 : selectedEvent.user1}</span>
                </p>
                <p>
                  <span className="label">Date:</span>
                  <span className="value">{format(new Date(selectedEvent.datetime), "yyyy-MM-dd HH:mm")}</span>
                </p>
                <p>
                  <span className="label">Location:</span>
                  <span className="value">{selectedEvent.location}</span>
                </p>
                <p>
                  <span className="label">Status:</span>
                  <span className={`value status ${selectedEvent.status.toLowerCase()}`}>
                    {selectedEvent.status === "Confirmed" && "✅ "}
                    {selectedEvent.status === "Declined" && "❌ "}
                    {selectedEvent.status === "Pending" && "⏳ "}
                    {selectedEvent.status}
                  </span>
                </p>
              </div>

              <hr className="modal-divider" />

              {selectedEvent.type === "received" && selectedEvent.status === "Pending" && (
                <div className="suggest-form">
                  <h3>Respond to Meeting</h3>
                  <div className="button-group">
                    <Button onClick={() => updateStatus(selectedEvent.id, "Confirmed")}>Confirm</Button>
                    <Button variant="destructive" onClick={() => updateStatus(selectedEvent.id, "Declined")}>Deny</Button>
                  </div>

                  <div className="alt-suggestion">
                    <h4>Suggest Changes</h4>
                    <Input
                      placeholder="New Date & Time"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                    />
                    <Input
                      placeholder="New Location"
                      value={newPlace}
                      onChange={(e) => setNewPlace(e.target.value)}
                    />
                    <Button variant="outline" onClick={handleSuggestSubmit}>Suggest New</Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default MeetingsDashboard;
