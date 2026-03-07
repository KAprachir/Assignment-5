const userInput = document.getElementById("userInput");
const passwordInput = document.getElementById("passwordInput");
const signBtn = document
  .getElementById("signBtn")
  .addEventListener("click", () => {
    console.log("btn clicked");
    const userValue = userInput.value;
    const passwordvalue = passwordInput.value;
    if (userValue === "admin" && passwordvalue === "admin123") {
      alert("Sign In Successfull");
      window.location.href = "/home.html";
    } else {
      alert("Invalid username or password");
      return;
    }
  });
