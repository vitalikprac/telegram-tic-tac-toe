import { defineConfig } from 'vite';
import fs from 'fs';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  /*server: {
    port: 3000,
    https: {
      pfx: fs.readFileSync('./cert/tictactoe.pfx'),
      passphrase: 'vitalik3703',
    },
  },*/
  plugins: [react()],
});
