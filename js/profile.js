window.addEventListener('load', function () {
    getProfile();
});

document.getElementById("logout").addEventListener("click", logout);

function getProfile() {
    const url = "http://127.0.0.1:5000/auth/profile";
    
    fetch(url, {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        if (response.status === 200) {
            return response.json().then(data => {
                document.getElementById("username").innerText = data.username;
                document.getElementById("image").innerText = data.image;
                document.getElementById("user_id").innerText = data.user_id;
        })
        } else {
            return response.json().then(data => {
                document.getElementById("message").innerHTML = data.error.description;
            });
        }
    })
    .catch(error => {
        document.getElementById("message").innerHTML = "Ocurrió un error.";
    });
}

function logout() {
    const url = "http://127.0.0.1:5000/auth/logout";
    
    fetch(url, {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        if (response.status === 200) {
            return response.json().then(data => {
                window.location.href = "login.html";
            });
        } else {
            return response.json().then(data => {
                document.getElementById("message").innerHTML = data.error.description;
            });
        }
    })
    .catch(error => {
        document.getElementById("message").innerHTML = "An error occurred.";
    });
}