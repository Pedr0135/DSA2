-- ============================================================
-- PIZZARIA - MODELO FÍSICO
-- V1__create_database.sql
-- Criação do banco de dados e configurações iniciais
-- ============================================================

USE master;
GO

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'pizzaria_db')
BEGIN
    CREATE DATABASE pizzaria_db
    COLLATE Latin1_General_CI_AI;
END
GO

USE pizzaria_db;
GO
