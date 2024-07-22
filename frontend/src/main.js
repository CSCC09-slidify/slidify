import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import vue3GoogleLogin from "vue3-google-login";
import { fa } from "vuetify/iconsets/fa";
import { mdi, aliases } from "vuetify/iconsets/mdi";
import { md } from "vuetify/iconsets/md";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import theme from "./plugins/theme.js";

import "@mdi/font/css/materialdesignicons.css";
import "material-design-icons-iconfont/dist/material-design-icons.css";

const vuetify = createVuetify({
  components,
  directives,
  theme,
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      fa,
      mdi,
      md
    }
  }
});

const app = createApp(App);

app.use(vuetify).use(router).use(vue3GoogleLogin, {
  clientId: process.env.VUE_APP_GOOGLE_CLIENT_ID,
});

app.mount("#app");
