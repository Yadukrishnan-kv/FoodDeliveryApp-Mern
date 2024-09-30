import React, { useContext, useEffect } from 'react'
import './App.css';
import UserRoutes from './Router/UserRoutes';
import HotelRoutes from './Router/HotelRoutes';
import { jwtDecode } from 'jwt-decode';
import { Context } from './Context/Context';
import AdminPage from './Router/AdminPage';
import toast,{Toaster} from 'react-hot-toast'


function App() {
  
  const {isAuthorized, setAuthorized,User,setUser}=useContext(Context);

  console.log(User);
  

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    
    if (storedToken) {
      try {
        const decodedToken = jwtDecode(storedToken);
        setAuthorized(true);
        setUser(decodedToken.sub);
        console.log(setUser);
      } catch (error) {
        console.error("Invalid token", error);
        setAuthorized(false);
        setUser(null);
      
      }
    }
  }, [setUser,isAuthorized]);
  // if (User){
  //   if(User.role === 'Restaurant'){
  //     return <HotelRoutes/> ;
  //   }else if(User.role === 'Admin'){
  //     return <AdminPage/>
  //   }else {
  //     return  <UserRoutes/> ;
  //   }
  // }


 
  return (
    <div className="App">


     
     { User ? (
        User.role === 'Admin' ?   <AdminPage/> :
        User.role === 'Restaurant' ? <HotelRoutes /> :
        <UserRoutes />
      ) : (
        <UserRoutes /> // Default to user routes if no user is authenticated
      )}
      {/* <AdminPage/>  */}
      <Toaster/>
    </div>

    
   
     
    
  
  );
}

export default App;
