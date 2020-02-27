const appFunctions = require('../common/appFunctions')
const utils = require('../common/utils')

function FlightsPage(){

    this.TerminePreiseButton = element(by.css('a.js-events-and-price'))
    this.AnReiseStart = element(by.css('#departureTimeRange .noUi-base .noUi-origin .noUi-handle-lower'))
    this.AnReiseEnd = element(by.css('#departureTimeRange .noUi-base .noUi-origin .noUi-handle-upper'))
    this.RuckReiseStart = element(by.css('#returnTimeRange .noUi-base .noUi-origin .noUi-handle-lower'))
    this.RuckResiseEnd = element(by.css('#returnTimeRange .noUi-base .noUi-origin .noUi-handle-upper'))
    this.departureTimeStart = element(by.css('#departureTimeRange + .time-footer .time-min'))
    this.departureTimeEnd = element(by.css('#departureTimeRange + .time-footer .time-max'))
    this.returnTimeStart = element(by.css('#returnTimeRange + .time-footer .time-min'))
    this.returnTimeEnd = element(by.css('#returnTimeRange + .time-footer .time-max'))
    this.offerLoading = element(by.css('.section_skeletonOffers.refreshing'))
    this.allFlights = element.all(by.css('section.skeleton-offers > article'))


    this.setTimeRange = async (sliderElement,x,y) => {
        await browser.sleep(1000);
        await browser.actions().mouseMove(this.RuckResiseEnd).perform();
        await browser.actions().mouseMove(sliderElement).perform();
        await browser.actions().mouseMove({x,y}).perform();
        await browser.actions().doubleClick().perform();        
        await browser.sleep(1000);
        await appFunctions.invisible(this.offerLoading,60000)
    }
    
    this.setAnreiseTimeRange = allure.createStep('Select departure time range', async (x,y)=>{
        utils.reportLogger(`departure time range : ${x}, ${y}`);
        let xDistance = Number(x.split(':')[0])*10
        let yDistance = -(24 - Number(y.split(':')[0])) *10
        await this.setTimeRange(this.AnReiseStart,xDistance,0)
        if(yDistance < -110) {
            await this.setTimeRange(this.AnReiseEnd,-110,0)
            await this.setTimeRange(this.AnReiseEnd,yDistance+-110,0)
        }
        else{
            await this.setTimeRange(this.AnReiseEnd,yDistance,0)     
        }
            let xDiff = await this.departureTimeStart.getText()
                if(!(xDiff == x)){
                xDistance = Number(xDiff.split(':')[0] - Number(x.split(':')[0]))*10
                await this.setTimeRange(this.AnReiseStart,xDistance,0)
            }
            let yDiff = await this.departureTimeEnd.getText()
            if(yDiff == "23:59"){yDiff = "24:00"}
        if(!(yDiff == y)){
            yDistance = -(Number(yDiff.split(':')[0]) - Number(x.split(':')[0]))*10
            await this.setTimeRange(this.AnReiseEnd,yDistance,0)
        }
        await utils.takeScreenShots();
    })

    this.setRuckReiseTimeRange = allure.createStep('Select return time range', async function(x,y){
        utils.reportLogger(`return time range : ${x}, ${y}`);
        let xDistance = Number(x.split(':')[0])*10
        let yDistance = -(24 - Number(y.split(':')[0])) *10
        await this.setTimeRange(this.RuckReiseStart,xDistance,0)
        if(yDistance < -110) {
            await this.setTimeRange(this.RuckResiseEnd,-110,0)
            await this.setTimeRange(this.RuckResiseEnd,110+yDistance,0)
        }
        else{
            await this.setTimeRange(RuckResiseEnd,yDistance,0)
        }
        let xDiff = await this.returnTimeStart.getText()
        if(!(xDiff == x)){
            xDistance = (Number(xDiff.split(':')[0]) - Number(x.split(':')[0]))*10
            await this.setTimeRange(this.RuckReiseStart,xDistance,0)
        }
        let yDiff = await this.returnTimeEnd.getText()
        if(!(yDiff == y)){
            yDistance = -( Number(yDiff.split(':')[0]) - Number(x.split(':')[0]))*10
            await this.setTimeRange(this.RuckResiseEnd,yDistance,0)
        }
        await appFunctions.invisible(this.offerLoading,30000)
        await utils.takeScreenShots();
    })


    this.TerminePrice = async ()=>{
        await appFunctions.visible(this.TerminePreiseButton, 20000)
        await this.TerminePreiseButton.click();
        await appFunctions.waitForElement(this.AnReiseStart,60000)
    }

    this.AnReiseDatum = allure.createStep('Select departure date',async (date)=>{
        utils.reportLogger(`departure date : ${date}`);
        await element(by.css(`label[for="arrival-${utils.dateYYYYMMDD(date)}"]`)).click();
        await utils.takeScreenShots();
        await appFunctions.invisible(this.offerLoading,30000)
        await browser.actions().mouseMove(browser.element(by.css('#copy'))).perform();
    })

    this.returnDirectFlights = allure.createStep('Find direct flights', async ()=>{
        let directFligts = 0;
        let flightList = await this.allFlights
        let text;
        for(let i=0;i<flightList.length;i++){
            section = await this.allFlights.get(i)
            await browser.actions().mouseMove(section).perform();
            text = await section.getText();
            if(text.includes('Direkt')){
                directFligts++;
            }
            else if(text.includes('Stopp')){
            }
            else
            {
                if(await section.element(by.css('.button-next.link.doVacancy')).isPresent()){
                    await section.element(by.css('.button-next.link.doVacancy')).click();
                     await appFunctions.invisible(section.element(by.css('.button-next.link.doVacancy')), 20000)
                text = await this.allFlights.get(i).getText();
                if(text.includes('Direkt')){
                    directFligts++;
                }
                else if(text.includes('Stopp')){
                }
                    }
                }
                        }
        utils.reportLogger(`[OUTPUT] - Total direkt flights : ${directFligts}`);
        return directFligts;
    })
    
    this.checkDepartureTimeWithinRange = allure.createStep('Select departure within time range', async (flightNumber, startTime, EndTime)=>{
        utils.reportLogger(`Depature time within : ${startTime} - ${EndTime}`);
        await browser.actions().mouseMove(await this.allFlights.get(flightNumber-1).element(by.css('.duration-departure .flight-time'))).perform();
        let firstLeg = await this.allFlights.get(flightNumber-1).element(by.css('.duration-departure .flight-time')).getText();
        firstLeg = firstLeg.match(/\d{2}:\d{2}/g)
        await utils.takeScreenShots();
        let comparison = (firstLeg[0] >=startTime && firstLeg[0]<=EndTime)
        //expect(comparison).toBe(true)
        utils.reportLogger(`Depature time : ${firstLeg[0]} - ${comparison}`,true);
        
    })

    this.checkReturnTimeWithinRange = allure.createStep('Select return within time range', async (flightNumber, startTime, EndTime)=>{
        utils.reportLogger(`Return time within : ${startTime} - ${EndTime}`);
        await browser.actions().mouseMove(await this.allFlights.get(flightNumber-1).element(by.css('.duration-return .flight-time')));
        let secondLeg = await this.allFlights.get(flightNumber-1).element(by.css('.duration-return .flight-time')).getText();
        secondLeg = secondLeg.match(/\d{2}:\d{2}/g);
        await utils.takeScreenShots();
        let comparison = secondLeg[0] >=startTime && secondLeg[0]<=EndTime;
        //expect(comparison).toBe(true)
        utils.reportLogger(`return time : ${secondLeg[0]} - ${comparison}`, true);
    })

    this.SelectFlight = allure.createStep('Select first flight', async (flight)=>{
        let currentId = await browser.getAllWindowHandles();
        await element.all(by.css('section.skeleton-offers > article')).get(flight-1).element((by.css('.button-next.link'))).click();
        await utils.switchBrowser(currentId);
        await utils.takeScreenShots();
    })
}

module.exports = new FlightsPage();