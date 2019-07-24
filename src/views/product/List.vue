<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input placeholder="产品名称" size="small" v-model.trim="listQuery.productName" style="width: 200px" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.categoryID" size="small" placeholder="请选择类别" clearable class="filter-item" @change="handleFilter">
        <el-option v-for="item in categoryDropList" :key="item.Key" :label="item.Value" :value="item.Key"/>
      </el-select>
      <el-select v-model="listQuery.supplierID" size="small" placeholder="请选择供应商" clearable style="width: 300px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in supplierDropList" :key="item.Key" :label="item.Value" :value="item.Key"/>
      </el-select>
      <el-select v-model="listQuery.discontinued" size="small" placeholder="请选择状态" clearable class="filter-item" @change="handleFilter">
        <el-option v-for="item in productstatusOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
      <el-button class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column prop="ProductID" label="编号" align="center" width="70" fixed/>
      <el-table-column prop="CategoryName" label="所属类别" width="120"/>
      <el-table-column prop="ProductName" label="产品名称" min-width="100px"/>
      <el-table-column prop="UnitsOnOrder" label="订购总量" width="80"/>
      <el-table-column prop="UnitsInStock" label="库存数量" width="80"/>
      <el-table-column prop="UnitPrice" label="单价" width="70"/>
      <el-table-column prop="QuantityPerUnit" label="单位" min-width="60px"/>
      <el-table-column prop="SupplierName" label="供应商" min-width="100px"/>
      <el-table-column prop="Discontinued" label="是否停售" width="80">
        <template slot-scope="scope">
          <el-tag :type="scope.row.Discontinued  ? 'danger' : 'success'">{{scope.row.Discontinued?'停售':'热卖'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="145px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleModifyStatus(scope.row,scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-show="listQuery.total>0" background style="margin: 20px 0 0 0" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-size="listQuery.limit" layout="prev, pager, next, jumper" :total="listQuery.total"></el-pagination>
  </div>
</template>

<script>
import api from 'apis'
import { scrollTo } from 'utils/scrollTo'

export default {
  name: 'listProduct',
  data() {
    return {
      categoryDropList: [],
      supplierDropList: [],
      productstatusOptions: [
        {
          key: 0,
          display_name: '热卖'
        },
        {
          key: 1,
          display_name: '停售'
        }
      ],
      listQuery: {
        page: 1,
        limit: 15,
        total: 0,
        productName: '',
        supplierID: '',
        categoryID: '',
        discontinued: ''
      },
      list: [],
      listLoading: false
    }
  },
  created() {
    api.getCategoryDrop().then(response => {
      if (response.retCode == 200) {
        this.categoryDropList = response.retData
      } else {
        this.$message({
          message: '获取类别数据出错',
          type: 'error'
        })
      }
    })
    api.getSupplierDrop().then(response => {
      if (response.retCode == 200) {
        this.supplierDropList = response.retData
      } else {
        this.$message({
          message: '获取供应商数据出错',
          type: 'error'
        })
      }
    })
    this.fetchData()
  },
  methods: {
    handleUpdate(row) {
      this.$router.push({
        name: 'editProduct',
        params: {
          id: row.ProductID
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
          api.deleteProductById(row.ProductID).then(response => {
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
      api.getProductList(this.listQuery.productName, this.listQuery.supplierID, this.listQuery.categoryID, this.listQuery.discontinued, this.listQuery.page, this.listQuery.limit).then(response => {
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
