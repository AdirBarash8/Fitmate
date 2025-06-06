import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "../utils/axiosInstance";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import { format } from "date-fns";

const MeetingsDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("received");
  const [sentMeetings, setSentMeetings] = useState([]);
  const [receivedMeetings, setReceivedMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [suggestModalOpen, setSuggestModalOpen] = useState(false);
  const [selectedMeetingId, setSelectedMeetingId] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newPlace, setNewPlace] = useState("");

  useEffect(() => {
    if (!user?.user_id) return;

    const fetchMeetings = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`/meetings?user_id=${user.user_id}`);
        const meetings = res.data.meetings || [];

        const sent = [];
        const received = [];

        meetings.forEach((m) => {
          const formatted = {
            id: m._id,
            user_1: m.user_1,
            user_2: m.user_2,
            datetime: format(new Date(m.datetime), "yyyy-MM-dd HH:mm"),
            location: m.location,
            status: m.status
          };

          if (m.user_1 === user.user_id) {
            formatted.withUser = `User #${m.user_2}`;
            sent.push(formatted);
          } else {
            formatted.fromUser = `User #${m.user_1}`;
            received.push(formatted);
          }
        });

        setSentMeetings(sent);
        setReceivedMeetings(received);
      } catch (err) {
        console.error("Failed to fetch meetings:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeetings();
  }, [user]);

  const updateStatus = async (meetingId, status) => {
    try {
      await axios.patch(`/meetings/${meetingId}/status`, { status });
      setSentMeetings((prev) =>
        prev.map((m) => (m.id === meetingId ? { ...m, status } : m))
      );
      setReceivedMeetings((prev) =>
        prev.map((m) => (m.id === meetingId ? { ...m, status } : m))
      );
    } catch (err) {
      console.error(`Failed to update status to "${status}"`, err);
    }
  };

  const handleConfirm = (id) => updateStatus(id, "Confirmed");
  const handleDeny = (id) => updateStatus(id, "Declined");

  const openSuggestModal = (id) => {
    setSelectedMeetingId(id);
    setSuggestModalOpen(true);
  };

  const handleSuggestSubmit = () => {
    console.log("📤 Suggesting new time/location:", {
      meeting_id: selectedMeetingId,
      suggested_datetime: newDate,
      suggested_location: newPlace
    });

    // 🔧 Optional: Send this suggestion to backend if desired

    setSuggestModalOpen(false);
    setNewDate("");
    setNewPlace("");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "border-green-500";
      case "Declined":
        return "border-red-500";
      case "Suggested":
        return "border-yellow-500";
      default:
        return "border-gray-300";
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📆 My Meetings</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader className="animate-spin w-8 h-8 text-gray-500" />
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="sent">Sent</TabsTrigger>
            <TabsTrigger value="received">Received</TabsTrigger>
          </TabsList>

          <TabsContent value="sent">
            {sentMeetings.length === 0 ? (
              <p>No sent meetings.</p>
            ) : (
              sentMeetings.map((m) => (
                <div
                  key={m.id}
                  className={`border-2 ${getStatusColor(m.status)} p-3 my-2 rounded`}
                >
                  <p><strong>With:</strong> {m.withUser}</p>
                  <p><strong>Date:</strong> {m.datetime}</p>
                  <p><strong>Location:</strong> {m.location}</p>
                  <p><strong>Status:</strong> {m.status}</p>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="received">
            {receivedMeetings.length === 0 ? (
              <p>No received meetings.</p>
            ) : (
              receivedMeetings.map((m) => (
                <div
                  key={m.id}
                  className={`border-2 ${getStatusColor(m.status)} p-3 my-2 rounded`}
                >
                  <p><strong>From:</strong> {m.fromUser}</p>
                  <p><strong>Date:</strong> {m.datetime}</p>
                  <p><strong>Location:</strong> {m.location}</p>
                  <p><strong>Status:</strong> {m.status}</p>

                  {m.status === "Pending" && (
                    <div className="flex gap-2 mt-2">
                      <Button onClick={() => handleConfirm(m.id)}>Confirm</Button>
                      <Button variant="destructive" onClick={() => handleDeny(m.id)}>Deny</Button>
                      <Button variant="outline" onClick={() => openSuggestModal(m.id)}>Suggest New</Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Suggest Meeting Modal */}
      <Dialog open={suggestModalOpen} onOpenChange={setSuggestModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suggest New Meeting</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <Input
              placeholder="New Date & Time (e.g., 2025-06-12 16:00)"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
            <Input
              placeholder="New Location"
              value={newPlace}
              onChange={(e) => setNewPlace(e.target.value)}
            />
          </div>

          <DialogFooter className="mt-4">
            <Button onClick={handleSuggestSubmit}>Submit Suggestion</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MeetingsDashboard;
