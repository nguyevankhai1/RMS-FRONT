<template>
  <template v-if="step === 1">
    <section class="fp_section">
      <div class="fp_container">
        <h2 class="form_title">Forgot password?</h2>
        <span class="fp_description">Enter your details to receive a reset link</span>
        <form @submit.prevent="verifyAccount()" class="fp_form">
          <div class="form_group">
            <label class="label" for="name">Email address</label>
            <input
              type="text"
              class="form-control"
              v-model="verify.email"
              placeholder=" "
              required
            >
            <span class="fp_tips">We'll never share your email with anyone else.</span>
          </div>
          <button
            type="submit"
            class="btn btn-primary w-100 fp_submit"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Sign up
          </button>
        </form>
        <a @click="$router.push('/login')" class="form_link">Back to sign in</a>
      </div>
    </section>
  </template>
  <template v-if="step === 2">
    <section class="cp_section">
      <div class="cp_container">
        <h2 class="form_title">Reset password</h2>
        <form @submit.prevent="submitForm()" class="cp_form">
          <div class="form_group">
            <label class="label" for="name">Token</label>
            <input
              type="text"
              class="form-control"
              v-model="data.token"
              placeholder=" "
              required
            />
          </div>
          <div class="form_group">
            <label class="label" for="name">Account</label>
            <input
              type="text"
              class="form-control"
              v-model="data.account"
              placeholder=" "
              required
            />
          </div>
          <div class="form_group">
            <label class="label" for="name">New password</label>
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
            <label class="label" for="name">Confirm password</label>
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
            Update password
          </button>
        </form>
        <a @click="$router.push('/login')" class="form_link">Back</a>
      </div>
    </section>
  </template>
</template>

<script lang="ts" setup>
import useAuth from '~~/composables/useAuth';
const router = useRouter();
definePageMeta({
  layout: "login-layout",
});

let step = ref<any>(1);

const verify = ref<any>({
  email: ""
})

let isLoading = ref<any>(false)

const data = ref<any>({
  account: "",
  token: "",
  newPw: "",
  confirmPw: "",
});

const verifyAccount = async () => {
  isLoading.value = true
  const user = await useAuth().forgetPassword(verify.value.email)
  console.log('response:', user)
  if (user) {
    step.value = 2
  }
  isLoading.value = false
}

const submitForm = async () => {
  if (data.value.newPw !== data.value.confirmPw) {
    useNotify('danger', 'Mật khẩu xác nhận không đúng').show();
    return;
  }
  const response = await useAuth().resetPassword(
    data.value.account,
    data.value.newPw,
    data.value.token
  )
  if (response) {
    router.push({ path: '/login' })
  }
};
</script>

<style lang="sass" scoped>
@import '~~/assets/sass/_login.sass'
</style>
