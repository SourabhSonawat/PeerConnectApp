import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/conectionSlice";
import { Link } from "react-router-dom";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();

  const fetchConnections = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/connections`, {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return null;

  if (connections.length === 0)
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <h1 className="text-2xl text-white font-semibold">
          No Connections Found
        </h1>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-white text-center mb-10">
        Your Connections
      </h1>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
        {connections.map((connection) => {
          const { _id, firstName, lastName, photoUrl, age, gender, about } =
            connection;

          return (
            <div
              key={_id}
              className="bg-white/10 backdrop-blur-md border border-white/10 shadow-md rounded-xl p-5 flex items-center gap-4 transition hover:scale-[1.02] hover:shadow-lg duration-200"
            >
              <img
                src={photoUrl}
                alt={firstName}
                className="w-20 h-20 rounded-full object-cover border-2 border-white"
              />
              <div className="flex-1 text-white">
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
              <Link to={`/chat/${_id}`}>
                <button className="btn btn-accent btn-sm md:btn-md">
                  Chat
                </button>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
