<template>
    <div>
        <h1>Configure</h1>
        <span><b>{{ config.title }}</b></span><br />
        <span>{{ config.description }}</span>
    </div>
</template>

<script>
    import ConfigService from "@/services/ConfigService";
    export default {
        name: 'config',
        data () {
            return {
                config: []
            }
        },
        mounted () {
            this.getConfig()
        },
        methods: {
            async getConfig() {
                const response = await ConfigService.fetchConfig()
                this.config = response.data[0]
                console.log(this.config);
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
