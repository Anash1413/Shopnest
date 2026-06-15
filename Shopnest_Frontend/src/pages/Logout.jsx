import { useAuth } from "../hooks/useAuth"
 

function Logout() {
  const{logout}= useAuth()
  logout()
    // if(confirm("do you want to logout?")){
    //  logout()
    // }else {
    //   alert("logout cancel")
    // }
  
}

export default Logout
