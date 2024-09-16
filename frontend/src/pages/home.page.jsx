import axios from "axios"
import AnimationWrapper from "../common/page-animation"
import InPageNavigation from "../components/inpage-navigation.component"
import { useEffect, useState } from "react"
import Loader from "../components/loader.component"
import BlogPostCard from "../components/blog-post.component"
import MinimalBlogPost from "../components/nobanner-blog-post.component"
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {activeTabRef} from '../components/inpage-navigation.component'
import NoDataMessage from "../components/nodata.component"
import { filterPaginationData } from "../common/filter-pagination-data"
import LoadMoreDataBtn from "../components/load-more.component"
// import { Cursor } from 'react-creative-cursor';
// import 'react-creative-cursor/dist/styles.css';
// import icon from '../imgs/icon.png'

const HomePage=()=>{

    let [blogs, setBlog]=useState(null);
    let [trendingBlogs, setTrendingBlog]=useState(null);
    let [pageState, setPageState]=useState("home");
    
    let categories = ["wallpaper","dawn","rise","growth","easy","motivation","work","plant","extra"]

    const fetchLatestBlogs=({page=1})=>{
        axios.post(import.meta.env.VITE_SERVER_DOMAIN+"/latest-blogs",{page})
        .then(async ({data})=>{
            
            let formatedData= await filterPaginationData({
                state: blogs,
                data: data.blogs,
                page,
                countRoute: "/all-latest-blogs-count"
            })

            setBlog(formatedData)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const fetchTrendingBlogs=()=>{
        axios.get(import.meta.env.VITE_SERVER_DOMAIN+"/trending-blogs")
        .then(({data})=>{
            setTrendingBlog(data.blogs)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const loadBlogByCategory = (e) =>{
        let category = e.target.innerText.toLowerCase();
        setBlog(null);
        if(pageState==category){
            setPageState("home")
            return;
        }
        setPageState(category);
    }

    const fetchBlogsByCategory = ({page=1}) =>{
        axios.post(import.meta.env.VITE_SERVER_DOMAIN+"/search-blogs",{tag:pageState, page})
        .then(async({data})=>{
            let formatedData= await filterPaginationData({
                state: blogs,
                data: data.blogs,
                page,
                countRoute: "/search-blogs-count",
                data_to_send:{tag: pageState}
            })

            setBlog(formatedData)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    useEffect(()=>{

        activeTabRef.current.click()

        if(pageState=="home"){
            fetchLatestBlogs({page:1});
        }
        else{
            fetchBlogsByCategory({page:1})
        }
        if(!trendingBlogs){
            fetchTrendingBlogs();
        }
        
    },[pageState])

    return(
        <>
        {/* <Cursor isGelly={true}/> */}
        {/* data-cursor-magnetic data-cursor-background-image={icon} data-cursor-size="200px" */}
        <AnimationWrapper >
            <section className="h-cover flex justify-center gap-10">
                {/* latest blog */}
                <div className="w-full ">
                    <InPageNavigation routes={[pageState,"trending blogs"]} defaultHidden={["trending blogs"]}>
                        <>
                            {
                                blogs==null ? (
                                    <Loader/>
                                ) :  (
                                    blogs.results.length ? 
                                        blogs.results.map((blog,i)=>{
                                        return  <AnimationWrapper key={i} transition={{duration:1, delay:i*.1}}>
                                            <BlogPostCard content={blog} author={blog.author.personal_info}/>
                                        </AnimationWrapper>
                                    })
                                    :
                                    <NoDataMessage message="No blogs published"/>
                                )
                            }
                            <LoadMoreDataBtn state={blogs} fetchDataFun={(pageState=="home" ? fetchLatestBlogs : fetchBlogsByCategory)}/>
                        </>
                        
                        {
                            trendingBlogs==null ? (
                                <Loader/>
                            ) : (
                                trendingBlogs.length ?
                                    trendingBlogs.map((blog,i)=>{
                                        return  <AnimationWrapper key={i} transition={{duration:1, delay:i*.1}}>
                                            <MinimalBlogPost blog={blog} index={i}/>
                                        </AnimationWrapper>
                                    })
                                :
                                <NoDataMessage message="No trending blogs"/>
                            )
                            
                        }

                    </InPageNavigation>
                </div>

                {/* filters and trending blogs */}
                <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
                    <div className="flex flex-col gap-10">
                        <div>
                            <h1 className="font-medium text-xl mb-5">Stories form all interests</h1>
                            <div className="flex gap-3 flex-wrap">
                                {
                                    categories.map((category,i)=>{
                                        return(
                                            <button onClick={loadBlogByCategory} className={"tag " + (pageState==category ? " bg-black text-white" : " ")} key={i}>
                                                {category}
                                            </button>
                                        ) 
                                    })
                                }
                            </div>

                        </div>
                        
                        <div>
                            <h1 className="font-medium text-xl mb-8">Trending
                                <TrendingUpIcon/>
                            </h1>

                            {
                                trendingBlogs==null ? <Loader/> :
                                (
                                    trendingBlogs.length ?
                                        trendingBlogs.map((blog,i)=>{
                                            return  <AnimationWrapper key={i} transition={{duration:1, delay:i*.1}}>
                                                <MinimalBlogPost blog={blog} index={i}/>
                                            </AnimationWrapper>
                                        })
                                    :
                                    <NoDataMessage message="No trending blogs"/>
                                )
                                
                            }
                        </div>
                    </div>
                </div>
            </section>
        </AnimationWrapper>
        </>
    )
}
export default HomePage