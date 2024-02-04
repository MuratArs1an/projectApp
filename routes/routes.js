const express=require("express");
const methodOverride=require('method-override');
const projectController=require('../controller/projectController');
const routes=express();

routes.use(methodOverride('_method',{
    methods:['POST','GET']
}));

routes.get('/projects',projectController.getAllProjects);
routes.get('/users', projectController.getAllUsers);
routes.post('/project', projectController.createProject);
routes.post('/user', projectController.createUser);
routes.delete('/project/:id',projectController.deleteProject);
routes.delete('/user/:id', projectController.deleteUser);
routes.get('/project/:id',projectController.getProject);
routes.get('/user/:id', projectController.getUser);

module.exports=routes;