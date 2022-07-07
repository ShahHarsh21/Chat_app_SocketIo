let socket = io();

function scrollToBottom() {
    let message = document.querySelector('#messages').lastElementChild;
    message.scrollIntoView();
}

socket.on('connect', function () {
    let searchQuery = window.location.search.substring(1);
    let params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g, '":"') + '"}');

    socket.emit('join', params, function (err) {
        if (err) {
            alert(err);
            window.location.href = '/';
        } else {
            console.log('No Error');
        }
    })
});
socket.on('disconnect', () => {
    console.log('Disconnected from server.');
});
socket.on('updateUsersList',function(users){
    let ol = document.createElement('ol');
    users.forEach(function(user){
        let li = document.createElement('li');
        li.innerHTML = user;
        ol.appendChild(li);
    });
    let usersList = document.querySelector('#users');
    usersList.innerHTML = "";
    usersList.appendChild(ol); 
});
socket.on('newMessage', function (message) {
    const formattedTime = moment(message.createdAt).format('LT');
    const template = document.querySelector('#message-template').innerHTML;
    const html = Mustache.render(template, {
        from: message.from,
        text: message.text,
        createdAt: formattedTime
    });

    const div = document.createElement('div');
    div.innerHTML = html;
    document.querySelector('#messages').appendChild(div);
    scrollToBottom();
});

socket.on('newLocationMessage', function (message) {
    const formattedTime = moment(message.createdAt).format('LT');
    console.log('newLocationMessage', message);

    const template = document.querySelector('#location-message-template').innerHTML;
    const html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: formattedTime
    });

    const div = document.createElement('div');
    div.innerHTML = html;
    document.querySelector('#messages').appendChild(div);

    // let li = document.createElement('li');
    // let a = document.createElement('a');
    // li.innerText = `${message.from} ${formattedTime}: `
    // a.setAttribute('target','_blank');
    // a.setAttribute('href',message.url);
    // a.innerText ='My current location'; 
    // li.appendChild(a);

    // document.querySelector('#messages').appendChild(li);
});

document.querySelector('#submit-btn').addEventListener('click', function (e) {
    e.preventDefault();

    socket.emit("createMessage", {
        text: document.querySelector('input[name="message"]').value
    }, function () {
        document.querySelector('input[name="message"]').value = '';
    });
});

document.querySelector('#send-location').addEventListener('click', function (e) {

    if (!navigator.geolocation) {
        return alert("Geolocation is not support your browser . ")
    }
    navigator.geolocation.getCurrentPosition(function (position) {
        socket.emit('createLocationMessage', {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        })
    }, function () {
        alert('Unable to fatch location . ')
    })
})