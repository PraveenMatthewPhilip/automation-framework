const appFunctions = require('../common/appFunctions')
const utils = require('../common/utils')


function HoteListPage(){

    this.loadingHotelOffers = element(by.css('.loading-box.loading-box--hotel'));
    this.hotelHeadElement = element(by.css('#hotelListHeadSkeleton'));
    this.hotelListRefreshing = element(by.css('.section_hotelList.skeleton.refreshing'));
    this.buttonSearch = element(by.css('#submit'));
    this.allOffers = element.all(by.css('.hotel-offer-evaluation:not(.alternative-offer)'));
    
    this.currentBrowserId = async function(){
        return await browser.getWindowHandle()
    }

    this.selectStartDate  = allure.createStep('Select start date', async date => {
        utils.reportLogger(`start date : ${date}`);
        await this.loadingOffers();
        await appFunctions.selectStartDate(date);
        await utils.takeScreenShots();
    })

    this.selectEndDate = allure.createStep('Select end date', async date => {
        utils.reportLogger(`end date : ${date}`);
        await appFunctions.selectEndDate(date);
        await utils.takeScreenShots();
    })

    this.loadingOffers = async () =>{
        await appFunctions.waitForElement(this.hotelHeadElement,60000)
    }

    this.searchResults = allure.createStep('Search ...', async() =>{
        await this.buttonSearch.click();
        await utils.takeScreenShots();
        await appFunctions.visibleInvisible(this.loadingHotelOffers,20000)
    })

    this.selectRequiredRating = allure.createStep('Select rating', async(rating) =>{
        utils.reportLogger(`rating: ${rating}`);
        await element(by.css(`[data-name="ab ${rating} Sternen"]`)).click();
        await utils.takeScreenShots();
    })

    this.selectCustomerSatfaction = allure.createStep('Select cutomer rating ', async(point) =>{
        utils.reportLogger(`rating: ${point}`);
        await element(by.css(`label[for="${point} Punkte"]`)).click();
        await appFunctions.visibleInvisible(this.hotelListRefreshing,20000)
        await utils.takeScreenShots();
    })

    this.selectFilterOptions  = allure.createStep('Select filter option', async(filterOption) =>{
    utils.reportLogger(`filter option : ${filterOption}`);
    await element(by.cssContainingText('option',filterOption)).click();
    await browser.sleep(5000);
    await utils.takeScreenShots();
    await browser.actions().mouseMove(element(by.css('#copy'))).perform();
    await browser.sleep(5000);
    })

   this.validatePriceSorted = allure.createStep('validate if prices are sorted in descending order', async ()=>{
    let priceArray = [];
    let price;
    await this.allOffers.each(async (eleHotel)=>{
            eleHotel.getAttribute('data-price')
            price = await eleHotel.getAttribute('data-price')
            priceArray.push(Number(price))
        })
    expect(utils.isArraySorted(priceArray)).toBe(true); 
    utils.reportLogger(`hotels prices : ${priceArray}`);
    })
    
    this.getOfferHotelName = async (index) =>{
        return await this.allOffers.get(index-1).element(by.css('.hotel-name-wrapper > a')).getAttribute('title');
    }

    this.selectOffer = allure.createStep('Select hotel', async (hotel)=>{
        utils.reportLogger(`hotel : ${hotel}`);
        let currentId = await browser.getWindowHandle()
        await browser.actions().mouseMove(await this.allOffers.get(0)).perform();
        await this.allOffers.get(hotel-1).element(by.css('.priceBox > a')).click();
        utils.switchBrowser(currentId);
        await utils.takeScreenShots();
    })
}

module.exports = new HoteListPage();