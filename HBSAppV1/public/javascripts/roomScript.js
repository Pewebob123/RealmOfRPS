/**
 * Created by nikro on 21-3-2017.
 */
// $(document).ready(function () {
    var conNick =  'http://192.168.1.22:4200';
    var socket = io.connect(conNick);
    socket.on('connect', function(){
        socket.emit('adduser', prompt("What's your name: "));
    });

    socket.on('updatechat', function (username, data) {
        $('#conversation').append('<b>'+ username + ':</b> ' + data + '<br>');
    });


    socket.on('updaterooms', function (rooms, current_room) {
        $('#rooms').empty();
        $.each(rooms, function(key, value) {
            if(value == current_room){
                $('#rooms').append('<div>' + value + '</div>');
            }
            else {
                $('#rooms').append('<div><a href="#" onclick="switchRoom(\''+value+'\')">' + value + '</a></div>');
            }
        });
    });

    function switchRoom(room){
        socket.emit('switchRoom', room);
    }

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
    });
// });