<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container" />
    <breadcrumb class="breadcrumb-container" />
    <tabsView></tabsView>
    <div class="right-menu">
      <el-tooltip content="全屏" effect="dark" placement="bottom">
        <screenfull class="screenfull right-menu-item" />
      </el-tooltip>
      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <img :src="require('@/assets/images/header.png')" class="user-avatar" />
          <span class="user-name">{{userName}}</span>
          <!-- <li class="el-icon-caret-bottom" /> -->
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>首页</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from 'components/Breadcrumb'
import Hamburger from 'components/Hamburger'
import Screenfull from 'components/Screenfull'
import storage from 'utils/storage'
import TabsView from './TagsView'
export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    TabsView
  },
  computed: {
    ...mapGetters(['sidebar', 'userName'])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      storage.remove('admin_UserInfo')
      this.$store.dispatch('getUser')
      location.reload()
    }
  }
}
</script>

 <style rel="stylesheet/scss" lang="scss" scoped>
  .navbar {
    height: 50px;
    line-height: 50px;
    border-radius: 0px !important;
    .hamburger-container {
      line-height: 58px;
      height: 50px;
      float: left;
      padding: 0 10px;
    }
    .breadcrumb-container {
      float: left;
    }
    .errLog-container {
      display: inline-block;
      vertical-align: top;
    }
    .right-menu {
      position: absolute;
      right: 0px;
      top: 0px;
      &:focus {
        outline: none;
      }
      .right-menu-item {
        display: inline-block;
        margin: 0 8px;
      }
      .screenfull {
        height: 20px;
      }
      .international {
        vertical-align: top;
      }
      .theme-switch {
        vertical-align: 15px;
      }
      .avatar-container {
        height: 50px;
        margin-right: 30px;
        .avatar-wrapper {
          cursor: pointer;
          margin-top: 5px;
          position: relative;
          .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }
          .user-name {
            width: 40px;
            border-radius: 10px;
            line-height: 60px;
            vertical-align: top;
          }
          .el-icon-caret-bottom {
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>


