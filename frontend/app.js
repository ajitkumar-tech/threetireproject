let token = "";

// 🔹 Signup
async function signup() {
  const res = await fetch('http://localhost:3000/signup', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      username: su_user.value,
      password: su_pass.value
    })
  });

  const data = await res.json();
  console.log("Signup:", data);

  alert("User created");
}

// 🔹 Login (FIXED)
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
  console.log("Login response:", data);

  // ✅ CHECK SUCCESS
  if (!data.token) {
    alert(data.error || "Login failed");
    return;
  }

  token = data.token;
  console.log("TOKEN:", token);

  alert("Logged in successfully");
}

// 🔹 Get Users (FIXED)
async function getUsers() {
  if (!token) {
    alert("Please login first");
    return;
  }

  const res = await fetch('http://localhost:3000/users', {
    headers: {
      // 🔥 IMPORTANT FIX
      'Authorization': `Bearer ${token}`
    }
  });

  if (res.status === 403) {
    alert("Forbidden (invalid token)");
    return;
  }

  const data = await res.json();

  users.innerHTML = '';

  data.forEach(u => {
    const li = document.createElement('li');
    li.innerText = u.username;
    users.appendChild(li);
  });
}
