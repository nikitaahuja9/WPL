function check_pass() {
    if (document.getElementById('password').value ==
            document.getElementById('confirm-password').value) {
        alert("YES")
    } else {
        alert("NO")
    }
}