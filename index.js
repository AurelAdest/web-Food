import express, { urlencoded } from 'express';
import session from 'express-session';
import { cekadminController, dbloginadminController, deletesController, deleteshopController, editController, homeadminController, loginadminController } from './controller/indexadminController.js';
import { shopController, tambahController, transaksiController } from './controller/indexshopController.js';
import { cekuserController, dbloginuserController, dbregistrasiController, homeuserController, indexController, loginuserController, registrasiuserController, shopuserController, tambahuserController, transaksiuserController} from './controller/indexuserController.js';
import { deleteController, edittController, submitController} from './controller/submitController.js';

const app = express();

app.use(express.static('public'))
app.use(express.static('views'))
app.use(urlencoded({extended:true}))
app.set("view engine","ejs");
app.use(session({
    secret: 'inikuncirahasia'
}));

app.get("/index", indexController)
app.get("/registrasiuser", registrasiuserController)
app.post("/registrasiuser",dbregistrasiController)
app.get("/loginuser",loginuserController)
app.post("/loginuser",dbloginuserController)
app.get("/homeuser", cekuserController, homeuserController)

app.post("/submit", submitController)
app.get("/delete/:id", deleteController)
app.get("/editadmin/:id", editController)
app.post("/editadmin/:id",edittController)

app.get("/loginadmin", loginadminController)
app.post("/dbloginadmin", dbloginadminController)
app.get("/homeadmin",cekadminController, homeadminController)
app.get("/deleteshop/:id", deleteshopController)
app.get("/deletes/:id", deletesController)

//transaksi admin
app.get("/shop", shopController, cekuserController)
app.post("/items/tambah", tambahController)
app.post("/items/transaksi", transaksiController)

//transaksi user
app.get("/shopuser", shopuserController,cekadminController)
app.post("/item/tambahuser", tambahuserController)
app.post("/items/transaksiuser", transaksiuserController)

app.listen(5000,()=>{
    console.log("siap dijalankan")
})