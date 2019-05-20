<template>
  <div class="createPost-container">
    <el-form ref="form" :model="product" :rules="productRules" label-width="100px" class="demo-ruleForm">
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="18">
            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="产品类别" class="postInfo-container-item" prop="CategoryID">
                    <el-select v-model="product.CategoryID" placeholder="请选择">
                      <el-option v-for="item in categoryDropList" :key="item.Key" :label="item.Value" :value="item.Key"/>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="供应商" prop="SupplierID" class="postInfo-container-item">
                    <el-select v-model="product.SupplierID" placeholder="请选择" style="width: 290px">
                      <el-option v-for="item in supplierDropList" :key="item.Key" :label="item.Value" :value="item.Key"/>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item label="产品名称" prop="ProductName">
                <el-input v-model.trim="product.ProductName" placeholder="请输入产品名称"></el-input>
              </el-form-item>

              <div class="postInfo-container">
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="订购总量">
                      <el-input-number v-model="product.UnitsOnOrder" :min="1" :max="10000" label="描述文字"></el-input-number>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="单价">
                      <el-input-number v-model="product.UnitPrice" :precision="2" :step="0.1" :min="0" :max="100000000"></el-input-number>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
              <div class="postInfo-container">
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="产品单位">
                      <el-input v-model.trim="product.QuantityPerUnit" placeholder="请输入产品单位"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="停售" prop="Discontinued">
                      <el-checkbox v-model="product.Discontinued"></el-checkbox>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
              <el-form-item>
                <el-button type="primary" @click="onSubmit" v-loading="loading">保存</el-button>
                <el-button @click="onCloseView">取消</el-button>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>
<script>
import api from 'apis'

export default {
  data() {
    return {
      loading: false,
      avatarSrc: null,
      categoryDropList: [],
      supplierDropList: [],
      currentView: null,
      product: {
        ProductName: '',
        CategoryID: '',
        SupplierID: '',
        UnitsOnOrder: '',
        UnitPrice: '',
        QuantityPerUnit: '',
        Discontinued: false
      },
      productRules: {
        ProductName: [
          {
            required: true,
            message: '请输入产品名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 50,
            message: '长度在 1 到 50 个字',
            trigger: 'blur'
          }
        ],
        CategoryID: [
          {
            required: true,
            message: '请选择类别',
            trigger: 'blur'
          }
        ],
        SupplierID: [
          {
            required: true,
            message: '请选择供应商',
            trigger: 'blur'
          }
        ]
      }
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
    const id = this.$route.params.id
    if (id) {
      this.loading = true
      api.getProductById(id).then(response => {
        this.loading = false
        if (response.retCode == 200) {
          this.product = response.retData
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
          api.putProduct(this.product).then(response => {
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
        this.$router.push('/product')
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import '~@/styles/mixin.scss';

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
