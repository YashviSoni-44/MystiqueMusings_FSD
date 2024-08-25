import { Link } from 'react-router-dom';
import image404 from '../imgs/404_1.jpg'
import logo from '../imgs/mmname.png'

const PageNotFound=()=>{
    return (
        <section className="h-cover relative p-10 flex flex-col items-center gap-20">
            <img src={image404} style={{width:180}} className='select-non border-2 border-grey aspect-square object-cover rounded'/>

            <h1 className='text-2xl font-gelasio leading-7 -mt-10'>Page not found</h1>
            <p className='text-dark-grey text-xl leading-7 -mt-14'>The page you are looking for doesn't exist! Head back to the 
                <Link to="/" className='text-black underline'> home page</Link>
            </p>

            <div className='-mt-11'>
                <img src={logo} style={{height:60}} className='object-contain bloack mx-auto select-none'/>
                <p className='text-dark-grey'>Writings That Inspire, Musings That Matter</p>
            </div>
        </section>
    )
}

export default PageNotFound;