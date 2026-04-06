import { useEffect, useRef } from "react";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(TextPlugin);

function App() {
  const textRef = useRef(null);
  const titleRef = useRef(null);

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

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex flex-1 flex-col md:flex-row">
        {/* LEFT PANEL ON DESKTOP */}
        <section className="relative flex items-center justify-center bg-[#fcfafd] px-6 py-12 overflow-hidden md:flex-7 md:px-16 md:py-0">
          <div className="relative z-10 flex flex-col items-center text-center md:items-start md:text-left">
            <h1
              ref={titleRef}
              className="text-3xl md:text-5xl font-medium text-gray-900 opacity-0"
            >
              Picverse
            </h1>

            <h2
              ref={textRef}
              className="hidden md:block mt-12 text-5xl leading-tight text-gray-600 max-w-xl"
            ></h2>

            <p className="mt-4 text-base text-gray-600 md:hidden">
              A universe built from your{" "}
              <span className="text-gray-900 font-medium">moments...</span>
            </p>
          </div>
        </section>

        {/* FORM PANEL */}
        <section
          className="bg-linear-to-b from-[#1a1a1a] to-[#0f0f0f]
          shadow-[-20px_0_40px_rgba(0,0,0,0.2)]
          flex items-center justify-center px-6 py-6 md:flex-3 md:px-0 md:py-0"
        >
          <div className="w-full max-w-sm md:px-6">
            <form className="flex flex-col gap-4 w-full">
              <h3 className="text-white text-lg font-medium">
                Log in to Picverse
              </h3>

              <input
                type="text"
                placeholder="Email"
                required
                minLength={5}
                className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white placeholder-gray-400 outline-none transition duration-200 focus:border-white"
              />

              <input
                type="password"
                placeholder="Password"
                required
                minLength={5}
                className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white placeholder-gray-400 outline-none transition duration-200 focus:border-white"
              />

              <button
                type="submit"
                className="mt-2 w-full rounded-full bg-[#1b4f9c] px-5 py-3 text-white font-medium transition duration-200 hover:brightness-110 hover:scale-[1.01] active:scale-[0.99]"
              >
                Log in
              </button>

              <p className="mt-2 text-center text-sm text-white">
                Forgot password?
              </p>

              <button
                type="button"
                className="w-full rounded-full border border-[#1b4f9c] px-5 py-3 text-[#1b4f9c] transition duration-200 hover:bg-[#1b4f9c]/10 hover:scale-[1.01] active:scale-[0.99]"
              >
                Create new account
              </button>
            </form>
          </div>
        </section>
      </div>

      <footer className="bg-white text-center py-6 border-t border-black/10">
        <p className=" text-sm text-gray-500">© 2026 Picverse. Rahul J Gill.</p>
      </footer>
    </div>
  );
}

export default App;
