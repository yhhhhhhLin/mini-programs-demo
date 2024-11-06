<template>
  <view>
    <div class="index">
      <div class="cal-card" v-if="isCalendarVisible">
        <nut-calendar-card v-model="calendarsPickDate" @change="onChange" @page-change = "onChangeMonth">
          <template #top="{ day }">
            <div class="date-container">
              {{
                hasTask([String(day.year), String(day.month).padStart(2, '0'), String(day.date).padStart(2, '0')].join('-')) ? getCount([String(day.year), String(day.month).padStart(2, '0'), String(day.date).padStart(2, '0')].join('-')) : ''
              }}
            </div>
          </template>
        </nut-calendar-card>
      </div>
      <div>
        <nut-cell title="展示隐藏日历" @click="changeCalendarVisible"></nut-cell>
      </div>
      <div class="todo-list">
        <div class="todo-list-title">
          <div class="todo-list-title-date">
            日期：{{ formattedDate }}
          </div>

          <div class="todo-list-title-add-task">
            <nut-button plain type="info" @click="baseClickAddTask">添加当天任务</nut-button>
            <nut-dialog title="添加任务" v-model:visible="addTaskVisible" @ok="onOkAddTask" @opened="openAddTaskInit">
              <div>
                选择时间:
              </div>
              <div class="add-task-date-picker">
                <nut-date-picker
                  v-model="datePickerValue"
                  option-height="20"
                  :show-toolbar="false"
                  type="hour-minute"
                  :three-dimensional="false"
                >
                </nut-date-picker>
              </div>
              <div class="add-task-content">
                <div class="add-task-content-title">请输入任务内容：</div>
                <div class="add-task-content-body">
                  <nut-input v-model="addTaskContent" placeholder="输入任务内容"/>
                </div>
              </div>
            </nut-dialog>
          </div>
        </div>
        <div class="todo-list-body-title">
          <div class="todo-list-body-title-left">
            代办内容：
          </div>
          <div class="todo-list-body-title-right">
            {{ currentCount }}
          </div>
        </div>
        <div class="todo-list-body">
          <nut-table :columns="todoListColumns" :data="taskDetailData"></nut-table>
        </div>
      </div>
    </div>
  </view>
</template>

<script setup>
import {computed, h, onMounted, reactive, ref} from 'vue'
import {addTask, getCalendarsAndQuantities} from "../../services/home";
import {isLogin} from "../../uitls/request";
import Taro from "@tarojs/taro";

// 选择日期后只会更新时和分，不会更新年月日
const datePickerValue = ref(new Date());
const calendarsPickDate = ref(new Date())
const addTaskVisible = ref(false)
const addTaskContent = ref('')
const isCalendarVisible = ref(true)

const dailyTaskList = reactive([
]);

const taskDetailData = ref([
  {
    TaskTime: '2024-9-10',
    taskDetail: '这是任务详细',
    render: () => {
      return h(
        'button',
        {
          onClick: () => {
            console.log('完成某个任务')
          }
        },
        '完成'
      )
    }
  },
])

const todoListColumns = ref([
  {
    title: '时间',
    key: 'TaskTime'
  },
  {
    title: '任务详细',
    key: 'taskDetail'
  },
  {
    title: '操作',
    key: 'render'
  }
])

onMounted(async () => {
  // 判断是否登录，如果没登陆那么跳转到登陆页面
  // 发送请求获取日期对应的任务数量
  const loggedIn = await isLogin();
  if (!loggedIn) {
    // 如果没有登录，跳转到登录页面并终止后续操作
    Taro.redirectTo({url: '/pages/login/login'});
    return; // 终止后续的请求调用
  }

  const date = new Date(datePickerValue.value);
  const month = String(date.getMonth()+1).padStart(2, '0');
  const year = date.getFullYear()
  const temp = await getCalendarsByMonth(year,month);
})

const getCalendarsByMonth = async (year, month) => {

  getCalendarsAndQuantities(year, month).then((res => {
    const dayAndCountVOs = res.data
    dailyTaskList.length = 0
    dayAndCountVOs.forEach(item => {
      dailyTaskList.push(item);
    });
  }))
}

const hasTask = (day) => {
  return dailyTaskList.some(task => task.taskDay === day);
}

const getCount = (day) => {
  const task = dailyTaskList.find(task => task.taskDay === day);
  return task ? task.taskCount : 0;
}

const currentCount = computed(() => {
  return getCount(formattedDate.value);
});

const formattedDate = computed(() => {
  const date = new Date(calendarsPickDate.value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
});

const baseClickAddTask = () => {
  addTaskVisible.value = true;
};

const openAddTaskInit = () => {
  datePickerValue.value = new Date()
  addTaskContent.value = ''
}

const onOkAddTask = () => {
  const addDate = new Date(datePickerValue.value)

  const date = new Date(calendarsPickDate.value);
  const year = date.getFullYear();
  const month = String(date.getMonth()).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  addDate.setFullYear(year)
  addDate.setMonth(month)
  addDate.setDate(day)
  addTask({taskContent: addTaskContent.value, taskTime: addDate, needNotify: false}).then((res) => {
    // 添加成功后重新获取日历信息和当日任务
    getCalendarsByMonth(year,parseInt(month)+1);

    console.log("添加任务返回结果：%s",res.data)
  })

}

const changeCalendarVisible = () => {

  isCalendarVisible.value = !isCalendarVisible.value
}

const onChange = (e) => {
  calendarsPickDate.value = e;
  console.log('发送请求获取当前日期对应的所有任务，更新到代办内容中')
}

const onChangeMonth = ({year, month})=>{
  console.log("切换日期年月,年：{}，月：{}",year,month)
  // 重新请求获取当前年月日期对应的任务
  getCalendarsByMonth(year,month);


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
