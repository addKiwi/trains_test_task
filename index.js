const fs = require("fs");
csv = fs.readFileSync("test_task_data.csv")

let  array = csv.toString().split("\n").map(ell=>ell.slice(0,-1));

array = array.map(ell=>{
    let massEll=ell.split(";")
    ell = new Object({
        'number':massEll[0].trim(),
        'start':massEll[1].trim(),
        'end':massEll[2].trim(),
        'price':massEll[3].trim(),
        'startTime':massEll[4].trim(),
        'endTime':massEll[5].trim()
    })
    return ell
})

function compareP(a,b) {
    const priceA = a.price;
    const priceB = b.price;
    let comparison = 0;
    if (priceA > priceB) {
        comparison = 1;
    } else if (priceA < priceB) {
        comparison = -1;
    }
    return comparison;
}

function compareT(a,b) {
    const priceA = a.time;
    const priceB = b.time;
    let comparison = 0;
    if (priceA > priceB) {
        comparison = 1;
    } else if (priceA < priceB) {
        comparison = -1;
    }
    return comparison;
}

function deleteTrains/*deleteTrainsByEnd*/(start,data) {
    for(let j = 0; j<data.length;j++){
        if(start.start===data[j].end){
            data.splice(j,1)
            j--
        }
    }
    return data
}

function cheapestTrain(train, trainData) {
    for (let i = 0; i<trainData.length; i++){
        if(train===trainData[i].start){
            return trainData[i]
            break
        }
    }
}

function searhNumberOfTrain(start, end, price, startTime, endTime, trainData) {
    if(price!=='time')
    {

        for (let i = 0; i<trainData.length; i++)
        {
            if(start===+trainData[i].start &&
                end===+trainData[i].end &&
                price===+trainData[i].price)
            {
                return trainData[i].number
                break
            }
        }
    }else if(price==='time')
    {
        // console.log(trainData)
        for (let i = 0; i<trainData.length; i++)
        {
            if(start===+trainData[i].start &&
                end===+trainData[i].end &&
                startTime===+trainData[i].startTime &&
                endTime===+trainData[i].endTime)
            {
                return trainData[i].number
                break
            }
        }
    }
}

function textTimeToSeconds(time) {
    return time
        .split(':')
        .map(ell=>ell = +ell)
        .map((ell,idx)=>{if(idx===0)
        {ell=ell*3600}
        else if(idx===1)
        {ell=ell*60};
            return ell})
        .reduce((acc,a)=>{return acc+a},0)
}

function travelTime(start, end){

    if(typeof start!=='number' && typeof end!=='number'){
        start = textTimeToSeconds(start)
        end = textTimeToSeconds(end)}
    if (start > end) {
        end += 86400
    }
    return end - start
}

function deleteCurrentTrain(train, data) {
    for(let i = 0; i<data.length;i++){
        if(train.start===data[i].start &&
            train.end===data[i].end &&
            train.startTime===data[i].startTime &&
            train.endTime===data[i].endTime){
            data.splice(i,1)
            break
        }
    }
    return data
}

function fastestTrain(train, trainData) {
    let trains = trainData.filter(ell => ell.start===train.end)
    if(trains.length!==0){
        trains = trains.map(ell=>{ell.time = ell.time+travelTime(train.endTime, ell.startTime); return ell})
        trains.sort(compareT)
        return trains[0]}
    else {return false}
}

function toDateTime(secs) {
    let m = Math.floor(secs/60)
    let h = Math.floor(m/60)
    m = m-h*60
    if(h>=24){
        let d = Math.floor(h/24)
        h = h-d*24
        if(d>1){return d+' days '+h+':'+m+' hours'}
        else {return d+' day '+h+':'+m+' hours'}
    }else{return h+':'+m+' hours';
    }
}

let task_data_price = JSON.parse(JSON.stringify(array));
let arrayT=JSON.parse(JSON.stringify(array));
let arrayP=JSON.parse(JSON.stringify(array));


function dataFor(array, value){
    if(value==='price'){
        let dataFor = array.map(ell=>{
            delete ell.number
            delete ell.startTime
            delete ell.endTime
            ell.start =  +ell.start
            ell.end =  +ell.end
            ell.price =  +ell.price
            return ell
        })
        return dataFor
    } else if(value==='time'){
        let dataFor = array.map(ell=>{
            delete ell.price
            ell.start =  +ell.start
            ell.end =  +ell.end
            ell.time = travelTime(ell.startTime, ell.endTime)
            ell.startTime = textTimeToSeconds(ell.startTime)
            ell.endTime = textTimeToSeconds(ell.endTime)
            return ell
        })
        return dataFor
    }
}

let dataForTime=dataFor(arrayT,'time')
let task_data_time = JSON.parse(JSON.stringify(array));
task_data_time = task_data_time.map(ell=>{
    ell.startTime = textTimeToSeconds(ell.startTime)
    ell.endTime = textTimeToSeconds(ell.endTime)
    return ell
})
let dataForPrice=dataFor(arrayP,'price')

function toObj(data){
    data = data.map(ell =>{
        ell = JSON.stringify(ell)
        return ell
    })
    return data
}

dataForTime = toObj(dataForTime)
dataForPrice = toObj(dataForPrice)


function createUniq(data){
    data = new Set(data)
    data = [...data]
    data = data.map(ell=>{
        ell = JSON.parse(ell)
        return ell
    })
    return data
}


dataForPrice=createUniq(dataForPrice)
dataForTime=createUniq(dataForTime)


function deleteWorst(data, value) {
    let li =  data.length
    if(value==='price'){
        for( let i=0; i<li; i++ ) {
            for(let j=i+1; j<li; j++){
                if(data[i].start === data[j].start &&
                    data[i].end === data[j].end &&
                    +data[i].price <= +data[j].price) {
                    data.splice(j,1)
                    li--
                    j--
                }else if (data[i].start === data[j].start &&
                    data[i].end === data[j].end){
                    data[i] = data[j]
                    data.splice(j,1)
                    li--
                    j--
                }
            }
        }
    }else if(value==='time'){
        for( let i=0; i<li; i++ ) {
            for(let j=i+1; j<li; j++){
                if(data[i].start === data[j].start &&
                    data[i].end === data[j].end &&
                    data[i].startTime === data[j].startTime &&
                    data[i].time <= data[j].time) {
                    data.splice(j,1)
                    li--
                    j--
                }else if (data[i].start === data[j].start &&
                    data[i].end === data[j].end &&
                    data[i].startTime === data[j].startTime){
                    data[i] = data[j]
                    data.splice(j,1)
                    li--
                    j--
                }
            }
        }
    }
    return data

}

dataForTime = deleteWorst(dataForTime, 'time')
dataForPrice = deleteWorst(dataForPrice, 'price')

function listOfStations(data) {
    let listOfStations = data.map(val=>{return val.start})
    listOfStations = new Set(listOfStations)
    listOfStations=[...listOfStations]
    listOfStations.sort(function(a, b) {
        return a - b;
    });
    return listOfStations

}

let listOfStationsTime = listOfStations(dataForTime)
let listOfStationsPrice = listOfStations(dataForPrice)

dataForPrice.sort(compareP)
dataForTime.sort(compareT)

function routes(listOfStations, dataFor, value) {
    let routes=[]
//init the routes
    for ( let i = 0; i < dataFor.length; i++ ) {
        routes[i] = [];
    }
    if(value==='price'){
        for (let i = 0; i<listOfStations.length;i++)
        {
            let start = cheapestTrain(listOfStations[i], dataFor)
            let price = [...dataFor]
            let done = false

            while(done!=true){
                routes[i].push(start)
                price = deleteTrains(start, price)
                for(let j = 0; j<price.length;j++){
                    if(start.end===price[j].start){
                        start=price[j]
                        break
                    }
                    else if(j===price.length-1){
                        done = true
                    }
                }
            }

        }
        return routes
    }
    else if(value==='time'){
        let length = dataFor.length
        let forTime = JSON.parse(JSON.stringify(dataFor))
        for(let i = 0; i<length; i++){
            let start=forTime[i]
            if(typeof start === 'object'){
                routes[i].push(start)
                forTime = deleteCurrentTrain(start, forTime)
                let done = false
                let data = JSON.parse(JSON.stringify(forTime))
                let first = JSON.parse(JSON.stringify(start))
                while(done!==true){
                    data = deleteTrains(first, data)
                    let closestTrain = fastestTrain(start,data)
                    if(closestTrain!==false){
                        routes[i].push(closestTrain)
                        data = deleteTrains(closestTrain,data)
                        start=closestTrain}
                    else{done=true}
                }
            }else {break}
        }
    return routes
    }
}

let TimeRoutes = routes(listOfStationsTime, dataForTime, 'time')
let PriceRoutes = routes(listOfStationsPrice, dataForPrice, 'price')

function bestRoutes(routes, value, task_data, listOfStations)
{
    if(value==='price')
    {
        if(routes.length>0)
        {
            let possibleRoutes = routes.filter(ell => ell.length > (listOfStations.length - 2))
            let priceArr= []
            for(let i=0; i<possibleRoutes.length; i++)
            {
                let price = 0
                for(let j = 0; j<possibleRoutes[i].length;j++)
                {
                    price+=possibleRoutes[i][j].price
                }
                priceArr.push(+price.toFixed(2))
            }
            let minValue = Math.min(...priceArr)
            let cheapestRoutes = possibleRoutes.filter((ell, idx)=> priceArr[idx]===minValue)
            for (let i = 0; i<cheapestRoutes.length; i++)
            {
                let route = 'Best by Price #' + (i+1) +' : '
                for (let j = 0; j<cheapestRoutes[i].length;j++)
                {
                    let start = cheapestRoutes[i][j].start
                    let end = cheapestRoutes[i][j].end
                    let price = cheapestRoutes[i][j].price
                    let number = searhNumberOfTrain(start, end, price, null, null, task_data)
                    route = route + '#' + number + ' --> '
                }
                route = route+' Price: ' + minValue
                console.log(route)
            }
        }
        else
        {console.log('Possible '+value+' Routes does not exsist!')}
    }
    else if(value==='time')
    {
        if(routes.length>0)
        {
        let possibleRoutes = routes.filter(ell => ell.length > (listOfStations.length - 2))
        let timeArr= []
        for(let i=0; i<possibleRoutes.length; i++)
        {
            let price = 0
            for(let j = 0; j<possibleRoutes[i].length;j++)
            {
                price+=possibleRoutes[i][j].time
            }
            timeArr.push(price)
        }
        let minValue = Math.min(...timeArr)
        let fastestRoutes = possibleRoutes.filter((ell, idx)=> timeArr[idx]===minValue)
        for (let i = 0; i<fastestRoutes.length; i++)
        {
            let route = 'Best by Time #' + (i+1) +' : '
            for (let j = 0; j<fastestRoutes[i].length;j++)
            {
                let start = fastestRoutes[i][j].start
                let end = fastestRoutes[i][j].end
                let startTime = fastestRoutes[i][j].startTime
                let endTime = fastestRoutes[i][j].endTime
                let number = searhNumberOfTrain(start, end, value,  startTime, endTime, task_data)

                route = route + '#' + number + ' --> '
            }
            route = route+' Travel time: ' + toDateTime(minValue)
            console.log(route)
        }
    }else {console.log('Possible '+value+' Routes does not exsist!')}
    }
}

bestRoutes(TimeRoutes, 'time',task_data_time, listOfStationsTime)

bestRoutes(PriceRoutes, 'price',task_data_price, listOfStationsPrice)