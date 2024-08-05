<template>
  <template v-for="(row, index) in data" :key="index">
    <tr>
      <td v-if="props.hasSelect">
        <NCheck
          v-model="row.checked"
          class="m-0"
          @update:modelValue="$emit('selected', { row, value: $event })"
        ></NCheck>
      </td>
      <!-- <td></td> -->
      <template v-for="(col, ind) in options.columns" :key="ind">
        <td
          :style="col.style"
          class="text-content"
          :class="{ [`text-${col.align}`]: col.align }"
        >
          <slot :name="col.data" :message="col.data" :entity="row">
            <div :style="!ind ? `padding-left: ${row.level * 25}px` : ''">
              <span
                v-if="!ind && (row.children || []).length"
                style="border: 1px solid #38bdf833"
                class="cp me-3"
                @click="row.show = !row.show"
              >
                <NIcon
                  :name="checkOpenAll(row.show) ? 'ic:baseline-add' : 'ic:baseline-minus'"
                  size="14"
                  color="#0d6efd"
                ></NIcon>
              </span>

              <svg v-else-if="!ind" width="16" height="16" class="me-2"></svg>
              <slot>{{ row[col.data] }}</slot>
            </div>
          </slot>
        </td>
      </template>
      <td v-if="!props.options.actions || !props.optionsCheckbox.data">
        <div class="actions">
          <div
            class="button"
            @click="onAction({ action: 'delete', entity: row })"
          >
            <NIcon name="feather:trash-2" size="16" color="#d21953"></NIcon>
          </div>
          <div
            class="button"
            @click="onAction({ action: 'edit', entity: row })"
          >
            <NIcon name="pajamas:pencil" size="16" color="#008BD9"></NIcon>
          </div>
          <div
            class="button"
            @click="onAction({ action: 'add-parent', entity: row })"
          >
            <NIcon
              name="material-symbols:add"
              size="20"
              color="#008BD9"
            ></NIcon>
          </div>
        </div>
      </td>
      <td v-if="props.optionsCheckbox.data">
        <NCheck
          v-model="row.view"
          :disabled="row.disabled"
          class="m-0"
          @update:modelValue="changeValue(row)"
        ></NCheck>
      </td>
    </tr>

    <NTr
      v-if="(row.children || []).length && checkOpenAll(!row.show)"
      :data="row.children"
      :options="options"
      :has-select="props.hasSelect"
      :options-checkbox="optionsCheckbox"
      :open-all="openAll"
      @selected="$emit('selected', $event)"
      @action="onAction"
      @checkBox="changeValue($event)"
    >
      <template v-for="col in options.columns" #[col.data]>
        <slot :name="col.data" :message="row[col.data]" :entity="row"> </slot>
      </template>
    </NTr>
  </template>
</template>

<script lang="ts" setup>
import NIcon from "~~/components/base/NIcon.vue";
import NCheck from "~~/components/base/NCheck.vue";

const props = defineProps({
  data: {
    type: Array as PropType<any>,
    default: () => [],
  },
  options: {
    type: Object,
    default: () => ({}),
  },
  index: {
    type: [String, Number],
    default: 0,
  },
  hasSelect: {
    type: Boolean,
    default: false,
  },
  optionsCheckbox: {
    type: Object,
    default: () => ({}),
  },
  openAll: {
    type: Boolean,
    default: false
  }
});

const emits = defineEmits(["action", "selected", "checkBox"]);

const onAction = (data: any) => {
  emits("action", data);
};

const changeValue = (item: any) => {
  emits("checkBox", item);
};

const checkOpenAll = (type: boolean) => {
  return props.openAll ? type : !type
}
</script>

<style lang="scss" scoped>
.d-flex {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
