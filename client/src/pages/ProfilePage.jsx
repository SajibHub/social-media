import Layout from "@/layout/Layout.jsx";
import UserInfo from "@/Component/users/UserInfo.jsx";
import postStore from "@/store/postStore.js";
import {useEffect} from "react";
import PostCard from "@/Component/post/PostCard.jsx";
import authorStore from "@/store/authorStore.js";
import {useParams} from "react-router-dom";


const ProfilePage = () => {
    const {user} = useParams();
    const {myPostReq} = postStore()
    const {readProfileReq}= authorStore()

    useEffect(() => {
        (
            async ()=>{
                  await myPostReq();
                  await readProfileReq(user)
            }
        )()
    }, [user]);

    return (
        <Layout>
            <UserInfo />
            <PostCard />

        </Layout>
    );
};

export default ProfilePage;