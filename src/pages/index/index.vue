<template>
  <view>
    <div class="index">
      <div class="cal-card" v-if="isCalendarVisible">
        <nut-calendar-card v-model="calendarsPickDate" @change="onChange" @page-change="onChangeMonth">
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
              <div class="add-task-notify">
                <div class="add-task-notify-title">
                  <nut-checkbox v-model="addTaskNeedNotify">是否需要通知</nut-checkbox>
                </div>
                <div class="add-task-notify-methods">
                  <nut-radio-group v-model="addTaskNotifyType" v-if="addTaskNeedNotify">
                    <nut-radio label='0' shape="button" disabled>微信通知</nut-radio>
                    <nut-radio label='1' shape="button">邮箱通知</nut-radio>
                    <nut-radio label='2' shape="button" disabled>短信通知</nut-radio>
                  </nut-radio-group>
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
            <div>
              {{ currentCount }}
            </div>
            <div class="todo-list-body-title-right-button">
              <nut-button type="info" size="small" @click="baseClickAddTaskTag" >
                添加标签
              </nut-button>
              <nut-dialog title="添加标签" :visible="addTaskTagVisible" @cancel="cancelTagDialog" @ok="onOkAddTaskTag" @opened="openAddTaskTagInit" >
                <nut-input v-model="addTaskTagName" placeholder="标签名称" />
              </nut-dialog>
            </div>
          </div>
        </div>
        <div class="todo-list-body-tag">
          <div class="todo-list-body-title-mid">
            <div class="todo-list-tags">
              <nut-tabs v-model="defaultTaskTagKey" title-scroll type="smile" @click="onChangeTag">
                <nut-tab-pane title="全部" :pane-key = 0>
                  <TaskTodoListBody
                    :columns="todoListColumns"
                    :expiredTaskList="expiredTaskList"
                    :inCompleteTaskList="inCompleteTaskList"
                    :completeTaskList="completeTaskList"
                    :expiredTaskCount="expiredTaskCount"
                    :inCompleteTaskCount="inCompleteTaskCount"
                    :completeTaskCount="completeTaskCount"
                  />
                </nut-tab-pane>
                <nut-tab-pane v-for="(id,tagName) in taskTags" :key="id" :title="tagName" :pane-key="id">
                  <TaskTodoListBody
                    :columns="todoListColumns"
                    :expiredTaskList="expiredTaskList"
                    :inCompleteTaskList="inCompleteTaskList"
                    :completeTaskList="completeTaskList"
                    :expiredTaskCount="expiredTaskCount"
                    :inCompleteTaskCount="inCompleteTaskCount"
                    :completeTaskCount="completeTaskCount"
                  />
                </nut-tab-pane>
              </nut-tabs>

            </div>
            <div class="todo-list-tag-add">

            </div>
          </div>
        </div>
        <!--        <div class="todo-list-body">-->
        <!--          <div class="todo-list-body-expired-task">-->
        <!--            <nut-collapse>-->
        <!--              <nut-collapse-item name="expired-task" title="标题">-->
        <!--                <template #title>超时任务</template>-->
        <!--                <template #value>{{ expiredTaskCount }}</template>-->
        <!--                <nut-table :columns="todoListColumns" :data="expiredTaskList"></nut-table>-->
        <!--              </nut-collapse-item>-->
        <!--            </nut-collapse>-->
        <!--          </div>-->

        <!--          <div class="todo-list-body-incomplete-task">-->
        <!--            <nut-collapse>-->
        <!--              <nut-collapse-item name="name未完成任务" title="未完成任务" value="数量">-->
        <!--                <template #title>未完成任务</template>-->
        <!--                <template #value>{{ inCompleteTaskCount }}</template>-->
        <!--                <nut-table :columns="todoListColumns" :data="inCompleteTaskList"></nut-table>-->
        <!--              </nut-collapse-item>-->
        <!--            </nut-collapse>-->
        <!--          </div>-->

        <!--          <div class="todo-list-body-complete-task">-->
        <!--            <nut-collapse>-->
        <!--              <nut-collapse-item name="name完成任务" title="完成任务" value="数量">-->
        <!--                <template #title>完成任务</template>-->
        <!--                <template #value>{{ completeTaskCount }}</template>-->
        <!--                <nut-table :columns="todoListColumns" :data="completeTaskList"></nut-table>-->
        <!--              </nut-collapse-item>-->
        <!--            </nut-collapse>-->
        <!--          </div>-->
        <!--        </div>-->

      </div>
    </div>
  </view>
</template>

<script setup>
import {computed, h, onMounted, reactive, ref} from 'vue'
import {addTask, getCalendarsAndQuantities, listTask, listTaskTags, updateTaskStatus} from "../../services/home";
import {isLogin} from "../../uitls/request";
import Taro from "@tarojs/taro";
import TaskTodoListBody from "../../components/TaskTodoListBody.vue";
import {addTaskTags} from "../../services/taskTag";

const defaultTaskTagKey = ref('0')

// 选择日期后只会更新时和分，不会更新年月日
const datePickerValue = ref(new Date());
const calendarsPickDate = ref(new Date())
const addTaskVisible = ref(false)
const addTaskTagVisible = ref(false)
const addTaskContent = ref('')
const addTaskNeedNotify = ref(false)
const addTaskNotifyType = ref('1')
const isCalendarVisible = ref(true)
const taskTagId = ref(0)
const addTaskTagName = ref('')

const expiredTaskList = reactive([]);
const expiredTaskCount = ref(0)
const inCompleteTaskList = reactive([]);
const inCompleteTaskCount = ref(0)
const completeTaskList = reactive([]);
const completeTaskCount = ref(0)

const taskTags = reactive([]);


const dailyTaskList = reactive([]);

const todoListColumns = ref([
  {
    title: '时间',
    key: 'taskTime',
  },
  {
    title: '任务详细',
    key: 'taskContent',
  },
  {
    title: '操作',
    key: 'render',
    render: (row, column, index) => {
      // 判断任务类型，根据类型显示不同的按钮
      if (row.taskStatus === 2 || row.taskStatus === 0) {
        return h(
          'button',
          {
            type: 'primary',
            onClick: () => finishTask(row)
          },
          '完成'
        )
      } else if (row.taskStatus === 1) {
        return h(
          'button',
          {
            type: 'warning',
            onClick: () => unFinishTask(row)
          },
          '取消完成'
        )
      }
    }
  }
  // {
  //   title: '操作',
  //   key: 'render'
  // }
])

onMounted(async () => {
  // 判断是否登录，如果没登陆那么跳转到登陆页面
  // 发送请求获取日期对应的任务数量
  const loggedIn = await isLogin();
  if (!loggedIn) {
    // 如果没有登录，跳转到登录页面并终止后续操作
    Taro.redirectTo({url: '/pages/login/login'});
    return;
  }

  const date = new Date(datePickerValue.value);
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const temp = await getCalendarsByMonth(year, month);
  // 获取所有tags
  await getTaskTags();
  // 获取当前天的是所有任务
  await getTaskByDate(year, month, day);
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

function formatTaskTime(taskTime) {
  const date = new Date(taskTime);
  return [date.getHours(), date.getMinutes()].join(':');
}

const getTaskTags = async () => {
  listTaskTags().then((res) => {
    const result = res.data
    taskTags.length = 0
    result.forEach((item) => {
      taskTags.push(item)
    })
  })
}

const getTaskByDate = async (year, month, day) => {
  const tagId = taskTagId.value
  listTask({year, month, day, tagId}).then((res) => {
    const result = res.data;
    // TODO 抽成一个方法
    expiredTaskList.length = 0;
    result.expiredTasks.forEach(item => {
      item.taskTime = formatTaskTime(item.taskTime);
      expiredTaskList.push(item)
    });
    expiredTaskCount.value = result.expiredTasks.length

    inCompleteTaskList.length = 0;
    result.incompleteTasks.forEach(item => {
      item.taskTime = formatTaskTime(item.taskTime);
      inCompleteTaskList.push(item)
    });
    inCompleteTaskCount.value = result.incompleteTasks.length

    completeTaskList.length = 0;
    result.completedTasks.forEach(item => {
      item.taskTime = formatTaskTime(item.taskTime);
      completeTaskList.push(item)
    });
    completeTaskCount.value = result.completedTasks.length
  })
}

const TASK_IN_COMPLETE_STATUS = 0
const TASK_COMPLETE_STATUS = 1
const finishTask = (row) => {
  updateTaskStatus({id: row.id, status: TASK_COMPLETE_STATUS}).then(res => {

    const date = new Date(calendarsPickDate.value);
    const year = date.getFullYear();
    const month = String(date.getMonth()).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    getTaskByDate(year, parseInt(month) + 1, parseInt(day));
    console.log('完成任务:' + row + ',结果:' + res.data)
  })
}

const unFinishTask = (row) => {
  updateTaskStatus({id: row.id, status: TASK_IN_COMPLETE_STATUS}).then(res => {
    const date = new Date(calendarsPickDate.value);
    const year = date.getFullYear();
    const month = String(date.getMonth()).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    getTaskByDate(year, parseInt(month) + 1, parseInt(day));
    console.log('取消完成任务:' + row + ',结果:' + res.data)
  })
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

const baseClickAddTaskTag = () => {
  addTaskTagVisible.value = true;
};

const openAddTaskInit = () => {
  const date = new Date()
  date.setSeconds(0, 0)
  datePickerValue.value = date
  addTaskContent.value = ''
}

const openAddTaskTagInit = () => {
  addTaskTagName.value = ''
}

const onOkAddTaskTag = () =>{
  console.log('添加task tag:'+addTaskTagName.value)
  // 调用添加tag接口
  addTaskTags(addTaskTagName.value).then(res=>{
    if(res.data){
      // 重新获取所有tags
      getTaskTags()
    }
  })


}

const cancelTagDialog = () =>{
  console.log()
  addTaskTagVisible.value = !addTaskTagVisible.value
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
  addTask({
    taskContent: addTaskContent.value,
    taskTime: addDate,
    needNotify: addTaskNeedNotify.value,
    notifyMethod: addTaskNotifyType.value
  }).then((res) => {
    // 添加成功后重新获取日历信息和当日任务
    getCalendarsByMonth(year, parseInt(month) + 1);
    getTaskByDate(year, parseInt(month) + 1, parseInt(day));
  })

}

const changeCalendarVisible = () => {

  isCalendarVisible.value = !isCalendarVisible.value
}

const onChange = async (e) => {
  calendarsPickDate.value = e;
  const year = e.getFullYear()
  const month = e.getMonth() + 1;
  const day = e.getDate();
  await getTaskByDate(year, month, day);
}

const onChangeMonth = ({year, month}) => {
  // 重新请求获取当前年月日期对应的任务
  getCalendarsByMonth(year, month);


}

const onChangeTag = ({title, paneKey, disabled}) => {
  console.log('当前标签id,todo 按照标签查找对应任务:' + paneKey)
  taskTagId.value = paneKey;

  const date = new Date(datePickerValue.value);
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  // 获取当前天的是所有任务
  getTaskByDate(year, month, day);

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
