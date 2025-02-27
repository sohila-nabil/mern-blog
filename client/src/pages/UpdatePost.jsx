import React, { useState, useEffect } from "react";
import { TextInput, Select, FileInput, Button, Alert } from "flowbite-react";
import ReactQuill from "react-quill-new";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { url } from "../data";
import "react-quill-new/dist/quill.snow.css";

const UpdatePost = () => {
  const { id } = useParams();
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState(null);
  const { data } = useSelector((state) => state.user.currentUser);
  const [postData, setPostData] = useState({
    userId: data._id,
    title: "",
    category: "",
    content: "",
    image: "",
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPost = async () => {
    try {
      const response = await fetch(`${url}/api/post/getposts?id=${id}`, {
        method: "GET",
        credentials: "include",
      });
      const res = await response.json();
      if (res.posts && res.posts.length > 0) {
        const fetchedPost = res.posts[0];
        console.log("fetchedPost", fetchedPost);
        setPostData({
          ...fetchedPost,
          title: fetchedPost.title || "",
          category: fetchedPost.category || "",
          content: fetchedPost.content || "",
          image: imageFile,
        });
        setImage(fetchedPost.image.url);
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      setError("Error fetching post");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setPostData((prevData) => ({ ...prevData, [id]: value }));
  };

  // const handlePreview = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setPostData((prevData) => ({ ...prevData, image: file }));
  //     const img = URL.createObjectURL(file);
  //     setImage(img);
  //   }
  // };

  const handlePreview = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // Show preview
      setImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(postData).forEach((key) => {
        formData.append(key, postData[key]);
      });
      // formData.append("image", imageFile);
      const response = await fetch(`${url}/api/post/update/${id}`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });
      const res = await response.json();
      if (!res.success) {
        setError(res.message);
        return;
      }
      setError(null);
      console.log(res);
      navigate(`/post/${res.updatedPost.slug}`);
    } catch (error) {
      console.error("Error submitting post:", error);
      setError("Something went wrong");
    }
  };

  if (loading) {
    return <div className="p-3 max-w-3xl mx-auto min-h-screen">Loading...</div>;
  }
  console.log(postData);

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update a Post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            value={postData.title} // always a string
            onChange={handleChange}
          />
          <Select
            id="category"
            onChange={handleChange}
            value={postData.category} // always a string
          >
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput type="file" accept="image/*" onChange={handlePreview} />
        </div>
        {image && !loading && <img src={postData?.image?.url || image} />}
        <ReactQuill
          theme="snow"
          placeholder="Write something amazing..."
          className="h-72 mb-12"
          id="content"
          value={postData.content} // ensure this is always a string
          onChange={(value) =>
            setPostData((prevData) => ({ ...prevData, content: value }))
          }
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Update
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

export default UpdatePost;
