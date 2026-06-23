import sequelize from '../config/database.js';
import Morador from '../models/morador.model.js';
import Visitante from '../models/visitante.model.js';
import Usuario from '../models/usuario.model.js';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const moradoresFicticios = [
  { nome: 'Ana Paula Silva', cpf: '111.111.111-11', telefone: '(11) 98888-1111', numero_casa: '101', placa_carro: 'ABC-1234' },
  { nome: 'Carlos Eduardo Mendes', cpf: '222.222.222-22', telefone: '(11) 98888-2222', numero_casa: '102', placa_carro: 'XYZ-9876' },
  { nome: 'Beatriz Souza', cpf: '333.333.333-33', telefone: '(11) 98888-3333', numero_casa: '103', placa_carro: '' },
  { nome: 'Fernando Alves', cpf: '444.444.444-44', telefone: '(11) 98888-4444', numero_casa: '104', placa_carro: 'DEF-5678' }
];

const visitantesFicticios = [
  { nome: 'João da Silva', cpf: '555.555.555-55', telefone: '(11) 97777-1111', placa_carro: 'JJJ-1111', tempo_visita: 'Algumas horas' },
  { nome: 'Maria Oliveira', cpf: '666.666.666-66', telefone: '(11) 97777-2222', placa_carro: 'MMM-2222', tempo_visita: 'O dia todo' }
];

async function seedDatabase() {
  try {
    // Conecta ao banco de dados
    await sequelize.authenticate();
    console.log('⏳ Conectando ao banco de dados...');

    // Garante que as tabelas existam
    await sequelize.sync();
    console.log('⏳ Sincronizando tabelas...');

    // Conta quantos moradores já existem
    const countMoradores = await Morador.count();
    
    if (countMoradores === 0) {
      // Se não tiver nenhum, insere a lista inteira
      await Morador.bulkCreate(moradoresFicticios);
      console.log('✅ Moradores fictícios inseridos com sucesso!');
    } else {
      console.log(`ℹ️ O banco já possui ${countMoradores} morador(es).`);
    }

    // Conta quantos usuários já existem
    const countUsuarios = await Usuario.count();
    if (countUsuarios === 0) {
      const senhaHash = await bcrypt.hash('admin123', 10);
      await Usuario.create({
        nome: 'Administrador',
        email: 'admin@acessoseguro.com',
        senha: senhaHash
      });
      console.log('✅ Usuário administrativo padrão inserido com sucesso!');
    } else {
      console.log(`ℹ️ O banco já possui ${countUsuarios} usuário(s).`);
    }

    // Conta quantos visitantes já existem
    const countVisitantes = await Visitante.count();

    if (countVisitantes === 0) {
      await Visitante.bulkCreate(visitantesFicticios);
      console.log('✅ Visitantes fictícios inseridos com sucesso!');
    } else {
      console.log(`ℹ️ O banco já possui ${countVisitantes} visitante(es).`);
    }

  } catch (error) {
    console.error('❌ Erro ao popular o banco:', error.message);
  } finally {
    // Fecha a conexão e encerra o script
    await sequelize.close();
    process.exit(0);
  }
}

seedDatabase();