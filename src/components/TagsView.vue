<template>
  <div class="tags-view-container">
    <router-link class="tabs-view" v-for="tag in visitedViews" :to="{path: tag.path, query: {fromTabsView: true}}" :key="tag.path">
      <!-- {{tag.title }}
      <span class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)" />-->
      <el-tag :closable="true" :type="isActive(tag)?'success':''" @close="closeSelectedTag(tag,$event)">{{tag.title}}</el-tag>
    </router-link>

    <!-- <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">刷新</li>
      <li @click="closeSelectedTag(selectedTag)">关闭</li>
      <li @click="closeOthersTags">关闭其它</li>
      <li @click="closeAllTags">全部关闭</li>
    </ul>-->
  </div>
</template>

 <script>
export default {
  // data() {
  //   return {
  //     top: 0,
  //     left: 0,
  //     selectedTag: {}
  //   }
  // },
  computed: {
    visitedViews() {
      return this.$store.state.tagsView.visitedViews
    }
  },
  watch: {
    $route() {
      this.addViewTags()
      // this.moveToCurrentTag()
    },
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  mounted() {
    this.addViewTags()
  },
  methods: {
    isActive(route) {
      return route.path === this.$route.path
    },
    addViewTags() {
      const { name } = this.$route
      if (name) {
        this.$store.dispatch('addView', this.$route)
      }
      return false
    },
    // moveToCurrentTag() {
    //   const tags = this.$refs.tag
    //   this.$nextTick(() => {
    //     for (const tag of tags) {
    //       if (tag.to.path === this.$route.path) {
    //         this.$refs.scrollPane.moveToTarget(tag)

    //         // when query is different then update
    //         if (tag.to.fullPath !== this.$route.fullPath) {
    //           this.$store.dispatch('updateVisitedView', this.$route)
    //         }

    //         break
    //       }
    //     }
    //   })
    // },
    // refreshSelectedTag(view) {
    //   this.$store.dispatch('delCachedView', view).then(() => {
    //     const { fullPath } = view
    //     this.$nextTick(() => {
    //       this.$router.replace({
    //         path: '/redirect' + fullPath
    //       })
    //     })
    //   })
    // },
    closeSelectedTag(view, $event) {
      this.$store.dispatch('delView', view).then(({ visitedViews }) => {
        if (this.isActive(view)) {
          const latestView = visitedViews.slice(-1)[0]
          if (latestView) {
            this.$router.push(latestView)
          } else {
            this.$router.push('/')
          }
        }
      })
      $event.preventDefault()
    },
    // closeOthersTags() {
    //   this.$router.push(this.selectedTag)
    //   this.$store.dispatch('delOthersViews', this.selectedTag).then(() => {
    //     this.moveToCurrentTag()
    //   })
    // },
    // closeAllTags() {
    //   this.$store.dispatch('delAllViews')
    //   this.$router.push('/')
    // },
    openMenu(tag, e) {
      const menuMinWidth = 105
      const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      const offsetWidth = this.$el.offsetWidth // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary
      const left = e.clientX - offsetLeft + 15 // 15: margin right

      if (left > maxLeft) {
        this.left = maxLeft
      } else {
        this.left = left
      }
      this.top = e.clientY

      this.visible = true
      this.selectedTag = tag
    },
    closeMenu() {
      this.visible = false
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .tabs-view-container {
    display: inline-block;
    vertical-align: top;
    margin-left: 10px;
  }
  .tabs-view {
    margin-left: 10px;
  }
</style>

 
