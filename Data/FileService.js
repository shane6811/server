var formidable = require('formidable');
var fs = require('fs');
var TITLE = 'formidable上传示例';
var AVATAR_UPLOAD_FOLDER = 'userimages/';

function FileService(){
    var _this=this;

    this.upload=function(callback){
        var req=_this.req;
        var res=_this.res;
        var form = new formidable.IncomingForm();   //创建上传表单
        form.encoding = 'utf-8';		//设置编辑
        form.uploadDir = 'public/' + AVATAR_UPLOAD_FOLDER;	 //设置上传目录
        form.keepExtensions = true;	 //保留后缀
        form.maxFieldsSize = 5 * 1024 * 1024;   //文件大小

        form.parse(req, function(err, fields, files) {

            if (err) {
                res.locals.error = err;
                res.render('index', { title: TITLE });
                return;		
            }  
            
            var extName = '';  //后缀名
            switch (files.file.type) {
            case 'image/pjpeg':
                extName = 'jpg';
                break;
            case 'image/jpeg':
                extName = 'jpg';
                break;		 
            case 'image/png':
                extName = 'png';
                break;
            case 'image/x-png':
                extName = 'png';
                break;		 
            }

            if(extName.length == 0){
                res.locals.error = '只支持png和jpg格式图片';
                res.render('index', { title: TITLE });
                return;				   
            }

            var avatarName = Math.random() + '.' + extName;
            
            //fs.renameSync(files.file.path, files.file.name);  //重命名
            var filepath=files.file.path;
            //为了去掉前面的public/
            filepath=filepath.substring(7);//replace("public\\","");
            //file.name和实际保存的文件名完全对应不上，不知为何。
            //var filepath=AVATAR_UPLOAD_FOLDER+files.file.name.toLowerCase();
            var rtn={value:filepath};
            callback(rtn);
        });

        }
    }
module.exports = FileService;