<template>
    <div>
        <h1>Configure</h1>
        <div v-if="config.controlLoops == undefined">Has no control loops.</div>
        <div v-else class="mx-auto" style="width: 800px;">
            <form class="form-inline" v-for="(control, key) in config.controlLoops" :key="key">

                <input id="controlName" class="form-control mb-2 mr-sm-4" type="text" v-model="control.name"
                    placeholder="Control Loop Name">

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
        name: 'config',
        data() {
            return {
                config: []
            }
        },
        mounted() {
            this.getConfig()
        },
        methods: {
            addControlLoop() {
                this.config.controlLoops.push({
                    name: "",
                    input: [],
                    output: [],
                    controller: []
                });
            },
            async getConfig() {
                const response = await ConfigService.fetchConfig()
                this.config = response.data[0]
            },
            async postConfig() {
                console.log(JSON.stringify(this.config))
                const response = await ConfigService.postConfig(this.config)
                console.log(response)
            }
        },
        computed: {
        }
    }
</script>

<style lang="scss" scoped>

</style>