import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });
  const { loading, user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      dispatch(setLoading(false));
    }
  };
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center max-w-7xl mx-auto px-4 w-full">
        <form
          onSubmit={submitHandler}
          className="w-full md:w-2/3 lg:w-1/2 xl:w-2/5 border border-gray-200 rounded-md p-4 md:p-6 my-10"
        >
          <h1 className="font-bold text-xl md:text-2xl mb-5 text-center md:text-left">Login</h1>
          <div className="my-3 md:my-4">
            <Label htmlFor="email" className="text-sm md:text-base">Email</Label>
            <Input
              id="email"
              type="email"
              value={input.email}
              name="email"
              onChange={changeEventHandler}
              placeholder="example@gmail.com"
              className="mt-1 text-sm md:text-base"
            />
          </div>

          <div className="my-3 md:my-4">
            <Label htmlFor="password" className="text-sm md:text-base">Password</Label>
            <Input
              id="password"
              type="password"
              value={input.password}
              name="password"
              onChange={changeEventHandler}
              placeholder="Enter your password"
              className="mt-1 text-sm md:text-base"
            />
          </div>
          
          <div className="my-4 md:my-5">
            <Label className="text-sm md:text-base mb-2 block">Select Role</Label>
            <RadioGroup className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
              <div className="flex items-center space-x-2">
                <Input
                  id="student-role"
                  type="radio"
                  name="role"
                  value="student"
                  checked={input.role === "student"}
                  onChange={changeEventHandler}
                  className="cursor-pointer"
                />
                <Label htmlFor="student-role" className="cursor-pointer text-sm md:text-base">Student</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  id="recruiter-role"
                  type="radio"
                  name="role"
                  value="recruiter"
                  checked={input.role === "recruiter"}
                  onChange={changeEventHandler}
                  className="cursor-pointer"
                />
                <Label htmlFor="recruiter-role" className="cursor-pointer text-sm md:text-base">Recruiter</Label>
              </div>
            </RadioGroup>
          </div>
          
          {loading ? (
            <Button className="w-full my-4 md:my-5 py-2 text-sm md:text-base" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </Button>
          ) : (
            <Button type="submit" className="w-full my-4 md:my-5 py-2 text-sm md:text-base">
              Login
            </Button>
          )}
          
          <div className="text-center mt-4">
            <span className="text-xs md:text-sm">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-600 hover:underline">
                Signup
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;