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
