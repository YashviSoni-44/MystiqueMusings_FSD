// import { Link } from "react-router-dom";
// import { getDay } from "../common/date";
// import FavoriteIcon from '@mui/icons-material/Favorite';

// const BlogPostCard=({content, author})=>{

//     let {publishedAt, tags, title, des, banner, activity:{total_likes}, blog_id:id}=content;
//     let {fullname, profile_img, username}=author;

//     return (
//         <Link to={`/blogs/${id}`} className="flex gap-8 items-center border-b border-grey pb-5 mb-4">
//         <div className="w-full">
//             <div className="flex gap-2 items-center mb-7">
//                 <img src={profile_img} className="w-6 h-6 rounded-full"/>
//                 <p className="line-clamp-1">{fullname} @{username}</p>
//                 <p className="min-w-fit">{getDay(publishedAt)}</p>
//             </div>

//             <h1 className="blog-title">{title}</h1>
//             <p className="my-3 text-xl font-gelasio leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2">{des}</p>

//             <div className="flex gap-2">
//                 <span className="btn-light py-1 px-4">{tags[0]}</span>
//                 <span className="ml-3 flex items-center gap-2 text-dark-grey">
//                     <FavoriteIcon style={{color:"red"}} className="text-xl"/>
//                     {total_likes}
//                 </span>
//             </div>
//         </div>

//         <div className="h-28 ascpect-video bg-grey">
//             <img src={banner} className="w-full h-full aspect-video object-cover "/>
//         </div>
//         </Link>
//     )
// }

// export default BlogPostCard;

import { Link } from "react-router-dom";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { getDay } from "../common/date";

const BlogPostCard = ({ content, author }) => {
  let { publishedAt, tags, title, des, banner, activity: { total_likes }, blog_id: id } = content;
  let { fullname, profile_img, username } = author;

  return (
    <Link to={`/blogs/${id}`} className="flex gap-8 items-center border-b border-grey pb-5 mb-4">
      <div className="w-full">
        <div className="flex gap-2 items-center mb-7">
          <img src={profile_img} className="w-6 h-6 rounded-full" alt={`${fullname}'s profile`} />
          <p className="line-clamp-1">{fullname} @{username}</p>
          <p className="min-w-fit">{getDay(publishedAt)}</p>
        </div>

        <h1 className="blog-title">{title}</h1>
        <p className="my-3 text-xl font-gelasio leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2">{des}</p>

        <div className="flex gap-2">
          <span className="btn-light py-1 px-4">{tags[0]}</span>
          <span className="ml-3 flex items-center gap-2 text-dark-grey">
            <FavoriteIcon style={{ color: "red" }} className="text-xl" />
            {total_likes}
          </span>
        </div>
      </div>

      <div className="w-56 bg-grey"> {/* Adjust the width as needed */}
        <img src={banner} className="w-full h-auto object-cover" alt="Blog Banner" />
      </div>
    </Link>
  );
};

export default BlogPostCard;
