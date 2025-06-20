import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import assets from '../chat-app-assets/chat-app-assets/assets';
import { AuthContext } from '../../context/AuthContext'; // ✅ Make sure this is imported

function LoginPage() {
  const [currState, setCurrState] = useState("Sign up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [dataSubmitted, setDataSubmitted] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (currState === "Sign up" && !dataSubmitted) {
      setDataSubmitted(true);
      return;
    }

    const payload = currState === "Sign up"
      ? { fullName, email, password, bio }
      : { email, password };

    await login(currState === "Sign up" ? "signup" : "login", payload);
    navigate("/");
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${assets.background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>

      {/* Blur overlay */}
      <div className="absolute inset-0 z-0 backdrop-blur-lg bg-black/10"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        <img src={assets.logo_big} alt="Logo" className="h-16 mb-6" />

        <form
          onSubmit={submitHandler}
          className="bg-white/10 backdrop-blur-sm p-8 rounded-xl shadow-xl text-white max-w-md w-full space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{currState}</h2>
            {dataSubmitted && (
              <img
                onClick={() => setDataSubmitted(false)}
                src={assets.arrow_icon}
                alt="Back"
                className="h-4 w-4 rotate-180 cursor-pointer"
              />
            )}
          </div>

          {/* Sign up - Full Name */}
          {currState === "Sign up" && !dataSubmitted && (
            <input
              type="text"
              placeholder="Full Name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2 rounded bg-white/20 placeholder-white/60 outline-none"
            />
          )}

          {/* Common Fields */}
          {!dataSubmitted && (
            <>
              <input
                type="email"
                placeholder="Email Address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 rounded bg-white/20 placeholder-white/60 outline-none"
              />
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 rounded bg-white/20 placeholder-white/60 outline-none"
              />
            </>
          )}

          {/* Sign up - Bio */}
          {currState === "Sign up" && dataSubmitted && (
            <textarea
              placeholder="Write a short bio..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-2 h-24 rounded bg-white/20 placeholder-white/60 outline-none resize-none"
            />
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 mt-2 bg-purple-600 hover:bg-purple-700 transition rounded text-white font-medium"
          >
            {currState === "Sign up" ? "Create Account" : "Login Now"}
          </button>

          {/* Terms (optional UI element) */}
          <div className="flex items-start gap-2 text-xs">
            <input type="checkbox" className="mt-1" required />
            <p>Agree to the terms of use & privacy policy</p>
          </div>

          {/* Switch State */}
          <div className="text-sm text-center">
            {currState === "Sign up" ? (
              <p>
                Already have an account?{" "}
                <span
                  onClick={() => {
                    setCurrState("Login");
                    setDataSubmitted(false);
                  }}
                  className="underline cursor-pointer text-blue-300"
                >
                  Login here
                </span>
              </p>
            ) : (
              <p>
                Don't have an account?{" "}
                <span
                  onClick={() => {
                    setCurrState("Sign up");
                    setDataSubmitted(false);
                  }}
                  className="underline cursor-pointer text-blue-300"
                >
                  Click here
                </span>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
