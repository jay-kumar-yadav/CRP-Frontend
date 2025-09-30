import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import ChatBox from "../ChatBox";

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
  const { applicants } = useSelector((store) => store.application);
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

  const statusHandler = async (status, id) => {
    console.log("called");
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/status/${id}/update`,
        { status }
      );
      console.log(res);
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div>
      <Table>
        <TableCaption>A list of your recent applied user</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>FullName</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Resume</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applicants &&
            applicants?.applications?.map((item) => (
              <tr key={item._id}>
                <TableCell>{item?.applicant?.fullname}</TableCell>
                <TableCell>{item?.applicant?.email}</TableCell>
                <TableCell>{item?.applicant?.phoneNumber}</TableCell>
                <TableCell>
                  {item.applicant?.profile?.resume ? (
                    <a
                      className="text-blue-600 cursor-pointer"
                      href={item?.applicant?.profile?.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item?.applicant?.profile?.resumeOriginalName}
                    </a>
                  ) : (
                    <span>NA</span>
                  )}
                </TableCell>
                <TableCell>{item?.applicant.createdAt.split("T")[0]}</TableCell>
                <TableCell>
                  <Badge
                    className={`${
                      item?.status === "rejected"
                        ? "bg-red-400"
                        : item.status === "pending"
                        ? "bg-gray-400"
                        : "bg-green-400"
                    }`}
                  >
                    {item.status?.toUpperCase() || "PENDING"}
                  </Badge>
                </TableCell>
                <TableCell className="float-right cursor-pointer">
                  <div className="flex items-center gap-2">
                    {item.status === "accepted" && (
                      <Button
                        onClick={() => handleChatOpen(item)}
                        size="sm"
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        Chat
                      </Button>
                    )}
                    <Popover>
                      <PopoverTrigger>
                        <MoreHorizontal />
                      </PopoverTrigger>
                      <PopoverContent className="w-32">
                        {shortlistingStatus.map((status, index) => {
                          return (
                            <div
                              onClick={() => statusHandler(status, item?._id)}
                              key={index}
                              className="flex w-fit items-center my-2 cursor-pointer"
                            >
                              <span>{status}</span>
                            </div>
                          );
                        })}
                      </PopoverContent>
                    </Popover>
                  </div>
                </TableCell>
              </tr>
            ))}
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

export default ApplicantsTable;
