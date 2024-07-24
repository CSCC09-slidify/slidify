<template>
    <v-menu>
        <template v-slot:activator="{ props }">
            <v-btn icon="mdi-account-circle" v-bind="props"></v-btn>
        </template>
        <v-list bg-color="white">
            <v-list-item
                :prepend-avatar="userProfile.picture"
                :subtitle="userProfile.email"
                :title="userProfile.name"
                class="mb-2"
            >
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item
                class="mt-2"
                :key="signout"
                value="signout"
                @click="logout"
            >
                <template v-slot:prepend>
                    <v-icon icon="mdi-exit-to-app" :style="{marginRight: '-1rem'}"></v-icon>
                </template>
                <v-list-item-title>Sign Out</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>    
</template>
<script>
import { googleLogout } from "@/tools/users.js";
import apiService from "@/services/api.service";

export default {
    name: "AccountSettingsButton",
    data: () => ({
        userProfile: {}
    }),
    methods: {
        logout() {
            googleLogout(
                () => this.$router.push("/")
            );
        },
        getUserProfile() {
            apiService.getUserProfile()
                .then(res => {
                    this.userProfile = res.profile ?? {};
                })
        }
    },
    created() {
        this.getUserProfile();
    }
}
</script>