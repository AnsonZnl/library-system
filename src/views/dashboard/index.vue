<template>
    <div class="wrap">
        <h3 class="top-title">设备今日使用情况</h3>
        <PanelGroop :vd="topData" />
        <!-- 设备表格 -->
        <h3 class="top-title">设备使用记录</h3>
        <el-row class="tablediv" ref="tableContainer">
            <el-col :span="24">
                <el-table :data="deviceList" :border="true" style="width: 100%" v-loading="tableLoading" highlight-current-row :height="350">
                    <el-table-column align="center" type="index" label="序号" width="50"> </el-table-column>
                    <el-table-column align="center" prop="trainerName" label="教练昵称" width=""> </el-table-column>
                    <el-table-column align="center" prop="deviceId" label="设备ID"> </el-table-column>
                    <el-table-column align="center" prop="examTotal" label="今日考试总量"> </el-table-column>
                    <el-table-column align="center" prop="useTimeTotal" label="考试总时长(分钟)"> </el-table-column>
                    <el-table-column align="center" label="操作" width="200">
                        <template slot-scope="scope">
                            <el-button @click="getLog(scope.row)" type="text" size="small">日志查询</el-button>
                            <el-button @click="getExamList(scope.row)" type="text" size="small">考试列表</el-button>
                            <!-- <el-button @click="getStudentsList(scope.row)" type="text" size="small">学生列表</el-button> -->
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>

        <!-- 弹窗 -->
        <el-dialog title="考试列表" :visible.sync="isShowExamList" width="80%">
            <!-- 指令表格 -->
            <div class="table">
                <el-table :data="examList" border style="width: 80%" v-loading="" highlight-current-row :height="tableHeight">
                    <el-table-column align="center" fixed type="index" label="序号"> </el-table-column>
                    <!-- <el-table-column align="center" prop="studentId" label="学生ID" width="160"> </el-table-column> -->
                    <el-table-column align="center" prop="nickname" label="学生姓名" width="160"> </el-table-column>
                    <el-table-column align="center" prop="phone" label="手机号"> </el-table-column>
                    <el-table-column align="center" prop="scope" label="头像">
                        <template slot-scope="scope">
                            <img :src="scope.row.userface" alt="" style="display:block;width:50px;height:50px;margin:auto;" />
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="examModel" label="考试模式">
                        <template slot-scope="scope">
                            {{ scope.row.examModel | fe }}
                        </template>
                    </el-table-column>
                    <!-- <el-table-column align="center" prop="trainerId" label="教练ID"> </el-table-column> -->
                    <el-table-column align="center" prop="startTime" label="开始考试时间" width="160"> </el-table-column>
                    <el-table-column align="center" prop="endTime" label="结束考试时间" width="160"> </el-table-column>
                    <el-table-column align="center" prop="useTime" label="使用时长(分钟)" width="120"> </el-table-column>
                    <el-table-column align="center" prop="distance" label="距离(米)"> </el-table-column>
                    <!-- <el-table-column align="center" prop="systemId" label="考场ID"> </el-table-column> -->
                    <el-table-column align="center" prop="score" fixed="right" label="得分"> </el-table-column>
                </el-table>
            </div>
        </el-dialog>
        <!-- 弹窗 -->
        <!-- <el-dialog title="学生列表" :visible.sync="isShowStudentsList" width="80%">
            <div class="table">
                <el-table :data="studentsList" border style="width: 80%" v-loading="" highlight-current-row :height="tableHeight">
                    <el-table-column align="center" fixed type="index" label="序号"> </el-table-column>
                    <el-table-column align="center" prop="id" label="学生ID" width=""> </el-table-column>
                    <el-table-column align="center" prop="nickname" label="学生姓名"> </el-table-column>
                    <el-table-column align="center" prop="phone" label="手机号"> </el-table-column>
                    <el-table-column align="center" prop="score" label="头像">
                        <template slot-scope="scope">
                            <img :src="scope.row.userface" alt="" style="display:block;width:50px;height:50px;margin:auto;" />
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-dialog> -->
        <!-- 弹窗 -->
        <el-dialog title="日志列表" :visible.sync="isShowLogList" width="80%">
            <!-- 指令表格 -->
            <!-- device 设备id。  filename日志名。    url日志路径。 createTime创建时间。  state。状态 -->
            <div class="table">
                <el-table :data="logList" border style="width: 80%" v-loading="" highlight-current-row :height="tableHeight">
                    <el-table-column align="center" fixed type="index" label="序号"> </el-table-column>
                    <el-table-column align="center" prop="device" label="设备ID" width=""> </el-table-column>
                    <el-table-column align="center" prop="fileName" label="日志名"> </el-table-column>
                    <el-table-column align="center" prop="url" label="日志路径">
                        <template slot-scope="scope">
                            <a :href="scope.row.url" alt="" style="color:#409EFF;">{{ scope.row.url }}</a>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="createTime" label="创建时间"> </el-table-column>
                    <el-table-column align="center" prop="state" label="状态">
                        <template slot-scope="scope">
                            <span>{{ scope.row.state == 0 ? '没过期' : '已过期' }}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-dialog>
        <!-- 考场分页器 -->
        <div class="page">
            <!-- 版本号 -->
            <div style="display: flex">
                <!-- {{ version }} -->
            </div>
            <div class="block">
                <Pagination :page="page" @onPaging="getDeviceList" />
            </div>
        </div>
        <!-- 设备历史使用情况 -->
        <h3 class="top-title">设备历史使用情况</h3>

        <div class="block" style="margin-bottom: 30px;">
            <!-- <span class="demonstration">带快捷选项</span> -->
            <el-date-picker v-model="historyDate" type="datetimerange" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
            </el-date-picker>
            <el-button @click="getHistoryData" type="primary">确定</el-button>
        </div>
        <!-- 历史设备列表 -->
        <el-row class="tablediv" ref="tableContainer">
            <el-col :span="24">
                <el-table :data="histroyList" :border="true" style="width: 100%" v-loading="isLoading" highlight-current-row :height="350">
                    <el-table-column align="center" type="index" label="序号" width="50"> </el-table-column>
                    <el-table-column align="center" prop="time" label="日期"> </el-table-column>
                    <el-table-column align="center" prop="deviceNumber" label="考试设备数量" width=""> </el-table-column>
                    <el-table-column align="center" prop="trainingTimes" label="训练次数" width=""> </el-table-column>
                    <el-table-column align="center" prop="examTimes" label="考试使用时间(分钟)" width=""> </el-table-column>
                </el-table>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import axios from 'axios'
import { Message } from 'element-ui'
import PanelGroop from './PanelGroop'
import { parseTime } from '../../utils'
import Pagination from '../../components/Pagination'
const http = axios.create({
    baseURL: 'https://xxx.xxxx.com/',
    timeout: 15 * 1000
})
export default {
    components: {
        PanelGroop,
        Pagination
    },
    data() {
        return {
            version: this.VERSION,
            tableHeight: 0, // 表格高度
            topData: {},
            deviceList: [],
            deviceName: '', // 当前设备名称
            page: {
                // 考场分页
                total: 15,
                current: 1,
                page_size: 15,
                size: 0,
                page_sizes: [15, 30, 45]
            },
            logList: [],
            isShowExamList: false,
            isShowLogList: false,
            isShowStudentsList: false,
            examList: [],
            studentsList: [],
            isLoading: false,
            pickerOptions: {
                shortcuts: [
                    {
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                            picker.$emit('pick', [start, end])
                        }
                    },
                    {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                            picker.$emit('pick', [start, end])
                        }
                    },
                    {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                            picker.$emit('pick', [start, end])
                        }
                    }
                ]
            },
            historyDate: [],
            histroyList: []
        }
    },
    beforeMount() {
        this.getHeight()
        this.getAllData()
        this.getDeviceList()

        // 默认当天的日期和时间间
        let now1 = new Date()
        let now2 = new Date()
        now2.setTime(now1.getTime() - 24 * 60 * 60 * 1000)
        // value1: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
        this.historyDate[1] = now1
        this.historyDate[0] = now2
        this.getHistoryData()
    },
    filters: {
        fe: function(value) {
            let res = ''
            if (value == 1) {
                res = '基础训练'
            } else if (value == 2) {
                res = '模拟考试'
            } else if (value == 3) {
                res = '基础训练-灯光模拟'
            } else if (value == 4) {
                res = '模拟考试-灯光模拟'
            } else {
                res = '--'
            }
            return res
        }
    },
    methods: {
        getDeviceList() {
            this.tableLoading = true
            http.get('/xxxx/devicePage', {
                params: {
                    current: this.page.current,
                    size: this.page.page_size
                }
            })
                .then(result => {
                    let data = result.data.result
                    this.tableLoading = false
                    this.page.total = data.total
                    this.deviceList = data.list
                })
                .catch(err => {
                    this.tableLoading = false
                    console.error(err)
                })
        },
        getAllData() {
            http.get('/xxxx/all')
                .then(result => {
                    console.log(result, result.data.result)
                    let data = result.data.result
                    // data.useTime = Math.ceil(data.useTime / 60)
                    this.topData = data
                })
                .catch(err => {
                    console.error(err)
                })
        },
        getLog(row) {
            http.get('/logFileList', {
                params: {
                    deviceId: row.deviceId,
                    state: 0
                }
            }).then(res => {
                // console.log(res);
                let data = res.data.result
                if (data.length == 0) {
                    Message.warning('当前设备无日志')
                } else {
                    this.isShowLogList = true
                    this.logList = data
                }
            })
        },
        getExamList(row) {
            http.get('/xxxx/examList', {
                params: { deviceId: row.deviceId }
            })
                .then(result => {
                    this.isShowExamList = true
                    // this.deviceName = row.deviceId
                    let data = result.data.result

                    let studentsList = data.students
                    this.examList = data.exams
                    this.examList.forEach(e1 => {
                        studentsList.forEach(e2 => {
                            if (e1.studentId == e2.id) {
                                e1.nickname = e2.nickname
                                e1.phone = e2.phone
                                e1.userface = e2.userface
                            }
                        })
                    })
                    // console.log(this.examList);
                    // this.studentsList = data.sutdents
                })
                .catch(err => {
                    this.isShowExamList = true
                    console.error(err)
                })
        },
        getStudentsList(row) {
            http.get('/xxxx/examList', {
                params: { deviceId: row.deviceId }
            })
                .then(result => {
                    this.isShowStudentsList = true
                    let data = result.data.result
                    this.studentsList = data.students
                })
                .catch(err => {
                    this.isShowStudentsList = true
                    console.error(err)
                })
        },
        getHeight() {
            this.tableHeight = 300
            return
            this.$nextTick(function() {
                this.tableHeight = window.innerHeight - this.$refs.tableContainer.$el.offsetTop
                let self = this
                window.onresize = function() {
                    self.tableHeight = window.innerHeight - self.$refs.tableContainer.$el.offsetTop
                }
            })
        },
        getHistoryData() {
            // parseTime()
            console.log(this.historyDate)
            
            let startTime = parseTime(this.historyDate[0])
            let endTime = parseTime(this.historyDate[1])
            console.log({ startTime, endTime })
            // return
            http.get('/xxxx/getUseDeviceDetail', {
                params: { startTime, endTime }
            })
                .then(result => {
                    this.isLoading = false
                    let data = result.data.result
                    this.histroyList = data
                })
                .catch(err => {
                    this.isLoading = false
                    console.error(err)
                })
        }
    }
}
</script>

<style lang="scss" scoped>
.wrap {
    padding: 32px;
    background-color: #f0f2f5;
    padding-bottom: 90px;
    // height: 100vh;
    box-sizing: border-box;
    .top-title {
        margin-bottom: 30px;
    }
}

.page {
    display: flex;
    height: 80px;
    align-items: center;
    float: right;
    color: #999;
    justify-content: flex-end;
    width: 100%;
    justify-content: space-between;
}
.el-row {
    // margin-bottom: 20px;
    &:last-child {
        margin-bottom: 0;
    }
}
.el-col {
    border-radius: 4px;
}
.bg-purple-dark {
    background: #99a9bf;
}
.bg-purple {
    background: #d3dce6;
}
.bg-purple-light {
    background: #e5e9f2;
}
.grid-content {
    border-radius: 4px;
    min-height: 36px;
}
.row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
}
</style>
