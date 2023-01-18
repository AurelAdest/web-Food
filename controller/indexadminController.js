import jwt  from "jsonwebtoken";
import { db } from "../database.js";

const JWT_Secret = "inikuncirahasia"

export const homeadminController = (req,res)=>{
    return db.query('select * from loginuser', (err, result)=>{
        if (err) throw err
        return res.render('homeadmin', {loginuser: result})
    })
    // res.render("homeadmin")
}

export const loginadminController = (req,res) => {
    res.render("loginadmin")
}

export const dbloginadminController = (req, res) => {
    const username = req.body.username
    const password = req.body.password

    db.query(`select * from admin where username = "${username}" and password = "${password}"`, (err, result) => {
        if (err) {
            console.log(err)
            return res.redirect('/loginadmin')
        }

        const admin = result[0]
        console.log(admin)
        if (!admin) return res.redirect('/loginadmin')

        const token = jwt.sign({
            username: admin.username,
            password: admin.password
        }, JWT_Secret, { expiresIn: '1h' })

        req.session.adminToken = token;
        return res.redirect('/homeadmin')
    })
}

export const cekadminController = (req, res,next) => { // middleware: mengecek user sudah login atau belum
    if (!req.session.penggunaToken) //! artinya bukan  //kalau tidak ada berarti mengarah ke return redirect
    return res.redirect("/loginadmin")

    jwt.verify(req.session.penggunaToken, JWT_Secret, (err,pengguna) => { //kalau ada maka menjalankan ccode ini
        if(err){ //jika gagal verifikasi token makan kembali ke login
            console.log(err)
            return res.redirect("/loginadmin")
        }
        req.pengguna = pengguna //jika berhasil kita simpan data pengguna di request user
        next()//dan menjalankan fungsi selanjutnya
    })
}
export const editController = (req,res) => {
    const id = req.params.id

    return db.query(`select * from loginuser where id = ${id}`,(err,result)=>{
        if (err) throw err
        return res.render ('editadmin', {loginuser : result[0]}) 
    })
}
export const deleteshopController = (req,res) => {
    const id = req.params.id

    db.query(`delete from items where id = ${id}`)
    res.redirect('/shop')
}
export const deletesController = (req,res) => {
    const id = req.params.id

    db.query(`delete from pembukuan where id = $ {id}`)
    res.redirect('/shop')
}