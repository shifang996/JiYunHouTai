<template>
  <div>
    <el-card>
      <!-- 面包屑显示 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>课程管理</el-breadcrumb-item>
        <el-breadcrumb-item>课程列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 搜索显示和注册添加 -->
      <el-row :gutter="24" type="flex" align="middle">
        <el-col :span="4"
          ><div class="grid-content ">
            <el-input v-model="courseNameSearch" placeholder="课程名称搜索"></el-input></div
        ></el-col>
        <el-col :span="3"
          ><div class="grid-content " style="font-size: 20px;">
            专业选择：
          </div></el-col
        >
        <el-col :span="4"
          ><div class="grid-content">
            <!-- 级部选择 -->
            <el-select v-model="classNameCheck" placeholder="请选择">
              <el-option v-for="item in className" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select></div
        ></el-col>
        <el-col :span="4"
          ><div class="grid-content ">
            <!-- 专业选择 -->
            <el-select v-model="classClassifyChecked" placeholder="请选择">
              <el-option v-for="item in classifyName" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content ">
            <!-- 班级选择 -->
            <el-select v-model="classNum" placeholder="请选择">
              <el-option v-for="item in classNumItem" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="4"
          ><div class="grid-content">
            <el-button type="primary">查询</el-button>
            <el-button type="success">+添加</el-button>
          </div></el-col
        >
      </el-row>
      <!-- 表头 -->
      <el-row :gutter="20">
        <el-col :span="24"> <i class="el-icon-menu"></i><span>课程列表</span> </el-col>
      </el-row>
      <!-- 相关渲染列表 -->
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column label="课程名称" prop="Cname"> </el-table-column>
        <el-table-column label="课程代号" prop="Cnumber"> </el-table-column>
        <el-table-column label="在学人数" prop="onlineUser"> </el-table-column>
        <el-table-column label="所属分类">
          <template slot-scope="scope">
            <el-tag effect="plain">{{ scope.row.CategoryOne }}</el-tag>
            <el-tag effect="plain">{{ scope.row.CategoryTwo }}</el-tag>
            <el-tag effect="plain">{{ scope.row.CategoryThree }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="编辑日期" prop="upDateAt"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag type="warning" effect="dark" v-if="scope.row.isState == '1'">草稿</el-tag>
            <el-tag type="success" effect="dark" v-if="scope.row.isState == '2'">上架</el-tag>
            <el-tag type="danger" effect="dark" v-if="scope.row.isState == '3'">下架</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="360px">
          <template>
            <el-button size="small">草稿</el-button>
            <el-button size="small">编辑</el-button>
            <el-button size="small">删除</el-button>
            <el-button size="small">置顶</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getDate();
  },
  data() {
    return {
      courseNameSearch: '',
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
      tableData: [],
    };
  },
  methods: {
    async getDate() {
      //获取所有的数据进行添加
      const { data: res } = await this.axios({
        url: '/VueHandler/CourseHandler?action=show',
        method: 'post',
        data: {
          searchText: '',
          CategoryOne: '',
          CategoryTwo: '',
          CategoryThree: '',
          pageStart: 1,
        },
      });
      console.log(res);
      this.tableData = res.data.list;
    },
  },
};
</script>
<style lang="less" scoped>
.el-row {
  margin: 20px 0;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
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
</style>
