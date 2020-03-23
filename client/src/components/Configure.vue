<template>
  <div>
    <h1>Configure</h1>
    <div v-if="config.controlLoops == undefined">Has no control loops.</div>
    <div v-else class="mx-auto" style="width: 800px;">
      <form class="form-inline" v-for="(control, key) in config.controlLoops" :key="key">
        <input
          id="controlName"
          class="form-control mb-2 mr-sm-4"
          type="text"
          v-model="control.name"
          placeholder="Control Loop Name"
        />

        <label class="mb-2 mr-sm-2" for="my-select">Input:</label>
        <select id="my-select" class="form-control mb-2 mr-sm-2" v-model="control.input">
          <option v-for="input in config.onewireDevices" :key="input">{{ input }}</option>
        </select>

        <label class="mb-2 mr-sm-2">Output:</label>
        <select id="outputSelect" class="form-control mb-2 mr-sm-2" v-model="control.output">
          <option v-for="output in config.outputPins" :key="output">{{ output }}</option>
        </select>

        <button class="btn btn-danger" type="button">X</button>
      </form>
    </div>
    <button class="btn btn-light" @click="addControlLoop">Add Control Loop</button>
    <button class="btn btn-light" @click="postConfig">Save</button>
  </div>
</template>

<script>
import ConfigService from "@/services/ConfigService";
export default {
  name: "config",
  data() {
    return {
      config: []
    };
  },
  mounted() {
    this.getConfig();
  },
  methods: {
    uuidv4() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    },
    addControlLoop() {
      this.config.controlLoops.push({
        name: "",
        input: [],
        output: [],
        controller: [],
        id: this.uuidv4()
      });
    },
    async getConfig() {
      const response = await ConfigService.fetchConfig();
      this.config = response.data[0];
      console.log("Checking for UUIDs ...")
      this.config.controlLoops.forEach(loop => {
          if(loop.id == null || (Object.keys(loop.id).length === 0 && loop.id.constructor === Object))
          {
              console.log(loop.name + " does not have a UUID, assigning one now.")
              loop.id = this.uuidv4()
              console.log(loop.id)
          }
      });
    },
    async postConfig() {
      console.log(JSON.stringify(this.config));
      const response = await ConfigService.postConfig(this.config);
      console.log(response);
    }
  },
  computed: {

  }
};
</script>

<style lang="scss" scoped>
</style>