import { db } from "../database.js";

export const submitController = (req,res)=>{
  

    const username = req.body.username;
    const password = req.body.password;
    

    db.query(`insert into loginuser (username, password) values ('${username}','${password}')`)
    
    res.redirect('/homeuser')
}

export const deleteController = (req,res) => {
    const id = req.params.id

    db.query(`delete from loginuser where id = ${id}`)
    res.redirect('/homeadmin')
}

export const edittController = (req,res) => {
    const id = req.params.id
    const data = req.body
    console.log(data)

    db.query(`update loginuser set username = "${data.username}", password="${data.password}" where id = ${id}`)
    res.redirect('/homeadmin')
}