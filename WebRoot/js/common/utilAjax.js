/**
 * 通过post方式获取json数据
 * @param url   地址 格式："/userAction.do?method=insertEmpee"
 * @param data   data 参数 json格式  {id：1，name:"adc"} 或 [{id：1，name:"adc"}]
 * @param logName 模块名  例如：“权限管理-增加权限”
 * @param callback  回调函数，返回成功后回调方法
 * @param execKey  execKey
 * @param dbKey  dbKey   可选项
 * @param async     是否异步，默认异步 可选项
 * @date 20170718
 */
function getJsonDataByPost(url,data,logName,callback,execKey,dbKey,async,msg,isShowLoadMask) {
    var obj = new Object();
    if(data){
        obj["params"] = mini.encode(data);
    }
    if(logName){
        obj["logName"] = logName;
    }
    if(execKey){
        obj["execKey"] = execKey;
    }
    if(dbKey){
        obj["dbKey"] = dbKey;
    }
    getJsonData(url, obj, callback, "POST", async,msg,isShowLoadMask);
}

/**
 * 获取json数据
 * @param url   地址
 * @param callback  回调函数
 * @param method    请求类型 GET OR POST
 * @param data      请求数据
 * @param async     是否异步，默认异步
 * @param msg       遮罩显示信息
 * @date 20170718
 *
 */
function getJsonData(url, data, callback, method, async,msg,isShowLoadMask) {
    if(async == undefined){
        async = true;
    }
     
    $.ajax({
        url: url,
        type: method,
        data: data,
        cache: false,
        dataType: "json",
        async: async,
        success: function (result,  status, xhr) {
            if(result){
                if(result.error){
                    showErrorMessageAlter(result.error);

                    return;
                }
                if(result.timeout){
                	showErrorMessageAlter("登录超时,请重新登陆",function(){
                		top.window.location.href =  result.timeout;
                		 return;
                	});
                    //alert("登录超时,请重新登陆");
                }
                callback(result);
            }else{
                callback();
            }
        },
        error: function (result, textStatus, errorThrown) {
            if(result.status=="0"){
                return ;
            }
            showErrorMessageAlter("系统异常!")
        }
    })
}

/**
 * ajax上传文件
 * @param url		   上传文件调用的url
 * @param elementID    html中type定义为file的input元素ID
 * @param data	       上传文件需要的额外参数  参数 json格式  {id：1，name:"adc"} 
 * @param callback	   上传成功后的回调函数
 */
function ajaxUploadFile(url,elementID,data,callback){
	var inputFile = $("#"+elementID+" > input:file")[0];
	var params = new Object();
	
	$.each(data,function(key,value){
		//数组参数，需要转成字符串
		if(isArray(value)){
			params[key] = encodeURI(mini.encode(value));
		}else{
			params[key] = value;
		}
	});
	
	$.ajaxFileUpload({
        url: url,                 										 //用于文件上传的服务器端请求地址
        fileElementId: inputFile,               						 //文件上传域的ID
        data: params,            							 			 //附加的额外参数
        dataType: 'text',                   							 //返回值类型 一般设置为json
        success: function (data, status)    							 //服务器成功响应处理函数
        {
        	if(data){
        		callback(data);
            }else{
                callback();
            }
        },
        error: function (data, status, e)   //服务器响应失败处理函数
        {
        	
        	 if(status=="error"){
                 return ;
             }
             showErrorMessageAlter("系统异常!")
        },
        complete: function () {
            var jq = $("#"+elementID+" > input:file");
            jq.before(inputFile);
            jq.remove();
        }
    });
}

function isArray(o) {
    return Object.prototype.toString.call(o) === '[object Array]';
}
