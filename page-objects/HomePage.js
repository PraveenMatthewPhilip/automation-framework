const appFunctions = require('../common/appFunctions')
const utils = require('../common/utils')

function HomePage(){
    

    this.eleCookieAccept = element(by.css('#CybotCookiebotDialogBodyButtonAccept'))     
    this.loadingDesitnation = element(by.css('.destinations:not(.location-mobile-dropdown) > .formload-animation'))
    this.inputTravellerSummary = element(by.css('input#travellerSummary'))
    this.buttonOKTraveller = element(by.css('#travellerLayer .button-submit'))    
    this.numberOfAdults = element(by.css('.adultCount.counter'))
    this.plusAdults = element(by.css('._input-box-traveller')).element(by.css('.plusButton'))
    this.buttonSearch = element(by.css('#submit'))

    
    this.AcceptCookies = allure.createStep('Accept Cookies', async ()=>{
        await appFunctions.waitForElement(this.eleCookieAccept,10000)
        await this.eleCookieAccept.click();
        await utils.takeScreenShots();
    })

    this.searchDestination = allure.createStep('Search for destination', async (destination)=>{
        utils.reportLogger(`destination : ${destination}`);
        await element(by.css('.location.standard-version #idestflat')).click();
        await element(by.css('.location-layer #idestflat')).sendKeys(destination);
        await appFunctions.visibleInvisible(this.loadingDesitnation, 10000)
        let targetDestination = await element.all(by.css(`.area a[data-name="${destination}"]`))
        await targetDestination[1].click();
        await utils.takeScreenShots();
    })

    this.selectTravellers = allure.createStep('Select number of travellers',  async (adults) => {
        utils.reportLogger(`adults : ${adults}`);
        await this.inputTravellerSummary.click()
        let adultsNumber = await this.numberOfAdults.getText();
        adultsDiff = adults - adultsNumber;
        while(adultsDiff){
            await this.plusAdults.click();
            --adultsDiff;
        }
        await this.buttonOKTraveller.click();
        await utils.takeScreenShots();
    })

    this.selectStartDate = allure.createStep('Select start date', async (date) =>{
        utils.reportLogger(`start date : ${date}`);
        await appFunctions.selectStartDate(date);
        await utils.takeScreenShots();
    })

    this.selectEndDate = allure.createStep('Select end date', async (date) =>{
        utils.reportLogger(`end date : ${date}`);
        await appFunctions.selectEndDate(date);
        await utils.takeScreenShots();
    })

    this.searchResults = allure.createStep('Search ...' , async ()=>{
        await this.buttonSearch.click();
        await utils.takeScreenShots();
    })

}
module.exports = new HomePage();