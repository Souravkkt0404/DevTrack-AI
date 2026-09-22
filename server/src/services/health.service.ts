export const healthService = {
  getStatus() {
    return {
      status: 'ok',
      service: 'devtrack-ai-server',
      timestamp: new Date().toISOString(),
    }
  },
}