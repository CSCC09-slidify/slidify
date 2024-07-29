<template>
    <v-container class="settings">
        <v-form>
            <v-row class="w-100">
                <v-col cols="12">
                    <div class="w-100 d-flex justify-space-between">
                        <div class="text-h4">
                            Slide Settings
                        </div>
                        <v-btn rounded="xl" size="large" color="primary" class="text-capitalize" @click="onBackButtonClick">
                            Back
                        </v-btn>
                    </div>
                </v-col>
                <v-col cols="6" class="w-100 pb-0">
                    <div class="text-h6 mb-2">Heading Font Family</div>
                    <v-select
                        @update:modelValue="changeInput"
                        v-model="headingFontFamily"
                        class="bg-transparent rounded-xl"
                        label=""
                        :items="availableFonts"
                        variant="outlined"
                        rounded="lg"
                    >
                        <template v-slot:item="{ props, item }">
                            <v-list-item class="bg-white" v-bind="props" :key="item" :style="{fontFamily: item.title}"></v-list-item>
                        </template>
                    </v-select>
                    <div class="text-h6 mb-2">Body Font Family</div>
                    <v-select
                        @update:modelValue="changeInput"
                        elevation="1"
                        class="bg-white elevation-0"
                        rounded="lg"
                        v-model="bodyFontFamily"
                        label=""
                        :items="availableFonts"
                        variant="outlined"
                    >
                        <template v-slot:item="{ props, item }">
                            <v-list-item class="bg-white" v-bind="props" :key="item"></v-list-item>
                        </template>
                    </v-select>
                </v-col>
                <v-col cols="6" class="pb-0">
                    <div class="text-h6 mb-2">Heading Font Colour</div>
                    <v-menu
                        v-model="headingFontMenu"
                        :close-on-content-click="false"
                        location="bottom"
                        >
                        <template v-slot:activator="{ props }">
                            <v-text-field
                                rounded="lg"
                                variant="outlined"
                                v-bind="props"
                                v-model="headingFontColourString"
                                readonly
                            >
                                <template v-slot:append-inner>
                                    <v-icon
                                        :style="{color: headingFontColourString, opacity: 1}"
                                        icon="mdi-circle"
                                    />
                                </template>
                            </v-text-field>
                        </template>
                        <v-color-picker
                            @update:modelValue="changeInput"
                            v-model="headingFontColour"
                            :modes="['rgba']"
                        ></v-color-picker>
                    </v-menu>
                    <div class="text-h6 mb-2">Body Font Colour</div>
                    <v-menu
                        v-model="bodyFontMenu"
                        :close-on-content-click="false"
                        location="bottom"
                        >
                        <template v-slot:activator="{ props }">
                            <v-text-field
                                rounded="lg"
                                variant="outlined"
                                v-bind="props"
                                v-model="bodyFontColourString"
                                readonly
                            >
                                <template v-slot:append-inner>
                                    <v-icon
                                        :style="{color: bodyFontColourString, opacity: 1}"
                                        icon="mdi-circle"
                                    />
                                </template>
                            </v-text-field>
                        </template>
                        <v-color-picker
                             @update:modelValue="changeInput"
                            v-model="bodyFontColour"
                            :modes="['rgba']"
                        ></v-color-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" class="pt-0">
                    <div class="text-h6 mb-2">Background Colour</div>
                    <v-menu
                        v-model="backgroundColourMenu"
                        :close-on-content-click="false"
                        location="bottom"
                        >
                        <template v-slot:activator="{ props }">
                            <v-text-field
                                rounded="lg"
                                variant="outlined"
                                v-bind="props"
                                v-model="backgroundColourString"
                                readonly
                            >
                                <template v-slot:append-inner>
                                    <v-icon
                                        :style="{color: backgroundColourString, opacity: 1}"
                                        icon="mdi-circle"
                                    />
                                </template>
                            </v-text-field>
                        </template>
                        <v-color-picker
                            v-model="backgroundColour"
                            :modes="['rgba']"
                            @update:modelValue="changeInput"
                        ></v-color-picker>
                    </v-menu>
                    <div class="text-h6 mb-2">Image Positioning</div>
                    <v-select
                        v-model="positioning"
                        class="bg-transparent rounded-xl"
                        label=""
                        :items="[{ title: 'Default', value: 'default'}, { title: 'Background', value: 'full'}]"
                        variant="outlined"
                        rounded="lg"
                        @update:modelValue="changeInput"
                    >
                        <template v-slot:item="{ props, item }">
                            <v-list-item class="bg-white" v-bind="props" :key="item"></v-list-item>
                        </template>
                    </v-select>
                    <v-btn rounded="lg" :disabled="saving || !changed" class="w-100 text-capitalize mt-2" size="large" color="primary" @click="onSaveSlideSettings">
                        Save Changes
                        <template v-slot:append>
                            <v-progress-circular size="22" width="3" color="onPrimary" v-if="saving" indeterminate></v-progress-circular>
                        </template>
                    </v-btn>
                </v-col>
            </v-row>
        </v-form>
        <v-form class="mt-5">
            <v-row class="w-100">
                <v-col cols="12">
                    <div class="w-100 d-flex justify-space-between">
                        <div class="text-h4">
                            Account Settings
                        </div>
                    </div>
                </v-col>
                <v-col cols="12">
                    Deleting your account data will remove all items with your google account information from the Slidify database,
                    including user sessions, notification history, slide settings and all generated presentation history.
                </v-col>
                <v-col cols=12>
                    <v-dialog max-width="500">
                        <template v-slot:activator="{ props: activatorProps }">
                            <v-btn rounded="lg" v-bind="activatorProps" class="w-100 text-capitalize" size="large" color="red-accent-4">
                                Delete All Account Data
                                <template v-slot:append>
                                    <v-progress-circular size="22" width="3" color="onPrimary" v-if="saving" indeterminate></v-progress-circular>
                                </template>
                            </v-btn>
                        </template>

                        <template v-slot:default="{ isActive }">
                            <v-card class="rounded-xl" color="onPrimary">
                                <v-card-title
                                    color="primary"
                                    class="bg-primary py-7 px-12 d-flex align-center"
                                >
                                    <v-icon size="48" color="onPrimary" icon="mdi-alert-circle"></v-icon>
                                    <div
                                    class="w-100 text-center text-h4 ps-2"
                                    :style="{ paddingRight: `${40 - deleteAccountHeader.length * 2}px` }"
                                    >
                                        {{ deleteAccountHeader }}
                                    </div>
                                </v-card-title>
                                <v-card-text class="pa-8">
                                    This account will be irreversable. 
                                    You will be able to continue using Slidify under the same google account by repeating the signin process.
                                </v-card-text>

                                <v-card-actions class="d-flex flex-column justify-center">
                                    <v-col cols="12" sm="8">
                                    <ActionButton
                                        class="ma-2"
                                        icon=""
                                        text="Cancel"
                                        :onClick="() => isActive.value = false"
                                    />
                                    <ActionButton
                                        class="mb-4"
                                        icon="mdi-alert"
                                        text="Delete Account"
                                        color="red-accent-4"
                                        :onClick="deleteAccount"
                                    />
                                    </v-col>
                                </v-card-actions>
                                </v-card>
                        </template>
                        </v-dialog>
                </v-col>
            </v-row>
        </v-form>
    </v-container>
</template>
<script>
import apiService from "@/services/api.service";
import { availableFonts } from "@/constants/settings.js"
import ActionButton from "@/components/ActionButton.vue";

export default {
    components: {
        ActionButton
    },
    watch: {
        headingFontColour: {
            handler(c) {
                if (!c) return;
                this.headingFontColourString = `rgb(${c.r},${c.g},${c.b},${c.a})`;
            }
        },
        bodyFontColour: {
            handler(c) {
                if (!c) return;
                this.bodyFontColourString = `rgb(${c.r},${c.g},${c.b},${c.a})`;
            }
        },
        backgroundColour: {
            handler(c) {
                if (!c) return;
                this.backgroundColourString = `rgb(${c.r},${c.g},${c.b},${c.a})`;
            }
        }
    },
    data: () => ({
        changed: false,
        headingFontColour: {
            r: 0,
            g: 0,
            b: 0,
            a: 1
        },
        bodyFontColour: {
            r: 0,
            g: 0,
            b: 0,
            a: 1
        },
        backgroundColour: {
            r: 255,
            g: 255,
            b: 255,
            a: 1
        },
        headingFontColourString: `rgb(0,0,0,1)`,
        bodyFontColourString: `rgb(0,0,0,1)`,
        headingFontMenu: false,
        bodyFontMenu: false,
        backgroundColourMenu: false,
        backgroundColourString: `rgb(255,255,255,1)`,
        headingFontFamily: "Monsterrat",
        bodyFontFamily: "Monsterrat",
        positioning: "default",
        saving: false,
        availableFonts: availableFonts,
        deleteAccountHeader: "Deleting Account"
    }),
    methods: {
        changeInput() {
            this.changed = true;
        },
        onBackButtonClick() {
            this.$router.go(-1)
        },
        onSaveSlideSettings() {
            this.saving = true;
            apiService.updateUserSettings({
                headingFontColour: this.headingFontColour,
                bodyFontColour: this.bodyFontColour,
                headingFontFamily: this.headingFontFamily,
                bodyFontFamily: this.bodyFontFamily,
                positioning: this.positioning,
                backgroundColour: this.backgroundColour
            })
            .then(() => {
                this.saving = false;
                this.changed = false;
            })
        },
        deleteAccount() {
            apiService.deleteAccount()
                .then(() => {
                    this.$router.push("/")
                })
        }
    },
    created() {
        apiService.getUserSettings()
            .then(res => {
                console.log(res)
                this.headingFontColour = res.headingFontColour
                this.bodyFontColour = res.bodyFontColour
                this.headingFontFamily = res.headingFontFamily
                this.bodyFontFamily = res.bodyFontFamily
                this.positioning = res.positioning,
                this.backgroundColour = res.backgroundColour.r ? res.backgroundColour : {
                    r: 255,
                    g: 255,
                    b: 255,
                    a: 1 
                }
            })
    }
};
</script>
<style>

.v-field--variant-solo {
    background: none !important;
}

</style>