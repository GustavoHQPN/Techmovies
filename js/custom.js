/*// Recuperar do HTML o SELETOR cad-usuario-form com JavaScript
const cadUsuarioForm = document.getElementById("cad-usuario-form");

// Verificar se a constante cadUsuarioForm é TRUE
if (cadUsuarioForm) {

    // Aguardar e identificar o clique do usuário no botão cadstrar com JavaScript
    cadUsuarioForm.addEventListener("submit", async (e) => {

        // Bloquear o recarregamento da página com JavaScript
        e.preventDefault();

        // Receber os dados do formulário com JavaScript
        const dadosForm = new FormData(cadUsuarioForm);

        // Enviar os dados do JavaScript para o PHP
        const dados = await fetch("cadastrar.php", {
            method: "POST", // Enviar os dados do JavaScript para o PHP através do método POST
            body: dadosForm, // Enviar os dados do JavaScript para o PHP
        });

        // Ler o retorno do PHP com JavaScript
        const resposta = await dados.json();

        // Verificar com JavaScript se cadastrou no banco de dados
        if (resposta['status']) {
            // Usar o SweetAlert para apresentar a mensagem após cadastrar no banco de dados com PHP
            Swal.fire({
                text: resposta['msg'],
                icon: 'success',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Fechar'
            });

            // Limpar o formulário com JavaScript
            cadUsuarioForm.reset();
        } else {
            // Usar o SweetAlert para apresentar a mensagem de erro após não cadastrar no banco de dados com PHP
            Swal.fire({
                text: resposta['msg'],
                icon: 'error',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Fechar'
            });
        }
    });


}*/

// Exemplo basico de SweetAlert2
// Criar função com JavaScript
function modal_01(){
    // Apresentar a mensagem com SweetAlert
    Swal.fire({
        title:'50% de desconto nas assinaturas premium',
       html:'<span class="tt"> em todos os planos! </span>',
       background: 'url(fotoivo.jpg)',
       input:'email',
       inputPlaceholder:'digite seu email',
        confirmButtonColor: '#d3f02e',
        cancelButtonColor: '#b60303',
        confirmButtonText: '!!Quero obter os meus 50% de desconto!!',
        showCancelButton:true,
        cancelButtonText: 'Não muito obrigado.',
        footer:'<span> Obrigado pela visita! </span>',
        customClass:{
            imageUrl:'img-pop-out',
            title:'titulo-pop-out',
            input:'input-pop-out',
            footer:'footer-po-out'
        },
    });}

// Chamar a função com JavaScript
modal_01();