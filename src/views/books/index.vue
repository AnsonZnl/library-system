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
      <el-table-column prop="author" label="作者" wdith="120">
      </el-table-column>
      <!-- <el-table-column prop="stock" label="库存"> </el-table-column> -->
      <!-- <el-table-column prop="shelfNumber" label="书架位置"> </el-table-column> -->
      <el-table-column prop="price" label="价钱"> </el-table-column>
      <el-table-column prop="summary" label="描述" width="130">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="bookDetail(scope.row)" type="text" size="small"
            >查看</el-button
          >

          <el-button type="text" size="small" @click="bookUpdate(scope.row)"
            >编辑</el-button
          >
          <el-button type="text" size="small" @click="onRemoveBook(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <Pagination :page="listPage" @onPaging="getBookList" />
    </div>

    <el-dialog
      :title="isEdit ? '编辑图书' : '添加图书'"
      :visible.sync="showAddBooks"
    >
      <el-form ref="addForm" :model="bookForm" label-width="120px">
        <el-form-item label="书籍ISBN">
          <el-input
            size="medium"
            placeholder="请输入书籍ISBN"
            v-model="bookForm.isbn"
          />
          <el-button
            v-if="!isEdit"
            :disabled="!bookForm.isbn"
            @click="onGetDouBookInfo"
            >获取豆瓣信息</el-button
          >
        </el-form-item>
        <el-form-item label="书籍名称">
          <el-input
            size="medium"
            placeholder="请输入书籍名称"
            v-model="bookForm.name"
          />
        </el-form-item>
        <el-form-item label="书籍种类">
          <el-input
            size="medium"
            placeholder="请输入书籍种类"
            v-model="bookForm.bookClass"
          />
        </el-form-item>
        <el-form-item label="书籍作者">
          <el-input
            size="medium"
            placeholder="请输入书籍作者"
            v-model="bookForm.author"
          />
        </el-form-item>
        <el-form-item label="书籍价钱">
          <el-input
            size="medium"
            placeholder="请输入书籍价钱"
            v-model="bookForm.price"
          />
        </el-form-item>
        <el-form-item label="书籍描述">
          <el-input
            type="textarea"
            size="medium"
            placeholder="请输入书籍描述"
            v-model="bookForm.summary"
          />
        </el-form-item>
        <el-form-item>
          <el-button v-if="isEdit" type="primary" @click="onEditBook"
            >确定</el-button
          ><el-button v-else type="primary" @click="onAddBook"
            >确定</el-button
          >
          <el-button @click="showAddBooks = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="图书详情" :visible.sync="showBooksDetail" :before-close="()=>{showBooksDetail = false;detailData = {}}">
      <img :src="detailData.images" style="width:300px;height:300px;" alt="">
      <el-descriptions :column="3" size="medium" border>
        <el-descriptions-item label="书籍名称">{{
          detailData.name
        }}</el-descriptions-item>
        <el-descriptions-item label="书籍编码">{{
          detailData.isbn
        }}</el-descriptions-item>
        <el-descriptions-item label="书籍类型">{{
          detailData.bookClass
        }}</el-descriptions-item>
        <el-descriptions-item label="书籍描述">{{
          detailData.summary
        }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getList,
    addBook,
    removeBook,
    getDouBookInfo,
    editBook,
  } from "@/api/books";

  import Pagination from "../../components/Pagination";

  export default {
    components: {
      Pagination,
    },

    data() {
      return {
        list: [],
        showAddBooks: false,
        isEdit: false, // 是否编辑状态
        showBooksDetail: false,
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

        bookForm: {
          name: "",
          isbn: "",
          bookClass: "",
          author: "",
          summary: "",
          // shelfNumber: "",
          price: "",
          // stock: "",
        },
        detailData: {},
      };
    },
    created() {
      this.getBookList(1);
    },
    methods: {
      async bookUpdate(row) {
        let res = await getList(
          {
            page: 1,
            size: this.listPage.page_size,
          },
          { _id: row._id }
        );
        console.log(res);
        this.showAddBooks = true;
        this.bookForm = res.data.list[0];
        this.isEdit = true;
      },
      async onGetDouBookInfo() {
        let isbn = this.bookForm.isbn;
        let res = await getDouBookInfo({ isbn });
        this.bookForm = res.data;
      },
      async bookDetail(row) {
        console.log(row._id);
        let _id = row._id;
        let res = await getList({ page: 1, size: 1 }, { _id });
        this.showBooksDetail = true;
        let data = res.data.list[0]
        var img = data.images
        data.images = img.replace(/https:/g,'https://images.weserv.nl/?url=');
        this.detailData = data

      },
      async onRemoveBook(row) {
        console.log(row);
        let id = row._id;
        await removeBook({ id });
        this.$message({
          message: "删除成功",
          type: "success",
        });
        this.getBookList(1);
      },
      async getBookList(one) {
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
          e.createTime = d.toLocaleDateString() + d.toLocaleTimeString();
          if (e.summary) {
            e.summary = e.summary.slice(0, 10) + "....";
          }
        });
      },
      async searchBook() {
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
          e.createTime = d.toLocaleDateString() + d.toLocaleTimeString();
          if (e.summary) {
            e.summary = e.summary.slice(0, 10) + "....";
          }
        });
      },
      async onAddBook() {
        this.isEdit = false;
        this.showAddBooks = false;
        this.$refs.addForm.resetFields();
        await addBook(this.bookForm);
        this.$message.success("添加成功！");
        await this.getBookList(1);
      },
      async onEditBook() {
        await editBook(this.bookForm);
        this.$refs.addForm.resetFields();
        this.showAddBooks = false;

        await this.getBookList();
      },
    },
  };
</script>

<style scoped>
  .line {
    text-align: center;
  }
</style>
