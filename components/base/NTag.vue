<template>
  <VueMultiselect
    v-model="tags"
    :options="selectOptions"
    :tag-placeholder="$t('tag.label.addNewTag')"
    :deselectLabel="''"
    :placeholder="placeholder"
    label="name"
    track-by="code"
    :multiple="true"
    :taggable="true"
    @tag="addTag"
    @remove="keepTags"
    :showNoOptions="false"
  >
    <template #tag="slotProps">
      <span class="multiselect__tag">
        {{ slotProps.option.name }}
        <i
          tabindex="1"
          @keypress.enter.prevent="removeTag(slotProps.option)"
          @mousedown.prevent="removeTag(slotProps.option)"
          class="multiselect__tag-icon"
        ></i>
      </span>
    </template>
  </VueMultiselect>
  <span class="suggestion" v-if="suggestion">
    {{ $t("forms.importFile.example") }}: {{ suggestion }}</span
  >
</template>

<script lang="ts" setup>
import VueMultiselect from "vue-multiselect";

export interface Tag {
  code: string;
  name: string;
}

const props = defineProps({
  modelValue: {
    type: Array as PropType<Tag[]>,
    default: () => [],
  },
  placeholder: {
    type: String as PropType<string>,
    default: "",
  },
  suggestion: {
    type: String as PropType<string>,
    default: "",
  },
});
const tags = ref<Tag[]>(props.modelValue);
const selectOptions = ref<Tag[]>([]);

const emits = defineEmits(["update:modelValue"]);

const addTag = (newTag: string) => {
  const tag = {
    name: newTag.trim(),
    code: newTag.substring(0, 2) + Math.floor(Math.random() * 10000000),
  };

  selectOptions.value.push(tag);
  tags.value.push(tag);
  emits("update:modelValue", tags.value);
};

const setTags = (newTags: Tag[]) => {
  tags.value = newTags;
  emits("update:modelValue", newTags);
};

const keepTags = (tagToKeep: Tag) => {
  setTags([...tags.value, tagToKeep]);
};

const removeTag = (tagToRemove: Tag) => {
  setTags(tags.value.filter((tag) => tag.code !== tagToRemove.code));
};

const clearAllTags = () => {
  tags.value = [];
};

defineExpose({
  clearAllTags,
});
</script>

<style lang="sass">
.suggestion
  margin-top: 5px
  display: inline-block
  color: #a8acbc

.multiselect__option--selected.multiselect__option--highlight
  background: #41b883
</style>
