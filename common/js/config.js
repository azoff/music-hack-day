var config = {
    // @todo Change the server to the dev server, not the open test server
    firebase_base_uri: 'https://pr5c1gjakw6.firebaseio-demo.com/',

    // @todo Allow the user to browse rooms, and change room
    room_name: 'sf-music-hack-day',

}
config.firebase_room_uri = config.firebase_base_uri + "rooms/" + config.room_name;