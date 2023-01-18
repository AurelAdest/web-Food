import { db } from "../database.js"

export const shopController =(req,res)=>{
    db.query(`select * from items`,(err,items)=>{
        if(err) console.log (err)

        db.query(`select * from pembukuan order by create_time desc limit 5`,(err,pembukuan)=>{

            if(err) console.log(err)
            res.render("shop",{
                pembukuan: pembukuan || [], //nilai mulai dari nol
                items: items || []
    
            })
        })
    })
}

export const tambahController = (req,res) => {
    const data = req.body

    db.query(`insert into items (name, gambar, harga) values (?, ?, ?)`,[data.name, data.gambar, data.harga], (err,result)=>{ //nilai awal yang ada nilainya,tidak kosong
        if (err) console.log (err)
        res.redirect('/shop');
    }) 
}

export const transaksiController = (req,res) => {
    const data = req.body
    db.query(`insert into pembukuan(type, item_id, amount) values (?,?,?)` , [data.type, data.item_id, data.amount],(err,result) =>{
        if (err) {
			console.log(err);
			res.redirect('/shop');
            return;
		}
        const qty = data.type === 'keluar' ? data.amount * -1 : data.amount;
		db.query('update items set qty = qty + ? where id = ?', [qty, data.item_id], (err, result) => {
			if (err) console.log(err);
			res.redirect('/shop');
		});
    })
}
// export const shopController =(req,res)=>{
//     db.query(`select * from items`,(err,items)=>{
//         if(err) console.log (err);

//         db.query(`select * from pembukuan order by create_time desc limit 5`,(err,pembukuan)=>{

//             if(err) console.log(err)
//             res.render("shop",{
//                 pembukuan: pembukuan || [], //nilai mulai dari nol
//                 items: items || []
    
//             })
//         })
//     })
    
// }

// export const tambahController = (req,res) => {
//     const data = req.body;

//     db.query(`insert into items (name) values (?)`,[data.name], (err,result)=>{ //nilai awal yang ada nilainya,tidak kosong
//         if (err) console.log (err)
//         res.redirect('/shop');
//     }) 
// }

// export const transaksiController = (req,res) => {
//     const data = req.body;
//     db.query(`insert into pembukuan(type, item_id, amount) values (?,?,?)` , [data.type, data.item_id, data.amount],(err,result) =>{
//         if (err) {
// 			console.log(err);
// 			res.redirect('/shop');
//             return;
// 		}
//         const qty = data.type === 'keluar' ? data.amount * -1 : data.amount;
// 		db.query('update items set qty = qty + ? where id = ?', [qty, data.item_id], (err, result) => {
// 			if (err) console.log(err);
// 			res.redirect('/shop');
// 		});
//     })
// }
