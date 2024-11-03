<template>
  <view>
    <div class="index">
      <div class="calendar-card">
        <nut-calendar-card v-model="value" @change="onChange">
          <template #top="{ day }">
            <div class="date-container">
              {{ hasTask(day.date) ? getCount(day.date) : '' }}
            </div>
          </template>
        </nut-calendar-card>
      </div>
      <div class="todo-list">
        <div class="todo-list-title">代办标题1</div>
        <div class="todo-list-body">代办内容</div>
      </div>
    </div>
  </view>
</template>

<script setup>
import {reactive, ref} from 'vue'

const value = ref(new Date('2024-01-01'))

const dailyTaskList = reactive([
  {date: 8, count: 3},
]);

const hasTask = (day) => {
  return dailyTaskList.some(task => task.date === day);
}

const getCount = (day) => {
  const task = dailyTaskList.find(task => task.date = day)
  return task ? task.count : 0;

}

const onChange = (e) => {
  console.log(e)
}

const show = ref(false)
</script>

<style scoped>
.index {
  display: flex;
  height: 100vh;
}

.calendar-card {
  width: 30%;
  background-color: lightblue;
}

.todo-list {
  width: 70%;
  background-color: lightcoral;
}

.date-container{
  display: flex;
  justify-content: flex-end;
}
</style>
