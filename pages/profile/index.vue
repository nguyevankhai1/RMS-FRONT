<template>
  <div class="container-xxl">
    <NForm
      ref="formEditProfile"
      :configs="UserInfoFormConfig"
      :update-value="form"
      :customSave="onSave"
    >
      <template #headtitle>
        <h3 class="mt-2">{{ $t("profile") }}</h3>
      </template>
      <template #avatar="props">
        <div class="row mb-6" style="display: flex; justify-content: center">
          <div class="" style="width: unset">
            <NCropableAvatar
              :src="user?.avatar"
              :customProps="props"
              @uploaded="uploadAvatar"
            ></NCropableAvatar>
          </div>
        </div>
      </template>
    </NForm>
    <div>
      <div class="form-head border-b">
        <div class="mt-auto">
          <h3>Tài khoản liên kết</h3>
        </div>
      </div>
      <div class="form-body">
        <div class="d-flex">
          <div class="button-google col-2 row">
            <div class="social-card__icon col-3">
              <img
                src="https://i.pinimg.com/736x/74/65/f3/7465f30319191e2729668875e7a557f2.jpg"
                alt=""
                height="40%"
              />
            </div>
            <div class="col">
              <div class="text">Google</div>
              <div class="d-flex">
                <div class="item">OPENID</div>
                <div class="item">PROFILE</div>
                <div class="item">EMAIL</div>
              </div>
            </div>
            <NIcon
              v-if="!checkAccountLink"
              name="ion:close-circled"
              size="19px"
              class="close"
            ></NIcon>
            <img
              v-else
              src="/img/image-18.png"
              width="16"
              height="16"
              class="close"
            />
          </div>
          <div style="margin: 22px;">
            <a v-if="!checkAccountLink" :href="urlGoogle()">
              <NIcon name="ion:add-circle-outline" size="22px"></NIcon>
            </a>
            <a v-else @click="deleteLink()" class="cursor-pointer">
              <NIcon name="ion:md-remove-circle-outline" size="22px"></NIcon>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useMeStore } from "~~/store/me";
import API_PATH from "~~/enums/API_PATH";
import UserInfoFormConfig from "~~/configs/forms/UserInfoFormConfig";
import NForm from "~~/components/base/NForm.vue";
import NCropableAvatar from "~/components/base/NCropableAvatar.vue";
import NIcon from "~~/components/base/NIcon.vue";

const meStore = useMeStore();
const { me } = storeToRefs(meStore);

const form = ref<any>({});
const { user, setUser } = useMe();

const service = useService(API_PATH.USER);

const { t } = useI18n();

const avatar = ref<string>("");
const formEditProfile = ref<any>(null);
const checkAccountLink = ref<Boolean>(false)

const uploadAvatar = (imageId: string) => {
  form.value.avatar = imageId;
};

const deleteLink = () => {
  useConfirm({
      confirmFn: onConfirmDelete,
      confirmBtnColor: "danger",
      message: `${t("confirmBeforeDeleting")}${t("confirmText")}?`,
      t,
    }).show();
}

const urlGoogle = () => {
  const { $config } = useNuxtApp();
  const proceed =  window.location.href
  const apiBase = $config.public.apiBase.replace('/api', '')
  const userId = useUserZone().zone.value.userId
  const appId = useUserZone().zone.value.appId
  return `${apiBase}/oauth2/authorization/google?appId=${appId}&proceed=${proceed}&userId=${userId}`
}

const { goBack } = useHistory();

const onConfirmDelete = () => {
  useAPI({  path: `${API_PATH.PROVIDER}/delete` as API_PATH })._delete().then((data:any)=> {
    if (data.data.value.statusCode == 200) {
      getGoogleLink()
      useNotify("success", t("deleteRecordSuccessfully")).show();
    }
   });
}

const getGoogleLink = () => {
  useAPI({  path: `${API_PATH.PROVIDER}/check/accountLink` as API_PATH })._get().then((data:any)=> {
    checkAccountLink.value = data.data.value.data
   });
}

const onSave = (entity: any) => {
  service
    .update(entity)
    .then((response: any) => {
      if (response.value.statusCode == 200) {
        setUser(response.value.data);
        useNotify("success", t("updateSucessfully")).show();
        goBack();
      }
    })
    .finally(() => formEditProfile.value?.hideLoading());
};

watch(
  me,
  (newValue: any) => {
    avatar.value = newValue.avatar;
    form.value = { ...newValue };
  },
  { deep: true }
);

onMounted(() => {
  if (user.value?.avatar) avatar.value = user.value.avatar;
  form.value = { ...user.value };
  getGoogleLink()
});
</script>

<style lang="sass" scoped>

.form-head, .form-footer
    display: flex
    padding: 12px 20px

.form-body
  padding: 20px 40px 40px

.border-b
    border-bottom: 1px solid rgb(229, 229, 229)

.button-google
  position: relative
  height: 64px
  border: 1px solid #E1E3EA
  border-radius: 5px
  .close
    position: absolute
    right: 0px
    top: 22px
    width: 35px
  .social-card__icon
    height: 64px
    display: flex
    align-items: center
    justify-content: center
    border-right: 1px solid #E1E3EA
  .text
    font-weight: bold
    font-size: 22px
    margin-top: 5px
  .item
    font-size: 10px
    margin-top: 5px
    margin-right: 5px
</style>
