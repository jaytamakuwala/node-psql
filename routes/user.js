const express = require('express')
const moment = require('moment')
const SalesTable = require('../db/postgres')


const router = new express.Router()

// route to add data into sales table
router.post('/adddata', async (req, res) => {
    try{
        console.log(typeof req.body.amount)
        console.log(req.body)
        const dataObj = {
            userName : req.body.userName,
            amount : req.body.amount,
            date : moment(Date.now()).format(),
            ts : Date.now()
        }

        console.log(dataObj)
        const salestable = new SalesTable(dataObj)
        console.log(salestable)
        await salestable.save()
        res.status(200).send(salestable)
    } catch(error) {
        res.status(400).send(error)
    }
})

router.patch('/fetchdata', async (req, res) => {
    try{

        if(req.query.filter === 'daily') {
            let responseData = []
            const data = await SalesTable.findAll()

            let currentTS = Date.now()
            let currentEndOf = moment(currentTS).endOf('hour').minutes(60).seconds(0).milliseconds(0).format()
            let currentEndOfTS = moment(currentEndOf).valueOf()
            let minTS = moment("2021-08-01T00:00:00+05:30").valueOf()


            while(currentEndOfTS > minTS) {
                let hourlyTS = currentEndOfTS - ( 60 * 60 * 1000)

                const hourlyFilter = function(data) {
                    return data.filter(function (singledata) {
                        return singledata.ts >= hourlyTS && singledata.ts <= currentEndOfTS
                    })
                }

                const newObj = hourlyFilter(data)

                let sumAmount = 0

                if(newObj.length > 0) {
                    newObj.forEach(function (singledata) {
                        sumAmount = sumAmount + parseInt(singledata.amount)
                    })
                }

                if(newObj.length > 0) {
                    const fromTime = moment(hourlyTS).format("Do MMM YYYY, h:mm:ss a")
                    const toTime = moment(currentEndOfTS).format("h:mm:ss a")
                    const timeInterval = `${fromTime} - ${toTime}`
                    
                    responseData.push({
                        timeInterval : timeInterval,
                        sumAmount : sumAmount,
                        dataObjects : newObj
                    })
                }
                currentEndOfTS = currentEndOfTS - 3600000
            }

            res.status(200).send(responseData)
        }


        if(req.query.filter === 'weekly') {
            let responseData = []
            const data = await SalesTable.findAll()

            let currentTS = Date.now()
            let currentEndOf = moment(currentTS).endOf('day').hours(24).minutes(0).seconds(0).milliseconds(0).format()
            let currentEndOfTS = moment(currentEndOf).valueOf()
            let minTS = moment("2021-08-01T00:00:00+05:30").valueOf()


            while(currentEndOfTS > minTS) {
                let dailyTS = currentEndOfTS - (24 * 60 * 60 * 1000)

                const dailyFilter = function(data) {
                    return data.filter(function (singledata) {
                        return singledata.ts >= dailyTS && singledata.ts <= currentEndOfTS
                    })
                }

                const newObj = dailyFilter(data)

                let sumAmount = 0

                if(newObj.length > 0) {
                    newObj.forEach(function (singledata) {
                        sumAmount = sumAmount + parseInt(singledata.amount)
                    })
                }

                if(newObj.length > 0) {
                    const fromTime = moment(dailyTS).format("Do MMM YYYY")
                    const timeInterval = `${fromTime}`
                                        
                    responseData.push({
                        timeInterval : timeInterval,
                        sumAmount : sumAmount,
                        dataObjects : newObj
                    })
                }
                currentEndOfTS = currentEndOfTS - (24 * 3600000)
            }

            res.status(200).send(responseData)
        }

        if(req.query.filter === 'monthly') {
            let responseData = []
            const data = await SalesTable.findAll()

            let currentTS = Date.now()
            let currentEndOf = moment(currentTS).endOf('week').days(7).hours(0).minutes(0).seconds(0).milliseconds(0).format()
            let currentEndOfTS = moment(currentEndOf).valueOf()
            let minTS = moment("2021-08-01T00:00:00+05:30").valueOf()


            while(currentEndOfTS > minTS) {
                let weeklyTS = currentEndOfTS - (7 * 24 * 60 * 60 * 1000)

                const weeklyFilter = function(data) {
                    return data.filter(function (singledata) {
                        return singledata.ts >= weeklyTS && singledata.ts <= currentEndOfTS
                    })
                }

                const newObj = weeklyFilter(data)

                let sumAmount = 0

                if(newObj.length > 0) {
                    newObj.forEach(function (singledata) {
                        sumAmount = sumAmount + parseInt(singledata.amount)
                    })
                }

                if(newObj.length > 0) {
                    const fromTime = moment(weeklyTS).format("ddd, Do MMM YYYY")
                    const toTime = moment(currentEndOfTS).format("ddd, Do MMM YYYY")
                    const timeInterval = `${fromTime} - ${toTime}`
                    
                    responseData.push({
                        timeInterval : timeInterval,
                        sumAmount : sumAmount,
                        dataObjects : newObj
                    })
                }
                currentEndOfTS = currentEndOfTS - (7 * 24 * 3600000)
            }

            res.status(200).send(responseData)
        }
    } catch(error) {
        res.status(400).send(error)
    }
})


module.exports = router