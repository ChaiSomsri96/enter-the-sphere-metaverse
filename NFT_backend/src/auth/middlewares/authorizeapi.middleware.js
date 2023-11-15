module.exports=authorizeAPI;

function authorizeAPI(){

		return [(req,res,next)=>{
			if (req.header('X-API-KEY')!==process.env.SPHERE_API_KEY) {
				return res.status(401).json({})
			}

			next();
		}]
}
