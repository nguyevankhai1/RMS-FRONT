<template>
  <div class="login_form_input">
    <h3 class="form_title">Sign Up</h3>
    <form @submit.prevent="registerAccount()" autocomplete="off">
      <div class="form_group">
        <label class="label" for="name">Full name</label>
        <input
          type="text"
          class="form-control"
          v-model="data.name"
          placeholder="Username"
          required
        />
      </div>
      <div class="form_group">
        <label class="label" for="mail">Email address</label>
        <input
          type="text"
          class="form-control"
          v-model="data.email"
          placeholder="Email"
          required
        />
        <span class="form_tips"
          >We'll never share your email with anyone else.</span
        >
      </div>
      <div class="form_group">
        <label class="label" for="account">Account</label>
        <input
          type="text"
          class="form-control"
          v-model="data.account"
          placeholder="Account"
          required
        />
      </div>
      <div class="form_group">
        <label class="label" for="pass">Password</label>
        <input
          type="password"
          class="form-control"
          v-model="data.password"
          placeholder="Password"
          autocomplete="new-password"
          required
        />
        <span class="form_tips"
          >Password required at least 8 char and includes upper&lower case letter, special char and number.</span
        >
      </div>
      <div class="form_action">
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            v-model="data.isAgree"
            id="flexCheckDefault"
          />
          <label for="rememberCheck">I agree with the terms of use</label>
        </div>
      </div>
      <button type="submit" :disabled="!data.isAgree || loading.register" class="btn btn-primary form_submit w-100">
        <span
          v-if="loading.register"
          class="spinner-border spinner-border-sm"
          role="status" aria-hidden="true"
        ></span>
        Sign up
      </button>
    </form>
    <div class="form-helper">
      <span>Already have an Account? </span>
      <a @click="$emit('change-mode', 'signin-mode')" class="form_link" href="#">Sign in.</a>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  item: {
    type: [Object],
    default: () => ({}),
  },
});

let data = ref<any>({
  name: '',
  account: '',
  email: '',
  password: '',
  isAgree: false
});

let loading = ref<any>({
  register: false,
})

const registerAccount = async () => {
  loading.value.register = true
  let formData: any = data.value
  const response = await useAuth().register(
    formData.name,
    formData.account,
    formData.email,
    formData.password,
  )
  if (response) {
    useNotify('success', 'Đăng ký tài khoản thành công').show()
    emits("sign-up", formData);
  }
  loading.value.register = false
};

const emits = defineEmits(["change-mode", "sign-up"]);
</script>

<style lang="sass" scoped>
@import '~~/assets/sass/_tree.sass'
</style>
