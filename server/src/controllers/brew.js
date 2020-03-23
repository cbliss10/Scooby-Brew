var brewery = []

exports.postBrew = (req, res, next) => {
    console.log("not here")
}

exports.getData = (req, res, next) => {
    let data = []
    req.brewery.forEach(controlLoop => {
        let temp = controlLoop.input.getTemp();
        data.push({
            name: controlLoop.name,
            id: controlLoop.id,
            temp: temp,
            on: controlLoop.on,
            run: controlLoop.run
        })
        //console.log(data)
    });

    res.send([data])
}

function handleInput(data, config, brewery) {
    let response = "No control loop found."
    let requestControlLoopId = data.requestControlLoopId
    let requestFunction = data.requestFunction;
    let setTemp = data.setTemp;
    console.log(data)
    brewery.forEach(controlLoop => {
        console.log(controlLoop.id + " and " + requestControlLoopId)
        if(controlLoop.id === requestControlLoopId)
        {
            switch(requestFunction) {
                case "on":
                    controlLoop.fullOn();
                    response = controlLoop.name + " has been turned on."
                    break;
                case "run":
                    controlLoop.runAt(setTemp);
                    response = controlLoop.name + " has been set to run at " + setTemp + " degrees F."
                    break;
                case "off":
                    controlLoop.turnOff();
                    response = controlLoop.name + " has been turned off."
                    break;
                default:
                    response = "Request function not recognized";
            }
        }
    })
    return response
}

exports.breweryInput = (req, res, next) => {
    let data = req.body;
    let config = req.config
    let brewery = req.brewery
    //console.log("request body: " + JSON.stringify(req.body))
    let handlerResp = handleInput(data, config, brewery)
    res.send([handlerResp])
}
