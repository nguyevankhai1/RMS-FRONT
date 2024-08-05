<template>
  <tr>
    <th :colspan="props.colspan">
      <div class="no-data">
        <div>
          <div>
            <img alt="Logo" src="@/assets/icons/svg/table-document.svg" />
          </div>
          {{ $t('table.no-data') }}
        </div>
      </div>
    </th>
  </tr>
</template>

<script lang="ts" setup>
const props = defineProps({
  colspan: {
    type: [String, Number],
    default: 0,
  },
});
</script>
