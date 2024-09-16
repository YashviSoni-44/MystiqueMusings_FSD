import { useContext, useEffect } from "react";
import { BlogContext } from "../pages/blog.page";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import { Link } from "react-router-dom";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { UserContext } from "../App";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";

const BlogInteraction=()=>{
    const encodeMessage = (message) => {
        return encodeURIComponent(message);
    };

    let {blog, blog:{_id, title, blog_id, activity, activity:{total_likes, total_comments}, author:{personal_info:{username:author_username}} }, setBlog, isLikedByUser, setLikedByUser, setCommentsWrapper}=useContext(BlogContext);

    let {userAuth:{username, access_token}}=useContext(UserContext)

    useEffect(()=>{
        if(access_token){
            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/isliked-by-user",{_id},{
                headers:{
                    'Authorization':`Bearer ${access_token}`
                }
            })
            .then(({data:{result}})=>{
                setLikedByUser(Boolean(result))
            })
            .catch(err=>{
                console.log(err)
            })
        }
    },[_id, access_token])

    // const handleLike=()=>{
    //     if(access_token){
    //         setLikedByUser(preVal => !preVal);
    //         !isLikedByUser ? total_likes++ : total_likes--;
    //         setBlog({...blog, activity:{...activity, total_likes}})
    //         axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/like-blog",{_id, isLikedByUser},{
    //             headers:{
    //                 'Authorization':`Bearer ${access_token}`
    //             }
    //         })
    //         .then(({data})=>{
    //             console.log(data)
    //         })
    //         .catch(err=>{
    //             console.log(err)
    //         })
    //     }
    //     else{
    //         toast.error("Please login to like this blog")
    //     }
    // }

    const handleLike = () => {
    if (access_token) {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/like-blog", { _id, isLikedByUser }, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
        .then(({ data }) => {
            setLikedByUser(data.liked_by_user);
            const newTotalLikes = data.liked_by_user ? total_likes + 1 : total_likes - 1;
            setBlog({ ...blog, activity: { ...activity, total_likes: newTotalLikes } });
        })
        .catch(err => {
            console.log(err);
            toast.error("An error occurred while processing your request.");
        });
    } else {
        toast.error("Please login to like this blog");
    }
}


    return (
        <>
            <Toaster/>
            <hr className="border-grey my-2"/>

            <div className="flex gap-6 justify-between">
                <div className="flex gap-3 items-center">
                    <button onClick={handleLike} className={"w-10 h-10 rounded-full flex items-center justify-center bg-grey/80"}>
                        {!isLikedByUser ? <FavoriteBorderIcon/> : <FavoriteIcon className="text-red border-black"/>}
                        
                    </button>
                    <p className="text-xl text-dark-grey">{total_likes}</p>

                    <button onClick={() => setCommentsWrapper(preVal=>!preVal)} className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80">
                        <CommentIcon/>
                    </button>
                    <p className="text-xl text-dark-grey">{total_comments}</p>
                </div>
                

                <div className="flex gap-6 items-center">

                    {
                        username==author_username ?
                        <Link to={`/editor/${blog_id}`} className="underline hover:text-purple">Edit</Link>
                        :""
                    }

                    <Link
                        to={`https://api.whatsapp.com/send?text=${encodeMessage(
                            `Read the following blog on Mystique Musings website:\n${title}\n${location.href}`
                        )}`}
                        >
                        <WhatsAppIcon className="text-xl hover:text-whatsapp" />
                    </Link>
                </div>
            </div>

            <hr className="border-grey my-2"/>
        </>
    )
}

export default BlogInteraction;