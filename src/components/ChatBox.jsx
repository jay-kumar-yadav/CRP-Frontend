import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { setMessages, addMessage, setLoading, setError } from "../redux/chatSlice";
import { toast } from "sonner";
import axios from "axios";
import { APPLICATION_API_END_POINT } from "../utils/constant";

const ChatBox = ({ isOpen, onClose, application }) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  
  const { messages, loading } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && application) {
      console.log("Application data:", application);
      fetchMessages();
    }
  }, [isOpen, application]);

  const fetchMessages = async () => {
    try {
      dispatch(setLoading(true));
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/chat/${application._id}`,
        { withCredentials: true }
      );
      
      if (res.data.success) {
        dispatch(setMessages(res.data.messages || []));
      }
    } catch (error) {
      console.log(error);
      dispatch(setError("Failed to fetch messages"));
      toast.error("Failed to load chat messages");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;

    // Determine receiver based on user role
    let receiverId, receiverName;
    
    if (user.role === 'student') {
      // Student is sending to company
      if (!application?.job?.company?.userId) {
        toast.error("Company information not available");
        return;
      }
      receiverId = application.job.company.userId;
      receiverName = application.job.company.name;
    } else {
      // Recruiter is sending to student
      if (!application?.applicant?._id) {
        toast.error("Applicant information not available");
        return;
      }
      receiverId = application.applicant._id;
      receiverName = application.applicant.fullname;
    }

    const newMessage = {
      _id: Date.now().toString(), // temporary ID
      content: message.trim(),
      sender: user._id,
      senderName: user.fullname,
      receiver: receiverId,
      receiverName: receiverName,
      application: application._id,
      createdAt: new Date().toISOString(),
      isTemporary: true
    };

    // Add message optimistically
    dispatch(addMessage(newMessage));
    setMessage("");
    setIsSending(true);

    try {
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/chat/send`,
        {
          applicationId: application._id,
          content: message.trim(),
          receiverId: receiverId
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        // Replace temporary message with real one
        dispatch(setMessages(messages.map(msg => 
          msg.isTemporary && msg._id === newMessage._id 
            ? res.data.message 
            : msg
        )));
        toast.success("Message sent successfully");
      }
    } catch (error) {
      console.log(error);
      // Remove failed message
      dispatch(setMessages(messages.filter(msg => msg._id !== newMessage._id)));
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  const groupedMessages = messages.reduce((groups, message) => {
    const date = formatDate(message.createdAt);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[500px] sm:h-[600px] flex flex-col mx-4 sm:mx-0">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-sm sm:text-base">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-semibold">
              {user.role === 'student' 
                ? application?.job?.company?.name?.charAt(0)?.toUpperCase()
                : application?.applicant?.fullname?.charAt(0)?.toUpperCase()
              }
            </div>
            <span className="truncate">
              Chat with {user.role === 'student' 
                ? application?.job?.company?.name
                : application?.applicant?.fullname
              }
            </span>
            <span className="text-xs sm:text-sm text-gray-500 font-normal truncate">
              - {application?.job?.title}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-4">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8 text-sm sm:text-base">
              No messages yet. Start the conversation!
            </div>
          ) : (
            Object.entries(groupedMessages).map(([date, dateMessages]) => (
              <div key={date}>
                <div className="text-center text-sm text-gray-500 mb-4">
                  {date}
                </div>
                {dateMessages.map((msg, index) => {
                  const isSameSender = index > 0 && dateMessages[index - 1].sender === msg.sender;
                  return (
                  <div
                    key={msg._id}
                    className={`flex ${msg.sender === user._id ? 'justify-end' : 'justify-start'} ${isSameSender ? 'mb-1' : 'mb-3'}`}
                  >
                    <div className={`max-w-xs sm:max-w-sm lg:max-w-md ${msg.sender === user._id ? 'items-end' : 'items-start'} flex flex-col`}>
                      {/* Sender Name with Avatar - only show if different sender */}
                      {!isSameSender && (
                        <div className={`flex items-center gap-1 sm:gap-2 mb-1 ${
                          msg.sender === user._id ? 'justify-end' : 'justify-start'
                        }`}>
                          {msg.sender !== user._id && (
                            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                              {(msg.senderName || (msg.sender?.fullname) || 'U').charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className={`text-xs font-medium ${
                            msg.sender === user._id ? 'text-blue-600' : 'text-gray-600'
                          }`}>
                            {msg.sender === user._id 
                              ? 'You' 
                              : (msg.senderName || (msg.sender?.fullname) || 'Unknown')
                            }
                          </div>
                          {msg.sender === user._id && (
                            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                              {user.fullname?.charAt(0)?.toUpperCase() || 'Y'}
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Message Bubble */}
                      <div
                        className={`px-3 sm:px-4 py-2 rounded-lg ${
                          msg.sender === user._id
                            ? 'bg-blue-500 text-white rounded-br-sm'
                            : 'bg-gray-200 text-gray-800 rounded-bl-sm'
                        }`}
                      >
                        <div className="text-xs sm:text-sm">{msg.content}</div>
                      </div>
                      
                      {/* Timestamp */}
                      <div className={`text-xs mt-1 ${
                        msg.sender === user._id ? 'text-right text-gray-500' : 'text-left text-gray-500'
                      }`}>
                        {formatTime(msg.createdAt)}
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} className="flex gap-2 p-2 sm:p-4 border-t">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={isSending}
            className="flex-1 text-sm sm:text-base"
          />
          <Button 
            type="submit" 
            disabled={!message.trim() || isSending}
            className="px-3 sm:px-6 text-xs sm:text-sm"
          >
            {isSending ? "Sending..." : "Send"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChatBox;
