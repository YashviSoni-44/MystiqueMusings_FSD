import ResponsiveAppBar from "./components/navbar.component";
import QuiltedImageList from "./components/media.components";
import {Route, Routes} from 'react-router-dom'
import UserAuthForm from "./pages/userAuthForm.page";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<ResponsiveAppBar/>}>
                <Route path="signin" element={<UserAuthForm type="sign-in"/>} />
                <Route path="signup" element={<UserAuthForm type="sign-up"/>} />
            </Route>
            
        </Routes>
        
    )
}

export default App;