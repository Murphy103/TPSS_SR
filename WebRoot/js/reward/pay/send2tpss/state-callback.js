var JsVar = new Object();

//初始化
$(document).ready(function() {
	mini.parse();
	
});

/**
 * 父窗口调用的初始化方法
 * @param action 操作类型
 * @param data   参数
 */
function onLoadComplete(action,data) {
  
    //父窗口参数
    JsVar["data"] = data;
}

/**
 * 导入状态
 */
function onSubmit() {
	
	var dataInfo = new Object();
	dataInfo["service_name"] = 'SALE_REWARD_SEND2TPSS_STATE_CALLBACK';
	dataInfo["service_name_pre"] = '';
	dataInfo["file_path"] = mini.get("file_path").getValue();
	dataInfo["upload_flag"] = "LOCAL";
	dataInfo["parse_flag"] = true;
    
    ajaxUploadFile(Globals.baseActionUrl.IMPORT_OPERATION_URL,"file_path",dataInfo,function(result){
    	result = mini.decode(result);
    	dataInfo["success"] = result.success;
    	dataInfo["errormsg"] = result.errormsg;
        closeWindow(dataInfo);
    });
   
}