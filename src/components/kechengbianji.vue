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
      <el-row :gutter="20" style="margin: 16px 0;">
        <el-col :span="24"> <i class="el-icon-menu"></i><span>课程信息</span> </el-col>
      </el-row>
      <!-- 表单提交 -->
      <el-row type="flex">
        <el-col :span="12"
          ><div class="grid-content">
            <el-form :model="addClassForm" :rules="addClassrules" status-icon ref="addClassForm" label-width="100px" class="demo-ruleForm">
              <el-form-item label="课程名称" prop="className">
                <el-input size="small" v-model="addClassForm.className" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="课程描述" prop="classDetail">
                <el-input size="small" v-model="addClassForm.classDetail" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="课程价格" prop="classPrice">
                <el-input size="small" type="number" v-model="addClassForm.classPrice" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="专业选择：">
                <!-- 级部选择 -->
                <el-select size="mini" v-model="classNameCheck" placeholder="请选择">
                  <el-option v-for="item in className" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
                <!-- 专业选择 -->
                <el-select size="mini" v-model="classClassifyChecked" placeholder="请选择">
                  <el-option v-for="item in classifyName" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
                <!-- 班级选择 -->
                <el-select size="mini" v-model="classNum" placeholder="请选择">
                  <el-option v-for="item in classNumItem" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="success" @click="submitForm('ruleForm')">保存</el-button>
              </el-form-item>
            </el-form>
          </div></el-col
        >
        <el-col :span="12">
          <div class="grid-content">
            <el-form>
              <el-form-item label="课程封面上传">
                <!-- 图片上传 -->
                <el-upload action="#" list-type="picture-card" :auto-upload="false">
                  <i slot="default" class="el-icon-plus"></i>
                  <div slot="file" slot-scope="{ file }">
                    <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                    <span class="el-upload-list__item-actions">
                      <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                        <i class="el-icon-zoom-in"></i>
                      </span>
                      <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDownload(file)">
                        <i class="el-icon-download"></i>
                      </span>
                      <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                        <i class="el-icon-delete"></i>
                      </span>
                    </span>
                  </div>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt="" />
                </el-dialog> </el-form-item
            ></el-form>
          </div>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <!-- 课程内容 -->
      <el-row>
        <el-col :span="12"
          ><div class="grid-content " style="margin-right: 5px;">
            <el-button type="success">增加目录</el-button>
            <!-- 添加目录 -->
            <el-table :data="addMuLv" style="width: 100%" border>
              <el-table-column label="目录" width="180"> </el-table-column>
              <el-table-column label="课件数" width="180"> </el-table-column>
              <el-table-column label="操作"> </el-table-column>
            </el-table></div
        ></el-col>
        <el-col :span="12"
          ><div class="grid-content ">
            <!-- 添加视频 -->
            <el-button type="success">增加视频</el-button>
            <!-- 添加目录 -->
            <el-table :data="addVideo" style="width: 100%" border>
              <el-table-column label="视频名称" width="180"> </el-table-column>
              <el-table-column label="时长" width="180"> </el-table-column>
              <el-table-column label="操作"> </el-table-column>
            </el-table></div
        ></el-col>
      </el-row>
      <!-- 富文本编辑器 -->
      <!-- 表头 -->
      <el-divider></el-divider>
      <el-row :gutter="20" style="margin: 16px 0;">
        <el-col :span="24"> <i class="el-icon-menu"></i><span>课程详情</span> </el-col>
      </el-row>
      <editor-com></editor-com>
    </el-card>
  </div>
</template>

<script>
import editorCom from '@/components/Editor';
export default {
  components: { editorCom },
  data() {
    return {
      addMuLv: [], //添加目录
      addVideo: [], //增加视频
      addClassForm: {
        className: '',
        classDetail: '',
        classPrice: '',
      },
      addClassrules: {
        //是否是必填项目s
        className: [{ required: true, message: '60字以内', trigger: 'blur' }],
        classDetail: [{ required: true, message: '100字以内', trigger: 'blur' }],
        classPrice: [{ required: true, message: '课程价格以元为单位，免费课程设置为0', trigger: 'blur' }],
      },
      classNameCheck: '级部选择',
      className: [
        {
          value: 1,
          label: '大学部',
        },
        {
          value: 2,
          label: '高中部',
        },
        {
          value: 3,
          label: '初中部',
        },
      ],
      classClassifyChecked: '专业选择',
      classifyName: [
        {
          value: 1,
          label: '前端开发',
        },
        {
          value: 2,
          label: '后端开发',
        },
        {
          value: 3,
          label: '运维',
        },
        {
          value: 4,
          label: '测试',
        },
        {
          value: 5,
          label: '大数据',
        },
      ],
      classNum: '班级选择',
      classNumItem: [
        {
          value: 1,
          label: '1班',
        },
        {
          value: 2,
          label: '2班',
        },
        {
          value: 3,
          label: '3班',
        },
      ],
      //图片上传
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
    };
  },
  methods: {
    //图片上传方法
    handleRemove(file) {
      console.log(file);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleDownload(file) {
      console.log(file);
    },
  },
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
</style>
