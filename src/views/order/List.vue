<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input placeholder="客户名称" v-model.trim="listQuery.customerName" style="width: 200px" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input placeholder="货主姓名" v-model.trim="listQuery.shipName" style="width: 200px" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.shipperID" placeholder="请选择物流公司" clearable class="filter-item" @change="handleFilter">
        <el-option v-for="item in shipperOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
      <div class="filter-item">
        <el-date-picker v-model="listQuery.orderDate" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="订购开始日期" end-placeholder="订购结束日期" :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']"></el-date-picker>
      </div>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>
    <el-table v-loading="loading" :data="list" style="width: 100%" max-height="700" border highlight-current-row :row-key="row => row.OrderID">
      <!-- <el-table-column type="expand">
        <template slot-scope="props">
          <el-table
            :data="props.row.DetailList"
            border
            style="width: 100%"
            max-height="250"
          >
            <el-table-column
              prop="ProductName"
              label="产品名称"
              min-width="260px"
            />
            <el-table-column
              prop="UnitPrice"
              label="单价"
              width="80"
            />
            <el-table-column
              prop="Quantity"
              label="数量"
              width="80"
            />
            <el-table-column
              prop="Discount"
              label="折扣"
              width="70"
            />
            <el-table-column
              prop="Cost"
              label="价格"
              width="80px"
            />
          </el-table>
        </template>
      </el-table-column>-->
      <el-table-column prop="OrderID" label="编号" align="center" width="70"/>
      <el-table-column label="订购日期" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.OrderDate | parseTime('{y}-{m}-{d}')}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="预计到达日期"
        width="120"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.RequiredDate | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="发货日期"
        width="100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.ShippedDate | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
       <el-table-column
        prop="EmployeeName"
        label="职员名称"
        width="140px"
      />-->
      <el-table-column prop="CustomerName" label="客户名称" width="220"/>
      <el-table-column prop="ShipperName" label="物流公司" width="130"/>
      <el-table-column prop="ShipName" label="货主姓名" width="210px"/>
      <el-table-column prop="ShipAddress" label="货主地址" width="160px"/>
      <el-table-column prop="Freight" label="运费" width="70px"/>
      <el-table-column prop="TotalPrice" label="商品总价" width="80px"/>
      <el-table-column label="产品信息">
        <el-table-column label="产品名称" min-width="120" max-height="250">
          <template slot-scope="scope">
            <p class="table-p" :style="scope.row.DetailList.length>1?' border-bottom: 1px solid #bfcbd9 !important;':''" v-for="item in scope.row.DetailList">{{item.ProductName}}</p>
          </template>
        </el-table-column>

        <el-table-column label="单价" width="65" align="center">
          <template slot-scope="scope">
            <p class="table-p" :style="scope.row.DetailList.length>1?' border-bottom: 1px solid #bfcbd9 !important;':''" v-for="item in scope.row.DetailList">{{item.UnitPrice}}</p>
          </template>
        </el-table-column>
        <el-table-column label="数量" width="60" align="center">
          <template slot-scope="scope">
            <p class="table-p" :style="scope.row.DetailList.length>1?' border-bottom: 1px solid #bfcbd9 !important;':''" v-for="item in scope.row.DetailList">{{item.Quantity}}</p>
          </template>
        </el-table-column>
        <el-table-column label="折扣" width="65" align="center">
          <template slot-scope="scope">
            <p class="table-p" :style="scope.row.DetailList.length>1?' border-bottom: 1px solid #bfcbd9 !important;':''" v-for="item in scope.row.DetailList">{{item.Discount}}</p>
          </template>
        </el-table-column>
        <el-table-column label="价格" width="90" align="center">
          <template slot-scope="scope">
            <p class="table-p" :style="scope.row.DetailList.length>1?' border-bottom: 1px solid #bfcbd9 !important;':''" v-for="item in scope.row.DetailList">{{item.Cost}}</p>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-pagination v-show="listQuery.total>0" background style="margin: 20px 0 0 0" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-size="listQuery.limit" layout="prev, pager, next, jumper" :total="listQuery.total"></el-pagination>
  </div>
</template>

<script>
import api from 'apis'
import { parseTime } from 'utils'
import { scrollTo } from 'utils/scrollTo'

export default {
  name: 'listProduct',
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 15,
        total: 0,
        customerName: '',
        shipName: '',
        shipperID: '',
        orderDate: []
      },
      list: [],
      loading: false,
      downloadLoading: false,
      shipperOptions: [
        {
          key: 1,
          display_name: 'Speedy Express'
        },
        {
          key: 2,
          display_name: 'United Package'
        },
        {
          key: 3,
          display_name: 'Federal Shipping'
        }
      ],
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近半年',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 180)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },
  created() {
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
    handleFilter() {
      this.listQuery.page = 1
      this.listQuery.total = 0
      this.fetchData()
    },
    // handleSizeChange(val) {
    //   this.listQuery.page = val;
    //   this.fetchData();
    // },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.fetchData()
    },
    fetchData() {
      this.loading = true
      let orderStartDate = ''
      let orderEndDate = ''
      if (this.listQuery.orderDate && this.listQuery.orderDate.length > 0) {
        orderStartDate = this.listQuery.orderDate[0]
        orderEndDate = this.listQuery.orderDate[1]
      }
      api
        .getOrderList(this.listQuery.customerName, this.listQuery.shipName, this.listQuery.shipperID, orderStartDate, orderEndDate, this.listQuery.page, this.listQuery.limit)
        .then(response => {
          this.loading = false
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
        .catch(error => {
          this.loading = false
        })
    },
    handleDownload() {
      this.downloadLoading = true
      let orderStartDate = ''
      let orderEndDate = ''
      if (this.listQuery.orderDate && this.listQuery.orderDate.length > 0) {
        orderStartDate = this.listQuery.orderDate[0]
        orderEndDate = this.listQuery.orderDate[1]
      }
      api
        .getOrderList(this.listQuery.customerName, this.listQuery.shipName, this.listQuery.shipperID, orderStartDate, orderEndDate, 1, 1000000)
        .then(response => {
          if (response.retCode == 200) {
            import('../../vendor/Export2Excel').then(excel => {
              const tHeader = ['订单编号', '订购日期', '客户名称', '物流公司', '货主名称', '运费', '总价']
              const filterVal = ['OrderID', 'OrderDate', 'CustomerName', 'ShipperName', 'ShipName', 'Freight', 'TotalPrice']
              const data = this.formatJson(filterVal, response.retData)
              excel.export_json_to_excel({
                header: tHeader,
                data,
                filename: '订单列表'
              })
            })
          } else {
            this.$message({
              message: response.message,
              type: 'error'
            })
          }
          this.downloadLoading = false
        })
        .catch(error => {
          this.loading = false
        })

      //   import("../../vendor/Export2Excel").then(excel => {
      //     const tHeader = ["timestamp", "title", "type", "importance", "status"];
      //     const filterVal = [
      //       "timestamp",
      //       "title",
      //       "type",
      //       "importance",
      //       "status"
      //     ];
      //     const data = this.formatJson(filterVal, this.list);
      //     excel.export_json_to_excel({
      //       header: tHeader,
      //       data,
      //       filename: "table-list"
      //     });
      //     this.downloadLoading = false;
      //   });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'OrderDate') {
            return parseTime(v[j], '{y}-{m}-{d}')
          } else {
            return v[j]
          }
        })
      )
    }
  }
}
</script>
<style scoped>
  .el-range-separator {
    padding: 0 0 !important;
  }

  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 15%;
  }

  .el-form-item :first-child {
    /* margin-right: 0;
            margin-bottom: 0; */
    background-color: blue;
    /* width: 15%; */
  }

  .el-form-item:nth-child(n) {
    /* width: 15%; */
    background-color: chartreuse;
  }

  .table-p {
    width: 100% !important;
  }
</style>
