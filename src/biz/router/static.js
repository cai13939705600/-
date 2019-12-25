const ROUTES = CNST.ROUTES
export default Object.values(ROUTES).filter(item => !item.meta.isGlobal)