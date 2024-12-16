// export const API_ROOT = 'http://localhost:8017/api/v1'

let api_root = ''
if (process.env.BUILD_MODE === 'dev') {
  api_root = 'http://localhost:8017/api/v1'
}
if (process.env.BUILD_MODE === 'production') {
  api_root = 'https://trelloapp-server.onrender.com/api/v1'
}
export const API_ROOT = api_root