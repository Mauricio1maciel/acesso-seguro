import { Sequelize } from 'sequelize';
import 'dotenv/config';

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Fundamental para o Supabase aceitar a conexão
    }
  },
  define: {
    timestamps: true,
    underscored: true
  }
});

export default sequelize;