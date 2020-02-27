
module.exports.dateSelector = function(date='06.06.2020', currentMonth=0){

    const [day, month, year] = date.split(".");
    let currentDate = new Date();
    let customDate = new Date(year,month-1,day);
    let monthDifference = customDate.getMonth() - currentMonth;
    let monthName = customDate.toLocaleString('de-de',{month:'long'});
    return {monthDifference, monthName, day, newDate:`${year}-${month}-${day}`};   
}

module.exports.isArraySorted = function(paramArray){
    let flag = true;
    for(let i=0;i<paramArray.length;i++){
        if(i < paramArray.length-1){
        if(paramArray[i] > paramArray[i+1] || paramArray[i] === paramArray[i+1]){
        }
        else{
            flag =  false;
            return flag;
        }
        }
    }
    return flag;
}

module.exports.getNewGUID = function(paramArray,guid){
    return paramArray.reduce((value,item)=>{
    //console.log("items",item)
    if(!guids.includes(guid)){
            //console.log('gg',guid)
            value = item
        }
        return value
    },'')
}


module.exports.switchBrowser =  async function (paramArray){
    let allGUIDs = await browser.getAllWindowHandles()
    let expectID = allGUIDs.reduce((value,item)=>{
        //console.log("items",item)
            if(!paramArray.includes(item)){
                //console.log('gg',guid)
                value = item
            }
            return value
        },'')

        await browser.switchTo().window(expectID)

}

module.exports.dateYYYYMMDD = function(date){

    const [day, month, year] = date.split(".");
    return `${year}-${month}-${day}`;   
}

module.exports.reportLogger = (string,notfail=true) => {
    if (notfail){
    return allure.createStep(string,()=>{})();
    }
    else{
        return allure.createStep(string, function () {throw new Error(string)})();
    }
}

// module.exports.reportLogger = (string,notfail=true) => {
//     return allure.createStep(string,()=>{})();
// }

module.exports.takeScreenShots = async (name='screenshot') =>{
    return browser.takeScreenshot().then(function (png) {
        allure.createAttachment(name, function () {return new Buffer.from(png, 'base64')}, 'image/png')();
      });
}


module.exports.loadExcelData = (datafile)=>{
    const xlsx = require('xlsx')
    let file = xlsx.readFile(datafile)
    return xlsx.utils.sheet_to_json(file.Sheets[(file.SheetNames)[0]])
}


