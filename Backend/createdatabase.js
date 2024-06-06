var mysql=require("mysql");
var con=mysql.createConnection({
    host:"127.0.0.1",
    user:"root",
    password:""
});

con.connect(function(err){
    if(err) throw err;
    console.log("Connected");
    var sql="CREATE DATABASE book_reviews";

    con.query(sql,function(err,result){
        if (err) throw err;

        console.log("Database created");
    });
});