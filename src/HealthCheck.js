
import os from 'os';

const healthCheck = (req, res) => res.json({
  alive: true,
  date: new Date(),
  env: process.env.NODE_ENV,
  os: {
    freeMem: os.freemem(),
    loadAvg: os.loadavg(),
    uptime: os.uptime()
  },
  process: {
    memUsage: process.memoryUsage(),
    uptime: process.uptime(),
    cpuUsage: process.cpuUsage()
  }
});

export default healthCheck;
