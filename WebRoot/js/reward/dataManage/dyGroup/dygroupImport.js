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
	
	//导入店员
	var dygroupInfo = new Object();
	dygroupInfo["service_name"] = JsVar["data"]["service_name"];
	dygroupInfo["service_name_pre"] = JsVar["data"]["service_name_pre"];
	dygroupInfo["file_path"] = mini.get("file_path").getValue();
	dygroupInfo["REF_DEM_TYPE_ID"] = JsVar["data"]["REF_DEM_TYPE_ID"];
	dygroupInfo["upload_flag"] = "LOCAL";
	dygroupInfo["parse_flag"] = true;
    
    ajaxUploadFile(Globals.baseActionUrl.IMPORT_OPERATION_URL,"file_path",dygroupInfo,function(result){
    	result = mini.decode(result);
    	dygroupInfo["success"] = result.success;
    	dygroupInfo["errormsg"] = result.errormsg;
        closeWindow(dygroupInfo);
    });
   
}