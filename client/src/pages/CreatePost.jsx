import React, { useState, useRef } from "react";
import { TextInput, Select, FileInput, Button, Alert } from "flowbite-react";
import ReactQuill, { Quill } from "react-quill-new";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { url } from "../data";
import "react-quill-new/dist/quill.snow.css";

const CreatePost = () => {
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const { data } = useSelector((state) => state.user.currentUser);
  const [postData, setPostData] = useState({
    title: "",
    category: "",
    content: "",
    userId: data._id,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setPostData({ ...postData, [id]: value });
  };
  const handlePreview = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPostData({ ...postData, image: file });
      let img = URL.createObjectURL(file);
      setImage(img);
    }
  };
  console.log(postData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
       Object.keys(postData).forEach((key) => {
         formData.append(key, postData[key]);
       });
      const response = await fetch(`${url}/api/post/create`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const res = await response.json();
      if (!res.success) {
        setError(res.message);
        return;
      }
      console.log(res);
      setError(null);
      navigate(`/post/${res.newPost.slug}`);
    } catch (error) {
      console.log(error);
      setError("Something went wrong");
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            value={postData.title}
            onChange={handleChange}
          />
          <Select id="category" onChange={handleChange}>
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput type="file" accept="image/*" onChange={handlePreview} />
        </div>
        {image && (
          <img
            src={image}
            alt="preview"
            className="w-full h-72 object-cover rounded-lg"
          />
        )}
        <ReactQuill
          theme="snow"
          placeholder="Write something amazing..."
          className="h-72 mb-12"
          id="content"
          value={postData.content}
          onChange={(value) => setPostData({ ...postData, content: value })}
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Publish
        </Button>
      </form>
      {error && (
        <Alert type="error" color="failure">
          {error}
        </Alert>
      )}
    </div>
  );
};

export default CreatePost;
