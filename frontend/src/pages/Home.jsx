import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

import image1 from "../assets/image1.jpg";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/image3.jpg";

import { FiUser, FiHeart, FiMessageCircle } from "react-icons/fi";

function Home() {
  const posts = [
    {
      id: 1,
      username: "rahulgill29",
      image: image1,
      likes: 128,
      comments: 14,
    },
    {
      id: 2,
      username: "travelwithmia",
      image: image2,
      likes: 342,
      comments: 27,
    },
    {
      id: 3,
      username: "devlife",
      image: image3,
      likes: 89,
      comments: 6,
    },
    {
      id: 4,
      username: "rahulgill29",
      image: image1,
      likes: 128,
      comments: 14,
    },
    {
      id: 5,
      username: "travelwithmia",
      image: image2,
      likes: 342,
      comments: 27,
    },
    {
      id: 6,
      username: "devlife",
      image: image3,
      likes: 89,
      comments: 6,
    },
  ];

  const iconButtonStyle =
    "flex items-center justify-center transition duration-200 ease-in-out hover:scale-110 hover:opacity-70 active:scale-95";

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-6 gap-y-10 px-6 py-10 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            to={`/post/${post.id}`}
            key={post.id}
            className="group flex flex-col transition duration-200 hover:scale-[1.02] cursor-pointer"
          >
            <div className="overflow-hidden ">
              <img
                src={post.image}
                alt={post.username}
                className="h-[400px] w-full object-cover transition duration-300 group-hover:brightness-95"
              />
            </div>

            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className={`${iconButtonStyle} h-10 w-10 rounded-full bg-black/5`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <FiUser className="text-base text-black" />
                </button>

                <div>
                  <h3 className="text-base font-semibold text-black">
                    {post.username}
                  </h3>
                  <p className="text-sm text-gray-400">x hrs ago</p>
                </div>
              </div>

              <div className="flex items-center gap-5 text-base text-black">
                <div className="flex items-center gap-2">
                  <span>{post.likes}</span>
                  <button
                    type="button"
                    className={iconButtonStyle}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <FiHeart className="text-lg" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span>{post.comments}</span>
                  <button
                    type="button"
                    className={iconButtonStyle}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <FiMessageCircle className="text-lg" />
                  </button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <button
        type="button"
        className="fixed bottom-6 right-10 z-50 flex h-14 w-14 items-center justify-center rounded-xl bg-black text-white shadow-lg transition duration-200 ease-in-out hover:scale-105 hover:brightness-110 active:scale-95"
      >
        <span className="text-3xl leading-none translate-y-[-1px]">+</span>
      </button>
    </div>
  );
}

export default Home;
