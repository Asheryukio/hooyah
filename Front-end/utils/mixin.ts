export default {
  data() {
    return {
      sexList: [
        { name: "none", value: 0 },
        { name: "male", value: 1 },
        { name: "girl", value: 2 },
      ],
    };
  },
  methods: {
    
    submitOk(msg: any, cb: any) {
      console.log("submitOk", msg);
      // this.$notify({
      //   title: 'success',
      //   message: msg || 'success',
      //   type: 'success',
      //   duration: 2000,
      //   onClose: function () {
      //     cb && cb();
      //   },
      // });
    },
    submitFail(msg: string) {
      console.log("submitError", msg);
    
    },
  },
};
