import React, { useState } from "react";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Contact, Mail, Pen } from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import AppliedJobTable from "./AppliedJobTable";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";

// const skills = ["Html", "Css", "Javascript", "Reactjs"]
const isResume = true;

const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-4 sm:p-6 lg:p-8 mx-4 sm:mx-6 lg:mx-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Avatar className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24">
              <AvatarImage
                src="https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"
                alt="profile"
              />
            </Avatar>
            <div>
              <h1 className="font-medium text-lg sm:text-xl">{user?.fullname}</h1>
              <p className="text-sm sm:text-base text-gray-600">{user?.profile?.bio}</p>
            </div>
          </div>
          <Button
            onClick={() => setOpen(true)}
            className="self-start sm:self-auto"
            variant="outline"
          >
            <Pen className="h-4 w-4" />
          </Button>
        </div>
        <div className="my-4 sm:my-5">
          <div className="flex items-center gap-3 my-2">
            <Mail className="h-4 w-4" />
            <span className="text-sm sm:text-base">{user?.email}</span>
          </div>
          <div className="flex items-center gap-3 my-2">
            <Contact className="h-4 w-4" />
            <span className="text-sm sm:text-base">{user?.phoneNumber}</span>
          </div>
        </div>
        <div className="my-4 sm:my-5">
          <h1 className="text-base sm:text-lg font-semibold mb-2">Skills</h1>
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            {user?.profile?.skills.length !== 0 ? (
              user?.profile?.skills.map((item, index) => (
                <Badge key={index} className="text-xs">{item}</Badge>
              ))
            ) : (
              <span className="text-sm text-gray-500">NA</span>
            )}
          </div>
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label className="text-sm sm:text-base font-bold">Resume</Label>
          {isResume ? (
            <a
              target="blank"
              href={user?.profile?.resume}
              className="text-blue-500 w-full hover:underline cursor-pointer text-sm sm:text-base break-all"
            >
              {user?.profile?.resumeOriginalName}
            </a>
          ) : (
            <span className="text-sm text-gray-500">NA</span>
          )}
        </div>
      </div>
      <div className="max-w-4xl mx-auto bg-white rounded-2xl mx-4 sm:mx-6 lg:mx-8">
        <h1 className="font-bold text-base sm:text-lg my-4 sm:my-5 px-4 sm:px-6">Applied Jobs</h1>
        {/* Applied Job Table   */}
        <AppliedJobTable />
      </div>
      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;
