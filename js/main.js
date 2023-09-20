// Esto se ejecuta al cargar la pagina
window.addEventListener('load', function () {
    getProfileName();
    load_user_servers();
});

document.getElementById("cancel-btn").addEventListener("click", function() { window.location.href = "../index.html"; });

function newServerForm() { window.location.href = "../pages/create_server.html"; }

function goToProfile() { window.location.href = "../pages/profile.html"; }

function gotToLogin() { window.location.href = "../pages/login.html"; }

document.getElementById("authForm").addEventListener("submit", function (event) {
    event.preventDefault();
    createServer();
});

function createServer() {
    const data = {
        server_name: document.getElementById("server_name").value,
        server_description: document.getElementById("server_description").value,
    }
    fetch("http://127.0.0.1:5000/server", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include'
    })
    .then(response => {
        if (response.status === 201) {
            return response.json().then(data => {
                document.getElementById("message").innerHTML = data.message;
                window.location.href = "../index.html";
            });
        } else {
            return response.json().then(data => {
                if (errorData.error) {
                    document.getElementById("message").innerHTML = data.error.description;
                }
            })
        }
    })
    .catch(error => {
        document.getElementById("message").innerHTML = "Ocurrio un error";
    });
}

function getProfileName() {
    const url = "http://127.0.0.1:5000/auth/profile";
    
    fetch(url, {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        if (response.status === 200) {
            return response.json().then(data => {
                document.getElementById("profile-card").innerText = data.username;
        })
        } else {
            return response.json().then(data => {
                profileCard = document.getElementById("profile-card");
                profileCard.onclick = goToLogin();
                profileCard.innerText = "Login"
            });
        }
    })
    .catch(error => {
        document.getElementById("message").innerHTML = "Ocurrió un error.";
    });
}

function load_user_servers() {
    if (window.location.pathname === '/index.html') {

        fetch("http://127.0.0.1:5000/users/servers", {
            method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })
    .then(response => {
        if (response.status === 200) {
            return response.json().then(data => {
                const serverList = document.getElementById("server-list");
                // serverList.innerHTML = ""; // Limpia el contenido anterior

                data.servers.forEach(server => {
                    const serverDiv = document.createElement("div");
                    serverDiv.classList.add("svr");
                    
                    const uServerDiv = document.createElement("div");
                    uServerDiv.classList.add("u-server");
                    
                    const IconImg = document.createElement("img");
                    IconImg.src = "../img/server.png";
                    IconImg.id = "search-icon";
                    
                    const serverNameP = document.createElement("p");
                    serverNameP.classList.add("svr-name");
                    serverNameP.textContent = server.server_name;

                    // Agrega un evento de clic al div
                    serverDiv.addEventListener('click', function () {
                        const server_id = server.server_id;
                        // Llama a otra función y pasa el server_id
                        get_channels(server_id);
                    });
                    
                    uServerDiv.appendChild(IconImg);
                    serverDiv.appendChild(uServerDiv);
                    serverDiv.appendChild(serverNameP);
                    
                    serverList.appendChild(serverDiv);
                });
            })
        } else {
            return response.json().then(data => {
                if (errorData.error) {
                    document.getElementById("message").innerHTML = data.error.description;
                }
            })
        }
    })
    .catch(error => {
        document.getElementById("message").innerHTML = "Ocurrio un error";
    });
}}

function get_channels(server_id) {
    const channelListDiv = document.createElement("div");
    channelListDiv.id = "channel-list";

    const addChannelDiv = document.createElement("div");
    addChannelDiv.id = "add-channel";

    const addButton = document.createElement("button");
    addButton.id = "btn-new-channel";
    addButton.textContent = "Agregar Canal";

    addButton.addEventListener('click', function () {
        newChannelForm(server_id);
    });

    addChannelDiv.appendChild(addButton);

    document.body.appendChild(channelListDiv);
    document.body.appendChild(addChannelDiv);

    get_channels_in_server(server_id)
}

function get_channels_in_server(server_id) {
    const url = `http://127.0.0.1:5000/tchannels?server_id=${server_id}`;

    fetch(url, {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        if (response.status === 200) {
            return response.json().then(data => {
                const channelListDiv = document.getElementById("channel-list");
                channelListDiv.innerHTML = ""; 

                data.channels.forEach(channel => {
                    const channelDiv = document.createElement("div");
                    channelDiv.classList.add("channel");

                    const channelNameP = document.createElement("p");
                    channelNameP.classList.add("channel_name");
                    channelNameP.textContent = `# ${channel.channel_name}`;

                    channelDiv.addEventListener('click', function () {
                        alert(`Canal seleccionado: ${channel.channel_name}`);
                    });

                    channelDiv.appendChild(channelNameP);
                    channelListDiv.appendChild(channelDiv);
                })
        })
        } else {
            return response.json().then(data => {
                alert("Ocurrio un error")
            });
        }
    })
    .catch(error => {
        document.getElementById("message").innerHTML = "Ocurrió un error.";
    });
}

function newChannelForm(server_id) {
    // Crear el div principal con clase "create-channel-screen"
    const createChannelScreenDiv = document.createElement("div");
    createChannelScreenDiv.classList.add("create-channel-screen");

    // Crear el div con clase "container"
    const containerDiv = document.createElement("div");
    containerDiv.classList.add("container");

    // Crear el título h1 con id "title"
    const titleH1 = document.createElement("h1");
    titleH1.id = "title";
    titleH1.textContent = "Nuevo Canal";

    // Crear el formulario con id "authForm"
    const form = document.createElement("form");
    form.id = "authForm";

    // Crear el div con clase "form-field"
    const formFieldDiv = document.createElement("div");
    formFieldDiv.classList.add("form-field");

    // Crear la etiqueta "label"
    const label = document.createElement("label");
    label.setAttribute("for", "channel_name");
    label.textContent = "Nombre:";

    // Crear el input con clase "input-box" y los atributos necesarios
    const input = document.createElement("input");
    input.classList.add("input-box");
    input.setAttribute("type", "text");
    input.setAttribute("name", "channel_name");
    input.setAttribute("id", "channel_name");
    input.setAttribute("required", true);

    // Crear el botón "Crear" con tipo "submit" y id "auth-btn"
    const submitButton = document.createElement("button");
    submitButton.setAttribute("type", "submit");
    submitButton.id = "auth-btn";
    submitButton.textContent = "Crear";

    // Crear el botón "Cancelar" con id "cancel-btn"
    const cancelButton = document.createElement("button");
    cancelButton.id = "cancel-btn";
    cancelButton.textContent = "Cancelar";

    // Agregar eventos de clic a los botones
    submitButton.addEventListener("click", onCrearButtonClick);
    cancelButton.addEventListener("click", onCancelarButtonClick);

    // Función que se ejecuta cuando se hace clic en el botón "Crear"
    function onCrearButtonClick(event) {
        event.preventDefault(); // Evita que el formulario se envíe si está dentro de un formulario
        // Agrega aquí el código que deseas ejecutar cuando se hace clic en "Crear"
        createChannel(server_id)
    }

    // Función que se ejecuta cuando se hace clic en el botón "Cancelar"
    function onCancelarButtonClick() {
        // Agrega aquí el código que deseas ejecutar cuando se hace clic en "Cancelar"
        window.location.href = "../index.html";
    }

    // Crear el div con id "message"
    const messageDiv = document.createElement("div");
    messageDiv.id = "message";

    // Agregar los elementos al formulario y al div principal
    formFieldDiv.appendChild(label);
    formFieldDiv.appendChild(input);
    form.appendChild(formFieldDiv);
    form.appendChild(submitButton);
    form.appendChild(cancelButton);
    containerDiv.appendChild(titleH1);
    containerDiv.appendChild(form);
    containerDiv.appendChild(messageDiv);
    createChannelScreenDiv.appendChild(containerDiv);

    // Insertar el div principal en el body
    document.body.appendChild(createChannelScreenDiv);
}

function createChannel(server_id) {
    const data = {
        channel_name: document.getElementById("channel_name").value,
        server_id: server_id,
    }
    fetch("http://127.0.0.1:5000/tchannels", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include'
    })
    .then(response => {
        if (response.status === 201) {
            return response.json().then(data => {
                alert(data.message);
                window.location.href = "../index.html";
            });
        } else {
            return response.json().then(data => {
                alert(data.error.description);
            })
        }
    })
    .catch(error => {
        alert("Ocurrio un error");
    });
}
