var express=require('express');
var app=express();
var bodyParser=require('body-Parser');//接收请求体
var fs=require('fs');
app.use(bodyParser.json());//把请求体从对象转换成json格式
app.listen(9090,function(){
    console.log('9090');
});
//静态文件中间件
app.use(express.static(__dirname));
//当访问'/'路径时(http://localhost:9090)，默认返回首页
app.get('/',function(req,res){
    res.sendFile('/index.html',{root:__dirname});
});
//增加书
app.post('/books',function(req,res){
    //获取请求体传过来的那本书
    var book=req.body;
    //先读json数据，将增加的图书写到son文件中
    getBooks(function(data){
        //读出来的数据增加id
        book.id=data.length==0?1:data[data.length-1].id+1;
        data.push(book);
        setBooks(data,function(){
            res.send(book);//增加的时候默认返回增加的那一项
        });
    });
});
//列表页
app.get('/books',function(req,res){
    getBooks(function(data){
        console.log(data);
        res.send(data);
    });
});
//详情页
app.get('/books/:id',function(req,res){
    var id=req.params.id;
    getBooks(function(data){
        //在所有书中找到某一本
        var book=data.find(function(item){
            return item.id==id;
        });
        res.send(book);
    });
});
//详情页的删除方法
app.delete('/books/:id',function(req,res){
    var id=req.params.id;
    getBooks(function(data){
        var books=data.filter(function(item){
            return item.id!=id;
        });
        setBooks(books,function(){
            res.send({});
        });
    });
});
//详情页的修改方法
app.put('/books/:id',function(req,res){
    var id=req.params.id;
    var book=req.body;
    getBooks(function(data){
        var books=data.map(function(item){
            if(item.id==id){
                return book;
            }else{
                return item;
            }
        });
        setBooks(books,function(){
            res.send(book);//修改后将修改的那一本书返回

        });

    });

});




function getBooks(callback){
    fs.readFile('./book.json','utf8',function(err,data){
        var books=[];
        if(err){
            callback(books);
        }else{
           if(data.startsWith('[')){
               console.log(data);
               books=JSON.parse(data);
           }
            callback(books);
        }
    })
}
function setBooks(data,callback){
    fs.writeFile('./book.json',JSON.stringify(data),callback)
}

