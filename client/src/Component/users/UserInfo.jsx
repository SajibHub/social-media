import authorStore from "@/store/authorStore.js";
import { MdEmail } from "react-icons/md";
import { IoCallSharp } from "react-icons/io5";
import { FaSquareFacebook } from "react-icons/fa6";
import { IoLogoLinkedin } from "react-icons/io";
import { TbBrandFiverr } from "react-icons/tb";
import { FaGithub, FaSignOutAlt } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import LoadingButtonFit from "@/Component/button/LoadingButtonFit.jsx";
import uiManage from "@/store/uiManage.js";
import VerifiedBadge from "../utility/VerifyBadge.jsx";
import useActiveStore from '../../store/useActiveStore.js'
import { socket } from "../../utils/socket.js";

const UserInfo = () => {
  const { SignOutReq } = authorStore();
  const navigate = useNavigate();
  const { isUserOnline } = useActiveStore();
  const [signOutLoading, setSignOutLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const [logoutModel, setLogoutModel] = useState(false);
  const { user } = useParams();
  const myUser = localStorage.getItem("userName");
  const myId = localStorage.getItem("id");
  const { profileData, flowReq, readProfileReq } = authorStore();
  const { set_profile_tab, profile_tab, set_edit_profile_Ui_Control } = uiManage();

  const openNewWindow = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleMessageClick = (receiverId) => {
    if (!myId) {
      toast.error("You must be logged in to start a chat");
      return;
    }
    if (!socket.connected) {
      socket.connect();
    }
    socket.emit("conversationCreated", { senderId: myId, receiverId });
  };

  const handleLogout = async () => {
    setSignOutLoading(true);
    const res = await SignOutReq();
    localStorage.clear();
    setSignOutLoading(false);
    if (res) {
      navigate("/author");
      toast.success("Log Out Successfully");
    }
  };

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    const handleNewConversation = (newConversation) => {
      navigate(`/message/${newConversation._id}`);
    };

    socket.on("conversationCreated", handleNewConversation);

    return () => {
      socket.off("conversationCreated", handleNewConversation);
    };
  }, [navigate]);

  if (profileData === null || profileData === undefined) {
    return (
      <div className="rounded border border-gray-200 mb-6 animate-pulse">
        {/* Loading Skeleton */}
        <div className="h-[200px] w-full bg-gray-300" />
        <div className="h-[100px] w-[100px] rounded-full bg-gray-300 mx-[25px] mt-[-50px] shadow" />
        <div className="mx-[25px] pb-3 mt-3">
          <div className="h-6 bg-gray-300 rounded w-1/3 mb-2" />
          <div className="h-4 bg-gray-300 rounded w-1/4 mb-4" />
          <div className="flex gap-4">
            <div className="h-4 bg-gray-300 rounded w-16" />
            <div className="h-4 bg-gray-300 rounded w-16" />
            <div className="h-4 bg-gray-300 rounded w-16" />
          </div>
          <div className="mt-4 h-12 bg-gray-200 rounded" />
          <div className="mt-4 flex flex-wrap gap-4">
            <div className="h-4 bg-gray-300 rounded w-32" />
            <div className="h-4 bg-gray-300 rounded w-32" />
          </div>
          <div className="mt-4 flex gap-4">
            <div className="h-8 w-8 bg-gray-300 rounded-full" />
            <div className="h-8 w-8 bg-gray-300 rounded-full" />
            <div className="h-8 w-8 bg-gray-300 rounded-full" />
            <div className="h-8 w-8 bg-gray-300 rounded-full" />
          </div>
        </div>
        <div className="flex gap-3 mt-4 px-4">
          <div className="h-8 w-24 bg-gray-300 rounded" />
          <div className="h-8 w-24 bg-gray-300 rounded" />
          <div className="h-8 w-24 bg-gray-300 rounded" />
          <div className="h-8 w-24 bg-gray-300 rounded" />
          <div className="h-8 w-24 bg-gray-300 rounded" />
        </div>
      </div>
    );
  } else {
    return (
      <div className="rounded border border-gray-200 mb-6">
        <div className="h-[200px] w-full overflow-hidden flex flex-row justify-between items-center shadow">
          <img
            src={profileData.cover}
            alt="Cover Photo"
            className="min-w-full min-h-full"
          />
        </div>
        <div
          className="
          h-[80px] w-[80px] lg:h-[100px] lg:w-[100px] rounded-full flex justify-center items-center mx-[25px] mt-[-40px] lg:mt-[-50px] shadow relative"
        >
          <img
            src={profileData.profile}
            alt="Profile"
            className="min-w-full min-h-full object-cover rounded-full"
          />
          <div
            className={`absolute bottom-1 right-0 h-4 w-4 rounded-full border-2 ${isUserOnline(profileData?._id)
                ? "bg-green-500 border-white"
                : "bg-red-500 border-white"
              } z-10`}
          ></div>
        </div>
        <div className="mx-3 lg:mx-[25px] pb-3 mt-3 relative">
          <h1 className="text-2xl font-medium text-neutral-700 flex items-center gap-1">
            {profileData.fullName}
            {profileData.verify && (
              <VerifiedBadge isVerified={profileData.verify} />
            )}
          </h1>
          {user === myUser ? (
            <div className="absolute top-[-67px] lg:top-0 right-0 flex items-center">
              <button
                onClick={() => set_edit_profile_Ui_Control(true)}
                className="bg-white text-base font-medium text-neutral-700 py-1 px-3 border-2 border-neutral-500 rounded-full hover:text-sky-500 hover:border-sky-500 me-2"
              >
                Edit Profile
              </button>
              <button
                onClick={() => setLogoutModel(true)}
                className="bg-white md:hidden flex items-center text-base font-medium text-neutral-700 py-1 px-3 shadow-md border-2 border-white h-[36px] rounded-full hover:text-sky-500 hover:border-sky-500"
              >
                {signOutLoading ? (
                  <div className="loader-dark"></div>
                ) : (
                  <span className="text-lg font-medium text-gray-600">Logout</span>
                )}
              </button>
            </div>
          ) : (
            <div className="absolute top-0 right-0 flex items-center gap-2">
              <button
                onClick={async () => {
                  setLoader(true);
                  const res = await flowReq(profileData._id);
                  if (res) {
                    await readProfileReq(user);
                    toast.success("Work successfully!");
                  } else {
                    toast.error("Work flow failed!");
                  }
                  setLoader(false);
                }}
                className={`
                  ${!loader &&
                  "text-base font-medium text-neutral-700 py-1 px-3 border-2 border-neutral-500 rounded-full hover:text-sky-500 hover:border-sky-500"
                  }
                  ${profileData.isFollowing &&
                  "bg-sky-500 text-white border-sky-500 hover:bg-transparent"
                  }
                `}
              >
                {loader && <LoadingButtonFit />}
                {loader === false && (profileData.isFollowing ? "Unfollow" : "Follow")}
              </button>
              <button
                onClick={() => handleMessageClick(profileData._id)}
                className="text-base font-medium text-neutral-700 py-1 px-3 border-2 border-neutral-500 rounded-full hover:text-green-500 hover:border-green-500"
              >
                Message
              </button>
            </div>
          )}
          <h3 className="text-base font-normal text-neutral-700">
            {profileData.username}
          </h3>
        </div>

        {/* Contact Info */}
        <div className="p-3 my-3 bg-gray-100 rounded">
          {profileData.bio === "" ? (
            <h1 className="text-sm font-medium text-neutral-700">
              Please add bio
            </h1>
          ) : (
            <h1 className="text-sm font-medium text-neutral-700">
              "{profileData.bio}"
            </h1>
          )}
        </div>

        {/* Social Media Links */}
        <div className="flex flex-wrap justify-start items-center gap-4">
          <div className="flex flex-row justify-start items-center">
            <IoCallSharp className="text-neutral-800" />
            <p className="text-base font-medium ms-1 text-neutral-800">
              {profileData.phone}
            </p>
          </div>
          <div className="flex flex-row justify-start items-center">
            <MdEmail className="text-neutral-800" />
            <p className="text-base font-medium ms-1 text-neutral-800">
              {profileData.email}
            </p>
          </div>
          <div className="flex flex-row justify-center lg:justify-end items-center gap-4 flex-grow">
            {profileData.mediaLink?.facebook && (
              <FaSquareFacebook
                className="font-lg text-neutral-800 cursor-pointer"
                onClick={() => openNewWindow(profileData.mediaLink?.facebook)}
              />
            )}
            {profileData.mediaLink?.linkedin && (
              <IoLogoLinkedin
                className="font-lg text-neutral-800 cursor-pointer"
                onClick={() => openNewWindow(profileData.mediaLink?.linkedin)}
              />
            )}
            {profileData.mediaLink?.github && (
              <FaGithub
                className="font-lg text-neutral-800 cursor-pointer"
                onClick={() => openNewWindow(profileData.mediaLink?.github)}
              />
            )}
            {profileData.mediaLink?.fiver && (
              <TbBrandFiverr
                className="font-lg text-neutral-800 cursor-pointer"
                onClick={() => openNewWindow(profileData.mediaLink.fiver)}
              />
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-row gap-3 w-full overflow-x-auto scroll-bar-hidden cursor-pointer">
          <button
            onClick={() => set_profile_tab("my-post")}
            className={`
              flex-shrink-0
              ${profile_tab === "my-post" ? "profile-tab-active" : "profile-tab"}
            `}
          >
            My Post
          </button>
          <button
            onClick={() => set_profile_tab("post-photo")}
            className={`
              flex-shrink-0
              ${profile_tab === "post-photo" ? "profile-tab-active" : "profile-tab"}
            `}
          >
            Photo
          </button>
          <button
            onClick={() => set_profile_tab("followers")}
            className={`
              flex-shrink-0
              ${profile_tab === "followers" ? "profile-tab-active" : "profile-tab"}
            `}
          >
            Followers
          </button>
          <button
            onClick={() => set_profile_tab("following")}
            className={`
              flex-shrink-0
              ${profile_tab === "following" ? "profile-tab-active" : "profile-tab"}
            `}
          >
            Following
          </button>
          <button
            onClick={() => set_profile_tab("about")}
            className={`
              flex-shrink-0
              ${profile_tab === "about" ? "profile-tab-active" : "profile-tab"}
            `}
          >
            About
          </button>
        </div>

        {/* Logout Modal */}
        {logoutModel && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
              <h2 className="text-xl font-semibold text-center mb-4">
                Are you sure you want to log out?
              </h2>
              <div className="flex justify-between">
                <button
                  onClick={() => setLogoutModel(false)}
                  className="bg-gray-300 text-neutral-700 py-2 px-4 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
};

export default UserInfo;
