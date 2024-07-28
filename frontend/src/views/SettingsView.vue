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
                <v-col cols="6" class="w-100">
                    <div class="text-h6 mb-2">Heading Font Family</div>
                    <v-select
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
                <v-col cols="6">
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
                            v-model="bodyFontColour"
                            :modes="['rgba']"
                        ></v-color-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12">
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
                    >
                        <template v-slot:item="{ props, item }">
                            <v-list-item class="bg-white" v-bind="props" :key="item"></v-list-item>
                        </template>
                    </v-select>
                </v-col>
                <v-col cols=12>
                    <v-btn rounded="lg" :disabled="saving" class="w-100 text-capitalize" size="large" color="primary" @click="onSaveSlideSettings">
                        Save Changes
                        <template v-slot:append>
                            <v-progress-circular size="22" width="3" color="onPrimary" v-if="saving" indeterminate></v-progress-circular>
                        </template>
                    </v-btn>
                </v-col>
            </v-row>
        </v-form>
    </v-container>
</template>
<script>
import apiService from "@/services/api.service";
import { availableFonts } from "@/constants/settings.js"
export default {
    watch: {
        headingFontColour: {
            handler(c) {
                console.log(c)
                if (!c) return;
                this.headingFontColourString = `rgb(${c.r},${c.g},${c.b},${c.a})`;
            }
        },
        bodyFontColour: {
            handler(c) {
                console.log(c)
                if (!c) return;
                this.bodyFontColourString = `rgb(${c.r},${c.g},${c.b},${c.a})`;
            }
        },
        backgroundColour: {
            handler(c) {
                console.log(c)
                if (!c) return;
                this.backgroundColourString = `rgb(${c.r},${c.g},${c.b},${c.a})`;
            }
        }
    },
    data: () => ({
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
        availableFonts: availableFonts
    }),
    methods: {
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