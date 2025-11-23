module.exports = {
  apps: [
    {
      name: 'avery-gdgoc-api',
      script: './dist/main.js',
      instances: 'max', // atau angka spesifik seperti 2, 4, dll
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        DATABASE_SSL: 'false',
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        DATABASE_SSL: 'false',
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3000,
        DATABASE_SSL: 'false',
      },
      error_file: './logs/pm2/err.log',
      out_file: './logs/pm2/out.log',
      log_file: './logs/pm2/combined.log',
      time: true,
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
};
