var date = new Date();
var days = [
    'vasárnap ',
    'hétfő ',
    'kedd ',
    'szerda ',
    'csütörök ',
    'péntek ',
    'szombat '];
var hoursText = [
    {
        hourFrom: 1,
        hourTo: 4,
        text: 'éjszaka'
    }, {
        hourFrom: 5,
        hourTo: 6,
        text: 'hajnal'
    },
    {
        hourFrom: 7,
        hourTo: 9,
        text: 'reggel'
    },
    {
        hourFrom: 10,
        hourTo: 11,
        text: 'délelőtt'
    },
    {
        hourFrom: 12,
        hourTo: 12,
        text: 'dél'
    },
    {
        hourFrom: 13,
        hourTo: 18,
        text: 'délután'
    },
    {
        hourFrom: 19,
        hourTo: 21,
        text: 'este'
    },
    {
        hourFrom: 22,
        hourTo: 23,
        text: 'éjszaka'
    },
    {
        hourFrom: 0,
        hourTo: 1,
        text: 'éjfél'
    }
];
var dayText = days[date.getDay()]
var noonText = getNoon(date.getHours());
document.getElementById('nap').innerHTML = 'Ma ' + dayText + noonText + ' van.';
function getNoon(hour) {
    for (var i = 0; i < hoursText.length; i++) {
        var obj = hoursText[i];
        if (obj.hourFrom <= hour && hour <= obj.hourTo) return obj.text;
    }
    return false;
}