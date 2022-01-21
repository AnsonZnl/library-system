<template>
  <div class="app-container">
    <el-table
    :data="list"
    border
    style="width: 100%">
    <el-table-column
      fixed
      prop="createTime"
      label="入库日期"
      width="200"
      >
    </el-table-column>
    <el-table-column
      prop="name"
      label="书籍名称"
      >
    </el-table-column>
    <el-table-column
      prop="isbn"
      label="书籍编码"
      >
    </el-table-column>
    <el-table-column
      prop="author"
      label="作者"
      >
    </el-table-column>
    <el-table-column
      prop="stock"
      label="库存"
      >
    </el-table-column>
    <el-table-column
      prop="shelfNumber"
      label="书架位置"
      >
    </el-table-column>
    <el-table-column
      prop="pressPrice"
      label="价钱"
      >
    </el-table-column>
    <el-table-column
      prop="descript"
      label="描述"
      >
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="150">
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
        <el-button type="text" size="small">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>

<el-dialog title="添加图书" :visible.sync="showAddBooks">
      <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="Activity name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="Activity zone">
        <el-select v-model="form.region" placeholder="please select your zone">
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item label="Activity time">
        <el-col :span="11">
          <el-date-picker v-model="form.date1" type="date" placeholder="Pick a date" style="width: 100%;" />
        </el-col>
        <el-col :span="2" class="line">-</el-col>
        <el-col :span="11">
          <el-time-picker v-model="form.date2" type="fixed-time" placeholder="Pick a time" style="width: 100%;" />
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
</el-dialog>
  </div>
</template>

<script>
import {getList} from '@/api/books'

// import { getList } from '@/api/table'
export default {
  data() {
    return {
      list: [],
showAddBooks: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    }
  },
  created(){
    getList({page:1,size:10},{}).then((res) => {
        console.log(res);
        this.list = res.data
        this.list.forEach(e=>{
          let d = new Date(e.createTime)
          e.createTime = d.toLocaleDateString() + d.toLocaleTimeString()
        })
    }).catch((err) => {
      console.error(err);
    });
  },
  methods: {
    onSubmit() {
      this.$message('submit!')
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

