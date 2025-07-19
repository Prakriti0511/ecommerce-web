import { signInWithPopup } from "firebase/auth"

export const googleSignup = async() => {
    try {
        const response = await signInWithPopup(auth, provider)
        console.log(response)
        let user = response.user;
        let name = user.displayName;
        let email = user.email;
        
        const result = await SiAxios.post(serverUrl + "/api/auth/googlelogin", {name, email}, {withCredentials:true})
        console.log(result.data)
    } catch (error) {
        console.log(error)
    }
}