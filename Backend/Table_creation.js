var mysql=require("mysql");
var con=mysql.createConnection({
    host:"127.0.0.1",
    user:"root",
    password:"",
    database:"book_reviews"
});

con.connect(function(err){
    if(err) throw err;
    console.log("connected");

    var sql="CREATE TABLE reviews(title varchar(255),author varchar(255),publication varchar(255),genre varchar(255),review varchar(255),rating int(5),user_id int(5))";
    
    con.query(sql,function(err,result){
        if (err) throw err;
        console.log("Table created");

    });
});
