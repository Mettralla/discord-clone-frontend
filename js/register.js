document.getElementById("authForm").addEventListener("submit", function (event) {
    event.preventDefault();
    register();
});

function register() {
    const data = {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
    }
    fetch("http://127.0.0.1:5000/auth/register", {
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
                window.location.href = "login.html";
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