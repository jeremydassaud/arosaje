const jwt = require('jsonwebtoken')
const jwtSignSecret =  process.env.jwtSignSecret 

module.exports =(req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = jwt.verify(token, jwtSignSecret)

        const userId = decodedToken.userId
        const userRole = decodedToken.role; 

        // const isadmin = decodedToken.isadmin
        req.auth = { userId , userRole}
        if(req.body.userId && req.body.userId !== userId){
            throw 'User ID non valable'
        }else if (req.body.requiredRole && req.body.requiredRole !== userRole) {
            throw 'Rôle non autorisé';
          }else {
            next()
        }
    } catch (error){
        res.status(401).json ({ error : error | 'Requête non authentifiée !'})
    }
}