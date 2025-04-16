import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { useEffect } from "react";
import { BASE_URL } from "../utils/constants";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();

  const reviewRequest = async (status, _id) => {
    try {
      await axios.post(
        `${BASE_URL}/request/review/${status}/${_id}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/requests/received`, {
        withCredentials: true,
      });
      dispatch(addRequests(res.data.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return null;

  if (requests.length === 0)
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <h1 className="text-xl font-semibold text-white">No Requests Found</h1>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white text-center mb-8">
        Connection Requests
      </h1>

      <div className="space-y-6">
        {requests.map((request) => {
          const { _id, firstName, lastName, photoUrl, age, gender, about } =
            request.fromUserId;

          return (
            <div
              key={_id}
              className="flex flex-col sm:flex-row sm:items-center bg-white/10 backdrop-blur-md border border-white/20 shadow-md rounded-xl p-5 gap-4 text-white"
            >
              <img
                src={photoUrl}
                alt={`${firstName}'s profile`}
                className="w-20 h-20 rounded-full object-cover border-2 border-white"
              />
              <div className="flex-1 text-left">
                <h2 className="text-xl font-semibold">
                  {firstName} {lastName}
                </h2>
                {age && gender && (
                  <p className="text-sm text-gray-300">
                    {age}, {gender}
                  </p>
                )}
                <p className="text-sm text-gray-400">{about}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4 sm:mt-0">
                <button
                  className="btn btn-sm sm:btn-md btn-outline btn-error"
                  onClick={() => reviewRequest("rejected", request._id)}
                >
                  Reject
                </button>
                <button
                  className="btn btn-sm sm:btn-md btn-outline btn-success"
                  onClick={() => reviewRequest("accepted", request._id)}
                >
                  Accept
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Requests;
