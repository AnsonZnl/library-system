<template>
  <div class="app-container">
    <el-form ref="form1" :inline="true" :model="searchData" label-width="100px">
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
    </el-form>
    <el-table :data="list" border style="width: 100%; height: 100%">
      <el-table-column fixed="left" type="index" label="序号" width="50">
      </el-table-column>
      <el-table-column prop="createTime" label="入库日期" width="170">
      </el-table-column>
      <el-table-column prop="name" label="书籍名称"> </el-table-column>
      <el-table-column prop="bookClass" label="书籍类别"> </el-table-column>
      <el-table-column prop="isbn" label="书籍编码"> </el-table-column>
      <el-table-column prop="author" label="作者" wdith="120"> </el-table-column>
      <el-table-column prop="stock" label="库存"> </el-table-column>
      <el-table-column prop="shelfNumber" label="书架位置"> </el-table-column>
      <el-table-column prop="pressPrice" label="价钱"> </el-table-column>
      <el-table-column prop="descript" label="描述" width="130"> </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small"
            >查看</el-button
          >

          <el-button type="text" size="small">编辑</el-button>
          <el-button type="text" size="small" @click="onRemoveBook(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <Pagination :page="listPage" @onPaging="getBookList" />
    </div>

    <el-dialog title="添加图书" :visible.sync="showAddBooks">
      <el-form ref="addForm" :model="addBook" label-width="120px">
        <el-form-item label="书籍名称">
          <el-input
            size="medium"
            placeholder="请输入书籍名称"
            v-model="addBook.name"
          />
        </el-form-item>
        <el-form-item label="书籍ISBN">
          <el-input
            size="medium"
            placeholder="请输入书籍ISBN"
            v-model="addBook.isbn"
          />
        </el-form-item>
        <el-form-item label="书籍种类">
          <el-input
            size="medium"
            placeholder="请输入书籍种类"
            v-model="addBook.bookClass"
          />
        </el-form-item>
        <el-form-item label="书籍作者">
          <el-input
            size="medium"
            placeholder="请输入书籍作者"
            v-model="addBook.author"
          />
        </el-form-item>
        <el-form-item label="书籍书架">
          <el-input
            size="medium"
            placeholder="请输入书籍书架"
            v-model="addBook.shelfNumber"
          />
        </el-form-item>
        <el-form-item label="书籍价钱">
          <el-input
            size="medium"
            placeholder="请输入书籍价钱"
            v-model="addBook.pressPrice"
          />
        </el-form-item>
        <el-form-item label="书籍库存">
          <el-input
            size="medium"
            type="number"
            placeholder="请输入书籍库存"
            v-model="addBook.stock"
          />
        </el-form-item>
        <el-form-item label="书籍描述">
          <el-input
            type="textarea"
            size="medium"
            placeholder="请输入书籍描述"
            v-model="addBook.descript"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onAddBook">添加</el-button>
          <el-button @click="onCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import { getList, addBook, removeBook } from "@/api/books";

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
          page_size: 10,
          size: 0,
          page_sizes: [10, 30, 50],
        },
        searchData: {
          name: "",
          isbn: "",
          bookClass: "",
          author: "",
        },

        addBook: {
          name: "",
          isbn: "",
          bookClass: "",
          author: "",
          descript: "",
          shelfNumber: "",
          pressPrice: "",
          stock: "",
        },
      };
    },
    created() {
      this.getBookList(1);
    },
    methods: {
      onRemoveBook(row) {
        console.log(row);
        let id = row._id;
        removeBook({ id })
          .then((result) => {
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.getBookList(1)
          })
          .catch((err) => {
            this.$message({
              message: "cancel!",
              type: "warning",
            });
          });
      },
      getBookList(one) {
        // let { province, city, examName } = this.examSearch;
        // this.examTableLoading = true;
        if (one) {
          this.listPage.current = 1;
        }

        getList(
          {
            page: one ? 1 : this.listPage.current,
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
      onAddBook() {
        addBook(this.addBook)
          .then((res) => {
            this.$message.success("添加成功！");
            this.showAddBooks = false;
            this.$refs.addForm.resetFields();
          })
          .catch((err) => {
            this.$message({
              message: "cancel!",
              type: "warning",
            });
          });
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
