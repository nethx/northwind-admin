<template>
  <div class="createPost-container">
    <el-upload class="avatar-uploader" action accept="image/jpeg, image/jpg, image/png" :show-file-list="false" :before-upload="beforeAvatarUpload">
      <img v-if="avatarSrc" :src="avatarSrc" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <el-form ref="form" :model="employee" :rules="employeeRules" label-width="80px" class="demo-ruleForm">
      <div class="createPost-main-container">
        <el-form-item label="姓名" required>
          <el-col :span="2">
            <el-form-item prop="FirstName">
              <el-input v-model.trim="employee.FirstName" placeholder="姓"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item prop="LastName">
              <el-input v-model.trim="employee.LastName" placeholder="名"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="职位">
          <el-select v-model="employee.Title" placeholder="请选择职位">
            <el-option label="销售经理" value="Sales Manager"></el-option>
            <el-option label="内部销售协调员" value="Inside Sales Coordinator"></el-option>
            <el-option label="销售副总裁" value="Vice President, Sales"></el-option>
            <el-option label="销售代表" value="Sales Representative"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出生日期">
          <el-date-picker type="date" placeholder="选择日期" v-model="employee.BirthDate" :picker-options="pickerOption"></el-date-picker>
        </el-form-item>
        <el-form-item label="入职日期">
          <el-date-picker type="date" placeholder="选择日期" v-model="employee.HireDate" :picker-options="pickerOption"></el-date-picker>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="employee.Notes"></el-input>
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
import service from '../../api/request.js'
import storage from 'utils/storage'
import imageUtil from 'utils/image'
export default {
  data() {
    return {
      loading: false,
      avatarSrc: null,
      currentView: null,
      employee: {
        FirstName: '',
        LastName: '',
        Title: '',
        BirthDate: '',
        HireDate: '',
        Notes: '',
        PhotoPath: ''
      },
      employeeRules: {
        // name: [{ validator: validateRequire, trigger: 'blur' }]
        FirstName: [
          {
            required: true,
            message: '请输入姓',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 10,
            message: '长度在 1 到 10 个字符',
            trigger: 'blur'
          }
        ],
        LastName: [
          {
            required: true,
            message: '请输入名',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 10,
            message: '长度在 1 到 10 个字符',
            trigger: 'blur'
          }
        ]
      },
      pickerOption: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  created() {
    const id = this.$route.params.id
    if (id) {
      api.getEmployeeById(id).then(response => {
        if (response.retCode == 200) {
          this.employee = response.retData
          this.avatarSrc = service.defaults.baseURL.replace('api', '') + this.employee.PhotoPath
        } else {
          this.$message({
            message: response.message,
            type: 'error'
          })
        }
      })
    }
    // if (editEmployee && editEmployee.EmployeeID > 0) {
    //   for (const key in editEmployee) {
    //     this.employee[key] = editEmployee[key];
    //   }
    // }
  },
  mounted() {
    const views = this.$store.state.tagsView.visitedViews
    if (views.length > 0) {
      this.currentView = views.filter(item => item.path == this.$route.path)[0]
    }
  },
  methods: {
    //压缩图片的方法
    compressImage(base64URL, fileSize, callback) {
      let _this = this,
        canvas = document.createElement('canvas'),
        drawer = canvas.getContext('2d'),
        maxWidth = 900,
        maxHeight = 1000,
        quality = 0.99, // 压缩质量
        img = new Image()
      if (0.5 < fileSize < 1) {
        quality = 0.95
      } else if (1 <= fileSize < 2) {
        quality = 0.9
      } else if (2 <= fileSize < 3) {
        quality = 0.85
      } else if (3 <= fileSize < 4) {
        quality = 0.7
      } else if (4 <= fileSize < 5) {
        quality = 0.6
      } else if (5 <= fileSize < 6) {
        quality = 0.55
      } else {
        quality = 0.5
      }
      img.src = base64URL
      img.onload = function() {
        if (canvas.getContext) {
          // let originWidth = img.width, // 压缩后的宽
          //   originHeight = img.height;
          // canvas.width = img.width;
          // canvas.height = img.height;
          // drawer.clearRect(0, 0, canvas.width, canvas.height);
          // drawer.drawImage(img, 0, 0, canvas.width, canvas.height);
          let originWidth = img.width,
            originHeight = img.height,
            targetWidth = originWidth,
            targetHeight = originHeight
          // 图片尺寸超过400x400的限制
          if (originWidth > maxWidth || originHeight > maxHeight) {
            if (originWidth / originHeight > maxWidth / maxHeight) {
              //更宽，按照宽度限定尺寸
              targetWidth = maxWidth
              targetHeight = Math.round(maxWidth * (originHeight / originWidth))
            } else {
              targetHeight = maxHeight
              targetWidth = Math.round(maxHeight * (originWidth / originHeight))
            }
          }
          canvas.width = targetWidth
          canvas.height = targetHeight
          // 清除画布
          drawer.clearRect(0, 0, targetWidth, targetHeight)
          drawer.drawImage(img, 0, 0, targetWidth, targetHeight)
          let newBase64 = canvas.toDataURL('image/jpeg', quality)
          let newImgFile = _this.dataURLtoFile(newBase64, Date.parse(Date()) + '.jpg')
          console.log('*******压缩后的图片大小*******')
          console.log(newImgFile.size)
          callback.call(_this, newImgFile)
          canvas = null
        } else {
          alert('压缩图片出错')
        }
      }
    },
    //base64转file
    dataURLtoFile(dataurl, filename) {
      let arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, { type: mime })
    },
    handleAvatarSuccess(res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(imgFile) {
      // const isJPG = file.type === "image/jpeg";
      let fileSize = imgFile.size / 1024 / 1024

      // if (!isJPG) {
      //   this.$message.warning("上传头像图片只能是 JPG 格式!");
      // }
      if (fileSize > 8) {
        this.$message.warning('上传头像图片大小不能超过 8MB!')
      } else {
        // let newFile = this.ontpys(img.file);
        let self = this
        if (window.FileReader) {
          self.loading = true
          let reader = new FileReader()
          reader.readAsDataURL(imgFile)
          reader.onload = function(r) {
            console.log('********未压缩前的图片大小********')
            console.log('fileSize:' + fileSize)
            imageUtil.compress(r.target.result, function(imageData) {
              if (!imageData) {
                self.$message.success('压缩失败!')
              } else {
                api.fileUpload(imageData).then(response => {
                  self.loading = false
                  if (response.retCode == 200) {
                    self.$message.success('上传成功!')
                    self.avatarSrc = service.defaults.baseURL.replace('api', '') + response.retData
                    self.employee.PhotoPath = response.retData
                  } else {
                    self.$message.error(response.message)
                  }
                })
              }
            })
          }
        } else {
          alert('浏览器不支持上传')
        }
      }
      return false
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          api.putEmployee(this.employee).then(response => {
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
        this.$router.push('/employee')
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
<style>
  .avatar-uploader .el-upload {
    border: 1px solid #d9d9d9;
    /*dashed*/
    border-radius: 6px;
    cursor: pointer;
    position: absolute;
    overflow: hidden;
    /* float: right;
                          margin-top: 20px;
                          margin-right: 100px; */
    top: 30px;
    right: 48px;
    z-index: 200;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
