<template>
  <div class="createPost-container">
    <el-form ref="form" :model="customer" :rules="customerRules" label-width="100px" class="demo-ruleForm">
      <div class="createPost-main-container">
        <el-form-item label="企业名称" prop="CompanyName">
          <el-input v-model.trim="customer.CompanyName"></el-input>
        </el-form-item>
        <el-form-item label="所属城市" prop="City">
          <el-input v-model.trim="customer.City"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="ContactName">
          <el-input v-model.trim="customer.ContactName"></el-input>
        </el-form-item>
        <el-form-item label="联系人职称" prop="ContactTitle">
          <el-input v-model.trim="customer.ContactTitle"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="Phone">
          <el-input v-model.trim="customer.Phone"></el-input>
        </el-form-item>
        <el-form-item label="详细地址" prop="Address">
          <el-input v-model.trim="customer.Address"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" v-loading="loading">保存</el-button>
          <el-button @click="onCloseView">取消</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script>
import api from 'apis'

export default {
  data() {
    return {
      currentView: null,
      loading: false,
      avatarSrc: null,
      customer: {
        CompanyName: '',
        ContactName: '',
        ContactTitle: '',
        Address: '',
        Phone: '',
        City: ''
      },
      customerRules: {
        CompanyName: [
          {
            required: true,
            message: '请输入企业名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 50,
            message: '长度在 1 到 20 个字',
            trigger: 'blur'
          }
        ],
        City: [
          {
            required: true,
            message: '请输入所在城市',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 50,
            message: '长度在 1 到 10 个字',
            trigger: 'blur'
          }
        ],
        ContactName: [
          {
            required: true,
            message: '请输入联系人',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字',
            trigger: 'blur'
          }
        ],
        ContactTitle: [
          {
            required: true,
            message: '请输入联系职称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 50,
            message: '长度在 1 到 10 个字',
            trigger: 'blur'
          }
        ],
        Address: [
          {
            required: true,
            message: '请输入详细地址',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 50,
            message: '长度在 1 到 30 个字',
            trigger: 'blur'
          }
        ],
        Phone: [
          {
            required: true,
            message: '请输入联系电话',
            trigger: 'blur'
          },
          {
            min: 8,
            max: 15,
            message: '长度为11个数字',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    const id = this.$route.params.id
    if (id) {
      this.loading = true
      api.getCustomerById(id).then(response => {
        this.loading = false
        if (response.retCode == 200) {
          this.customer = response.retData
        } else {
          this.$message({
            message: response.message,
            type: 'error'
          })
        }
      })
    }
  },
  mounted() {
    const views = this.$store.state.tagsView.visitedViews
    if (views.length > 0) {
      this.currentView = views.filter(item => item.path == this.$route.path)[0]
    }
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          api.putCustomer(this.customer).then(response => {
            this.loading = false
            if (response.retCode == 200) {
              this.onCloseView()
            } else {
              this.$message({
                message: response.message,
                type: 'error'
              })
            }
          })
        } else {
          return false
        }
      })
    },
    onCloseView() {
      this.$store.dispatch('delView', this.currentView).then(({ visitedViews }) => {
        const latestView = visitedViews.slice(-1)[0]
        this.$router.push('/customer')
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import '~@/styles/mixin.scss';

  .el-input {
    width: 30%;
  }

  .createPost-container {
    position: relative;

    .createPost-main-container {
      padding: 40px 45px 20px 50px;

      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;

        .postInfo-container-item {
          float: left;
        }
      }

      .editor-container {
        min-height: 500px;
        margin: 0 0 30px;

        .editor-upload-btn-container {
          text-align: right;
          margin-right: 10px;

          .editor-upload-btn {
            display: inline-block;
          }
        }
      }
    }

    .word-counter {
      width: 40px;
      position: absolute;
      right: -10px;
      top: 0px;
    }
  }
</style>
