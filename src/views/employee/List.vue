<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input placeholder="姓名" v-model.trim="listQuery.name" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border class="tableArea" max-height="672" stripe style="border-left: 1px solid #ebeef5;border-right: 1px solid #ebeef5;">
      <el-table-column prop="EmployeeID" label="编号" align="center" width="50" fixed></el-table-column>
      <el-table-column label="姓名" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.FirstName+''+scope.row.LastName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出生日期" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.BirthDate | parseTime('{y}-{m}-{d}')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="入职时间" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.HireDate | parseTime('{y}-{m}-{d}')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="TitleOfCourtesy" label="称呼" width="60px"></el-table-column>
      <el-table-column prop="Title" label="职位" width="160px"></el-table-column>
      <el-table-column prop="City" label="所属城市" width="100px"></el-table-column>
      <el-table-column prop="HomePhone" label="联系电话" width="120px"></el-table-column>
      <el-table-column prop="Notes" label="备注" min-width="100px"></el-table-column>
      <el-table-column label="操作" align="center" width="145px" class-name="small-padding fixed-width">
        <!-- <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleModifyStatus(scope.row,scope.$index)">删除</el-button>
        </template>-->
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="修改" placement="top-start">
            <i class="el-icon-edit-outline" @click="handleUpdate(scope.row)"/>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
            <i class="el-icon-delete" @click="handleModifyStatus(scope.row,scope.$index)"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-show="this.listQuery.total>0"
      background
      class="tableArea"
      style="margin: 10px 0 0 0"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="listQuery.page"
      :page-size="listQuery.limit"
      layout="prev, pager, next, jumper"
      :total="listQuery.total"
    ></el-pagination>
  </div>
</template>

<script>
import api from 'apis'
import { scrollTo } from 'utils/scrollTo'
export default {
  name: 'listEmployee',
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 15,
        total: 0,
        name: null
      },
      list: [],
      listLoading: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    handleUpdate(row) {
      this.$router.push({
        name: 'editEmployee',
        params: {
          id: row.EmployeeID
        }
      })
    },
    handleModifyStatus(row, index) {
      this.$confirm('此操作将永久删除该员工信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          api.deleteEmployeeById(row.EmployeeID).then(response => {
            if (response.retCode == 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.list.splice(index, 1)
            } else {
              this.$message({
                type: 'error',
                message: response.message
              })
            }
          })
        })
        .catch(() => {})
    },
    handleFilter() {
      this.listQuery.page = 1
      this.listQuery.total = 0
      this.fetchData()
    },
    handleSizeChange(val) {
      this.listQuery.page = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.fetchData()
    },
    async fetchData() {
      this.listLoading = true
      const response = await api.getEmployeeList(this.listQuery.page, this.listQuery.limit)
      this.listLoading = false
      if (response.retCode == 200) {
        this.list = response.retData
        if (response.dataCount > 0) {
          this.listQuery.total = response.dataCount
        }
        scrollTo(0, 800)
      } else {
        this.$message({
          message: response.message,
          type: 'error'
        })
      }
    }
  }
}
</script>
<style scoped>
  .tableArea {
    box-shadow: 0 0 8px 0 #aaa;
    width: 99%;
  }
</style>