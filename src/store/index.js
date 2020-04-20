import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {
    async getUserListDate() {
      //获取系统用户数据***重新更新数据
      const { data: res } = await this.axios({
        url: '/VueHandler/AdminHandler?action=show',
        method: 'get',
        params: {
          searchText: this.searchVal,
          pageStart: this.currentPage,
          pageSize: this.everyPageShowList,
        },
      });
      console.log(res);
      this.tableData = [];
      this.tableData = res.data.list;
      // this.totalCount = Math.ceil(res.data.count / res.data.pageSize);
      this.totalCount = res.data.count;
      // this.getPowerName();
    },
  },
  actions: {},
  modules: {},
});
