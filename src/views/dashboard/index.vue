<template>
  <div class="wrap">
    <h3 class="top-title">数据统计</h3>
    <PanelGroop :vd="topData" />
    <!-- 设备表格 -->
    <h3 class="top-title">借阅统计</h3>
    <el-row class="tablediv" ref="tableContainer">
      <el-col :span="24">
        <el-table
          :data="deviceList"
          :border="true"
          style="width: 100%"
          v-loading="tableLoading"
          highlight-current-row
          :height="350"
        >
          <el-table-column align="center" type="index" label="序号" width="50">
          </el-table-column>
          <el-table-column
            align="center"
            prop="trainerName"
            label="学生姓名"
          >
          </el-table-column>
          <el-table-column align="center" prop="deviceId" label="学生账号">
          </el-table-column>
          <el-table-column align="center" prop="examTotal" label="借阅数量">
          </el-table-column>
          <el-table-column align="center" prop="examTotal" label="借阅时长">
          </el-table-column>
         
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import PanelGroop from "./PanelGroop";
  import Pagination from "../../components/Pagination";

  export default {
    components: {
      PanelGroop,
      Pagination,
    },
    data() {
      return {
        version: this.VERSION,
        tableHeight: 0, // 表格高度
        topData: {
          count: 10,
          useTime: 20,
          errCount: 30,
          useDevice: 40,
        },
        deviceList: [],
        deviceName: "", // 当前设备名称
        page: {
          // 考场分页
          total: 15,
          current: 1,
          page_size: 15,
          size: 0,
          page_sizes: [15, 30, 45],
        },
        logList: [],
        isShowExamList: false,
        isShowLogList: false,
        isShowStudentsList: false,
        examList: [],
        studentsList: [],
        isLoading: false,
      };
    },

    methods: {
      getHeight() {
        this.tableHeight = 300;
        return;
        this.$nextTick(function () {
          this.tableHeight =
            window.innerHeight - this.$refs.tableContainer.$el.offsetTop;
          let self = this;
          window.onresize = function () {
            self.tableHeight =
              window.innerHeight - self.$refs.tableContainer.$el.offsetTop;
          };
        });
      },
    },
  };
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
