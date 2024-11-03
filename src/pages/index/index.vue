<template>
  <view>
    <div class="index">
      <div class="cal-card">
        <nut-calendar-card v-model="value" @change="onChange">
          <template #top="{ day }">
            <div class="date-container">
              {{ hasTask(day.date) ? getCount(day.date) : '' }}
            </div>
          </template>
        </nut-calendar-card>
      </div>
      <div class="todo-list">
        <div class="todo-list-title">
          <div class="todo-list-title-date">
            日期：{{ formattedDate }}
          </div>
          <div class="todo-list-title-add-task">
            <nut-cell title="添加当天任务" @click="baseClickAddTask"></nut-cell>
            <nut-dialog title="添加当天任务" content="填" v-model:visible="addTaskVisible" @ok="onOkAddTask" />
          </div>
        </div>
        <div class="todo-list-body">代办内容：</div>
      </div>
    </div>
  </view>
</template>

<script setup>
import {reactive, ref, computed} from 'vue'

const value = ref(new Date('2024-01-01'))
const addTaskVisible = ref(false)

const dailyTaskList = reactive([
  {date: 8, count: 3},
]);

const hasTask = (day) => {
  return dailyTaskList.some(task => task.date === day);
}

const getCount = (day) => {
  const task = dailyTaskList.find(task => task.date === day);
  return task ? task.count : 0;
}

const currentCount = computed(() => {
  const date = new Date(value.value);
  return getCount(date.getDate());
});

const formattedDate = computed(() => {
  const date = new Date(value.value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
});

const baseClickAddTask = () => {
  addTaskVisible.value = true;
};

const onOkAddTask = ()=>{
  console.log("添加任务发送请求（任务内容，日期年月日时分秒）")
}

const onChange = (e) => {
  value.value = e;
  console.log('发送请求获取当前日期对应的所有任务，更新到代办内容中')
}

const show = ref(false)
</script>

<style scoped>
.index {
  display: flex;
  height: 100vh;
}

.todo-list {
  width: 70%;
}

.date-container {
  display: flex;
  justify-content: flex-end;
}
</style>
