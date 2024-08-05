import FloatingVue from "floating-vue";
// import VueCtkDateTimePicker from "vue-ctk-date-time-picker";

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(FloatingVue);
  // vueApp.component("VueCtkDateTimePicker", VueCtkDateTimePicker);
});
