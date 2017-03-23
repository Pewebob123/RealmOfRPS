/**
 * Created by nikro on 21-3-2017.
 */
$( document ).ready(function() {

    function loadJSON(callback) {

        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("../json/");
        xobj.open('GET', '../json/data.json', true);
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") {

                // .open will NOT return a value but simply returns undefined in async mode so use a callback
                callback(xobj.responseText);

            }
        }
        xobj.send(null);

    }

// Call to function with anonymous callback
    var socket = io.connect( loadJSON(function (response) {
            jsonresponse = JSON.parse(response);
            var connection = jsonresponse.Connecten.ConnectString;

            return connection;

            // var socket = io.connect(connection);

            // return socket;


        })
    );
    socket.on('connect', function(){
        var url = window.location.href;
        var params = parseURLParams(url);

        socket.emit('adduser', params.name);
    });

    socket.on('updatechat', function (username, data) {
        $('#conversation').append('<b>'+ username + ':</b> ' + data + '<br>');
    });

    var Room;

    socket.on('updaterooms', function (rooms, current_room) {
        Room = current_room;
        $('#rooms').empty();
        $.each(rooms, function(key, value) {
            if(value == current_room){
                $('#rooms').append('<div>' + value + '</div>');
            }
            else {
                // $('#rooms').append('<div><a href="#" onclick="switchRoom(\''+value+'\')">' + value + '</a></div>');
                $('<div></div>').attr('id', value + 'div').appendTo($('#rooms'));
                $('<a>' + value + '</a>').attr('href', '#').attr('id', value).appendTo($('#' + value + 'div')).click(function () {
                    socket.emit('switchRoom', value);
                    console.log('switch');
                    $('#conversation').html('');
                });
            }
        });
    });
    // var socket = io.connect('http://192.168.1.22')


    function switchRoom(room){
        socket.emit('switchRoom', room);
    }

    socket.on('Joined', function (ID, name, room) {
        player(ID, name, room);
        alert(ID + ' ' + name);
        var Roomurl = encodeQueryData(Player);
        alert(Roomurl);
        document.location.href = 'gameRoom?' + Roomurl;
    })

    $(function(){
        $('#datasend').click( function() {
            var message = $('#data').val();
            $('#data').val('');
            socket.emit('sendchat', message);
        });

        $('#data').keypress(function(e) {
            if(e.which == 13) {
                $(this).blur();
                $('#datasend').focus().click();
            }
        });

        $('#roombutton').click(function(){
            var name = $('#roomname').val();
            $('#roomname').val('');
            socket.emit('create', name)
        });

        $('#JoinGame').click(function () {
            console.log('clicked');
            socket.emit('joinGame');
        })

    });

    var Player;

    function player(ID, name, room) {
        var ID = ID;
        var name = name;
        var room = room;
        var Status = null;
        Player = {'ID' : ID, 'Name' : name, 'Room' : room, 'Status' : Status}
    };

    function encodeQueryData(data) {
        var ret = [];
        for (var d in data)
            ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
        return ret.join('&');
    }

    function parseURLParams(url) {
        var queryStart = url.indexOf("?") + 1,
            queryEnd   = url.indexOf("#") + 1 || url.length + 1,
            query = url.slice(queryStart, queryEnd - 1),
            pairs = query.replace(/\+/g, " ").split("&"),
            parms = {}, i, n, v, nv;

        if (query === url || query === "") return;

        for (i = 0; i < pairs.length; i++) {
            nv = pairs[i].split("=", 2);
            n = decodeURIComponent(nv[0]);
            v = decodeURIComponent(nv[1]);

            if (!parms.hasOwnProperty(n)) parms[n] = [];
            parms[n].push(nv.length === 2 ? v : null);
        }
        return parms;
    }

});


