<template>
  <div id="app">
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
    <router-link class="navbar-brand" to="/">Scooby Brew</router-link>
    <button class="navbar-toggler" data-target="#navbar" data-toggle="collapse" aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div id="navbar" class="collapse navbar-collapse">
      <ul class="navbar-nav mr-auto">
        <li :class="[currentPage.includes('brew') ? activeClass : 'nav-item']">
          <router-link class="nav-link" to="/brew">Brew</router-link>
        </li>
        <li :class="[currentPage.includes('configure') ? activeClass : 'nav-item']">
          <router-link class="nav-link" to="/configure">Configure</router-link>
        </li>
      </ul>
    </div>
  </nav>
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  data() {
    return {
      activeClass : 'active',
    };
  },
  computed: {
    currentPage() {
      return this.$route.path;
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
