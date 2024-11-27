CREATE DATABASE Biblioteca
GO

USE Biblioteca
GO

CREATE TABLE Usuarios (
	ID_Usuario INT IDENTITY PRIMARY KEY,
	NomeUsuario VARCHAR(100),
	Turma VARCHAR(100),
	Telefone VARCHAR(11),
	Periodo VARCHAR(20)
)
GO

CREATE TABLE Livros (
	ID_Livro INT IDENTITY PRIMARY KEY,
	Titulo VARCHAR(100),
	Autor VARCHAR(100),
	Editora VARCHAR(100),
	Edicao VARCHAR(100),
	Volume INT,
	Quantidade INT,
	AnoPublicacao INT,
	Imagem NVARCHAR(400)
)

EXEC sp_rename 'Livros.AnoPublicação', 'AnoPublicacao', 'COLUMN';

CREATE TABLE Emprestimo (
	ID_Emprestimo INT IDENTITY PRIMARY KEY,
	ID_Usuario INT REFERENCES Usuarios(ID_Usuario),
	ID_Livro INT REFERENCES Livros(ID_Livro),
	DataEmprestimo DATE,
	DataDevolucao DATE,
	[Status] VARCHAR(50)
)
GO

ALTER TABLE Emprestimo
ADD [Status] VARCHAR(50)

USE Biblioteca;
GO

INSERT INTO Livros (Titulo, Autor, Editora, Edicao, Volume, Quantidade, AnoPublicacao) VALUES
('Introdução à Programação', 'Alice Souza', 'TechBooks', '1ª', 1, 5, 2022),
('Estruturas de Dados', 'Carlos Silva', 'EducaBook', '2ª', 1, 3, 2021),
('Banco de Dados SQL', 'Maria Costa', 'Informatics', '3ª', 1, 4, 2020),
('Algoritmos Avançados', 'Roberto Lima', 'TechPrint', '1ª', 1, 2, 2023),
('JavaScript Essencial', 'Ana Melo', 'DevBooks', '2ª', 1, 6, 2019);

CREATE LOGIN appUser1 
WITH PASSWORD = '12345';
GO

CREATE USER appUser1
FOR LOGIN appUser1;
GO

ALTER ROLE db_owner ADD MEMBER appUser1;
GO

ALTER SERVER ROLE sysadmin ADD MEMBER appUser1;
GO


UPDATE Livros
SET Imagem = 'https://marketplace.canva.com/EAE4oJOnMh0/1/0/1003w/canva-capa-de-livro-de-suspense-O7z4yw4a5k8.jpg'
WHERE ID_Livro = 1;
