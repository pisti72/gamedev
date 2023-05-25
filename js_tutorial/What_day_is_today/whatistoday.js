var date = new Date();
var days = [
    'Sunday ',
    'Monday ',
    'Tuesday ',
    'Wednesday ',
    'Thursday ',
    'Friday ',
    'Saturday '];
var hoursText = [
    {
        hourFrom: 1,
        hourTo: 4,
        text: 'night'
    }, {
        hourFrom: 5,
        hourTo: 6,
        text: 'dawn'
    },
    {
        hourFrom: 7,
        hourTo: 9,
        text: 'morning'
    },
    {
        hourFrom: 10,
        hourTo: 11,
        text: 'before noon'
    },
    {
        hourFrom: 12,
        hourTo: 12,
        text: 'noon'
    },
    {
        hourFrom: 13,
        hourTo: 18,
        text: 'afternoon'
    },
    {
        hourFrom: 19,
        hourTo: 21,
        text: 'everning'
    },
    {
        hourFrom: 22,
        hourTo: 23,
        text: 'night'
    },
    {
        hourFrom: 0,
        hourTo: 1,
        text: 'midnight'
    }
];
var dayText = days[date.getDay()]
var noonText = getNoon(date.getHours());
document.getElementById('day').innerHTML = 'Today there is ' + dayText + noonText + '.';
function getNoon(hour) {
    for (var i = 0; i < hoursText.length; i++) {
        var obj = hoursText[i];
        if (obj.hourFrom <= hour && hour <= obj.hourTo) return obj.text;
    }
    return false;
}