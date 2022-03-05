<template>
  <div class="app-container">
    <el-form ref="form1" :inline="true" :model="searchData" label-width="100px">
      <el-form-item label="读者姓名">
        <el-input
          size="medium"
          placeholder="请输入读者姓名"
          v-model="searchData.username"
        />
      </el-form-item>
      <el-form-item label="读者账号">
        <el-input
          size="medium"
          placeholder="请输入读者账号"
          v-model="searchData.account"
        />
      </el-form-item>

      <el-form-item style="margin-left: 30px">
        <el-button type="primary" @click="searchStudent">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="" @click="searchData = { username: '', account: '' }"
          >重置</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="showAddStudent = true"
          >添加读者</el-button
        >
      </el-form-item>
    </el-form>
    <el-table :data="list" border style="width: 100%; height: 100%">
      <el-table-column fixed="left" type="index" label="序号" width="50">
      </el-table-column>
      <el-table-column prop="createTime" label="注册日期" width="170">
      </el-table-column>
      <el-table-column prop="username" label="读者名称"> </el-table-column>
      <el-table-column prop="account" label="读者账号"> </el-table-column>
      <el-table-column prop="info.borrwoCount" label="可借数量">
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="studentDetail(scope.row)" type="text" size="small"
            >查看</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="onRemoveStudent(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <Pagination :page="listPage" @onPaging="getStudentList" />
    </div>

    <el-dialog title="添加读者" :visible.sync="showAddStudent">
      <el-form ref="addForm" :model="studentForm" label-width="120px">
        <el-form-item label="读者姓名">
          <el-input
            size="medium"
            placeholder="请输入读者姓名"
            v-model="studentForm.username"
          />
        </el-form-item>
        <el-form-item label="读者账号">
          <el-input
            size="medium"
            placeholder="请输入读者账号"
            v-model="studentForm.account"
          />
        </el-form-item>
        <el-form-item label="读者密码">
          <el-input
            size="medium"
            placeholder="请输入读者密码"
            v-model="studentForm.password"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onAddStudent">确定</el-button>
          <el-button @click="showAddStudent = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="读者详情" :visible.sync="showBooksDetail">
      <el-descriptions :column="4" size="medium" border>
        <el-descriptions-item label="读者名称">{{
          detailData.username
        }}</el-descriptions-item>
        <el-descriptions-item label="读者账号">{{
          detailData.account
        }}</el-descriptions-item>
        <el-descriptions-item label="读者密码">{{
          detailData.password
        }}</el-descriptions-item>
        <el-descriptions-item label="可借数量">{{
          detailData.info.borrwoCount
        }}</el-descriptions-item>
        <el-table
          :data="detailData.info.borrwo"
          border
          style="width: 100%; height: 100%"
        >
          <el-table-column fixed="left" type="index" label="序号" width="50">
          </el-table-column>
          <el-table-column prop="bookId" label="书籍ID"></el-table-column>
          <el-table-column prop="startDate" label="开始日期"></el-table-column>
          <el-table-column prop="endDate" label="还书日期"></el-table-column>
        </el-table>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getList,
    addStudent,
    studentInfo,
    removeStudent,
  } from "@/api/student";

  import Pagination from "../../components/Pagination";

  export default {
    components: {
      Pagination,
    },

    data() {
      return {
        list: [],
        showAddStudent: false,
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
          username: "",
          account: "",
        },
        studentForm: {
          username: "",
          account: "",
          password: "",
        },
        detailData: {
          info: {
            borrwo: [{
                bookId: "",
                startDate: "",
                endDate: "",
            }], // 借书列表
            borrwoCount: 5, // 可借书数量
        },
        },
      };
    },
    created() {
      this.getStudentList(1);
    },
    methods: {
      async studentDetail(row) {
        console.log(row._id);
        let _id = row._id;
        let res = await studentInfo({ _id });
        this.showBooksDetail = true;
        this.detailData = res.data;
      },
      async onRemoveStudent(row) {
        console.log(row);
        let id = row._id;
        await removeStudent({ id });
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
        let res = await getList(
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
          e.createTime = d.toLocaleDateString()  +' '+  d.toLocaleTimeString();
          if (e.summary) {
            e.summary = e.summary.slice(0, 10) + "....";
          }
        });
      },
      async searchStudent() {
        console.log("searchData", this.searchData);
        let res = await getList(
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
          e.createTime = d.toLocaleDateString()  +' '+  d.toLocaleTimeString();
          if (e.summary) {
            e.summary = e.summary.slice(0, 10) + "....";
          }
        });
      },
      async onAddStudent() {
        this.showAddStudent = false;
        this.$refs.addForm.resetFields();
        await addStudent(this.studentForm);
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
