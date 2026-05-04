
let token = "";

async function signup() {
  await fetch('http://localhost:3000/signup', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      username: su_user.value,
      password: su_pass.value
    })
  });
  alert("User created");
}

async function login() {
  const res = await fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      username: li_user.value,
      password: li_pass.value
    })
  });

  const data = await res.json();
  token = data.token;
  alert("Logged in");
}

async function getUsers() {
  const res = await fetch('http://localhost:3000/users', {
    headers: {
      'Authorization': token
    }
  });

  const data = await res.json();
  users.innerHTML = '';

  data.forEach(u => {
    const li = document.createElement('li');
    li.innerText = u.username;
    users.appendChild(li);
  });
}
