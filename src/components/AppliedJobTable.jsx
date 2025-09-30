import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import ChatBox from "./ChatBox";

const AppliedJobTable = () => {
  const { allAppliedJobs } = useSelector((store) => store.job);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const handleChatOpen = (application) => {
    setSelectedApplication(application);
    setIsChatOpen(true);
  };

  const handleChatClose = () => {
    setIsChatOpen(false);
    setSelectedApplication(null);
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableCaption className="text-xs sm:text-sm">A list of your applied jobs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs sm:text-sm">Date</TableHead>
            <TableHead className="text-xs sm:text-sm">Job Role</TableHead>
            <TableHead className="text-xs sm:text-sm">Company</TableHead>
            <TableHead className="text-right text-xs sm:text-sm">Status</TableHead>
            <TableHead className="text-right text-xs sm:text-sm">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allAppliedJobs.length <= 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-sm text-gray-500 py-8">
                You haven't applied any job yet.
              </TableCell>
            </TableRow>
          ) : (
            allAppliedJobs.map((appliedJob) => (
              <TableRow key={appliedJob._id}>
                <TableCell className="text-xs sm:text-sm">{appliedJob?.createdAt?.split("T")[0]}</TableCell>
                <TableCell className="text-xs sm:text-sm">{appliedJob.job?.title}</TableCell>
                <TableCell className="text-xs sm:text-sm">{appliedJob.job?.company?.name}</TableCell>
                <TableCell className="text-right">
                  <Badge
                    className={`text-xs ${
                      appliedJob?.status === "rejected"
                        ? "bg-red-400"
                        : appliedJob.status === "pending"
                        ? "bg-gray-400"
                        : "bg-green-400"
                    }`}
                  >
                    {appliedJob.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {appliedJob.status === "accepted" ? (
                    <Button
                      onClick={() => handleChatOpen(appliedJob)}
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600 text-white text-xs"
                    >
                      Chat
                    </Button>
                  ) : (
                    <span className="text-gray-400 text-xs">-</span>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {/* Chat Dialog */}
      <ChatBox
        isOpen={isChatOpen}
        onClose={handleChatClose}
        application={selectedApplication}
      />
    </div>
  );
};

export default AppliedJobTable;
