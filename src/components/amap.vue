<template>
  <div class="m-map">
    <div class="search" v-if="placeSearch">
      <input type="text" placeholder="请输入关键字" v-model="searchKey">
      <button type="button" @click="handleSearch">搜索</button>
      <div id="js-result" v-show="searchKey" class="result"></div>
    </div>
    <div id="js-container" class="map">正在加载数据 ...</div>
  </div>
</template>
<script>
export default {
  props: ["lat", "lng", "MapCityName"],
  data() {
    return {
      searchKey: "",
      placeSearch: null,
      dragStatus: false
    };
  },
  created() {
    this.initMap();
  },
  watch: {
    searchKey() {
      if (this.searchKey === "") {
        this.placeSearch.clear();
      }
    }
  },
  methods: {
    // 搜索
    handleSearch() {
      if (this.searchKey) {
        this.placeSearch.search(this.searchKey);
      }
    },
    // 实例化地图
    initMap() {
      // 加载PositionPicker，loadUI的路径参数为模块名中 'ui/' 之后的部分

      AMapUI.loadUI(["misc/PositionPicker"], PositionPicker => {
        let mapConfig = {
          zoom: 16,
          cityName: this.MapCityName
        };
        if (this.lat && this.lng) {
          mapConfig.center = [this.lng, this.lat];
        }
        let map = new AMap.Map("js-container", mapConfig);
        // 加载地图搜索插件
        AMap.service("AMap.PlaceSearch", () => {
          this.placeSearch = new AMap.PlaceSearch({
            pageSize: 5,
            pageIndex: 1,
            citylimit: true,
            city: this.MapCityName,
            map: map,
            panel: "js-result"
          });
        });
        // 启用工具条
        AMap.plugin(["AMap.ToolBar"], function() {
          map.addControl(
            new AMap.ToolBar({
              position: "RB"
            })
          );
        });
        // 创建地图拖拽
        let positionPicker = new PositionPicker({
          mode: "dragMap", // 设定为拖拽地图模式，可选'dragMap'、'dragMarker'，默认为'dragMap'
          map: map // 依赖地图对象
        });
        // 拖拽完成发送自定义 drag 事件
        positionPicker.on("success", positionResult => {
          // 过滤掉初始化地图后的第一次默认拖放
          if (!this.dragStatus) {
            this.dragStatus = true;
          } else {
            this.$emit("drag", positionResult);
          }
        });
        // 启动拖放
        positionPicker.start();
      });
    }
  }
};
</script>
<style lang="css">
  .m-map {
    min-width: 500px;
    min-height: 300px;
    position: relative;
  }
  .m-map .map {
    width: 100%;
    height: 100%;
  }
  .m-map .search {
    position: absolute;
    top: 10px;
    left: 10px;
    width: 285px;
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
  .m-map .result {
    max-height: 300px;
    overflow: auto;
    margin-top: 10px;
  }
</style>
