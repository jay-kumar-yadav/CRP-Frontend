import React, { useState } from "react";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = () => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  return (
    <div className="text-center px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:gap-5 my-8 sm:my-10 max-w-4xl mx-auto">
        <span className="mx-auto px-3 sm:px-4 py-2 rounded-full bg-gray-100 text-[#F83002] font-medium text-xs sm:text-sm md:text-base">
          No. 1 Job Hunt Website
        </span>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight sm:leading-snug">
          Search, Apply & <br className="hidden sm:block" />
          Get Your <span className="text-[#6A38C2]">Dream Jobs</span>
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-gray-600 max-w-lg sm:max-w-xl mx-auto px-2">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid
          aspernatur temporibus nihil tempora dolor!
        </p>
        <div className="flex w-full max-w-sm sm:max-w-xl mx-auto shadow-lg border border-gray-200 pl-2 sm:pl-3 pr-1 rounded-full items-center gap-1 sm:gap-2 md:gap-4">
          <input
            type="text"
            placeholder="Find your dream jobs"
            onChange={(e) => setQuery(e.target.value)}
            className="outline-none border-none w-full text-xs sm:text-sm md:text-base px-1 sm:px-2 py-2 sm:py-3 rounded-l-full"
          />
          <Button
            onClick={searchJobHandler}
            className="rounded-full bg-[#6A38C2] hover:bg-[#5b30a6] px-2 sm:px-3 md:px-4 py-2 sm:py-3"
          >
            <Search className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
