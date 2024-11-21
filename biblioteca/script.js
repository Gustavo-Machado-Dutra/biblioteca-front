const express = require('express');
const sql = require('mssql');
const cors = require('cors'); // Para permitir requisições entre diferentes origens

const app = express();
app.use(cors());

// Configurações de conexão ao banco de dados MSSQL
const dbConfig = {
    user: 'seu_usuario',
    password: 'sua_senha',
    server: 'seu_servidor',
    database: 'seu_banco',
    options: {
        encrypt: true, // Se necessário, dependendo da configuração do banco
    },
};

// Endpoint para buscar títulos por letra
app.get('/api/titulos', async (req, res) => {
    const { letra } = req.query;

    if (!letra || letra.length !== 1) {
        return res.status(400).json({ error: 'Informe uma única letra para o filtro.' });
    }

    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool
            .request()
            .input('letra', sql.NVarChar, `${letra}%`)
            .query('SELECT titulo FROM Titulos WHERE titulo LIKE @letra');

        res.json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar dados.' });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
