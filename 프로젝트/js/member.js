const initForm = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  $("#inputName").val(user.id);
  $("#inputLastName").val(user.pw);
  $("#inputUserName").val(user.name);
  $("#inputUserName").val(user.name);
  $("#inputEmail").val(user.addr);
  $("#inputPassword").val(user.tel);
};

const editUser = (e) => {
  e.preventDefault();
  const form = e.target.form;

  let changeUser = {
    id: form.elements["id"].value,
    pw: form.elements["pw"].value,
    name: form.elements["name"].value,
    addr: form.elements["addr"].value,
    tel: form.elements["tel"].value,
  };

  users[form.elements["id"].value] = changeUser;
  user = changeUser;
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("user", JSON.stringify(user));
  window.location.reload();
};

const deleteUser = (e) => {
  e.preventDefault();
  const form = e.target.form;

  localStorage.setItem("isLogin", "false");
  localStorage.setItem("user", "");
  delete users[form.elements["id"].value];
  localStorage.setItem("users", JSON.stringify(users));
  window.location = "./index.html";
};

window.addEventListener("load", () => {
  initForm();

  $("#editBtn").click(editUser);
  $("#deleteBtn").click(deleteUser);
});
