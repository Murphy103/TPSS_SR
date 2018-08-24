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
 * 导入终端
 */
function onSubmit() {
	
	//导入终端
	var terminalInfo = new Object();
    terminalInfo["service_name"] = JsVar["data"]["service_name"];
    terminalInfo["service_name_pre"] = JsVar["data"]["service_name_pre"];
    terminalInfo["file_path"] = mini.get("file_path").getValue();
    terminalInfo["REF_DEM_TYPE_ID"] = JsVar["data"]["REF_DEM_TYPE_ID"];
    terminalInfo["upload_flag"] = "LOCAL";
    terminalInfo["parse_flag"] = true;
    
    ajaxUploadFile(Globals.baseActionUrl.IMPORT_OPERATION_URL,"file_path",terminalInfo,function(result){
    	result = mini.decode(result);
    	terminalInfo["success"] = result.success;
    	terminalInfo["errormsg"] = result.errormsg;
        closeWindow(terminalInfo);
    });
   
}