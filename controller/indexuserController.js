import jwt from "jsonwebtoken";
import { db } from "../database.js";

const JWT_Secret = 'inikuncirahasia'

export const indexController = (req,res) => {
    res.render("index")
}

export const registrasiuserController = (req,res) => {
    res.render('registrasiuser')
}

export const dbregistrasiController = (req,res) => {

    const username = req.body.username
    const password = req.body.password

    db.query(`insert into loginuser(username, password) values("${username}","${password}")`)
    res.redirect('/loginuser')
}

export const loginuserController = (req,res) => {
    res.render('loginuser')
}

export const dbloginuserController = (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    db.query(`select * from loginuser where username = "${username}" and password = "${password}"`, (err,result)=>{
        if(err){
            console.log(err)
            return res.redirect('/loginuser')
        }
        const pengguna = result[0]
        if(!pengguna) return res.redirect('/loginuser')

        const token = jwt.sign({
            username: pengguna.username,
            password: pengguna.password
        }, JWT_Secret, {expiresIn:'6h'})

        req.session.penggunaToken = token;
        return res.redirect('/homeuser')
    })
}

export const homeuserController = (req,res)=>{
    res.render("homeuser")
}

export const logoutuserController = (req,res)=>{
    req.session.penggunaToken = undefined 
    return res.redirect("/index")
}

export const cekuserController = (req, res,next) => { // middleware: mengecek user sudah login atau belum
    if (!req.session.penggunaToken) //! artinya bukan  //kalau tidak ada berarti mengarah ke return redirect
    return res.redirect("/loginuser")

    jwt.verify(req.session.penggunaToken, JWT_Secret, (err,pengguna) => { //kalau ada maka menjalankan ccode ini
        if(err){ //jika gagal verifikasi token makan kembali ke login
            console.log(err)
            return res.redirect("/loginuser")
        }
        req.pengguna = pengguna //jika berhasil kita simpan data pengguna di request user
        next()//dan menjalankan fungsi selanjutnya
    })
}

//transaksi

export const shopuserController =(req,res)=>{
    db.query(`select * from items`,(err,items)=>{
        if(err) console.log (err)

        db.query(`select * from pembukuan order by create_time desc limit 5`,(err,pembukuan)=>{

            if(err) console.log(err)
            res.render("shopuser",{
                pembukuan: pembukuan || [], //nilai mulai dari nol
                items: items || []
    
            })
        })
    })
    
}


export const tambahuserController = (req,res) => {
    const data = req.body

    db.query(`insert into items (name) values (?)`,[data.name], (err,result)=>{ //nilai awal yang ada nilainya,tidak kosong
        if (err) console.log (err)
        res.redirect('/shopuser');
    }) 
}

export const transaksiuserController = (req,res) => {
    const data = req.body
    db.query(`insert into pembukuan(type, item_id, amount) values (?,?,?)` , [data.type, data.item_id, data.amount],(err,result) =>{
        if (err) {
			console.log(err);
			res.redirect('/shopuser');
            return;
		}
        const qty = data.type === 'keluar' ? data.amount * -1 : data.amount;
		db.query('update items set qty = qty + ? where id = ?', [qty, data.item_id], (err, result) => {
			if (err) console.log(err);
			res.redirect('/shopuser');
		});
    })
}