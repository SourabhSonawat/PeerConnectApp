// import { useState } from "react";
// import axios from "axios";
// import { useDispatch } from "react-redux";
// import { addUser } from "../utils/userSlice";
// import { useNavigate } from "react-router-dom";
// import { BASE_URL } from "../utils/constants";

// const Login = () => {
//   const [emailId, setEmailId] = useState("");
//   const [password, setPassword] = useState("");
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [isLoginForm, setIsLoginForm] = useState(true);
//   const [error, setError] = useState("");
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const isStrongPassword = (password) => {
//     // Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character
//     const strongPasswordRegex =
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;
//     return strongPasswordRegex.test(password);
//   };

//   const handleLogin = async () => {
//     try {
//       const res = await axios.post(
//         `${BASE_URL}/login`,
//         {
//           emailId,
//           password,
//         },
//         { withCredentials: true }
//       );
//       dispatch(addUser(res.data));
//       return navigate("/");
//     } catch (err) {
//       setError(err?.response?.data || "Something went wrong");
//     }
//   };

//   const handleSignUp = async () => {
//     if (!isStrongPassword(password)) {
//       setError(
//         "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
//       );
//       return;
//     }
//     try {
//       const res = await axios.post(
//         `${BASE_URL}/signup`,
//         { firstName, lastName, emailId, password },
//         { withCredentials: true }
//       );
//       dispatch(addUser(res.data.data));
//       return navigate("/profile");
//     } catch (err) {
//       setError(err?.response?.data || "Something went wrong");
//     }
//   };

//   return (
//     <div className="flex justify-center my-10 px-4 sm:px-6 md:px-8">
//       <div className="card bg-base-300 shadow-xl w-full max-w-md">
//         <div className="card-body">
//           <h2 className="card-title justify-center">
//             {isLoginForm ? "Login" : "Sign Up"}
//           </h2>
//           <div>
//             {!isLoginForm && (
//               <>
//                 <label className="form-control w-full max-w-xs my-2">
//                   <div className="label">
//                     <span className="label-text">First Name</span>
//                   </div>
//                   <input
//                     type="text"
//                     value={firstName}
//                     className="input input-bordered w-full max-w-xs"
//                     onChange={(e) => setFirstName(e.target.value)}
//                   />
//                 </label>
//                 <label className="form-control w-full max-w-xs my-2">
//                   <div className="label">
//                     <span className="label-text">Last Name</span>
//                   </div>
//                   <input
//                     type="text"
//                     value={lastName}
//                     className="input input-bordered w-full max-w-xs"
//                     onChange={(e) => setLastName(e.target.value)}
//                   />
//                 </label>
//               </>
//             )}
//             <label className="form-control w-full max-w-xs my-2">
//               <div className="label">
//                 <span className="label-text">Email ID:</span>
//               </div>
//               <input
//                 type="text"
//                 value={emailId}
//                 className="input input-bordered w-full max-w-xs"
//                 onChange={(e) => setEmailId(e.target.value)}
//               />
//             </label>
//             <label className="form-control w-full max-w-xs my-2">
//               <div className="label">
//                 <span className="label-text">Password</span>
//               </div>
//               <input
//                 type="password"
//                 value={password}
//                 className="input input-bordered w-full max-w-xs"
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </label>
//           </div>
//           <p className="text-red-500">{error}</p>
//           <div className="card-actions justify-center m-2">
//             <button
//               className="btn btn-outline btn-primary w-full sm:w-auto"
//               onClick={isLoginForm ? handleLogin : handleSignUp}
//             >
//               {isLoginForm ? "Login" : "Sign Up"}
//             </button>
//           </div>

//           <p
//             className="m-auto text-center cursor-pointer py-2"
//             onClick={() => setIsLoginForm((value) => !value)}
//           >
//             {isLoginForm
//               ? "New User? Signup Here"
//               : "Existing User? Login Here"}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

// Password validation functions
const isStrongPassword = (password) => {
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;
  return strongPasswordRegex.test(password);
};

const getPasswordStrength = (password) => {
  if (password.length < 6) return { label: "Too short", color: "text-red-500" };

  const strongRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;
  const mediumRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

  if (strongRegex.test(password)) {
    return { label: "Strong", color: "text-green-500" };
  } else if (mediumRegex.test(password)) {
    return { label: "Medium", color: "text-yellow-500" };
  } else {
    return { label: "Weak", color: "text-red-500" };
  }
};

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/login`,
        {
          emailId,
          password,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      return navigate("/");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    }
  };

  const handleSignUp = async () => {
    if (!isStrongPassword(password)) {
      setError(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    try {
      const res = await axios.post(
        `${BASE_URL}/signup`,
        { firstName, lastName, emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.data));
      return navigate("/profile");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center my-10 px-4 sm:px-6 md:px-8">
      <div className="card bg-base-300 shadow-xl w-full max-w-md">
        <div className="card-body">
          <h2 className="card-title justify-center">
            {isLoginForm ? "Login" : "Sign Up"}
          </h2>
          <div>
            {!isLoginForm && (
              <>
                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text">First Name</span>
                  </div>
                  <input
                    type="text"
                    value={firstName}
                    className="input input-bordered w-full max-w-xs"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </label>
                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text">Last Name</span>
                  </div>
                  <input
                    type="text"
                    value={lastName}
                    className="input input-bordered w-full max-w-xs"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </label>
              </>
            )}
            <label className="form-control w-full max-w-xs my-2">
              <div className="label">
                <span className="label-text">Email ID:</span>
              </div>
              <input
                type="text"
                value={emailId}
                className="input input-bordered w-full max-w-xs"
                onChange={(e) => setEmailId(e.target.value)}
              />
            </label>
            <label className="form-control w-full max-w-xs my-2">
              <div className="label">
                <span className="label-text">Password</span>
              </div>
              <input
                type="password"
                value={password}
                className="input input-bordered w-full max-w-xs"
                onChange={(e) => setPassword(e.target.value)}
              />
              {!isLoginForm && password && (
                <p
                  className={`text-sm mt-1 ${
                    getPasswordStrength(password).color
                  }`}
                >
                  Strength: {getPasswordStrength(password).label}
                </p>
              )}
            </label>
          </div>
          <p className="text-red-500 text-sm mt-2">{error}</p>
          <div className="card-actions justify-center m-2">
            <button
              className="btn btn-outline btn-primary w-full sm:w-auto"
              onClick={isLoginForm ? handleLogin : handleSignUp}
            >
              {isLoginForm ? "Login" : "Sign Up"}
            </button>
          </div>

          <p
            className="m-auto text-center cursor-pointer py-2"
            onClick={() => {
              setIsLoginForm((value) => !value);
              setError(""); // clear error on toggle
            }}
          >
            {isLoginForm
              ? "New User? Signup Here"
              : "Existing User? Login Here"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
