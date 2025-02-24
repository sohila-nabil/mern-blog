import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { url } from "../data";
import { Table } from "flowbite-react";
import { Link } from "react-router-dom";
const DashPost = () => {
  const { data } = useSelector((state) => state.user.currentUser);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);

  const fetchPosts = async () => {
    try {
      const response = await fetch(
        `${url}/api/post/getposts?userId=${data._id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const res = await response.json();
      setUserPosts(res.posts);
      if (res.posts.length < 9) {
        setShowMore(false);
      }
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const response = await fetch(
        `${url}/api/post/getposts?userId=${data._id}&startIndex=${startIndex}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const res = await response.json();
      setUserPosts((prev) => [...prev, ...res.posts]);
      if (res.posts.length < 9) {
        setShowMore(false);
      }
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (data.isAdmin) {
      fetchPosts();
    }
  }, [data._id]);
  console.log(userPosts);
  return (
    <div
      className="overflow-x-auto md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500"
      style={{ scrollbarColor: "gray" }}
    >
      {data?.isAdmin && userPosts?.length > 0 ? (
        <div>
          <Table hoverable className="shadow-md min-w-[610px]">
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {userPosts.map((post) => (
              <Table.Body className="divide-y" key={post._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image.url}
                        alt={post.title}
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="font-medium text-gray-900 dark:text-white"
                      to={`/post/${post.slug}`}
                    >
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    <span className="font-medium text-red-500 hover:underline cursor-pointer">
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="text-teal-500 hover:underline"
                      to={`/update-post/${post._id}`}
                    >
                      <span>Edit</span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7 hover:underline"
            >
              Show more
            </button>
          )}
        </div>
      ) : (
        <p>You have no Posts Yet</p>
      )}
    </div>
  );
};

export default DashPost;
