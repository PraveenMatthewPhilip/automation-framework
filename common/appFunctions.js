const utils = require('./utils')


function appFunctions(){
    this.openInputDatePicker = element(by.css('div.datepicker-input-wrapper-start'));
    this.startInputMonth = element(by.css('.start-input')).element(by.css('.months-wrapper > span:not(.hidden)'));
    this.endInputMonth = element(by.css('.end-input')).element(by.css('.months-wrapper > span:not(.hidden)'));
    this.nextMonth = element(by.css('.month-button-next'));
    let EC = protractor.ExpectedConditions;

   this.getBrowserId = async() =>
   {
       return await browser.getWindowHandle();
   }

this.selectDate  = async (date,defaultMonth)=>{
    let {monthDifference, newDate} = utils.dateSelector(date,defaultMonth);

    while(monthDifference !== 0){
        await this.nextMonth.click();
        --monthDifference;
    }
    await element(by.css(`[data-date="${newDate}"]`)).click();
}


this.selectStartDate = async (date) => {
        await this.openInputDatePicker.click();
        let defaultMonth = await this.startInputMonth.getAttribute('data-month')
        await this.selectDate(date,defaultMonth)
      
}


this.selectEndDate = async (date) => {
    let defaultMonth = await this.endInputMonth.getAttribute('data-month')
    await this.selectDate(date,defaultMonth)
}

this.waitForElement = async (targetElement, timeOut)=>{
    await browser.wait(EC.visibilityOf(targetElement), timeOut); 
}


this.invisible = async (targetElement, timeOut)=>{
    await browser.wait(EC.invisibilityOf(targetElement),timeOut);
}

this.visible = async (targetElement, timeOut)=>{
    await browser.wait(EC.visibilityOf(targetElement),timeOut);
}

this.visibleInvisible = async (targetElement, timeOut) => {
    await browser.wait(EC.visibilityOf(targetElement), timeOut); 
    await browser.wait(EC.invisibilityOf(targetElement), timeOut); 
}

this.presenceOfElement = async(targetElement, timeOut) => {
    await browser.wait(EC.presenceOf(targetElement), timeOut); 
}
  
}

module.exports = new appFunctions();