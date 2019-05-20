<template>
  <div style="widith:100%">
    <h1>{{ msg }}</h1>
    <!-- <div style="height: 600px">
      <el-scrollbar class="el-scrollbar" ref="form-container" id="container">
        <div style="height: 100%; " class="div-scrollbar">
          <li class="legend_1">1</li>
          <li class="legend_2">2</li>
          <li class="legend_3">3</li>
          <li class="legend_4">4</li>
          <li class="legend_5">5</li>
        </div>
      </el-scrollbar>
      <el-button type="primary" @click="onJump">回到底部</el-button>
      <el-button type="success" @click="onJump">回到顶部</el-button>
    </div>-->
    <div id="amapDemo1"></div>
    <div id="amapDemo2"></div>
    <div class="m-part">
      <amap @drag="getMapData" MapCityName="深圳" class="mapbox"></amap>
      <ul class="info">
        <li>
          <span>经度：</span>
          {{ mapData.lng }}
        </li>
        <li>
          <span>纬度：</span>
          {{ mapData.lat }}
        </li>
        <li>
          <span>地址：</span>
          {{ mapData.address }}
        </li>
        <li>
          <span>最近的路口：</span>
          {{ mapData.nearestJunction }}
        </li>
        <li>
          <span>最近的路：</span>
          {{ mapData.nearestRoad }}
        </li>
        <li>
          <span>最近的POI：</span>
          {{ mapData.nearestPOI }}
        </li>
      </ul>
    </div>
    <!-- <el-table :data="listData" :span-method="objectSpanMethod" border class="tableArea" style="width: 100%">
      <el-table-column prop="type" label="序号" align="center" width="200"/>
      <el-table-column prop="sheetType" label="工单类型"/>
      <el-table-column prop="taskKey" label="taskKey"/>
      <el-table-column prop="templateUrl" label="templateUrl"/>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="修改" placement="top-start">
            <i class="el-icon-edit-outline"/>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
            <i class="el-icon-delete"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <table class="custom_table">
      <thead>
        <tr>
          <th>工作组</th>
          <th>执行人</th>
          <th>帐期</th>
          <th>订单数</th>
          <th>客户数</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item,index) in listData" :key="index">
          <td v-if="item.orgRowspan" :rowspan="item.orgRowspan">{{item.orgName}}</td>
          <td v-if="item.operatorRowspan" :rowspan="item.operatorRowspan">{{item.operatorUserName}}</td>
          <td>{{item.period}}</td>
          <td>{{item.orderCount}}</td>
          <td>{{item.customerCount}}</td>
        </tr>
      </tbody>
    </table>-->
  </div>
</template>

<script>
import amap from '@/components/amap'
import { scrollTo } from 'utils/scrollTo'

export default {
  name: 'HelloWorld',
  components: {
    amap
  },
  data() {
    return {
      msg: '高德地图展示',
      mapData: {
        lng: null,
        lat: null,
        address: null,
        nearestJunction: null,
        nearestRoad: null,
        nearestPOI: null
      },
      backPosition: {
        type: Number,
        default: 0
      },
      rowList: [],
      spanArr: [],
      position: 0,
      listData: []
    }
  },
  mounted() {
    this.queryData()
    this.initMap()
  },

  methods: {
    queryData() {
      //查询操作
      this.listData = [
        {
          operatorUserId: 1,
          period: 201904,
          orgName: '资料完善',
          operatorUserName: '系统管理员',
          orgRowspan: 1,
          operatorRowspan: 1,
          accreditAmountSum: 100000.0,
          orderCount: 1,
          orgId: 102,
          customerCount: 1
        },
        {
          operatorUserId: 1,
          period: 201904,
          orgName: '财务审核',
          orgRowspan: 1,
          operatorUserName: '系统管理员',
          operatorRowspan: 1,
          accreditAmountSum: 60.0,
          orderCount: 1,
          orgId: 114,
          customerCount: 1
        },
        {
          operatorUserId: 1,
          period: 201904,
          orgName: '资金发放',
          orgRowspan: 5,
          operatorUserName: '系统管理员',
          operatorRowspan: 2,
          accreditAmountSum: 1400000.0,
          orderCount: 1,
          orgId: 116,
          customerCount: 1
        },
        {
          operatorUserId: 1,
          period: 201905,
          orgName: '资金发放',
          orgRowspan: 0,
          operatorUserName: '系统管理员',
          operatorRowspan: 0,
          accreditAmountSum: 150.0,
          orderCount: 1,
          orgId: 116,
          customerCount: 1
        },
        {
          operatorUserId: 470,
          period: 201904,
          orgName: '资金发放',
          orgRowspan: 0,
          operatorUserName: '贺冬梅',
          operatorRowspan: 1,
          accreditAmountSum: 1400000.0,
          orderCount: 1,
          orgId: 116,
          customerCount: 1
        },
        {
          operatorUserId: 472,
          period: 201905,
          orgName: '资金发放',
          orgRowspan: 0,
          operatorRowspan: 1,
          operatorUserName: '王瑜',
          accreditAmountSum: 2100000.0,
          orderCount: 1,
          orgId: 116,
          customerCount: 1
        },
        {
          operatorUserId: 474,
          period: 201904,
          orgName: '资金发放',
          orgRowspan: 0,
          operatorRowspan: 1,
          operatorUserName: '蓝天海',
          accreditAmountSum: 2800000.0,
          orderCount: 1,
          orgId: 116,
          customerCount: 1
        },
        {
          operatorUserId: 474,
          period: 201905,
          orgName: '存续',
          orgRowspan: 1,
          operatorRowspan: 1,
          operatorUserName: '蓝天海',
          accreditAmountSum: 260.0,
          orderCount: 1,
          orgId: 120,
          customerCount: 1
        }
      ]

      // this.rowspan()
    },
    rowspan() {
      this.listData.forEach((item, index) => {
        if (index === 0) {
          this.spanArr.push(1)
          this.position = 0
        } else {
          if (this.listData[index].type === this.listData[index - 1].type) {
            this.spanArr[this.position] += 1
            this.spanArr.push(0)
          } else {
            this.spanArr.push(1)
            this.position = index
          }
        }
      })
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      //表格合并行
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
      if (columnIndex === 1) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    easeInOutQuad(t, b, c, d) {
      if ((t /= d / 2) < 1) return (c / 2) * t * t + b
      return (-c / 2) * (--t * (t - 2) - 1) + b
    },
    onJump() {
      // this.backPosition == 600
      // const start = window.pageYOffset
      // let i = 0
      const jump = document.querySelectorAll('.legend_4')
      const total = jump[0].offsetTop

      // console.log('total:' + JSON.stringify(document.querySelectorAll('#container')[0]))
      // window.scrollTo(0, total)
      // console.log('total:' + JSON.stringify(total))
      // window.scrollTo(0, total)
      // document.querySelectorAll('.div-scrollbar')[0].scrollTo(0, total)
      // this.$nextTick(() => {
      //图片列表栏始终左对齐
      // this.$refs['form-container'][0].scrollTo(0, 0)
      //this.$refs.table.scrollBy(document.body.scrollWidth, 0)
      // })
      //scrollTo(0, 300)
      this.$nextTick(() => {
        this.$refs['form-container'].$refs['wrap'].scrollTop = total
      })
    },
    getMapData(data) {
      this.mapData = {
        lng: data.position.lng,
        lat: data.position.lat,
        address: data.address,
        nearestJunction: data.nearestJunction,
        nearestRoad: data.nearestRoad,
        nearestPOI: data.nearestPOI
      }
    },
    handleSearch() {
      if (this.searchKey) {
        this.placeSearch.search(this.searchKey)
      }
    },
    initMap() {
      /**驾车导航展示 **/
      let mapDemo1 = new AMap.Map('amapDemo1', {})
      AMap.plugin('AMap.Driving', function() {
        let driving = new AMap.Driving({
          map: mapDemo1,
          policy: AMap.DrivingPolicy.LEAST_TIME
        })
        driving.search(
          new AMap.LngLat('114.084422', '22.570738'),
          new AMap.LngLat('113.3703929186', '22.947402498'),
          {
            waypoints: [new AMap.LngLat('113.739065', '23.02569')]
          },
          function(status, result) {}
        )
      })
      /**轨迹巡航展示 **/
      let marker,
        lineArr = [
          [114.08434, 22.570203],
          [114.082034, 22.56998],
          [114.079775, 22.568935],
          [114.077484, 22.567384],
          [114.07596, 22.566987],
          [114.072977, 22.566462],
          [114.070091, 22.566116],
          [114.067817, 22.565957],
          [114.067313, 22.567007],
          [114.066776, 22.569385],
          [114.066132, 22.571991],
          [114.065768, 22.573932],
          [114.066111, 22.574418],
          [114.067077, 22.574487],
          [114.067549, 22.574824],
          [114.067602, 22.575131],
          [114.06742, 22.575399],
          [114.067119, 22.575557],
          [114.063364, 22.575795],
          [114.062055, 22.576112],
          //[114.066132, 22.571991],
          [114.061101, 22.576785],
          [114.060135, 22.578341],
          [114.059041, 22.580332],
          [114.058526, 22.581679],
          [114.058161, 22.583809],
          [114.05785, 22.584671],
          [114.05741, 22.585275],
          [114.056627, 22.585988],
          [114.055371, 22.587078],
          [114.054631, 22.58795],
          [114.05403, 22.588861],
          [114.053322, 22.590159],
          [114.051399, 22.593982],
          [114.05083, 22.595022]
        ]
      let mapDemo2 = new AMap.Map('amapDemo2', {
        resizeEnable: true,
        // center: [114.063364, 22.575795],
        zoom: 16
      })
      let markers = [
        {
          icon: '//webapi.amap.com/theme/v1.3/markers/n/start.png',
          position: [114.08434, 22.570203]
        },
        // {
        //   icon: "//webapi.amap.com/theme/v1.3/markers/n/mid.png",
        //   position: [116.480784, 39.998302]
        // },
        {
          icon: '//webapi.amap.com/theme/v1.3/markers/n/end.png',
          position: [114.05083, 22.595022]
        }
      ]
      markers.forEach(function(marker) {
        new AMap.Marker({
          map: mapDemo2,
          icon: marker.icon,
          position: [marker.position[0], marker.position[1]],
          offset: new AMap.Pixel(-13, -30)
        })
      })
      marker = new AMap.Marker({
        map: mapDemo2,
        position: [114.08434, 22.570203],
        icon: 'https://webapi.amap.com/images/car.png',
        // icon: require("@/assets/images/car.png"),
        offset: new AMap.Pixel(-26, -13),
        autoRotation: true
        // angle: -90
      })
      // 绘制轨迹
      let polyline = new AMap.Polyline({
        map: mapDemo2,
        path: lineArr,
        showDir: true,
        strokeColor: '#28F', //线颜色
        strokeOpacity: 1, //线透明度
        strokeWeight: 6, //线宽
        strokeStyle: 'solid' //线样式
      })
      let passedPolyline = new AMap.Polyline({
        map: mapDemo2,
        // path: lineArr,
        strokeColor: '#AF5', //线颜色
        strokeOpacity: 1, //线透明度
        strokeWeight: 6, //线宽
        strokeStyle: 'solid' //线样式
      })
      marker.on('moving', function(e) {
        passedPolyline.setPath(e.passedPath)
      })
      mapDemo2.setFitView()
      marker.moveAlong(lineArr, 600)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  #amapDemo1 {
    float: left;
    margin-left: 3%;
    width: 45%;
    height: 370px;
    margin-right: 3%;
  }
  #amapDemo2 {
    width: 45%;
    height: 370px;
  }
  #amapDemo3 {
    float: left;
    margin-top: 35px;
    margin-left: 3%;
    width: 45%;
    height: 370px;
  }
  h1,
  h2 {
    text-align: center;
    font-weight: normal;
    font-size: 18px;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
  .m-map {
    width: 100%;
    height: 400px;
    position: relative;
  }
  .m-map .map {
    width: 100%;
    height: 100%;
  }
  .search {
    position: absolute;
    top: 40px;
    left: 100px;
    width: 242px;
    z-index: 1;
  }
  .m-map .search input {
    width: 180px;
    border: 1px solid #ccc;
    line-height: 20px;
    padding: 5px;
    outline: none;
  }
  .m-map .search button {
    line-height: 26px;
    background: #fff;
    border: 1px solid #ccc;
    width: 50px;
    text-align: center;
  }

  .result {
    max-height: 100px;
    width: 20px;
    overflow: auto;
    margin-top: 10px;
  }
  .m-part {
    margin-top: 35px;
    margin-left: 3%;
  }
  .m-part::after {
    content: '';
    display: block;
    clear: both;
  }
  .m-part .title {
    font-size: 30px;
    line-height: 60px;
    margin-bottom: 10px;
    color: #333;
  }
  .m-part .mapbox {
    width: 570px;
    height: 370px;
    margin-bottom: 20px;
    float: left;
  }
  .m-part .info {
    /* float: none; */
    width: 100%;
    margin: 0;
    padding: 0;
    line-height: 50px;
    margin-left: 570px;
  }
  .info li {
    width: 100%;
  }
  .m-part .info span {
    /* display: block; */
    color: #999;
  }
  .m-part ol {
    line-height: 40px;
    margin-left: 0;
    padding-left: 0;
  }
  .el-scrollbar {
    height: 100%;
    overflow-x: hidden;
  }
  .div-scrollbar {
    overflow: hidden;
  }
  .div-scrollbar li {
    background-color: #42b983;
    line-height: 490px;
    width: 90%;
    margin-top: 30px;
  }
  .custom_table {
    width: 100%;
    table-layout: auto !important;
    word-wrap: break-word;
    word-break: break-all;
    /* border-collapse: collapse; */
  }
  .custom_table thead th {
    line-height: 31px;
    padding: 6px 10px;
    font-size: 13px;
    white-space: normal;
    color: #333333 !important;
    font-weight: bold !important;
    background: #e5e9f2;
    text-align: left;
  }
  .custom_table thead th span {
    color: #333333 !important;
    font-weight: bold !important;
  }
  .custom_table tbody tr td {
    line-height: 22px;
    padding: 2px 10px;
    font-size: 13px;
    color: #606266;
    background: #ffffff;
    border: 1px solid #ebeef5;
    text-align: left;
  }
</style>
