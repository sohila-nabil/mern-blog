import { TextInput, Button, Alert, Modal } from "flowbite-react";
import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { url } from "../data";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFail,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFail,
  signoutSuccess,
} from "../redux/user/userSlice";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const DashProfile = () => {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [showModal, setShowModal] = useState(false);
  const [imagePreview, setImagePreview] = useState(
    currentUser.data.profilePicture.url || currentUser.data.profilePicture
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [userData, setUserData] = useState({
    username: currentUser.data.username,
    email: currentUser.data.email,
    password: "",
  });
  const [meg, setMsg] = useState("");
  const fileInput = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleImagePrev = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const img = URL.createObjectURL(file);
      setImagePreview(img);
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

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const formData = new FormData();
      formData.append("name", userData.username);
      formData.append("email", userData.email);
      formData.append("password", userData.password);
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const response = await fetch(
        `${url}/api/user/update/${currentUser.data._id}`,
        {
          method: "PUT",
          credentials: "include",
          body: formData,
        }
      );
      const data = await response.json();
      if (!data.success) {
        console.log(data);
        dispatch(updateUserFail(data.message));
        return;
      }
      console.log(data);
      dispatch(updateUserSuccess(data));
      setMsg(data.message);
    } catch (error) {
      console.log(error);
      dispatch(updateUserFail(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      const response = await fetch(`${url}/api/auth/sign-out`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (!data.success) {
        return;
      }
      dispatch(signoutSuccess());
      navigate("/sign-in");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const response = await fetch(
        `${url}/api/user/delete/${currentUser.data._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (!data.success) {
        dispatch(deleteUserFail(data.message));
        return;
      }
      dispatch(deleteUserSuccess());
      navigate("/sign-in");
    } catch (error) {
      dispatch(deleteUserFail(error.message));
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            src={imagePreview}
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
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.data.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="password"
          onChange={handleChange}
        />
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          disabled={loading}
        >
          {loading ? "Loading..." : "Update"}
        </Button>
        {currentUser.data.isAdmin && (
          <Link to={"/create-post"}>
            <Button
              type="button"
              gradientDuoTone="purpleToPink"
              className="w-full"
            >
              Create a Post
            </Button>
          </Link>
        )}
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span onClick={() => setShowModal(true)} className="cursor-pointer">
          Delete Account
        </span>
        <span onClick={handleSignout} className="cursor-pointer">
          Sign Out
        </span>
      </div>
      {meg && (
        <Alert className="mt-4 text-center" color="success">
          {meg}
        </Alert>
      )}
      {error && (
        <Alert className="mt-4 text-center" color="failure">
          {error}
        </Alert>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
        className="mx-auto"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashProfile;
