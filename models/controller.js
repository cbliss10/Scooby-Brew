function input(id, name = "", address = []){
    let inpt = {
        id: id,
        name: name,
        address: address
    }
    return inpt;
}

function output()
{
    return {
        pin: undefined,
        name: ""
    }
}

function controller(){
    var control = {
        input: input(),
        output: output()
    };
    return control;
}

function getIdArray(sensorList){
    let arr = [];
    sensorList.forEach(sensor => {
        arr.push({
            id: sensor.id,
            
        })
    });
}

module.exports.input = input;
module.exports.controller = controller;