import { Router } from "express";
import { uManager } from "../dao/managersMongo/usersManager.js";

const router = Router();


router.post('/signup', async (req, res) => {
    const { first_name, last_name, email, password } = req.body;    
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const createdUser = await uManager.createUser(req.body)
        res.status(200).json({message: 'User created'})
    }catch (error) {
        res.status(500).json({error})
    }
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body    
    if (!email || !password)
        return res.status(400).json({message: 'All fields are requiered'})    
    try {
        const user = await uManager.findUserByEmail(email)        
        if (!user){
            return res.redirect('/api/views/signup')
        } 
        const isPasswordValid = password === user.password
        if(!isPasswordValid) {
            return res.status(401).json({message: 'Password is not valid'})
        } //hasta aca funciona
        const sessionInfo =
            email === "adminCoder@coder.com" && password === "adminCod3r123"
                ? { email, first_name: user.first_name, isAdmin: true }
                : { email, first_name: user.first_name, isAdmin: false };        
        console.log(req.session)
        req.session.user = sessionInfo;
        

        /* res.status(200).json({message: 'User logged'}) */
        res.redirect("/api/views/products")
    }catch (error) {
        res.status(500).json({error})
    }
})

/* router.get("/products", async (req, res) => {  
    res.render("products", {user: req.session.user});
}); */


router.get('/signout', async(req, res)=>{
    req.session.destroy(()=> {       
        res.redirect('/api/views/login')
    })
})


export default router

