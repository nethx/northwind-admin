<template>
  <div
    v-if="!item.hidden&&item.children"
    class="menu-wrapper"
  >
    <router-link
      v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow"
      :to="resolvePath(onlyOneChild.path)"
    >
      <el-menu-item
        :index="resolvePath(onlyOneChild.path)"
        :class="{'submenu-title-noDropdown':!isNest}"
      >
        <svg-icon
          v-if="onlyOneChild.meta&&onlyOneChild.meta.icon"
          :icon-class="onlyOneChild.meta.icon"
        ></svg-icon>
        <span
          v-if="onlyOneChild.meta&&onlyOneChild.meta.title"
          slot="title"
        >{{onlyOneChild.meta.title}}</span>
      </el-menu-item>
    </router-link>
    <el-submenu
      v-else
      ref="submenu"
      :index="resolvePath(item.path)"
    >
      <template slot="title">
        <svg-icon
          v-if="item.meta&&item.meta.icon"
          :icon-class="item.meta.icon"
        ></svg-icon>
        <span
          v-if="item.meta&&item.meta.title"
          slot="title"
        >{{item.meta.title}}</span>
      </template>

      <template
        v-for="child in item.children"
        v-if="!child.hidden"
      >
        <sidebar-item
          :is-nest="true"
          class="nest-menu"
          v-if="child.children&&child.children.length>0"
          :item="child"
          :key="child.path"
          :base-path="resolvePath(child.path)"
        ></sidebar-item>
        <router-link
          v-else
          :to="resolvePath(child.path)"
          :key="child.name"
        >
          <el-menu-item :index="resolvePath(child.path)">
            <svg-icon
              v-if="child.meta&&child.meta.icon"
              :icon-class="child.meta.icon"
            ></svg-icon>
            <span
              v-if="child.meta&&child.meta.title"
              slot="title"
            >{{child.meta.title}}</span>
          </el-menu-item>
        </router-link>
      </template>
    </el-submenu>
  </div>
</template>
<script>
import path from "path";
import { isExternal } from "utils";
export default {
  name: "SidebarItem",
  props: {
    // route配置json
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      onlyOneChild: null
    };
  },
  methods: {
    hasOneShowingChild(children, parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false;
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item;
          return true;
        }
      });
      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true;
      }
      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: "", noShowingChildren: true };
        return true;
      }
      return false;
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath;
      }
      return path.resolve(this.basePath, routePath);
    }
  }
};
</script>
