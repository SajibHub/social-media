import { useNavigate, useParams } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import { FaAngleLeft, FaChevronRight } from "react-icons/fa";
import StoryStore from "@/store/StoryStore.js";
import { CiMenuKebab } from "react-icons/ci";
import VerifiedBadge from "../utility/VerifyBadge";
import { AiFillDelete } from "react-icons/ai";

const PreviewStoryComponent = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const initialUserIndex = Math.max(0, parseInt(id) || 0);

    const { StoryData, StoryReq, clearStoreData } = StoryStore();
    const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex);
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [popupMenu, setPopupMenu] = useState(false)
    const popupRef = useRef(null);

    useEffect(() => {
        const fetchStories = async () => {
            await clearStoreData();
            await StoryReq();
        };
        fetchStories();
    }, [StoryReq, clearStoreData]);

    useEffect(() => {
        if (StoryData?.length > 0) {
            const boundedUserIndex = Math.min(initialUserIndex, StoryData.length - 1);
            setCurrentUserIndex(boundedUserIndex);
            setCurrentStoryIndex(0);
            setProgress(0);
        }
    }, [StoryData, initialUserIndex]);

    useEffect(() => {
        if (!StoryData?.length || popupMenu) return;

        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    handleNext();
                    return 0;
                }
                return prev + (100 / 60);
            });
        }, 100);

        return () => clearInterval(timer);
    }, [currentUserIndex, currentStoryIndex, StoryData, popupMenu]);


    const handleNext = () => {
        if (!StoryData?.length) return;
        setPopupMenu(false); // Close popup when changing story
        const currentUserStories = StoryData[currentUserIndex].stories;
        if (currentStoryIndex < currentUserStories.length - 1) {
            setCurrentStoryIndex(currentStoryIndex + 1);
        } else if (currentUserIndex < StoryData.length - 1) {
            setCurrentUserIndex(currentUserIndex + 1);
            setCurrentStoryIndex(0);
            navigate(`/story/${currentUserIndex + 1}`);
        }
        setProgress(0);
    };

    const handlePrev = () => {
        if (!StoryData?.length) return;
        setPopupMenu(false); // Close popup when changing story
        if (currentStoryIndex > 0) {
            setCurrentStoryIndex(currentStoryIndex - 1);
        } else if (currentUserIndex > 0) {
            setCurrentUserIndex(currentUserIndex - 1);
            setCurrentStoryIndex(StoryData[currentUserIndex - 1].stories.length - 1);
            navigate(`/story/${currentUserIndex - 1}`);
        }
        setProgress(0);
    };

    const handleStoryChange = (index) => {
        setPopupMenu(false);
        setCurrentStoryIndex(index);
        setProgress(0);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setPopupMenu(false);
            }
        };

        if (popupMenu) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [popupMenu]);



    if (!StoryData || StoryData.length === 0) {
        return (
            <div className="h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
                <div className="w-full max-w-md h-[85vh] bg-gray-800/50 rounded-2xl animate-pulse overflow-hidden">
                    <div className="h-2 bg-gray-700/50 rounded-full m-4"></div>
                    <div className="flex items-center gap-3 p-4">
                        <div className="w-12 h-12 bg-gray-700/50 rounded-full"></div>
                        <div className="flex-1 h-4 bg-gray-700/50 rounded"></div>
                    </div>
                    <div className="h-[calc(100%-8rem)] bg-gray-700/50"></div>
                </div>
            </div>
        );
    }

    const currentUser = StoryData[currentUserIndex] || {};
    const currentStory = currentUser.stories?.[currentStoryIndex] || {};
    const prevStory = currentUserIndex > 0 || currentStoryIndex > 0
        ? (currentStoryIndex > 0
            ? currentUser.stories[currentStoryIndex - 1]
            : StoryData[currentUserIndex - 1]?.stories[StoryData[currentUserIndex - 1].stories.length - 1])
        : null;
    const nextStory = currentUserIndex < StoryData.length - 1 || currentStoryIndex < currentUser.stories?.length - 1
        ? (currentStoryIndex < currentUser.stories.length - 1
            ? currentUser.stories[currentStoryIndex + 1]
            : StoryData[currentUserIndex + 1]?.stories[0])
        : null;

    return (
        <div className="h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center relative overflow-hidden">
            {prevStory && (
                <div className="absolute left-0 top-0 h-full w-1/3 opacity-30 pointer-events-none transform -translate-x-1/4 transition-opacity duration-300">
                    <img
                        src={prevStory.image}
                        alt="Previous"
                        className="w-full h-full object-cover rounded-l-2xl"
                    />
                </div>
            )}
            {nextStory && (
                <div className="absolute right-0 top-0 h-full w-1/3 opacity-30 pointer-events-none transform translate-x-1/4 transition-opacity duration-300">
                    <img
                        src={nextStory.image}
                        alt="Next"
                        className="w-full h-full object-cover rounded-r-2xl"
                    />
                </div>
            )}

            <div className="w-full max-w-md h-[85vh] relative flex flex-col rounded-2xl overflow-hidden shadow-xl">
                <div className="absolute top-4 left-0 right-0 flex gap-2 px-6 z-20">
                    {currentUser.stories?.map((_, index) => (
                        <div
                            key={index}
                            className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden cursor-pointer"
                            onClick={() => handleStoryChange(index)}
                        >
                            <div
                                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-100 ease-linear"
                                style={{
                                    width: index < currentStoryIndex ? '100%' :
                                        index === currentStoryIndex ? `${progress}%` : '0%'
                                }}
                            />
                        </div>
                    ))}
                </div>

                <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent z-10">
                    <div className="flex items-center gap-3 mt-2 ml-2">
                        <img
                            src={currentUser.profile || ""}
                            alt="Profile"
                            className="w-12 h-12 rounded-full border-2 border-blue-500/50 object-cover shadow-md"
                        />
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1">
                                <span className="text-white font-semibold text-sm">{currentUser.fullName || "Unknown"}</span>
                                <VerifiedBadge isVerified={currentUser.verify || false} />
                            </div>
                            <span className="text-white/60 text-xs">{currentStory.time || ""}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <CiMenuKebab onClick={() => {
                            const story = StoryData[id]
                            if (story?.isMyStory) {
                                setPopupMenu(true)
                            }
                        }
                        } className="text-white text-xl cursor-pointer hover:text-blue-400 transition-colors" />
                        <IoMdClose
                            className="text-white text-2xl cursor-pointer hover:text-blue-400 transition-colors"
                            onClick={() => navigate('/')}
                        />
                    </div>
                </div>

                <div className="flex-1 relative">
                    <img
                        src={currentStory.image || ""}
                        alt="Story"
                        className="w-full h-full object-cover transition-opacity duration-300"
                    />
                    {currentStory.text && (
                        <div className="absolute bottom-6 left-0 right-0 text-center px-4">
                            <span className="text-white text-xl font-medium px-4 py-2 bg-black/70 rounded-xl shadow-lg">
                                {currentStory.text}
                            </span>
                        </div>
                    )}

                    <div className="absolute inset-0 flex">
                        <div
                            className="w-1/3 h-full cursor-pointer"
                            onClick={handlePrev}
                        />
                        <div className="w-1/3 h-full" />
                        <div
                            className="w-1/3 h-full cursor-pointer"
                            onClick={handleNext}
                        />
                    </div>
                </div>

                {prevStory && (
                    <button
                        onClick={handlePrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-3 rounded-full hover:bg-black/70 transition-all shadow-md hover:text-blue-400"
                    >
                        <FaAngleLeft className="text-white text-2xl" />
                    </button>
                )}
                {nextStory && (
                    <button
                        onClick={handleNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-3 rounded-full hover:bg-black/70 transition-all shadow-md hover:text-blue-400"
                    >
                        <FaChevronRight className="text-white text-2xl" />
                    </button>
                )}
                {popupMenu && (
                    <div
                        ref={popupRef}
                        className="absolute z-50 right-0 mt-2 w-56 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition-all duration-200 ease-in-out transform scale-95 hover:scale-100 group"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="menu-button"
                    >
                        <div className="py-2">
                            <>
                                <button
                                    onClick={() => {

                                    }}
                                    className="flex items-center w-full px-4 py-2 text-sm text-neutral-800 hover:bg-red-50 hover:text-red-500 rounded-md transition duration-200 ease-in-out"
                                >
                                    <AiFillDelete className="mr-2 text-lg" /> Delete Post
                                </button>
                            </>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PreviewStoryComponent;