<?php
$new_password = "admin123";
$hash = password_hash($new_password, PASSWORD_DEFAULT);
echo "New password: $new_password<br>";
echo "Hash: $hash<br>";
echo "<br>SQL to update:<br>";
echo "UPDATE admin_users SET password = '$hash' WHERE username = 'admin';";
?>