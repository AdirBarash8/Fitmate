import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react"; // for spinner

const MeetingsDashboard = () => {
  const [activeTab, setActiveTab] = useState("received");
  const [suggestModalOpen, setSuggestModalOpen] = useState(false);
  const [selectedMeetingId, setSelectedMeetingId] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newPlace, setNewPlace] = useState("");

  const dummySentMeetings = [
    {
      id: "sent1",
      withUser: "Alice Johnson",
      date: "2025-05-02 15:00",
      place: "Central Park Gym",
      status: "Pending",
    },
    {
      id: "sent2",
      withUser: "David Smith",
      date: "2025-05-04 18:00",
      place: "Downtown Studio",
      status: "Confirmed",
    },
  ];

  const dummyReceivedMeetings = [
    {
      id: "recv1",
      fromUser: "Emily Stone",
      date: "2025-05-03 10:00",
      place: "Fitness Center",
      status: "Pending",
    },
    {
      id: "recv2",
      fromUser: "Mark Lee",
      date: "2025-05-06 20:00",
      place: "Yoga Club",
      status: "Denied",
    },
  ];

  const handleConfirm = (meetingId) => {
    console.log(`Confirmed meeting: ${meetingId}`);
  };

  const handleDeny = (meetingId) => {
    console.log(`Denied meeting: ${meetingId}`);
  };

  const openSuggestModal = (meetingId) => {
    setSelectedMeetingId(meetingId);
    setSuggestModalOpen(true);
  };

  const handleSuggestSubmit = () => {
    console.log(`Suggesting new meeting for: ${selectedMeetingId}`);
    console.log(`New Date: ${newDate}, New Place: ${newPlace}`);
    setSuggestModalOpen(false);
    setNewDate("");
    setNewPlace("");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "border-green-500";
      case "Denied":
        return "border-red-500";
      case "Suggested New":
        return "border-yellow-500";
      default:
        return "border-gray-300";
    }
  };

  const isLoading = false; // we can later simulate true/false

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Meetings</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader className="animate-spin w-8 h-8 text-gray-500" />
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="sent">Sent Meetings</TabsTrigger>
            <TabsTrigger value="received">Received Meetings</TabsTrigger>
          </TabsList>

          <TabsContent value="sent">
            {dummySentMeetings.length === 0 ? (
              <p>No sent meetings.</p>
            ) : (
              dummySentMeetings.map((meeting) => (
                <div key={meeting.id} className={`border-2 ${getStatusColor(meeting.status)} p-3 my-2 rounded`}>
                  <p><strong>With:</strong> {meeting.withUser}</p>
                  <p><strong>Date:</strong> {meeting.date}</p>
                  <p><strong>Place:</strong> {meeting.place}</p>
                  <p><strong>Status:</strong> {meeting.status}</p>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="received">
            {dummyReceivedMeetings.length === 0 ? (
              <p>No received meetings.</p>
            ) : (
              dummyReceivedMeetings.map((meeting) => (
                <div key={meeting.id} className={`border-2 ${getStatusColor(meeting.status)} p-3 my-2 rounded`}>
                  <p><strong>From:</strong> {meeting.fromUser}</p>
                  <p><strong>Date:</strong> {meeting.date}</p>
                  <p><strong>Place:</strong> {meeting.place}</p>
                  <p><strong>Status:</strong> {meeting.status}</p>

                  {meeting.status === "Pending" && (
                    <div className="flex gap-2 mt-2">
                      <Button onClick={() => handleConfirm(meeting.id)}>Confirm</Button>
                      <Button variant="destructive" onClick={() => handleDeny(meeting.id)}>Deny</Button>
                      <Button variant="outline" onClick={() => openSuggestModal(meeting.id)}>Suggest New</Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Suggest New Modal */}
      <Dialog open={suggestModalOpen} onOpenChange={setSuggestModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suggest New Meeting</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <Input
              placeholder="New Date (e.g., 2025-05-01 14:00)"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
            <Input
              placeholder="New Place"
              value={newPlace}
              onChange={(e) => setNewPlace(e.target.value)}
            />
          </div>

          <DialogFooter className="mt-4">
            <Button onClick={handleSuggestSubmit}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MeetingsDashboard;
