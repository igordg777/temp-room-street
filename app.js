const express = require("express");
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config()

mongoose.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-g0n3e.mongodb.net/tempRoomStreet?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    },
);


const CronJob = require('cron').CronJob;
const Room = require("./models/room");
const Street = require("./models/street");
const Dinamic = require("./models/dinamic");


// urlencoded.
app.use(express.urlencoded({extended: true}));
// json.
app.use(express.json());

// Подключаем статику
app.use(express.static(path.join(__dirname, 'public')));

// Подключаем views(hbs)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Отображаем главную страницу с использованием шаблона "index.hbs"
app.get('/', function (req, res) {
    res.render('index', req.query);
});

app.get('/tempDinamic', async function (req, res) {
    let dinamic = await Dinamic.find().sort({ $natural: -1 }).limit(31);
    console.log(dinamic);
    res.json(dinamic);
});

const job = new CronJob('* * * * *', async () => {
        const url = `http://dom.sqrt.group:90/json_sensor.cgi?psw=TestZad3$`;
        const newTemp = await fetch(
            `https://cors-anywhere.herokuapp.com/${url}`,
            {
                headers: {
                    'Content-Type': 'application/text; charset=utf-8',
                    "Access-Control-Allow-Headers": "X-Requested-With",
                    "X-Requested-With": "XMLHttpRequest"
                },
                method: 'GET',
            });
        const data = await newTemp.json();

                const date = `${data.rtc_y}.${data.rtc_m}.${data.rtc_d}`;
                const time = `${data.rtc_h} ч. ${data.rtc_min} мин. ${data.rtc_s} сек. (dw: ${data.rtc_dw})`;

                const roomTemp = data.onew_temp[0].t;
                const streetTemp = data.onew_temp[1].t;

                const roomTempSave = new Room({
                    date: date,
                    time: time,
                    roomTemp: roomTemp,

                })
                roomTempSave.save();
                const streetTempSave = new Street({
                    date: date,
                    time: time,
                    streetTemp: streetTemp,
                })
                streetTempSave.save();

        const dinamic = new Dinamic({
            dinamic: [`${data.rtc_h}.${data.rtc_min}`,  roomTemp, streetTemp]
        })
        dinamic.save();
        console.log(dinamic)
},
null, true, 'Europe/Moscow'
);
job.start();

// app.use("/", indexRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Listening on " + port));