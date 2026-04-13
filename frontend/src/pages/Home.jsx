import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  FiUser,
  FiHeart,
  FiMessageCircle,
  FiImage,
  FiArrowLeft,
} from "react-icons/fi";

async function createPost({ image, caption, token }) {
  const formData = new FormData();
  formData.append("image", image);
  formData.append("caption", caption);

  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    const firstError = data.errors && Object.values(data.errors)[0]?.[0];

    throw new Error(firstError || data.message || "Post creation failed");
  }

  return data;
}

async function fetchPosts() {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts`, {
    headers: {
      Accept: "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch posts");
  }

  return data;
}

function Home() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [caption, setCaption] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData(["me"]);

  const {
    data: posts = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  function openForm() {
    setIsFormOpen(true);
    setSuccessMessage("");
  }

  function closeForm() {
    setIsFormOpen(false);
    setSelectedImage(null);
    setImagePreview("");
    setCaption("");
    setSuccessMessage("");
  }

  function handleImageChange(e) {
    const file = e.target.files[0];

    if (!file) return;

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    setSuccessMessage("");
  }

  function clearSelectedImage() {
    setSelectedImage(null);
    setImagePreview("");
    setCaption("");
    setSuccessMessage("");
  }

  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      setSuccessMessage("Post created successfully.");
      setSelectedImage(null);
      setImagePreview("");
      setCaption("");

      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  function handleCreatePost(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!selectedImage) return;

    createPostMutation.mutate({
      image: selectedImage,
      caption,
      token,
    });
  }

  const iconButtonStyle =
    "flex items-center justify-center transition duration-200 ease-in-out hover:scale-110 hover:opacity-70 active:scale-95";

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {isLoading && (
        <div className="px-6 py-10 text-center text-gray-500">
          Loading posts...
        </div>
      )}

      {isError && (
        <div className="px-6 py-10 text-center text-red-500">
          {error.message}
        </div>
      )}

      {!isLoading && !isError && (
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-6 gap-y-10 px-6 py-10 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              to={`/post/${post.id}`}
              key={post.id}
              className="group flex cursor-pointer flex-col transition duration-200 hover:scale-[1.02]"
            >
              <div className="overflow-hidden">
                <img
                  src={post.image_url}
                  alt={post.user?.username || "Post"}
                  className="h-100 w-full object-cover transition duration-300 group-hover:brightness-95"
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
                      {post.user?.username || "Unknown user"}
                    </h3>
                    <p className="text-sm text-gray-400">{post.uploaded_ago}</p>
                  </div>
                </div>

                <div className="flex items-center gap-5 text-base text-black">
                  <div className="flex items-center gap-2">
                    <span>{post.likes_count ?? 0}</span>
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
                    <span>{post.comments_count ?? 0}</span>
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
      )}

      {isFormOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={closeForm}
        >
          <div
            className="relative flex h-[85vh] w-[95vw] max-w-6xl flex-col overflow-hidden bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {!imagePreview ? (
              <>
                <div className="relative flex items-center justify-center border-b border-black/10 px-6 py-4">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="absolute right-6 text-2xl text-gray-500 transition duration-200 hover:scale-110 hover:text-black"
                  >
                    ✕
                  </button>

                  <h2 className="text-lg font-semibold text-black">
                    Create new post
                  </h2>
                </div>

                <form className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
                  <FiImage className="text-6xl text-gray-400" />

                  <p className="text-xl text-gray-800">
                    Drag photos and videos here
                  </p>

                  <label
                    htmlFor="fileUpload"
                    className="cursor-pointer rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition duration-200 hover:brightness-110 active:scale-95"
                  >
                    Select from computer
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    id="fileUpload"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </form>
              </>
            ) : (
              <>
                <div className="relative flex items-center justify-center border-b border-black/10 px-6 py-4">
                  <button
                    type="button"
                    onClick={clearSelectedImage}
                    className="absolute left-6 flex items-center justify-center text-2xl text-black transition duration-200 hover:scale-110 hover:opacity-70"
                  >
                    <FiArrowLeft />
                  </button>

                  <h2 className="text-lg font-semibold text-black">
                    Create new post
                  </h2>

                  <button
                    type="button"
                    onClick={handleCreatePost}
                    disabled={createPostMutation.isPending}
                    className="absolute right-6 text-sm font-semibold text-blue-600 transition duration-200 hover:opacity-70 disabled:opacity-50"
                  >
                    {createPostMutation.isPending ? "Sharing..." : "Share"}
                  </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                  <div className="flex flex-1 items-center justify-center bg-black">
                    <img
                      src={imagePreview}
                      alt="Selected preview"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex w-95 flex-col border-l border-black/10 bg-white">
                    <div className="flex items-center gap-3 border-b border-black/10 px-4 py-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5">
                        <FiUser className="text-base text-black" />
                      </div>

                      <span className="text-sm font-semibold text-black">
                        {currentUser?.username || "rahul.j.gill"}
                      </span>
                    </div>

                    <div className="flex-1 p-4">
                      <textarea
                        placeholder="Write a caption..."
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        maxLength={2200}
                        className="h-full w-full resize-none border-none text-sm text-black outline-none"
                      />
                    </div>

                    <div className="px-4 pb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {caption.length}/2200
                        </span>

                        {createPostMutation.isError && (
                          <span className="text-sm text-red-500">
                            {createPostMutation.error.message}
                          </span>
                        )}

                        {successMessage && (
                          <span className="text-sm text-green-600">
                            {successMessage}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <button
        type="button"
        className="fixed bottom-6 right-10 z-50 flex h-14 w-14 items-center justify-center rounded-xl bg-black text-white shadow-lg transition duration-200 ease-in-out hover:scale-105 hover:brightness-110 active:scale-95"
        onClick={openForm}
      >
        <span className="text-3xl leading-none -translate-y-px">+</span>
      </button>
    </div>
  );
}

export default Home;
