function geoFindMe() {
    var output = document.getElementById("out");
    var output2 = document.getElementById("out2");

    if (!navigator.geolocation){
    output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
    return;
    }

    function success(position) {
    var latitude  = position.coords.latitude;
    var longitude = position.coords.longitude;

    output.innerHTML = '<p>Latitude is ' + latitude + '° <br>Longitude is ' + longitude + '°</p>';

    var img = new Image();
    img.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + latitude + "," + longitude + "&zoom=13&size=300x300&sensor=false";

    output.appendChild(img);

    findParcs(position.coords);
    }

    function error() {
    output.innerHTML = "Unable to retrieve your location";
    }

//    https://data.rennesmetropole.fr/api/records/1.0/search/?dataset=aires-de-jeux-des-espaces-verts-rennes&rows=1000
    
    function findParcs(current_position) {
        
getJSON('index.php?latitude='+ current_position.latitude + '&longitude='+ current_position.longitude).then(function(data) {
        // get parcs and distance from me
        var objs =[]
        for (var key in data.records) {
            var distance =  data.records[key].fields.distance
            var name = data.records[key].fields.nom
            var position = data.records[key].fields.geo_point_2d
            var dif = PythagorasEquirectangular(position[0], position[1], current_position.latitude, current_position.longitude);
            objs.push( { name, dif,distance } ); 
            
        }
        // sort it

        objs.sort(function(a,b) {return a.dif - b.dif})
        // show it
        var newUl = document.createElement('ul')
        for (var key in objs) {
            newLi = document.createElement('li')
            newLi.innerText = objs[key].name + " se trouve à " + objs[key].distance + " de votre position"
            newUl.appendChild(newLi)
        }
        result.appendChild(newUl)
    }, function(status) {
        alert('Something went wrong.');
    });
    }

    var getJSON = function(url) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('get', url, true);
        xhr.responseType = 'json';
        xhr.onload = function() {
        var status = xhr.status;
        if (status == 200) {
            resolve(xhr.response);
        } else {
            reject(status);
        }
        };
        xhr.send();
    });
    };

    // Convert Degress to Radians
    function Deg2Rad(deg) {
    return deg * Math.PI / 180;
    }

    function PythagorasEquirectangular(lat1, lon1, lat2, lon2) {
    lat1 = Deg2Rad(lat1);
    lat2 = Deg2Rad(lat2);
    lon1 = Deg2Rad(lon1);
    lon2 = Deg2Rad(lon2);
    var R = 6371; // km
    var x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
    var y = (lat2 - lat1);
    var d = Math.sqrt(x * x + y * y) * R;
    return d;
    }

    output.innerHTML = "<p>Locating…</p>";

    navigator.geolocation.getCurrentPosition(success, error);
}

geoFindMe();