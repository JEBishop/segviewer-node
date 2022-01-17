var map;
var tooltip;

function createMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 43.6426, lng: -79.3871 },
        zoom: 13,
        mapTypeControl: false
    });
    var noPoi = [{
        featureType: "poi",
        stylers: [{ visibility: "off" }]   
    }];
    map.setOptions({styles: noPoi});
    tooltip = new google.maps.InfoWindow();
}

$(document).ready(function() {
    const token = localStorage.getItem("access_token");
    if(token === null) {
        handleAuthCode();
    }
    else {
        reAuthorize();
    }

    function handleAuthCode() {
        const auth_code = localStorage.getItem("auth_code");
        // exchange authorization code for an access token
        if (auth_code !== null) {
            // pass auth code to node API to do perform auth
            // receive access_token and refresh_token back, add to localstorage
            // getStarredSegments
        }
    }

    function reAuthorize() {
        // pass refresh_token to node API
        // receive access_token and refresh_token back, add to localstorage
        // getStarredSegments
    }

    function getStarredSegments(token) {
        $("#auth_btn").hide(); // if we got this far, we're authenticated. hide login button
        $.ajax({
            url: "https://www.strava.com/api/v3/segments/starred",
            method: "GET",    
            dataType: "json",   	
            data: {
                page: 1,
                per_page: 100,
                access_token: token
            },
            error: function(xhr, status, error) {
                console.log(`error:${xhr.responseText}`);
            },
            complete: function(response) {
                let segArr = response["responseJSON"];
                var latlngList = [];
                for(var i = 0; i < segArr.length; i++) {
                    var segment = {
                        id: segArr[i]["id"],
                        name: segArr[i]["name"],
                        distance: segArr[i]["distance"],
                        average_grade: segArr[i]["average_grade"],
                        start_lat: segArr[i]["start_latitude"], 
                        start_lng: segArr[i]["start_longitude"],
                        end_lat: segArr[i]["end_latitude"],
                        end_lng: segArr[i]["end_longitude"],
                        polyline: ""
                    }
                    latlngList.push(new google.maps.LatLng(segment.start_lat, segment.start_lng));
                    getPolyline(token, segment);
                }
                getNewCenter(latlngList);
            }
        });
    }

    function getPolyline(token, segment) {
        /* 
            this is going to hit the 100 calls/15 min rate limit real fast
            store id and polyline locally to save some calls on repeat users 
        */
        if(localStorage.getItem(segment.id) === null) {
            $.ajax({
                url: `https://www.strava.com/api/v3/segments/${segment.id}`,
                method: "GET",    
                dataType: "json",   	
                data: {
                    access_token: token
                },
                error: function(xhr, status, error) {
                    console.log(`error:${xhr.responseText}`);
                },
                complete: function(response) {
                    segment.polyline = response["responseJSON"]["map"]["polyline"];
                    localStorage.setItem(segment.id, JSON.stringify(segment));
                }
            });
        } 
        else {
            segment = JSON.parse(localStorage.getItem(segment.id));
        }
        mapSegment(segment);
    }

    function mapSegment(segment) {
        // write segment to map
        var decodedPath = google.maps.geometry.encoding.decodePath(segment.polyline); 
        var decodedLevels = decodeLevels("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");

        var line = new google.maps.Polyline({
            path: decodedPath,
            levels: decodedLevels,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 4,
            map
        });

        google.maps.event.addListener(line, 'click', function() {
            tooltip.setPosition(new google.maps.LatLng(segment.start_lat, segment.start_lng));
            tooltip.setContent(
                "<strong>" + segment.name + 
                "</strong><br/><span>" + segment.distance + 
                "m&emsp;|&emsp;" + segment.average_grade + 
                "&#37;</span><br/><a href='" + "https://www.strava.com/segments/" + 
                segment.id + "' target='_blank' rel='noopener noreferrer'>" + "View on Strava</a>");
            tooltip.open(map);
        })

        //red market at end
        new google.maps.Marker({
            map: map,
            position: new google.maps.LatLng(segment.end_lat, segment.end_lng),
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: '#FF0000',
                fillOpacity: 0.6,
                strokeColor: '#FFFFFF',
                strokeOpacity: 1,
                strokeWeight: 1,
                scale: 5
            }
        });

        //green marker at start
        new google.maps.Marker({
            map: map,
            position: new google.maps.LatLng(segment.start_lat, segment.start_lng),
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: '#00FF00',
                fillOpacity: 0.6,
                strokeColor: '#FFFFFF',
                strokeOpacity: 1,
                strokeWeight: 1,
                scale: 5
            }
        });

    }

    function decodeLevels(encodedLevelsString) {
        var decodedLevels = [];

        for (var i = 0; i < encodedLevelsString.length; ++i) {
            var level = encodedLevelsString.charCodeAt(i) - 63;
            decodedLevels.push(level);
        }
        return decodedLevels;
    }
    
    function getNewCenter(latlng) {
        var bounds = new google.maps.LatLngBounds();
        for(var i = 0; i < latlng.length; i++) {
            bounds.extend(latlng[i]);
        }

        map.setCenter(bounds.getCenter());
        map.fitBounds(bounds);
    }
});