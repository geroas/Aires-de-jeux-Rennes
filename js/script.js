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
        
        window.globalLat = position.coords.latitude;;
        window.globalLng = position.coords.longitude;
        
        
    

    
     var locations = [
      ['Bondi Beach', latitude, longitude, 4],
      ['Coogee Beach', -33.923036, 151.259052, 5],
      ['Cronulla Beach', -34.028249, 151.157507, 3],
      ['Manly Beach', -33.80010128657071, 151.28747820854187, 2],
      ['Maroubra Beach', -33.950198, 151.259302, 1]
    ];

    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 10,
      center: new google.maps.LatLng(-33.92, 151.25),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var infowindow = new google.maps.InfoWindow();

    var marker, i;

    for (i = 0; i < locations.length; i++) { 
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[i][1], locations[i][2]),
        map: map
      });

      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          infowindow.setContent(locations[i][0]);
          infowindow.open(map, marker);
        }
      })(marker, i));
    }
    

        
        

    output.innerHTML = '<p>Votre latitude : ' + latitude + '° <br>Votre longitude : ' + longitude + '°</p>';

//    var img = new Image();
//    img.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + latitude + "," + longitude + "&zoom=13&size=300x300&sensor=false";

    //output.appendChild(img);

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
       
        newUl.classList.add("list-group");
        for (var key in objs) {
            newLi = document.createElement('li')
            newLi.classList.add("list-group-item");
            newLi.innerText = objs[key].name + "(" + objs[key].distance + ")"
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

    output.innerHTML = "<img src=\"loading.gif\" width=\"65\">";

    navigator.geolocation.getCurrentPosition(success, error);
}





geoFindMe();