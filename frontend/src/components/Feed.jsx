import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useEffect } from "react";
import UserCard from "./UserCard";
import { BASE_URL } from "../utils/constants";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  const getFeed = async () => {
    if (feed) return;
    try {
      const res = await axios.get(`${BASE_URL}/feed`, {
        withCredentials: true,
      });
      dispatch(addFeed(res?.data?.data));
    } catch (err) {
      console.log("error");
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (!feed) return null;

  if (feed.length <= 0)
    return (
      <h1 className="flex justify-center items-center text-center text-xl font-semibold text-gray-700 py-20 px-4">
        No new users found!
      </h1>
    );

  return (
    <div className="flex justify-center items-center px-4 py-8 min-h-[calc(100vh-5rem)] ">
      <div className="w-full max-w-md">
        <UserCard user={feed[0]} />
      </div>
    </div>
  );
};

export default Feed;
