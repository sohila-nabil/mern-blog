import { TextInput, Button } from "flowbite-react";
import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";

const DashProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [image, setImage] = useState(
    currentUser.data.profilePicture.url || currentUser.data.profilePicture
  );
  const fileInput = useRef(null);

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleImagePrev = (e) => {
    const file = e.target.files[0];
    if (file) {
      const img = URL.createObjectURL(file);
      setImage(img);
      setUploading(true);
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setUploading(false);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  const handleSignout = () => {
    // Implement signout logic here
  };
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4">
        <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full">
          <input
            type="file"
            accept="image/*"
            id="profilePicture"
            className="hidden"
            ref={fileInput}
            onChange={handleImagePrev}
          />
          <img
            src={image}
            onClick={() => fileInput.current.click()}
            className="rounded-full w-full h-full object-cover border-8 border-[lightgray]"
            alt="user"
          />
          {uploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 bg-opacity-75">
              {/* Spinner */}
              <svg
                className="animate-spin h-8 w-8 text-purple-500 mb-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              {/* Progress Bar */}
              <div className="w-20 bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-purple-500 h-2.5 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="mt-2 text-sm text-gray-600">{progress}%</p>
            </div>
          )}
        </div>
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.data.username}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.data.email}
        />
        <TextInput type="password" id="password" placeholder="password" />
        <Button type="submit" gradientDuoTone="purpleToBlue" outline>
          Update
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer">Delete Account</span>
        <span onClick={handleSignout} className="cursor-pointer">
          Sign Out
        </span>
      </div>
    </div>
  );
};

export default DashProfile;
