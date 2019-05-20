<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input placeholder="企业名称" v-model.trim="listQuery.companyName" style="width: 200px" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input placeholder="联系人" v-model.trim="listQuery.contactName" style="width: 120px" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input placeholder="电话" v-model.trim="listQuery.phone" style="width: 120px" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column prop="CustomerID" label="编号" align="center" width="70" fixed></el-table-column>
      <el-table-column prop="CompanyName" label="企业名称" width="260"></el-table-column>
      <el-table-column prop="City" label="所属城市" width="120"></el-table-column>
      <el-table-column prop="ContactName" label="联系人" width="120"></el-table-column>
      <el-table-column prop="Phone" label="联系电话" width="120"></el-table-column>
      <el-table-column prop="Address" label="详细地址" min-width="100px"></el-table-column>
      <el-table-column label="操作" align="center" width="145px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleModifyStatus(scope.row,scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-show="this.listQuery.total>0" background style="margin: 20px 0 0 0" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-size="listQuery.limit" layout="prev, pager, next, jumper" :total="listQuery.total"></el-pagination>
  </div>
</template>

<script>
import api from 'apis'
import { scrollTo } from 'utils/scrollTo'
export default {
  name: 'listCustomer',
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 15,
        total: 0,
        companyName: '',
        contactName: '',
        phone: ''
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
        name: 'editCustomer',
        params: {
          id: row.CustomerID
        }
      })
    },
    handleModifyStatus(row, index) {
      this.$confirm('此操作将永久删除该客户信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          api.deleteCustomerById(row.CustomerID).then(response => {
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
        .catch(() => {
          // this.$message({
          //   type: "info",
          //   message: "已取消删除"
          // });
        })
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
    fetchData() {
      this.listLoading = true
      api.getCustomerList(this.listQuery.companyName, this.listQuery.contactName, this.listQuery.phone, this.listQuery.page, this.listQuery.limit).then(response => {
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
      })
    }
  }
}
</script>
