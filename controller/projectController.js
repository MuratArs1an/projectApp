const postgresClient=require('../config/database');

exports.getAllProjects=async(req,res)=>{
    try {
        const query="SELECT * FROM projects ORDER BY id ASC";
        const{rows}=await postgresClient.query(query);
        return res.status(200).json(rows);
    } catch (error) {
        return res.status(400).json({message:error.message})
    }
}

exports.getAllUsers=async(req,res)=>{
    try {
        const query="SELECT * FROM users ORDER BY id ASC";
        const{rows}=await postgresClient.query(query);
        return res.status(200).json(rows);
    } catch (error) {
        return res.status(400).json({message:error.message})
    }
}

exports.createProject=async(req, res)=>{
    try {
        const query="INSERT INTO projects (title, user_id, description, importance, start, deadline ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
        const values = [req.body.title, req.body.userId, req.body.description, req.body.importance, req.body.start, req.body.deadline ];
        //console.log(typeof(req.body.startingDate));
        const {rows}= await postgresClient.query(query,values)
        console.log("rows",rows);
        res.status(201).json({ message: rows[0] });
    } catch (error) {
        //console.error('Error adding project:', error.response);
        console.log("error log",error);
        //return res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.createUser=async(req,res)=>{
    try {
        const query="INSERT INTO users (name, lastname, title) VALUES ($1, $2, $3) RETURNING *";
        const values = [req.body.name, req.body.lastname, req.body.title];
        const {rows}= await postgresClient.query(query,values)
        res.status(201).json({ message: rows[0] });
    } catch (error) {
        console.error(error.response.data);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.deleteUser=async(req,res)=>{
    try {
        const {id}=req.params;
        const query="DELETE FROM users WHERE id= $1 RETURNING *";
        const values=[id];
        const { rows } = await postgresClient.query(query, values)
        if(!rows.length)
            return res.status(404).json({ message: 'User not found.' })

        return res.status(200).json({ deletedUser: rows[0] })
    } catch (error) {
        return res.status(400).json({ message: error.message })  
    }
}

exports.deleteProject=async(req,res)=>{
    try {
        const {id}=req.params;
        const query="DELETE FROM projects WHERE id= $1 RETURNING *";
        const values=[id];
        const { rows } = await postgresClient.query(query, values)
        if(!rows.length)
            return res.status(404).json({ message: 'Project not found.' })

        return res.status(200).json({ deletedUser: rows[0] })
    } catch (error) {
        return res.status(400).json({ message: error.message })  
    }
}

exports.getProject=async(req, res)=>{
    try {
        const { id } = req.params
        const text ="SELECT * FROM projects WHERE id = $1";
        const values = [id]
        const { rows } = await postgresClient.query(text,values)
        return res.status(200).json(rows)
    } catch (error) {
        console.log('Error occured', error.message)
        return res.status(400).json({ message: error.message }) 
    }
}

exports.getUser=async(req, res)=>{
    try {
        const { id } = req.params
        const text ="SELECT * FROM users WHERE id = $1";
        const values = [id]
        const { rows } = await postgresClient.query(text,values)
        return res.status(200).json(rows)
    } catch (error) {
        console.log('Error occured', error.message)
        return res.status(400).json({ message: error.message }) 
    }
}