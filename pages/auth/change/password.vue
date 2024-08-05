<template>
  <section class="cp_section">
    <div class="cp_container">
      <h2 class="form_title">{{ $t("password.change") }}</h2>
      <form @submit.prevent="submitForm()" class="cp_form">
        <div class="form_group">
          <label class="label" for="name">{{ $t("password.old") }}</label>
          <input
            type="password"
            class="form-control"
            v-model="data.oldPw"
            placeholder=" "
            required
            autocomplete="new-password"
          />
        </div>
        <div class="form_group">
          <label class="label" for="name"> {{ $t("password.new") }}</label>
          <input
            type="password"
            class="form-control"
            v-model="data.newPw"
            placeholder=" "
            required
            autocomplete="new-password"
          />
        </div>
        <div class="form_group">
          <label class="label" for="name"> {{ $t("password.confirm") }}</label>
          <input
            type="password"
            class="form-control"
            v-model="data.confirmPw"
            placeholder=" "
            required
            autocomplete="new-password"
          />
        </div>
        <button type="submit" class="btn btn-primary w-100 cp_submit">
          {{ $t("update") }} {{ $t("table.user.password").toLowerCase() }}
        </button>
      </form>
      <a @click="$router.go(-1)" class="form_link">{{ $t("goBack") }}</a>
    </div>
  </section>
</template>

<script lang="ts" setup>
import useAuth from "~~/composables/useAuth";

const { t } = useI18n();
const router = useRouter();
definePageMeta({
  layout: "login-layout",
});

const data = ref<any>({
  oldPw: "",
  newPw: "",
  confirmPw: "",
  isAgree: false,
});

const submitForm = async () => {
  if (data.value.newPw !== data.value.confirmPw) {
    useNotify("danger", t("password.invalidRetypePassword")).show();
    return;
  }
  const response = await useAuth().changePassword(
    data.value.oldPw,
    data.value.newPw
  );

  if (response) {
    const authCookie = useCookie("Authorization");
    authCookie.value = null;
    router.push({ path: "/login" });
  }
};
</script>

<style lang="sass" scoped>
@import '~~/assets/sass/_login.sass'
</style>
