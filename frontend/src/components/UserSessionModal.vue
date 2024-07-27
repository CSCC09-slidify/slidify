<template>
<v-dialog max-width="420" persistent v-model="isOpen">
    <v-card class="rounded-xl" color="onPrimary">
      <v-card-title color="primary" class="bg-primary py-7 px-12 d-flex align-center">   
            <v-icon size="48" color="onPrimary" :icon="headerIcon"></v-icon>
            <div class="w-100 text-center text-h4 ps-2" :style="{ paddingRight: `${40 - header.length * 2}px` }">{{ header }}</div>
        </v-card-title>
      <v-card-text class="pa-8">
        {{ body }}
      </v-card-text>

      <v-card-actions class="d-flex flex-column justify-center">
        <v-col cols="12" sm="8">
            <ActionButton class="ma-2" icon="mdi-account-circle" text="Sign in with Google" :onClick="login"/>
            <ActionButton class="mb-4" icon="mdi-home" text="Return to homepage" :onClick="goToHome" />
        </v-col>
      </v-card-actions>
    </v-card>
</v-dialog>
</template>
<script>
import ActionButton from "./ActionButton.vue";
import apiService from "@/services/api.service";
import { googleSdkLoaded } from "vue3-google-login";

export default {
    components: {
        ActionButton
    },
    props: {
        headerIcon: {
            type: String
        },
        body: {
            type: String
        },
        header: {
            type: String
        },
        onSignIn: {
            type: Function
        }
    },
    data: () => ({
        isOpen: true
    }),
    methods: {
        login() {
            googleSdkLoaded(google => {
                google.accounts.oauth2.initCodeClient({
                client_id: process.env.VUE_APP_GOOGLE_CLIENT_ID,
                scope: "email profile openid https://www.googleapis.com/auth/presentations",
                redirect_uri: process.env.VUE_APP_GOOGLE_REDIRECT_URI,
                include_granted_scopes: false,
                callback: response => {
                    if (response.code) {
                        apiService.signIn(response.code).then((response) => {
                            if (!response.error)
                                this.onSignIn();
                        })
                    }
                }
                }).requestCode();
            });
        },
        goToHome() {
            this.$router.push("/")
        }
    }
}
</script>