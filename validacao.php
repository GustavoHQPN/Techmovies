<?php
session_start();

$_SESSION["usuario"] = $_POST["usuario"];
$_SESSION["senha"]  = $_POST["senha"];
function redirect(){
if($_SESSION["usuario"]=='admin' && $_SESSION["senha"]=='admin'){
    header("location:index.php");
}else 
    header("location:indexform.php");
}  
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <?php 
        redirect();
    ?>
</body>
</html>

