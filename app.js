const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sql = require('mssql');
const app = express();

const dbConfig = {
    user: 'appUser1',        // Substitua com seu usuário do SQL Server
    password: '12345',      // Substitua com sua senha do SQL Server
    server: 'localhost',        // Ou o nome do seu servidor SQL
    database: 'Biblioteca',
    options: {
        encrypt: true,          // Define se a conexão será criptografada (necessário para Azure).
        enableArithAbort: true,   // Controla como erros aritméticos são tratados.
        trustServerCertificate: true // Ignora a validação do certificado SSL,  Aceita conexões mesmo com certificado 
                                    // autoassinado (resolve problemas de conexão SSL).
    }
};
app.use(cors()); // Ativa o CORS para permitir requisições de diferentes origens.

app.use(bodyParser.json()); // Processa o corpo de requisições HTTP no formato JSON.

app.use(express.static('public')); // Serve arquivos estáticos da pasta 'public'.

app.use('/img', express.static('public/img')); // Serve arquivos da pasta 'public/img' na rota '/img'.

app.get('/api/livros', async (req, res) => { // Define uma rota GET para o endpoint '/api/livros'.
    const { letra } = req.query; // Captura o parâmetro 'letra' da query string, se fornecido.

    try {
        const pool = await sql.connect(dbConfig); // Conecta ao banco de dados usando as configurações fornecidas.

        const query = letra // Define a consulta SQL com ou sem filtro pela letra.
            ? 'SELECT Titulo, imagem FROM Livros WHERE Titulo LIKE @letra' // Consulta com filtro de títulos que começam com a letra.
            : 'SELECT Titulo, imagem FROM Livros'; // Consulta sem filtro para retornar todos os livros.
            
            // ? = se o valor de letra for verdadeiro consulta com filtro
            // : = se o valor de letra for vazio, ou falso,  consulta todos os livros

        const request = pool.request(); // Cria um objeto para configurar e executar a consulta ao banco.

        if (letra) { // Se a letra foi fornecida, adiciona o parâmetro à consulta.
            request.input('letra', sql.NVarChar, `${letra}%`); // Configura o parâmetro 'letra' com a formatação adequada.
        }

        const result = await request.query(query); // Executa a consulta e armazena o resultado.

        res.json(result.recordset); // Retorna os resultados da consulta no formato JSON.
    } catch (error) { // Captura qualquer erro que ocorrer no bloco 'try'.
        console.error(error); // Exibe o erro no console para depuração.
        res.status(500).json({ error: 'Erro ao buscar dados.' }); // Retorna uma resposta de erro ao cliente.
    }
});



const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});


