<template>
  <div class="app-container">
    <!-- <el-form ref="form1" :inline="true" :model="searchData" label-width="100px">
      <el-form-item label="书籍名称">
        <el-input
          size="medium"
          placeholder="请输入书籍名称"
          v-model="searchData.name"
        />
      </el-form-item>
      <el-form-item label="书籍ISBN">
        <el-input
          size="medium"
          placeholder="请输入书籍ISBN"
          v-model="searchData.isbn"
        />
      </el-form-item>
      <el-form-item label="书籍种类">
        <el-input
          size="medium"
          placeholder="请输入书籍种类"
          v-model="searchData.bookClass"
        />
      </el-form-item>
      <el-form-item label="书籍作者">
        <el-input
          size="medium"
          placeholder="请输入书籍作者"
          v-model="searchData.author"
        />
      </el-form-item>
      <br />
      <el-form-item style="margin-left: 30px">
        <el-button type="primary" @click="searchBook">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          type=""
          @click="
            searchData = { name: '', isbn: '', bookClass: '', author: '' }
          "
          >重置</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="showAddBooks = true"
          >添加书籍</el-button
        >
      </el-form-item>
    </el-form> -->
    <h2>还书申请列表</h2>
    <el-table :data="list" border style="width: 100%">
      <el-table-column fixed prop="status.username" label="学生姓名" width="">
      </el-table-column>
      <el-table-column prop="status.account" label="学生账号">
      </el-table-column>
      <el-table-column prop="name" label="书籍名称"> </el-table-column>
      <el-table-column prop="author" label="作者"> </el-table-column>
      <el-table-column prop="stock" label="库存"> </el-table-column>
      <el-table-column prop="status.startDate" label="借书日期" width="100">
      </el-table-column>
      <el-table-column prop="status.endDate" label="还书日期" width="100">
      </el-table-column>
      <el-table-column prop="status.borrowDay" label="借书天数" width="100">
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <!-- <el-button @click="handleClick(scope.row)" type="text" size="small"
            >查看</el-button
          > -->

          <el-button type="success" size="mini" @click="passRequest(scope.row)"
            >通过</el-button
          >
          <el-button size="mini" type="danger" @click="rejectRequest(scope.row)"
            >拒绝</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <Pagination :page="listPage" @onPaging="getBookList" />
    </div>

    <!-- <el-dialog title="添加图书" :visible.sync="showAddBooks">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="Activity name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="Activity zone">
          <el-select
            v-model="form.region"
            placeholder="please select your zone"
          >
            <el-option label="Zone one" value="shanghai" />
            <el-option label="Zone two" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item label="Activity time">
          <el-col :span="11">
            <el-date-picker
              v-model="form.date1"
              type="date"
              placeholder="Pick a date"
              style="width: 100%"
            />
          </el-col>
          <el-col :span="2" class="line">-</el-col>
          <el-col :span="11">
            <el-time-picker
              v-model="form.date2"
              type="fixed-time"
              placeholder="Pick a time"
              style="width: 100%"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="Instant delivery">
          <el-switch v-model="form.delivery" />
        </el-form-item>
        <el-form-item label="Activity type">
          <el-checkbox-group v-model="form.type">
            <el-checkbox label="Online activities" name="type" />
            <el-checkbox label="Promotion activities" name="type" />
            <el-checkbox label="Offline activities" name="type" />
            <el-checkbox label="Simple brand exposure" name="type" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="Resources">
          <el-radio-group v-model="form.resource">
            <el-radio label="Sponsor" />
            <el-radio label="Venue" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Activity form">
          <el-input v-model="form.desc" type="textarea" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">Create</el-button>
          <el-button @click="onCancel">Cancel</el-button>
        </el-form-item>
      </el-form>
    </el-dialog> -->
  </div>
</template>

<script>
  import { getReturnList, isPassReturn } from "@/api/books";

  import Pagination from "../../components/Pagination";

  export default {
    components: {
      Pagination,
    },

    data() {
      return {
        list: [],
        showAddBooks: false,
        listPage: {
          // 考场分页
          total: 40,
          current: 1,
          page_size: 12,
          size: 0,
          page_sizes: [15, 30, 45],
        },
        searchData: {
          name: "",
          isbn: "",
          bookClass: "",
          author: "",
        },
        form: {
          name: "",
          region: "",
          date1: "",
          date2: "",
          delivery: false,
          type: [],
          resource: "",
          desc: "",
        },
      };
    },
    created() {
      this.getBookList(1);
    },
    methods: {
      passRequest: async function (row) {
        console.log(row);
        let data = row.status;
        // debugger
        let res = await isPassReturn({
          isPass: 1,
          userid: data.userid,
          bookid: data.bookid,
          id: data.borrwoId,
        });
        console.log(res);
        this.getBookList(1);
      },
      rejectRequest: async function (row) {
        let data = row.status;
        let res = await isPassReturn({
          isPass: 3,
          userid: data.userid,
          bookid: data.bookid,
          id: data.borrwoId,
        });
        console.log(res);
        this.getBookList(1);
      },
      getBookList(one) {
        // let { province, city, examName } = this.examSearch;
        // this.examTableLoading = true;
        if (one) {
          this.listPage.current = 1;
        }

        getReturnList({
          page: one ? 1 : this.listPage.current,
          size: this.listPage.page_size,
        })
          .then((res) => {
            console.log(res);
            this.list = res.data.list;
            this.listPage.total = res.data.total;
            this.list.forEach((e) => {
              let d = new Date(e.createTime);
              e.createTime = d.toLocaleDateString() + d.toLocaleTimeString();
            });
          })
          .catch((err) => {
            console.error(err);
          });
      },
      searchBook() {
        console.log("searchData", this.searchData);
        getList(
          {
            page: 1,
            size: this.listPage.page_size,
          },
          { ...this.searchData }
        )
          .then((res) => {
            console.log(res);
            this.list = res.data.list;
            this.listPage.total = res.data.total;
            this.list.forEach((e) => {
              let d = new Date(e.createTime);
              e.createTime = d.toLocaleDateString() + d.toLocaleTimeString();
            });
          })
          .catch((err) => {
            console.error(err);
          });
      },
      onSubmit() {
        this.$message("submit!");
      },
      onCancel() {
        this.$message({
          message: "cancel!",
          type: "warning",
        });
      },
    },
  };
</script>

<style scoped>
  .line {
    text-align: center;
  }
</style>
