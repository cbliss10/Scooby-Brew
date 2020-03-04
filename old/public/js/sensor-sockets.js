var app = new Vue({
    el: '#app',
    data: {
        hlt: {
            setTemp: 165,
            currentTemp: 0,
            address: '28-041702b06bff',
            run: false,
            on: false,
            powerLevel: 0
        },
        mash: {
            currentTemp: "--",
            address: '28-0517027930ff',
        },
        boilKettle: {
            setTemp: 212,
            currentTemp: 0,
            address: '28-0517023ae9ff',
            run: false,
            on: false,
            powerLevel: 0
        }
        // how do I dynamically add my sensors?
    },
    methods: {
        hltIncrease: function () {
             this.hlt.setTemp ++;
        },
        hltDecrease: function () {
            this.hlt.setTemp --;
       },
        boilKettleIncrease: function () {
            this.boilKettle.setTemp ++;
       },
        boilKettleDecrease: function () {
            this.boilKettle.setTemp --;
       },
    },
    mounted: function () {
        // var socket = io();
        // let vm = this;
        // socket.emit("consoleMessage", "Socket started ...")
        // socket.on('consoleMessage', function(data) {
        //     console.log(data);
        // });
        // socket.on('data', function(data){
        //     // console.log(data);
        //     vm.hlt.currentTemp = data.hlt.temp.toFixed(1);
        //     vm.hlt.powerLevel = Math.round(data.hlt.out/2.55);
        //     vm.mash.currentTemp = data.mash.temp.toFixed(1);
        //     vm.boilKettle.currentTemp = data.boilKettle.temp.toFixed(1);
        //     vm.boilKettle.powerLevel = Math.round(data.boilKettle.out/2.55);

        //     socket.emit("requestData", {
        //         hlt: vm.hlt,
        //         boilKettle: vm.boilKettle
        //     })
        // });
        console.log(vm.hlt.setTemp);
        // socket.emit("requestData", {
        //     hlt: vm.hlt,
        //     boilKettle: vm.boilKettle
        // });
    }
});