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

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/img', express.static('public/img'));

app.get('/api/livros', async (req, res) => {
    const { letra } = req.query;

    // Verifica se a letra foi fornecida corretamente
    if (!letra || letra.length !== 1) {
        return res.status(400).json({ error: 'Informe uma única letra para o filtro.' });
    }

    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool
            .request()
            .input('letra', sql.NVarChar, `${letra}%`) // Passa a letra com '%' para buscar títulos que começam com a letra
            .query('SELECT Titulo, imagem FROM Livros WHERE Titulo LIKE @letra');

        if (result.recordset.length === 0) {
            return res.status(200).json([]); // Retorna uma lista vazia se não houver resultados
        }

        res.json(result.recordset); // Envia os livros encontrados como resposta
    } catch (error) {
        console.error(error); // Loga o erro para depuração
        res.status(500).json({ error: 'Erro ao buscar dados.' });
    }
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});


