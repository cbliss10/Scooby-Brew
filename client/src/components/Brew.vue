<template>
    <div class="d-flex justify-content-center" id="app">
        <h1>Brew</h1>
        <div class="card-deck text-center mt-4">
            <div class="card" v-for="(controlLoop, key) in config.controlLoops" :key="key">
                <div class="bg-dark">
                    <h2 class="m-4 text-light">{{ controlLoop.name }}</h2>
                </div>
                <h5 class="card-text border-top border-3">Temperature Controller</h5>
                <div class="border-top">
                    <div class="row">
                        <div class="col d-flex align-items-center">
                            <strong class="mx-2">Current Temp: </strong>
                        </div>
                        <div class="col d-flex align-items-center justify-content-center temp">{{ controlLoop.temperature }}<span class="degree">&deg;F</span></div>
                        <div class="col">

                        </div>
                    </div>
                </div>
                <div class="border-top">
                    <div class="row">
                        <div class="col d-flex align-items-center">
                            <strong class="mx-2">Set Temp: </strong>
                        </div>
                        <div class="col d-flex align-items-center justify-content-center degree">
                            <input class="w-50px text-center temp" type="text"
                                v-model="controlLoop.setTemp">&deg;F
                        </div>
                        <div class="col justify-content-center">
                            <div class="row justify-content-center">
                                <div class="col">
                                    <button class="btn btn-dark w-100" type="button" @click="controlLoop.setTemp++">UP</button>
                                </div>
                            </div>
                            <div class="row justify-content-center">
                                <div class="col">
                                    <button class="btn btn-dark w-100" type="button" @click="controlLoop.setTemp--">DOWN</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="border-top">
                    <div class="row">
                        <div class="col">
                            <button class="btn w-100" v-bind:class="controlLoop.on ? 'btn-danger' : 'btn-dark'" type="button" @click="toggleBrewery(controlLoop.id, 'on', controlLoop.setTemp)">On</button>
                        </div>
                        <div class="col">
                            <button class="btn w-100" v-bind:class="controlLoop.run ? 'btn-warning' : 'btn-dark'" type="button" @click="toggleBrewery(controlLoop.id, 'run', controlLoop.setTemp)">Run</button>
                        </div>
                    </div>
                </div>
                <div class="border-top">
                    <div class="row">
                        <div class="col">
                            <h5 class="text-center">Power Level: %</h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import BrewService from "@/services/BrewService";
    import ConfigService from "@/services/ConfigService";
    export default {
        data() {
            return {
                config: []
            }
        },
        mounted() {
            this.getConfig().then(setInterval(this.getData, 5000))            
        },
        methods: {            
            async getData() {
                const response = await BrewService.fetchData()
                let config = this.config
                let controlLoops = response.data[0]
                let vm = this
                //console.log(controlLoops)
                controlLoops.forEach(controlLoop => {
                    config.controlLoops.forEach(configLoop => {
                        if (controlLoop.id === configLoop.id) {
                            //console.log(configLoop.name)
                            configLoop.temperature = controlLoop.temp
                            configLoop.on = controlLoop.on
                            configLoop.run = controlLoop.run
                            vm.$forceUpdate();
                        }
                    });
                });
            },         
            async postData(controlLoopId, requestFunction, setTemp) {
                const response = await BrewService.postData(
                    {requestControlLoopId: controlLoopId,
                    requestFunction: requestFunction,
                    setTemp: setTemp})
                console.log(response.data[0])
            },
            async getConfig() {
                const response = await ConfigService.fetchConfig()
                this.config = response.data[0]
            },
            toggleBrewery(controlLoopId, requestFunction, setTemp)
            {
                let config = this.config
                let resp = "off"
                config.controlLoops.forEach(controlLoop => {
                    console.log(controlLoop.run + " and " + controlLoop.on)
                    if (controlLoop.id === controlLoopId) {
                        switch (requestFunction) {
                            case "run":
                                if(controlLoop.run)
                                    resp = "off"
                                else
                                    resp = "run"
                                break;
                            case "on":
                                if(controlLoop.on)
                                    resp = "off"
                                else
                                    resp = "on"
                                break;
                                                  
                            default:

                                break;
                        }
                    }
                });
                this.postData(controlLoopId, resp, setTemp)
            }
        }
    }
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css?family=Courier+Prime|Teko:300&display=swap');

.border-3 {
    border-width: 3px !important;
}

.btn {
    height: 75px !important;
    margin: 5px 0px 5px 0px;
}

.card {
    width: 350px;
}

.degree {
    font-family: 'Teko', sans-serif;
    font-size: 30px !important;
    font-weight: bold !important;    
}

.temp {
    font-family: 'Teko', sans-serif;
    font-size: 60px !important;
    font-weight: bold !important;
}

.w-50px {
    width: 60px !important;
}

</style>