<template>
  <div class="todo-list-body">
    <!-- 超时任务 -->
    <div class="todo-list-body-expired-task">
      <nut-collapse>
        <nut-collapse-item name="expired-task" title="超时任务">
          <template #title>超时任务</template>
          <template #value>{{ expiredTaskCount }}</template>
          <nut-table :columns="columns" :data="expiredTaskList"></nut-table>
        </nut-collapse-item>
      </nut-collapse>
    </div>

    <!-- 未完成任务 -->
    <div class="todo-list-body-incomplete-task">
      <nut-collapse>
        <nut-collapse-item name="incomplete-task" title="未完成任务">
          <template #title>未完成任务</template>
          <template #value>{{ inCompleteTaskCount }}</template>
          <nut-table :columns="columns" :data="inCompleteTaskList"></nut-table>
        </nut-collapse-item>
      </nut-collapse>
    </div>

    <!-- 完成任务 -->
    <div class="todo-list-body-complete-task">
      <nut-collapse>
        <nut-collapse-item name="complete-task" title="完成任务">
          <template #title>完成任务</template>
          <template #value>{{ completeTaskCount }}</template>
          <nut-table :columns="columns" :data="completeTaskList"></nut-table>
        </nut-collapse-item>
      </nut-collapse>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  columns: Array,
  expiredTaskList: Array,
  inCompleteTaskList: Array,
  completeTaskList: Array,
  expiredTaskCount: Number,
  inCompleteTaskCount: Number,
  completeTaskCount: Number,
});
</script>
