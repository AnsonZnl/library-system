<template>
  <div class="wrap">
    <h3 class="top-title">数据统计</h3>
    <PanelGroop :vd="topData" />
    <!-- 设备表格 -->
    <!-- <h3 class="top-title">借阅统计</h3> -->

<div style="height:30px;"></div>
    <div id="myChart3" :style="{ width: '100%', height: '500px' }"></div>

    <!-- <el-row class="tablediv" ref="tableContainer">
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
          <el-table-column align="center" prop="trainerName" label="读者姓名">
          </el-table-column>
          <el-table-column align="center" prop="deviceId" label="读者账号">
          </el-table-column>
          <el-table-column align="center" prop="examTotal" label="借阅数量">
          </el-table-column>
          <el-table-column align="center" prop="examTotal" label="借阅时长">
          </el-table-column>
        </el-table>
      </el-col>
    </el-row> -->
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
          count: 11280,
          useTime: 2420,
          errCount: 3405,
          useDevice: 340,
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

    mounted() {
      setTimeout(()=>{

      this.drawLine();
      }, 1000)
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
      getDay(day){
    var today = new Date();
    function doHandleMonth(month){
    var m = month;
    if(month.toString().length == 1){
     m = "0" + month;
    }
    return m;
}
    var targetday_milliseconds=today.getTime() + 1000*60*60*24*day;
    today.setTime(targetday_milliseconds); //注意，这行是关键代码
    var tYear = today.getFullYear();
    var tMonth = today.getMonth();
    var tDate = today.getDate();
    tMonth = doHandleMonth(tMonth + 1);
    tDate = doHandleMonth(tDate);
    return tYear+"-"+tMonth+"-"+tDate;
},
      drawLine() {
        console.log('this.$echarts',this.$echarts);
        // 基于准备好的dom，初始化echarts实例
        let myChart3 = this.$echarts.init(document.getElementById("myChart3"));
        // 绘制图表
        myChart3.setOption({
          title: { text: "借阅统计" }, //图表标题

          tooltip: {},
          xAxis: {
            name: "日期", //x轴标题
            data: [this.getDay(-6), this.getDay(-5), this.getDay(-4), this.getDay(-3), this.getDay(-2), this.getDay(-1), this.getDay(0)], ////x轴数据
          },
          yAxis: {
            name: "本", //y轴标题
            type: "value",
          },
          series: [
            {
              type: "bar", //图表形状
              //柱状图的颜色
              itemStyle: {
                normal: {
                  color: "#5470c6",
                },
              },
              barWidth: 30, //柱图宽度
              data: [60, 45, 80, 13, 23, 54, 24], //图表数据
            },
            {
              type: "bar", //图表形状
              //柱状图的颜色
              itemStyle: {
                normal: {
                  color: "#91cc75",
                },
              },
              barWidth: 30, //柱图宽度
              data: [72, 35, 42, 27, 15, 36, 64], //图表数据
            },
          ],
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
