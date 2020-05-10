<template>
  <div>
    <el-card>
      <!-- 面包屑显示 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>课程管理</el-breadcrumb-item>
        <el-breadcrumb-item>课程编辑</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 表头 -->
      <el-divider></el-divider>
      <el-row :gutter="20" style="margin: 16px 0;" class="zheZhaoCeng">
        <el-col :span="24">
          <i class="el-icon-menu"></i><span>课程信息</span>
        </el-col>
      </el-row>
      <!-- 表单提交 -->
      <el-row type="flex" :style="addClassFlag ? zheZhaoCeng : ''">
        <el-col :span="12"
          ><div class="grid-content">
            <el-form
              :model="addClassForm"
              :rules="addClassrules"
              status-icon
              ref="addClassForm"
              label-width="100px"
              class="demo-ruleForm"
            >
              <el-form-item label="课程名称" prop="className">
                <el-input
                  size="small"
                  v-model="addClassForm.className"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="课程描述" prop="classDetail">
                <el-input
                  size="small"
                  v-model="addClassForm.classDetail"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="课程价格" prop="classPrice">
                <el-input
                  size="small"
                  type="number"
                  v-model="addClassForm.classPrice"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="专业选择：">
                <!-- 级部选择 -->
                <el-select
                  size="mini"
                  v-model="classNameCheck"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in className"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <!-- 专业选择 -->
                <el-select
                  size="mini"
                  v-model="classClassifyChecked"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in classifyName"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <!-- 班级选择 -->
                <el-select size="mini" v-model="classNum" placeholder="请选择">
                  <el-option
                    v-for="item in classNumItem"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="success" @click="saveClassDetail"
                  >保存</el-button
                >
              </el-form-item>
            </el-form>
          </div></el-col
        >
        <el-col :span="12">
          <div class="grid-content">
            <el-form>
              <el-form-item label="课程封面上传：">
                <!-- 图片上传 -->
                <div class="updateInput" @click="dialogVisible = true">
                  <i class="el-icon-plus" v-if="imgdateUrl ? false : true"></i>
                  <img :src="imgdateUrl" v-if="!imgdateUrl ? false : true" />
                </div>
                <!-- 图片上传框逻辑 -->
                <el-dialog
                  title="是否上传课程封面？"
                  :visible.sync="dialogVisible"
                  width="50%"
                  :before-close="setUpdateDialog"
                >
                  <input
                    :id="uuids"
                    @change="onFileChange($event, uuids)"
                    accept="image/gif,image/jpeg,image/x-png"
                    type="file"
                  />
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="handle_isOK('cancel')">取 消</el-button>
                    <el-button type="primary" @click="handle_isOK('yes')"
                      >确 定</el-button
                    >
                  </span>
                </el-dialog>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <!-- 课程内容 v-if="!addClassFlag ? false : true"-->
      <el-row>
        <el-col :span="12"
          ><div class="grid-content " style="margin-right: 5px;">
            <el-button type="success" @click="addMuLvFn">增加目录</el-button>
            <!-- 添加目录 -->
            <el-table
              :data="addMuLv"
              style="width: 100%"
              border
              highlight-current-row
              @current-change="handleCurrentChange"
            >
              <el-table-column label="目录" width="180" prop="CDName">
              </el-table-column>
              <el-table-column label="课件数" width="180" prop="CourseNumber">
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="small"
                    @click="handle_deleteRow(scope.row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div></el-col
        >
        <el-col :span="12"
          ><div class="grid-content ">
            <!-- 添加视频 -->
            <el-button type="success" @click="addVideosBtnFn"
              >增加视频</el-button
            >
            <!-- 添加目录 -->
            <el-table :data="addVideo" style="width: 100%" border>
              <el-table-column label="视频名称" width="180" prop="Vname">
              </el-table-column>
              <el-table-column label="时长" width="180" prop="Vtime">
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    @click="handle_addVideosDelete(scope.row)"
                    type="text"
                    size="small"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div></el-col
        >
      </el-row>
      <!-- 富文本编辑器 -->
      <!-- 表头 -->
      <el-divider></el-divider>
      <el-row :gutter="20" style="margin: 16px 0;">
        <el-col :span="24">
          <i class="el-icon-menu"></i><span>课程详情</span>
        </el-col>
      </el-row>
      <quill-editor
        style="margin-bottom:10px;"
        v-model="keyBody"
        @change="curuentKeybody($event)"
      ></quill-editor>
      <el-button type="success">保存</el-button>
    </el-card>
    <!-- 增加目录框弹出框 -->
    <el-dialog title="增加目录" :visible.sync="AdddialogMuLv" width="30%">
      <el-form label-width="80px">
        <el-form-item label="增加目录">
          <el-input v-model="MULVDATE"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AdddialogMuLv = false">取 消</el-button>
        <el-button type="primary" @click="addmulvFunction">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 增加目录的弹出框 -->
    <el-dialog title="增加视频" :visible.sync="AdddialogShiPin" width="80%">
      <!-- 面包屑显示 -->
      <el-breadcrumb
        separator-class="el-icon-arrow-right"
        style="margin-bottom:15px;"
      >
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>课程管理</el-breadcrumb-item>
        <el-breadcrumb-item>视频管理</el-breadcrumb-item>
      </el-breadcrumb>
      <el-row>
        <el-col :span="12">
          <el-input
            v-model="studentList.username"
            placeholder="模糊搜索课程名称"
          ></el-input>
        </el-col>
        <el-col :span="12">
          <el-button type="success" @click="checkedStudentUser">查询</el-button>
          <span style="margin-left: 6px;"
            >注意：依次写下相关字段进行相关的操作!</span
          >
        </el-col>
      </el-row>
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
              @click="handle_addMuLvVideos(scope.row)"
              type="primary"
              size="small"
              >添加视频</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block" style="margin-top: 14px;">
        <el-pagination
          @size-change="handleSizePageChange"
          @current-change="handleCurrentPageChange"
          :current-page.sync="pageVideoStart"
          :page-size="videosPageSize"
          :page-sizes="[3, 6, 9]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="videosCount"
        >
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// require styles
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
//引入uid处理数据
import classStore from "../store/classDateHandle.js";
export default {
  created() {
    if (this.$route.query.mulvid || this.$route.query.classid) {
      //视频列表页有值传过来
      console.log(
        this.$route.query.classid,
        "******************",
        this.$route.query.mulvid
      );
      this.clickMuLvObj.CDid = this.$route.query.classid;
      this.clickMuLvObj._id = this.$route.query.mulvid;
      this.handle_editInforMations(); //调用编辑方法
    }
    this.clickMuLvObj = {};
    this.getFullVideos(); //没有值则调用添加视频页数据
  },
  components: { quillEditor },
  computed: {
    uuids() {
      return classStore.state.uuids; //请求uuid名称
    }
  },
  data() {
    return {
      contextDetails: "",
      keyBody: "",
      studentList: {
        //搜索详情视频
        username: ""
      },
      videoTableDate: [],
      pageVideoStart: 1,
      videosCount: 0,
      videosPageSize: 0,
      AdddialogShiPin: false, //增加视频弹出框
      AdddialogMuLv: false, //增加目录弹出框
      zheZhaoCeng: {
        background: "rgba(0,0,0,.5) ",
        "z-index": "1000"
      },
      addClassFlag: false, //增加课程成功
      addMuLv: [], //添加目录
      addVideo: [], //增加视频
      imgdateUrl: "",
      addClassForm: {
        className: "",
        classDetail: "",
        classPrice: ""
      },
      addClassrules: {
        //是否是必填项目s
        className: [{ required: true, message: "60字以内", trigger: "blur" }],
        classDetail: [
          { required: true, message: "100字以内", trigger: "blur" }
        ],
        classPrice: [
          {
            required: true,
            message: "课程价格以元为单位，免费课程设置为0",
            trigger: "blur"
          }
        ]
      },
      classNameCheck: "级部选择",
      className: [
        {
          value: 1,
          label: "大学部"
        },
        {
          value: 2,
          label: "高中部"
        },
        {
          value: 3,
          label: "初中部"
        }
      ],
      classClassifyChecked: "专业选择",
      classifyName: [
        {
          value: 1,
          label: "前端开发"
        },
        {
          value: 2,
          label: "后端开发"
        },
        {
          value: 3,
          label: "运维"
        },
        {
          value: 4,
          label: "测试"
        },
        {
          value: 5,
          label: "大数据"
        }
      ],
      classNum: "班级选择",
      classNumItem: [
        {
          value: 1,
          label: "1班"
        },
        {
          value: 2,
          label: "2班"
        },
        {
          value: 3,
          label: "3班"
        }
      ],
      //图片上传
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      cacheName: "", //图片名称
      MULVDATE: "", //增加目录信息
      addClassRealDate: {},
      MuLvCdid: "", //增加目录的cid
      clickMuLvObj: {} //暂时存储左边目录信息
    };
  },
  methods: {
    async handle_editInforMations() {
      //处理用户编辑数据
      //1请求课程信息
      let { data: res } = await this.axios({
        url: "/VueHandler/CourseHandler?action=getcourse",
        method: "get",
        params: {
          ID: this.clickMuLvObj.CDid
        }
      });
      console.log(res);
      if (res.data.err) return this.$message.error(res.data.err);
      if (res.data.success) {
        this.$message.success(res.data.success);
        this.addClassForm.className = res.data.courselist.Cname;
        this.addClassForm.classPrice = res.data.courselist.Cprice;
        this.addClassForm.classDetail = res.data.courselist.Cdescribe;
        this.keyBody = res.data.courselist.Cdescribe;
        //  this.cacheName:res.data.courselist.Cdescribe
        console.log(this.addClassForm, this.keyBody);
        this.addmulvFunction(); //没有后台无法渲染
      }
    },
    checkedStudentUser() {
      //查询用户方法
      this.getFullVideos();
    },
    curuentKeybody(e) {
      //富文本编辑器
      console.log(this.contextDetails);
      this.keyBody = e.html;
      console.log(e.html);
    },
    async getFullVideos() {
      //增加视频按钮表格数据渲染
      const { data: res } = await this.axios({
        url: "/VueHandler/VideoHandler?action=showlist",
        method: "post",
        data: {
          searchText: this.studentList.username,
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
    handleSizePageChange(val) {
      //分页器a
      this.videosPageSize = val;
    },
    handleCurrentPageChange(val) {
      //分页器
      this.pageVideoStart = val; //更改页数
      this.getFullVideos(); //更新数据
    },
    addVideosBtnFn() {
      //增加视频弹出框
      this.AdddialogShiPin = true;
    },
    async handle_addMuLvVideos(vals) {
      //为当前目录增加视频
      console.log(vals);
      const { data: res } = await this.axios({
        url: "/VueHandler/CourseHandler?action=addvideo",
        method: "get",
        params: {
          CDid: this.clickMuLvObj.CDid, //课程id
          _id: this.clickMuLvObj._id, //目录id
          Vid: vals._id //视频id
        }
      });
      console.log(res);
      if (res.err) return this.$message.error(res.err);
      if (res.success) {
        this.$message.success(res.success);
        this.addVideo = res.data.list;
      }
    },
    async handle_addVideosDelete(opsss) {
      //删除相关目录下的已经增加的视频
      console.log(opsss);
      console.log(this.clickMuLvObj.CDid);
      console.log(this.clickMuLvObj._id);
      console.log(opsss._id);
      const { data: res } = await this.axios({
        url: "/VueHandler/CourseHandler?action=delvideo",
        method: "get",
        params: {
          CDid: this.clickMuLvObj.CDid, //课程id
          _id: this.clickMuLvObj._id, //目录id
          Vid: opsss._id //视频id
        }
      });
      if (res.err) return this.$message.error(res.err);
      if (res.success) {
        this.$message.success(res.success);
        this.currently_MuLvDateList(); //随即更新数据
      }
    },
    async currently_MuLvDateList() {
      //点击目录左边进行对右边数据的视频的table切换
      const { data: res } = await this.axios({
        url: "/VueHandler/VideoHandler?action=showdir",
        method: "get",
        params: {
          CDid: this.clickMuLvObj.CDid, //课程id
          _id: this.clickMuLvObj._id //目录id
        }
      });
      console.log(res);
      if (res.err) return this.$message.error(res.err);
      if (res.success) {
        this.$message.success(res.success);
        this.addVideo = res.data.list;
        // this.clickMuLvObj = {};
      }
    },
    handleCurrentChange(val) {
      //点击左边目录弹出相关处理视频添加视频
      this.clickMuLvObj = val; //此时获取数据左边点击数据
      console.log(this.clickMuLvObj);
      this.currently_MuLvDateList();
    },
    async handle_deleteRow(vals) {
      //执行删除目录的操作
      console.log(vals);
      const { data: res } = await this.axios({
        url: "/VueHandler/CourseHandler?action=deleteDirectory",
        method: "get",
        params: {
          CDid: vals.CDid,
          _id: vals._id
        }
      });
      console.log(res);
      if (res.err) {
        alert("删除成功");
      }
    },
    //文件上传框隐藏和显示
    setUpdateDialog() {
      this.dialogVisible = true;
    },
    async saveClassDetail() {
      if (this.keyBody) {
        //数据提交保存函数
        const { data: res } = await this.axios({
          url: "/VueHandler/CourseHandler?action=add",
          method: "post",
          data: {
            Cname: this.addClassForm.className,
            // Cdescribe: this.addClassForm.classDetail,
            Cdescribe: this.keyBody,
            Cprice: this.addClassForm.classPrice,
            CategoryOne: "",
            CategoryTwo: "",
            CategoryThree: "",
            Cpic: this.cacheName
          }
        });
        console.log(res); //获取到的数据打印获得ID值
        if (res.err) return this.$message.error(res.err);
        if (res.success) {
          this.$message.success(res.success);
          this.addClassFlag = true;
          this.addClassRealDate = res; //将数据灌入临时存储区，添加成功返回的相关的数据详情
          // this.addClassForm = {}; //清空输入框
        }
      } else {
        return this.$message.error(
          //提示用户完善富文本信息
          "请完善课程详情信息(富文本编辑器)内容！！！"
        );
      }
    },
    handle_isOK(mode) {
      //确定取消事件
      if (mode == "yes" || mode == "cancel") {
        this.dialogVisible = false;
      }
    },
    addMuLvFn() {
      //增加弹出框
      this.AdddialogMuLv = true;
    },
    async addmulvFunction() {
      console.log(this.addClassRealDate);
      //增加目录信息，主要是添加相关个承德目录
      const { data: res } = await this.axios({
        url: "/VueHandler/CourseHandler?action=AddDirectory",
        method: "post",
        data: {
          CDName: this.MULVDATE,
          CDid: this.addClassRealDate._id
        }
      });
      console.log(res);
      if (res.data.err) this.$message.error(res.data.err);
      if (res.data.success) this.$message.success(res.data.success);
      this.addMuLv = res.data.list; //将值付给渲染的目录列表
      this.AdddialogMuLv = false;
      this.MULVDATE = "";
      this.MuLvCdid = res.data.list[res.data.list.length - 1].CDid; //存入此目录的cdid
      console.log(this.MuLvCdid);
    },
    async onFileChange(e, item) {
      console.log(e, item);
      var form = new FormData(); //格式化表单数据
      if (document.getElementById(item).files[0]) {
        //参数为上传控件的id和该控件的数据
        //           id            上传的图片
        form.append(item, document.getElementById(item).files[0]);
      }
      // 处理图片略缩图操作
      this.imgdateUrl = URL.createObjectURL(
        document.getElementById(item).files[0]
      );
      console.log(form);
      //处理图片上传
      this.axios
        .post("/VueHandler/UpLoadPicHandler", form, {
          method: "post",
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(res => {
          console.log(res);
          this.cacheName = res.data.cacheName; //路径图片名称
          if (res.data.success) this.$message.success("图片上传成功");
          if (res.data.err) this.$message.success("图片上传失败");
        });
    }
  }
};
</script>
<style lang="less" scoped>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
  .el-input {
    width: 400px;
  }
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.el-select {
  width: 120px;
}
.el-form-item {
  .updateInput {
    font-size: 28px;
    color: #8c939d;
    width: 200px;
    height: 200px;
    display: flex;
    border: 1px dashed #d9d9d9;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    line-height: 178px;
    text-align: center;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
