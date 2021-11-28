<script>
  function submit() {
    var username = document.getElementById('username').value();
    window.localStorage.setItem('name', username);

  }
</script>