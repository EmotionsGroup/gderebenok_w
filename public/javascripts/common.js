//Create a single global variable
var MAPAPP = {};
MAPAPP.markers = [];
MAPAPP.currentInfoWindow;
MAPAPP.pathName = window.location.pathname;

$(document).ready(function() {
    initialize();
    populateMarkers(MAPAPP.pathName);
});

//Initialize our Google Map
function initialize() {
    var center = new google.maps.LatLng(43.2199907,76.8658772);
    var mapOptions = {
        zoom: 2,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: center,
    };
    this.map = new google.maps.Map(document.getElementById('map_canvas'),
        mapOptions);
    //console.log(this.map);
};


// Fill map with markers
function populateMarkers(dataType) {

    apiLoc = "http://localhost:3000/api/locationsList";
    // jQuery AJAX call for JSON
    $.getJSON(apiLoc, function(data) {
        //For each item in our JSON, add a new map marker
        $.each(data, function(i, ob) {
            var marker = new google.maps.Marker({
                map: map,
                draggable: true,
                animation: google.maps.Animation.DROP,
                position: new google.maps.LatLng(this.Latitude, this.Longitude),
                device_id: this.pureId,
                datetime: this.Date,

                speed: this.Speed,
                country: 'KZ',// this.country,
                city: 'KZ',//this.city,
                postcode: 'KZ',//this.postcode,
                street: 'KZ',//this.street,
                icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            });
            //Build the content for InfoWindow
            var content = '<h5>ID устройства: ' + '</h5>' + marker.device_id + '<hr>' + '<p><h5>Время: ' + '</h5>' + marker.datetime + '</p>'
                                                                                               + '<p><h5>Страна:</h5> ' + marker.country + '</p>'
                                                                                               + '<p><h5>Город:</h5> ' + marker.city + '</p>'
                                                                                               + '<p><h5>Почтовый индекс:</h5> ' + marker.postcode + '</p>'
                                                                                              + '<p><h5>Улица/Проспект:</h5> ' + marker.street + '</p>'
                                                                                               + '<p><h5>Долгота:</h5> ' + this.Latitude + '</p>'
                                                                                               + '<p><h5>Широта:</h5> ' + this.Longitude + '</p>'
                                                                                  //             + '<p><h5>Точность:</h5> '+ this.coordinates[2] + ' метров</p>'
                                                                                               + '<p><h5>Скорость:</h5> ' + marker.speed + ' км/ч</p>';
            marker.infowindow = new google.maps.InfoWindow({
                content: content,
                maxWidth: 400
            });

            //Add InfoWindow
            google.maps.event.addListener(marker, 'click', function() {
                if (MAPAPP.currentInfoWindow) MAPAPP.currentInfoWindow.close();
                marker.infowindow.open(map, marker);
                MAPAPP.currentInfoWindow = marker.infowindow;
            });

            MAPAPP.markers.push(marker);

            filterMarkers = function (category) {
                for (i = 0; i < MAPAPP.markers.length; i++) {
                    marker = MAPAPP.markers[i];
                    // If is same category or category not picked
                    console.log(marker.device_id);
                    if (marker.device_id == category || category.length === 0) {
                         console.log(category);
                        marker.setVisible(true);
                    }
                    // Categories don't match
                    else {
                        marker.setVisible(false);
                    }
                }
            }

        });
    });
};

//$(document).ready(function() {
//    $(function () {
//        $('.list-group.checked-list-box .list-group-item').each(function () {
//
//            // Settings
//            var $widget = $(this),
//                $checkbox = $('<input type="checkbox" class="hidden" />'),
//                color = ($widget.data('color') ? $widget.data('color') : "primary"),
//                style = ($widget.data('style') == "button" ? "btn-" : "list-group-item-"),
//                settings = {
//                    on: {
//                        icon: 'glyphicon glyphicon-check'
//                    },
//                    off: {
//                        icon: 'glyphicon glyphicon-unchecked'
//                    }
//                };
//
//            $widget.css('cursor', 'pointer')
//            $widget.append($checkbox);
//
//            // Event Handlers
//            $widget.on('click', function () {
//                $checkbox.prop('checked', !$checkbox.is(':checked'));
//                $checkbox.triggerHandler('change');
//                updateDisplay();
//            });
//            $checkbox.on('change', function () {
//                updateDisplay();
//            });
//
//
//            // Actions
//            function updateDisplay() {
//                var isChecked = $checkbox.is(':checked');
//
//                // Set the button's state
//                $widget.data('state', (isChecked) ? "on" : "off");
//
//                // Set the button's icon
//                $widget.find('.state-icon')
//                    .removeClass()
//                    .addClass('state-icon ' + settings[$widget.data('state')].icon);
//
//                // Update the button's color
//                if (isChecked) {
//                    $widget.addClass(style + color + ' active');
//                } else {
//                    $widget.removeClass(style + color + ' active');
//                }
//            }
//
//            // Initialization
//            function init() {
//
//                if ($widget.data('checked') == true) {
//                    $checkbox.prop('checked', !$checkbox.is(':checked'));
//                }
//
//                updateDisplay();
//
//                // Inject the icon if applicable
//                if ($widget.find('.state-icon').length == 0) {
//                    $widget.prepend('<span class="state-icon ' + settings[$widget.data('state')].icon + '"></span>');
//                }
//            }
//            init();
//        });
//
//        $('#get-checked-data').on('click', function(event) {
//            event.preventDefault();
//            var checkedItems = {};
//            //counter = 0;
//            $("#check-list-box li.active").each(function(idx, li) {
//                checkedItems = $(li).text();
//                //counter++;
//            });
//            $('#display-json').html(JSON.stringify(checkedItems, null, '\t'));
//            console.log(checkedItems);
//
//
//
//        });
//
//    });
//});






