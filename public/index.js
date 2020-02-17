document.getElementById("formLogin").addEventListener("submit", async (event) => {
    event.preventDefault();
    let select = document.getElementById("sel").value;
    if (select === 'Комната') {
        select = 'в комнате';
    } else if (select === 'Улица') {
        select = 'на улице';
    }
    const url = `http://dom.sqrt.group:90/json_sensor.cgi?psw=TestZad3$`;
    fetch(`https://cors-anywhere.herokuapp.com/${url}`)

        .then(resp => {
            return resp.json();
        })
        .then(data => {

            let dateTitle = document.getElementById('dateTitle');
            dateTitle.innerHTML = 'Дата';
            let timeTitle = document.getElementById('timeTitle');
            timeTitle.innerHTML = 'Время';

            let date = document.getElementById('date');
            date.innerHTML = `${data.rtc_y}.${data.rtc_m}.${data.rtc_d}`;
            let time = document.getElementById('time');
            time.innerHTML = `${data.rtc_h} ч. ${data.rtc_min} мин. ${data.rtc_s} сек. (dw: ${data.rtc_dw})`;
            let title = document.getElementById('title');
            if (select === 'в комнате') {
                title.innerHTML = `Точная температура ${select} в данный момент: ${data.onew_temp[0].t}°`;
            } else {
                title.innerHTML = `Точная температура ${select} в данный момент: ${data.onew_temp[1].t}°`;
            }
        });
})