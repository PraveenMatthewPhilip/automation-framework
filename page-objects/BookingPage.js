const appFunctions = require('../common/appFunctions');
const utils = require('../common/utils')


function BookingPage(){

    this.loadingSection = element(by.css('section#bookingload'));
    this.hotelDescription = element(by.css('ul.description-box'));


    this.checkHotelName = allure.createStep('Check hotel name matching', async (hotelname)=>{  
        utils.reportLogger(`expected hotel name : ${hotelname}`);  
        await appFunctions.invisible(this.loadingSection, 25000);
        await appFunctions.visible(this.hotelDescription, 25000);
        let targetName = await this.hotelDescription.getAttribute('data-hotelname');
        expect(targetName).toBe(hotelname);
        await utils.takeScreenShots();
        utils.reportLogger(`onpage hotel name : ${targetName}`);  
    })
    
}

module.exports = new BookingPage();