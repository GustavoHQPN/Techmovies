<?php

if(isset($_POST['submit']))
{
    print_r($_POST['Comentarios']);
}

include_once('ConexaoComentario.php');

$Comentario = $_POST['Comentarios'];

$result = mysqli_query($conecta, "INSERT INTO comentario(ComentarioAssinante) VALUES('$Comentario')");

?>