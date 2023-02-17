import { Navigate, Route, Routes } from "react-router-dom"
import Footer from "./components/Footer"
import Login from "./pages/Login"
import AuthNavbar from "./components/AuthNavbar"
import SignUp from "./pages/SignUp"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import About from "./pages/About"
import Find from "./pages/Find"
import { AuthContext } from "./context/AuthContext"
import { useContext } from "react"


function App() {

  const { currentUser } = useContext(AuthContext)

  const RequireAuth = ({children}) => {
    return currentUser? (children) : <Navigate to="/login" />
  }

  // console.log(currentUser)
  // console.log("abc")

  return (
    <>
      <AuthNavbar />
      <div>
        <Routes>
          <Route path="/">
            <Route index element={<Home />} />
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/find" element={
                <RequireAuth>
                  <Find />
                </RequireAuth>
            }/>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </>  
  )
}

export default App
