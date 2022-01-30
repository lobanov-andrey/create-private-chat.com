const WS_URL: string = process.env.WS_URL ? process.env.WS_URL : ''
const PRODUCTION_MODE: boolean = process.env.NODE_ENV == 'development' ? false : true
export { WS_URL, PRODUCTION_MODE }
