import axios from "axios";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import { BASE_URL } from "../utils/constants";

const UserCard = ({ user }) => {
  const { _id, firstName, lastName, photoUrl, age, gender, about } = user;
  const dispatch = useDispatch();

  const handleSendRequest = async (status, userId) => {
    try {
      await axios.post(
        `${BASE_URL}/request/send/${status}/${userId}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-md overflow-hidden transition-transform hover:scale-[1.02] duration-200">
      <div className="flex justify-center pt-6">
        <img
          src={photoUrl}
          alt={`${firstName} ${lastName}`}
          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
        />
      </div>
      <div className="p-6 text-white">
        <h2 className="text-xl font-bold text-center">
          {firstName} {lastName}
        </h2>
        {age && gender && (
          <p className="text-sm text-gray-300 text-center mt-1">
            {age} years, {gender}
          </p>
        )}
        <p className="text-sm text-gray-400 text-center mt-2">{about}</p>

        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
          <button
            className="btn btn-sm sm:btn-md btn-outline btn-error w-full sm:w-auto"
            onClick={() => handleSendRequest("ignored", _id)}
          >
            Ignore
          </button>
          <button
            className="btn btn-sm sm:btn-md btn-outline btn-success w-full sm:w-auto"
            onClick={() => handleSendRequest("interested", _id)}
          >
            Interested
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
