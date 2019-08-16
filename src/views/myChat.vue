<template>
  <div>
    <h1>myChat聊天室</h1>
    <el-form label-width="120px">
      <el-col :span="20">
        <el-form-item label="用户名：">
          <el-input size="small" v-model.trim="userName" placeholder="请输入用户名">
            <template slot="append">
              <el-button size="small" type="primary" plain @click="onLink">{{isWebSocket?'断开':'连接'}}</el-button>
            </template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="20">
        <el-form-item>
          <div class="container" v-html="chatText"></div>
        </el-form-item>
      </el-col>
      <el-col :span="20" v-show="isWebSocket">
        <el-form-item>
          <el-input size="small" v-model="sendText" placeholder="请输入">
            <template slot="append">
              <el-button size="small" type="primary" plain @click="onSendText">发送</el-button>
            </template>
          </el-input>
        </el-form-item>
      </el-col>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userName: '',
      chatText: '',
      sendText: '',
      isWebSocket: false,
      websock: null,
      linkCount: 0,
      logout: false
    }
  },
  created() {},
  methods: {
    initWebSocket() {
      //初始化weosocket
      if ('WebSocket' in window) {
        this.websock = new WebSocket(process.env.chatHost)
        this.websock.onmessage = this.websocketonmessage
        this.websock.onopen = this.websocketonopen
        this.websock.onerror = this.websocketonerror
        this.websock.onclose = this.websocketclose
      } else {
        this.$message({
          message: '您的浏览器不支持WebSocket',
          type: 'error'
        })
      }
    },
    websocketonopen() {
      //连接建立之后执行send方法发送数据
      // let actions = { test: '12345' }
      // this.websocketsend(JSON.stringify(actions))
      this.isWebSocket = true
      this.logout = false
      this.websock.send('login:' + this.userName)
      // this.websock.send(this.sendText)
    },
    websocketonerror() {
      this.linkCount++
      if (this.websock.readyState === 3 && this.linkCount < 2) {
        this.$message({
          message: '连接服务失败',
          type: 'error'
        })
        // 连接建立失败重连
        this.initWebSocket()
      }
    },
    websocketonmessage(e) {
      // 数据接收
      // const redata = e.data
      this.chatText = this.chatText + e.data + '<br />'
    },
    // websocketsend(Data) {
    //   // 数据发送
    //   this.websock.send(Data)
    // },
    websocketclose(e) {
      if (this.logout) {
        this.chatText = this.chatText + '【' + this.userName + '】离开了聊天室！' + '<br />'
      }
      //关闭
    },
    onSendText() {
      if (this.websock !== null && this.websock.readyState === 3) {
        this.websock.close()
        this.initWebSocket() //重连
      } else if (this.websock.readyState === 1) {
        this.websock.send(this.userName + '说 :' + this.sendText)
        this.sendText = ''
      } else if (this.websock.readyState === 0) {
        setTimeout(() => {
          this.websock.send(this.userName + '说 :' + this.sendText)
          this.sendText = ''
        }, 3000)
      }
    },
    onLink() {
      if (this.isWebSocket && (this.websock.readyState === 0 || this.websock.readyState === 1)) {
        this.isWebSocket = false
        this.logout = true
        this.websock.close()
      } else {
        if (this.userName) {
          this.initWebSocket()
        } else {
          this.$message({
            message: '请输入用户名',
            type: 'info'
          })
        }
      }
    }
  }
}
</script>
<style scoped>
  h1,
  h2 {
    text-align: left;
    font-weight: normal;
    font-size: 18px;
    margin-left: 7%;
    margin-top: 2%;
  }
  .container {
    font-family: 'Courier New';
    width: 100%;
    height: 300px;
    overflow: auto;
    border: 1px solid black;
  }
</style>
