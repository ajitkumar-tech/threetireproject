let token = "";

// 🔹 Signup
async function signup() {
  try {
    const res = await fetch('http://localhost:3000/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: su_user.value,
        password: su_pass.value
      })
    });

    const data = await res.json();
    console.log("Signup:", data);

    if (!res.ok) {
      alert(data.error || "Signup failed");
      return;
    }

    alert("User created successfully");
  } catch (err) {
    console.error(err);
    alert("Signup error");
  }
}

// 🔹 Login
async function login() {
  try {
    const res = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: li_user.value,
        password: li_pass.value
      })
    });

    const data = await res.json();
    console.log("Login response:", data);

    if (!res.ok || !data.token) {
      alert(data.error || "Login failed");
      return;
    }

    token = data.token;

    // ✅ optional (better UX)
    localStorage.setItem("token", token);

    alert("Logged in successfully");
  } catch (err) {
    console.error(err);
    alert("Login error");
  }
}

// 🔹 Get Users (Protected)
async function getUsers() {
  try {
    // ✅ get token from memory or storage
    const savedToken = token || localStorage.getItem("token");

    if (!savedToken) {
      alert("Please login first");
      return;
    }

    const res = await fetch('http://localhost:3000/users', {
      headers: {
        Authorization: `Bearer ${savedToken}`   // ✅ REQUIRED
      }
    });

    if (res.status === 403) {
      alert("Forbidden - Invalid or expired token");
      return;
    }

    const data = await res.json();
    console.log("Users:", data);

    users.innerHTML = '';

    data.forEach(u => {
      const li = document.createElement('li');
      li.innerText = u.username;
      users.appendChild(li);
    });

  } catch (err) {
    console.error(err);
    alert("Error fetching users");
  }
}
