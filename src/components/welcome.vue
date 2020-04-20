<template>
  <div style="font-size: 32px;">
    <h1>用户：{{ loginUser }}，欢迎登陆！</h1>
  </div>
</template>

<script>
export default {
  created() {
    this.loginUser = sessionStorage.user;
  },
  data() {
    return {
      loginUser: '',
    };
  },
};
</script>
<style scoped></style>
