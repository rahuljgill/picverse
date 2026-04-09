import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(TextPlugin);

async function loginUser({ email, password }) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
}

async function registerUser({ username, email, password }) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
}

function Login() {
  const textRef = useRef(null);
  const titleRef = useRef(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isRegisterFormOpen, setIsRegisterFormOpen] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      },
    );

    tl.to(textRef.current, {
      duration: 1.2,
      text: `A universe built<br/>from your <span class="text-gray-900 font-medium">moments...</span>`,
      ease: "none",
    });
  }, []);

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);

      if (data.user) {
        queryClient.setQueryData(["me"], data.user);
      }

      navigate("/home");
    },
    onError: (error) => {
      console.error(error.message);
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);

      if (data.user) {
        queryClient.setQueryData(["me"], data.user);
      }

      setRegisterUsername("");
      setRegisterEmail("");
      setRegisterPassword("");

      navigate("/home");
    },
    onError: (error) => {
      console.error(error.message);
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  }

  function handleRegisterSubmit(e) {
    e.preventDefault();
    registerMutation.mutate({
      username: registerUsername,
      email: registerEmail,
      password: registerPassword,
    });
  }

  function openRegisterForm() {
    setIsRegisterFormOpen(true);
  }

  function openLoginForm() {
    setIsRegisterFormOpen(false);
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex flex-1 flex-col md:flex-row">
        <section className="relative flex items-center justify-center overflow-hidden bg-[#fcfafd] px-6 py-12 md:flex-7 md:px-16 md:py-0">
          <div className="relative z-10 flex flex-col items-center text-center md:items-start md:text-left">
            <h1
              ref={titleRef}
              className="text-3xl font-medium text-gray-900 opacity-0 md:text-5xl"
            >
              Picverse
            </h1>

            <h2
              ref={textRef}
              className="mt-12 hidden max-w-xl text-5xl leading-tight text-gray-600 md:block"
            ></h2>

            <p className="mt-4 text-base text-gray-600 md:hidden">
              A universe built from your{" "}
              <span className="font-medium text-gray-900">moments...</span>
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center bg-linear-to-b from-[#1a1a1a] to-[#0f0f0f] px-6 py-6 shadow-[-20px_0_40px_rgba(0,0,0,0.2)] md:flex-3 md:px-0 md:py-0">
          <div className="w-full max-w-sm md:px-6">
            {isRegisterFormOpen ? (
              <form
                onSubmit={handleRegisterSubmit}
                className="flex w-full flex-col gap-4"
              >
                <h3 className="text-lg font-medium text-white">
                  Create your Picverse account
                </h3>

                <input
                  type="text"
                  placeholder="Username"
                  required
                  minLength={3}
                  value={registerUsername}
                  onChange={(e) => setRegisterUsername(e.target.value)}
                  className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white placeholder-gray-400 outline-none transition duration-200 focus:border-white"
                />

                <input
                  type="email"
                  placeholder="Email"
                  required
                  minLength={5}
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white placeholder-gray-400 outline-none transition duration-200 focus:border-white"
                />

                <input
                  type="password"
                  placeholder="Password"
                  required
                  minLength={5}
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white placeholder-gray-400 outline-none transition duration-200 focus:border-white"
                />

                <button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="mt-2 w-full rounded-full bg-[#1b4f9c] px-5 py-3 font-medium text-white transition duration-200 hover:scale-[1.01] hover:brightness-110 active:scale-[0.99] disabled:opacity-60"
                >
                  {registerMutation.isPending
                    ? "Creating account..."
                    : "Create account"}
                </button>

                {registerMutation.isError && (
                  <p className="text-sm text-red-400">
                    {registerMutation.error.message}
                  </p>
                )}

                <button
                  type="button"
                  onClick={openLoginForm}
                  className="w-full rounded-full border border-white/10 px-5 py-3 text-white transition duration-200 hover:bg-white/5 active:scale-[0.99]"
                >
                  Back to login
                </button>
              </form>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex w-full flex-col gap-4"
              >
                <h3 className="text-lg font-medium text-white">
                  Log in to Picverse
                </h3>

                <input
                  type="email"
                  placeholder="Email"
                  required
                  minLength={5}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white placeholder-gray-400 outline-none transition duration-200 focus:border-white"
                />

                <input
                  type="password"
                  placeholder="Password"
                  required
                  minLength={5}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white placeholder-gray-400 outline-none transition duration-200 focus:border-white"
                />

                <button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="mt-2 w-full rounded-full bg-[#1b4f9c] px-5 py-3 font-medium text-white transition duration-200 hover:scale-[1.01] hover:brightness-110 active:scale-[0.99] disabled:opacity-60"
                >
                  {loginMutation.isPending ? "Logging in..." : "Log in"}
                </button>

                {loginMutation.isError && (
                  <p className="text-sm text-red-400">
                    {loginMutation.error.message}
                  </p>
                )}

                <p className="mt-2 text-center text-sm text-white">
                  Forgot password?
                </p>

                <button
                  type="button"
                  onClick={openRegisterForm}
                  className="w-full rounded-full border border-[#1b4f9c] px-5 py-3 text-[#1b4f9c] transition duration-200 hover:scale-[1.01] hover:bg-[#1b4f9c]/10 active:scale-[0.99]"
                >
                  Create new account
                </button>
              </form>
            )}
          </div>
        </section>
      </div>

      <footer className="border-t border-black/10 bg-white py-6 text-center">
        <p className="text-sm text-gray-500">© 2026 Picverse. Rahul J Gill.</p>
      </footer>
    </div>
  );
}

export default Login;
