const homePage = require('./page-objects/HomePage')
const hotelListPage = require('./page-objects/HoteListPage')
const flightPage = require('./page-objects/FlightsPage')
const bookingPage = require('./page-objects/BookingPage')
const utils = require('./common/utils')

const using = require('jasmine-data-provider')


// const data = {
//     url: "https://www.ab-in-den-urlaub.de/",
//     destination: "Sizilien",
//     searchStartDate: "06.06.2020",
//     searchEndDate: "13.06.2020",
//     searchAdults: 2,
//     searchPageStartDate: "13.06.2020",
//     searchPageEndDate: "20.06.2020",
//     starRating: 4,
//     cutomerReview: 5,
//     sortbyOption: "Höchster Preis",
//     selectHotelIndex: 1,
//     departureStartTime: "04:00",
//     departureEndTime: "21:00",
//     returnStartTime: "00:00",
//     returnEndTime: "12:00",  
//     departureDate: "13.06.2020",
//     selectFlightIndex: 1,
//   }


let objDataProvider = utils.loadExcelData('./test-data/test-data.xlsx')

describe('Test Suite -  Hotel + Flight Booking',  ()=>{
  using(objDataProvider, (data) => {
    
    it('Test Case -  Hotel + Flight Booking', async ()=>{
      try{
        await browser.get(data.url)
        await homePage.AcceptCookies();
        await homePage.searchDestination(data.destination);  
        await homePage.selectStartDate(data.searchStartDate);
        await homePage.selectEndDate(data.searchEndDate);
        await homePage.selectTravellers(data.searchAdults);
        await homePage.searchResults();
        await hotelListPage.selectStartDate(data.searchPageStartDate);
        await hotelListPage.selectEndDate(data.searchPageEndDate)
        await hotelListPage.searchResults();
        await hotelListPage.selectRequiredRating(data.starRating);
        await hotelListPage.selectCustomerSatfaction(data.cutomerReview);
        await hotelListPage.selectFilterOptions(data.sortbyOption)
        await hotelListPage.validatePriceSorted();
        let HotelName = await hotelListPage.getOfferHotelName(data.selectHotelIndex)
        await hotelListPage.selectOffer(data.selectHotelIndex);

        await flightPage.TerminePrice();
        await flightPage.setAnreiseTimeRange(data.departureStartTime,data.departureEndTime)
        await flightPage.setRuckReiseTimeRange(data.returnStartTime,data.returnEndTime)
        await flightPage.AnReiseDatum(data.departureDate)
        let directFlights = await flightPage.returnDirectFlights();
        await flightPage.checkDepartureTimeWithinRange(1,data.departureStartTime,data.departureEndTime);
        await flightPage.checkReturnTimeWithinRange(1,data.returnStartTime,data.returnEndTime);
        await flightPage.SelectFlight(data.selectFlightIndex);
        await bookingPage.checkHotelName(HotelName );

      }
      catch(err){
        await allure.createStep('Error Step : ',async()=>{
          await utils.takeScreenShots('Error Screenshot');
          return await allure.createStep(err.message, function () {throw new Error(err.message)})();
        })();
        throw err;
      }
    },3000000)
  })
})
