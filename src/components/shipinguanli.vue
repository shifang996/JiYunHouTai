<template>
  <div>
    <el-card>
      <!-- 面包屑显示 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>课程管理</el-breadcrumb-item>
        <el-breadcrumb-item>视频管理</el-breadcrumb-item>
      </el-breadcrumb>
      <el-row :gutter="20" style="margin: 16px 0;">
        <el-col :span="6"
          ><el-input
            v-model="searchVideo"
            placeholder="模糊查找视频：名称"
          ></el-input
        ></el-col>
        <el-col :span="6"
          ><el-button type="primary" @click="searchVideoFn"
            >查询</el-button
          ></el-col
        >
        <el-col :span="8"></el-col>
        <el-col :span="2"
          ><el-button type="success" @click="addVideosDialog = true"
            >+ 视频添加</el-button
          ></el-col
        >
      </el-row>
      <!-- 表格 -->
      <el-table :data="videoTableDate" style="width: 100%" border>
        <el-table-column label="名称" width="180" prop="Vname">
        </el-table-column>
        <el-table-column label="绑定课程" width="180" prop="Vstate">
        </el-table-column>
        <el-table-column label="时长" width="180" prop="Vtime">
        </el-table-column>
        <el-table-column label="上传日期" prop="createAt"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="EditVideosDate(scope.row)"
              >编辑</el-button
            >
            <el-button
              @click="handle_Delete(scope.row)"
              type="text"
              size="small"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block" style="margin-top: 14px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pageVideoStart"
          :page-size="videosPageSize"
          :page-sizes="[3, 6, 9]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="videosCount"
        >
        </el-pagination>
      </div>
    </el-card>
    <!-- 视频添加弹窗 -->
    <el-dialog
      :title="!changMode ? '添加视频内容' : '修改视频内容'"
      :visible.sync="addVideosDialog"
      width="50%"
    >
      <div>
        <el-form :model="videoObj" label-width="80px">
          <el-row :gutter="20" align="center">
            <el-col :span="16"
              ><div class="grid-content bg-purple">
                <el-form-item label="视频上传">
                  <el-input v-model="videoObj.update"></el-input
                ></el-form-item></div
            ></el-col>
            <el-col :span="8">
              <!-- 上传组件 -->
              <div class="grid-content bg-purple">
                <el-button
                  size="small"
                  type="primary"
                  @click="addVideoBtn($event)"
                  v-if="showAddVidoesOrHidden"
                  >点击上传</el-button
                >
                <!-- 视频上传事件 -->
                <div v-if="!showAddVidoesOrHidden" style="display:flex;">
                  <el-button type="success" @click="uploadVideos()"
                    >上传</el-button
                  >
                  <el-button type="warning">清除</el-button>
                </div>
                <!-- 事件上传 -->
                <input
                  type="file"
                  accept="video/quicktime,video/x-mpeg2,video/x-msvideo,video/mpeg,video/mp4"
                  multiple
                  style="display:none"
                  :id="uuid"
                /></div
            ></el-col>
          </el-row>
          <!-- 第二框 -->
          <el-row>
            <el-col :span="16">
              <el-form-item label="视频名称">
                <el-input v-model="videoObj.name"></el-input
              ></el-form-item>
            </el-col>
            <el-col :span="8"></el-col>
          </el-row>
          <!-- 第三框 -->
          <el-row>
            <el-col :span="16">
              <el-form-item label="视频时长">
                <el-input v-model="videoObj.countTime"></el-input
              ></el-form-item>
            </el-col>
            <el-col :span="8"></el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVideosDialog = false">取 消</el-button>
        <el-button type="primary" @click="addVideosDate" v-if="!changMode"
          >确 定</el-button
        >
        <el-button type="primary" @click="editVideosDate" v-if="changMode"
          >修 改 确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import couroseuuid from "../store/classDateHandle";
export default {
  created() {
    this.getFullVideos(); //获取所有视频数据
  },
  computed: {
    uuid() {
      return couroseuuid.state.uuids;
    }
  },
  data() {
    return {
      showAddVidoesOrHidden: true, //上传按钮显示
      videoTableDate: [],
      searchVideo: "",
      pageVideoStart: 1,
      videosCount: 0,
      videosPageSize: 0,
      //视频添加弹窗
      addVideosDialog: false,
      //视频上传对象
      videoObj: {
        update: "",
        name: "",
        countTime: ""
      },
      editId: "", //修改id
      changMode: false //为修改和显示右下角按钮切换所用
    };
  },
  methods: {
    addVideoBtn(e) {
      //视频上传按钮事件
      //阻止默认事件
      e.preventDefault();
      //获取上传组件***input弹出框
      document.querySelector(`#${this.uuid}`).click();
      return (this.showAddVidoesOrHidden = false);
    },
    async uploadVideos() {
      //视频上传点击上传事件主要用于视频上传
      const form = new FormData();
      console.log(this.uuid, document.getElementById(this.uuid).files[0]);
      form.append(this.uuid, document.getElementById(this.uuid).files[0]);
      const { data: res } = await this.axios({
        url: "/VueHandler/UpLoadVideoHandler",
        method: "post",
        data: form,
        headers: { "Content-Type": "multipart/form-data" } //修改数据类型
      });
      console.log(res);
      if (res.err) return this.$message.error(res.err);
      if (res.success) {
        this.videoObj = {}; //先清空对象
        this.$message.success(`视频上载${res.success}!`);
        this.videoObj.update = res.cacheName;
      }
    },
    async addVideosDate() {
      //弹出框视频提交按钮方法**//视频编辑方法
      const { data: res } = await this.axios({
        url: `/VueHandler/VideoHandler?action=add`,
        method: "post",
        data: {
          ID: "",
          Vname: this.videoObj.name,
          Vtime: this.videoObj.countTime,
          Vurl: this.videoObj.update
        }
      });
      if (res.err) return this.$message.error(res.err);
      if (res.success) {
        this.addVideosDialog = false;
        this.$message.success(`添加视频${res.success}!`);
        this.videoObj = {};
      }
    },
    EditVideosDate(val) {
      this.addVideosDialog = true;
      this.changMode = true;
      console.log(val);
      this.videoObj.update = val.Vurl;
      this.videoObj.name = val.Vname;
      this.videoObj.countTime = val.Vtime;
      this.editId = val.ID;
    },
    async editVideosDate() {
      //弹出框视频提交按钮方法**//视频编辑方法
      const { data: res } = await this.axios({
        url: `/VueHandler/VideoHandler?action=update`,
        method: "post",
        data: {
          ID: this.editId,
          Vname: this.videoObj.name,
          Vtime: this.videoObj.countTime,
          Vurl: this.videoObj.update
        }
      });
      if (res.err) return this.$message.error(res.err);
      if (res.success) {
        this.addVideosDialog = false;
        this.$message.success(`修改视频${res.success}!`);
        this.videoObj = {};
        this.editId = "";
        this.changMode = false;
      }
    },
    handleSizeChange(val) {
      this.videosPageSize = val;
    },
    handleCurrentChange(val) {
      this.pageVideoStart = val; //更改页数
      this.getFullVideos(); //更新数据
    },
    async getFullVideos() {
      //数据渲染
      const { data: res } = await this.axios({
        url: "/VueHandler/VideoHandler?action=showlist",
        method: "post",
        data: {
          searchText: this.searchVideo,
          pageStart: this.pageVideoStart
        }
      });
      console.log(res);
      if (res.err) return this.$message.error(res.err);
      if (res.success) {
        this.$message.success(res.success);
        this.videosCount = res.data.count;
        this.videosPageSize = res.data.pageSize;
        this.videoTableDate = res.data.list;
      }
    },
    async handle_Delete(val) {
      //删除方法调用
      this.$confirm(`确定删除《${val.Vname}》此条数据？？？`)
        .then(async () => {
          const { data: res } = await this.axios({
            url: "/VueHandler/VideoHandler?action=delete",
            method: "get",
            params: {
              ID: val.ID
            }
          });
          console.log(res);
          if (res.err) return this.$message.error(res.err);
          if (res.success) this.$message.success(res.success);
          this.getFullVideos(); //更新列表
        })
        .catch(() => {
          this.$message.warning("取消删除！！！");
        });
    },
    searchVideoFn() {
      //搜索方法
      if (!this.searchVideo) {
        return this.$message.error("请输入搜索内容！");
      } else {
        this.getFullVideos(); //直接更新数据
        this.searchVideo = "";
      }
    }
  }
};
</script>
<style scoped></style>
