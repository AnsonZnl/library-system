<template>
  <div class="app-container">
    <el-form ref="form1" :inline="true" :model="searchData" label-width="100px">
      <el-form-item label="公告标题">
        <el-input
          size="medium"
          placeholder="请输入公告标题"
          v-model="searchData.title"
        />
      </el-form-item>
      <el-form-item style="margin-left: 30px">
        <el-button type="primary" @click="searchStudent">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="" @click="searchData = { title: '', content: '' }"
          >重置</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="showaddFeedback = true"
          >添加公告</el-button
        >
      </el-form-item>
    </el-form>
    <el-table :data="list" border style="width: 100%; height: 100%">
      <el-table-column fixed="left" type="index" label="序号" width="50">
      </el-table-column>
      <el-table-column prop="createTime" label="公告日期" width="170">
      </el-table-column>
      <el-table-column prop="title" label="公告标题"> </el-table-column>
      <el-table-column prop="content" label="公告内容"> </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="showDetail(scope.row)" type="text" size="small"
            >预览查看</el-button>
            <el-button v-if="scope.row.isShow" @click="showNotice(scope.row)" type="text" size="small"
            >[正在展示]</el-button>
            <el-button v-if="!scope.row.isShow" @click="showNotice(scope.row)" type="text" size="small"
            >设为展示</el-button>
          <el-button
            type="text"
            size="small"
            @click="onremoveFeedback(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <Pagination :page="listPage" @onPaging="getStudentList" />
    </div>

    <el-dialog title="添加公告" :visible.sync="showaddFeedback">
      <el-form ref="addForm" :model="noticeForm" label-width="120px">
        <el-form-item label="公告标题">
          <el-input
            size="medium"
            placeholder="请输入公告内容"
            v-model="noticeForm.title"
          />
        </el-form-item>
        <el-form-item label="公告内容">
          <el-input

         type="textarea"
  :rows="6"
            size="medium"
            placeholder="请输入公告内容"
            v-model="noticeForm.content"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="onaddFeedback">确定</el-button>
          <el-button @click="showaddFeedback = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="公告详情" :visible.sync="showBooksDetail">
   
  <h3>公告标题</h3>
  <div>{{detailData.title}}</div>
  <h3>公告内容</h3>
  <div>{{detailData.content}}</div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    
    
    getFeedbackList,
addFeedback,
removeFeedback,
showFeedback
  } from "@/api/notice";

  import Pagination from "../../components/Pagination";

  export default {
    components: {
      Pagination,
    },

    data() {
      return {
        list: [],
        showaddFeedback: false,
        isEdit: false, // 是否编辑状态
        showBooksDetail: false,
        listPage: {
          total: 40,
          current: 1,
          page_size: 10,
          size: 0,
          page_sizes: [10, 30, 50],
        },
        searchData: {
          title: "",
          content: "",
        },
        noticeForm: {
          title: "",
          content: "",
          
        },
        detailData: {},
      };
    },
    created() {
      this.getStudentList(1);
    },
    methods: {
      async showNotice(row){
            let id = row._id;
        await showFeedback({ id });
        this.$message({
          message: "展示成功",
          type: "success",
        });
        this.getStudentList(1);
      },
       showDetail(row) {
        console.log(row._id);
        this.showBooksDetail = true;
        this.detailData = row;
      },
      async onremoveFeedback(row) {
        console.log(row);
        let id = row._id;
        await removeFeedback({ id });
        this.$message({
          message: "删除成功",
          type: "success",
        });
        this.getStudentList(1);
      },
      async getStudentList(one) {
        if (one) {
          this.listPage.current = 1;
        }
        let res = await getFeedbackList(
          {
            page: one ? 1 : this.listPage.current,
            size: this.listPage.page_size,
          },
          { ...this.searchData }
        );
        this.list = res.data.list;
        this.listPage.total = res.data.total;
        this.list.forEach((e) => {
          let d = new Date(e.createTime);
          e.createTime = d.toLocaleDateString() + d.toLocaleTimeString();
          if (e.summary) {
            e.summary = e.summary.slice(0, 10) + "....";
          }
        });
      },
      async searchStudent() {
        console.log("searchData", this.searchData);
        let res = await getFeedbackList(
          {
            page: 1,
            size: this.listPage.page_size,
          },
          { ...this.searchData }
        );
        console.log(res);
        this.list = res.data.list;
        this.listPage.total = res.data.total;
        this.list.forEach((e) => {
          let d = new Date(e.createTime);
          e.createTime = d.toLocaleDateString() + d.toLocaleTimeString();
        
        });
      },
      async onaddFeedback() {
        this.showaddFeedback = false;
        this.$refs.addForm.resetFields();
        await addFeedback(this.noticeForm);
        this.$message.success("添加成功！");
        await this.getStudentList(1);
      },
    },
  };
</script>

<style scoped>
  .line {
    text-align: center;
  }
</style>
