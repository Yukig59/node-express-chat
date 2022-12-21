(function () {
    const server = 'http://127.0.0.1:3000'
    const socket = io(server);
    socket.on('connection', async (socket) => {
        async function getMessages() {
            const response = await fetch(`${server}/messages`);
            const data = await response.json();
            console.log(data)
            return data;
        }
        getMessages().then((messages) => {
            let parent = document.querySelector('#messages');
            parent.innerHTML = '';
            messages.forEach(message => {
                createDOMMessage(message);
            })
        })
        let messages = await fetch(`${server}/messages`);
        let json = await messages.json();
        let count = json.length;
    let counter = document.querySelector('#counter');
    counter.innerText=count;
    });

    socket.on('notification', (data) => {
        console.log('Message depuis le seveur:', data);
    })

    fetch(`${server}/test`).then((res) => {
        return res.json()
    }).then((data) => {
        console.log(data);
    })

    document.forms.message.addEventListener('submit', async function(e) {
        e.preventDefault();
        socket.emit('message', {
            text: document.forms.message.input.value,
            sender: socket.id
        })
        let msg = {
            text: document.forms.message.input.value,
            sender: socket.id
        }
        const server = "http://localhost:3000";
        await fetch(`${server}/message`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(msg)
        })
        let messages = await fetch(`${server}/messages`);
        let json = await messages.json();
        let count = json.length;
        let counter = document.querySelector('#counter');
        counter.innerText =count;
    });

socket.on('message', async (msg) => {
    createDOMMessage(msg);

    let messages = await fetch(`${server}/messages`);
    let json = await messages.json();
    let count = json.length;
    let counter = document.querySelector('#counter');
    counter.innerText =count;
});


    function createDOMMessage(msg){
        const messageLi = document.createElement('li');
        msg.sender === socket.id ? messageLi.classList.add('me') : messageLi.classList.add('other');
        let div = document.createElement('div');
        div.classList.add('name');
        messageLi.appendChild(div);
        let span = document.createElement('span');
        span.innerText = msg.sender
        div.appendChild(span);
        let message = document.createElement('div');
        message.classList.add('message');
        message.innerText = msg.text;
        messageLi.appendChild(message);
        let time = document.createElement('span');
        time.classList.add('msg-time');
        time.innerText = new Date().toLocaleTimeString();
        message.appendChild(time);
        let parent = document.querySelector('#messages');
        parent.appendChild(messageLi);
        document.forms.message.input.value = '';
    }
})()


