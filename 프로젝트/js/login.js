let isLogin;
let users;
const setHeader = () => {
  if (isLogin) {
    $(".login-header").each(function () {
      $(this).attr("style", "display: flex !important");
    });

    $(".logout-header").each(function () {
      $(this).attr("style", "display: none !important");
    });
  } else {
    $(".login-header").each(function () {
      $(this).attr("style", "display: none !important");
    });

    $(".logout-header").each(function () {
      $(this).attr("style", "display: flex !important");
    });
  }
};

const signup = (e) => {
  e.preventDefault();
  const form = e.target.form;

  if (users[form.elements["id"].value]) {
    alert("중복된 아이디┗|｀O′|┛");
    return;
  }

  let user = {
    id: form.elements["id"].value,
    pw: form.elements["pw"].value,
    name: form.elements["name"].value,
    addr: form.elements["addr"].value,
    tel: form.elements["tel"].value,
  };

  users[form.elements["id"].value] = user;
  localStorage.setItem("users", JSON.stringify(users));
  history.go(-1);
};

const login = (e) => {
  e.preventDefault();
  const form = e.target.form;

  if (!users[form.elements["id"].value]) {
    alert("로그인 실패┗|｀O′|┛");
    return;
  }

  if (users[form.elements["id"].value].pw !== form.elements["pw"].value) {
    alert("로그인 실패┗|｀O′|┛");
    return;
  }

  localStorage.setItem("isLogin", "true");
  localStorage.setItem(
    "user",
    JSON.stringify(users[form.elements["id"].value])
  );
  window.location.reload();
};

const logout = (e) => {
  e.preventDefault();

  localStorage.setItem("isLogin", "false");
  localStorage.setItem("user", "");
  window.location.reload();
};

window.addEventListener("load", () => {
  isLogin = localStorage.getItem("isLogin") === "true" ? true : false;

  users = localStorage.getItem("users")
    ? JSON.parse(localStorage.getItem("users"))
    : {};

  setHeader();

  $("#signupBtn").click(signup);
  $("#loginBtn").click(login);
  $("#logoutBtn").click(logout);
});
