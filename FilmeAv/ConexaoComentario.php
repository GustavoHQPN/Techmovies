<?php 

$localhost = "localhost";
$user = "root";
$passw = "";
$banco = "campocomentario";

$conecta = mysqli_connect($localhost, $user, $passw, $banco);
$sql = mysqli_query($conecta, "SELECT * FROM comentario");

echo mysqli_num_rows($sql);

?>