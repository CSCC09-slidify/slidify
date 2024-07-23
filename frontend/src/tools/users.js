import { googleSdkLoaded } from "vue3-google-login";
import apiService from "@/services/api.service";

export function googleLogin(next) {
  apiService.whoami()
    .then(res => {
      if (!res.userId) {
        googleSdkLoaded(google => {
          google.accounts.oauth2.initCodeClient({
            client_id: process.env.VUE_APP_GOOGLE_CLIENT_ID,
            scope: "email profile openid https://www.googleapis.com/auth/presentations",
            redirect_uri: process.env.VUE_APP_GOOGLE_REDIRECT_URI,
            include_granted_scopes: false,
            callback: response => {
              if (response.code) {
                apiService.signIn(response.code).then(() => {
                  next();
                })
              }
            }
          }).requestCode();
        });
      } else {
        next();
      }
    })
}
export function googleLogout(next) {
    apiService.signOut().then((response) => {
      console.log(response);
      next()
    });
}