var app = new Vue({
  el: '#app',
  data: {
    devices: "None found.",
  },
  created() {
    // fetch the data when the view is created and the data is
    // already being observed
    this.fetchData()
  },
  watch: {
    // call again the method if the route changes
    '$route': 'fetchData'
  },
  methods: {
    fetchData() {
      this.error = this.post = null
      this.loading = true
      // replace `getPost` with your data fetching util / API wrapper
      fetch('http://192.168.1.100:3000/configure/getData', {
        method: 'GET',
      })
        .then(response => {
          return response.json();
        })
        .then(data => {
          this.devices = data;
        })
        .catch(e => {
          console.log(e);
        })
    }
  }
});