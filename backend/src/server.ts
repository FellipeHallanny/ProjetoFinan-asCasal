import app from './app';
import { config } from '@/config/unifiedConfig';

const port = config.port || 3001;

const server = app.listen(port, () => {
  console.log(`[🚀 Server] Running on port ${port} in ${config.env} mode`);
});

export default server;
