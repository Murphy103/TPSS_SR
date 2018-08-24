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
	var subsidyInfo = new Object();
    subsidyInfo["service_name"] = JsVar["data"]["service_name"];
    subsidyInfo["service_name_pre"] = JsVar["data"]["service_name_pre"];
    subsidyInfo["file_path"] = mini.get("file_path").getValue();
    subsidyInfo["REF_DEM_TYPE_ID"] = JsVar["data"]["REF_DEM_TYPE_ID"];
    subsidyInfo["upload_flag"] = "LOCAL";
    subsidyInfo["parse_flag"] = true;
    
    ajaxUploadFile(Globals.baseActionUrl.IMPORT_OPERATION_URL,"file_path",subsidyInfo,function(result){
    	result = mini.decode(result);
    	subsidyInfo["success"] = result.success;
    	subsidyInfo["errormsg"] = result.errormsg;
        closeWindow(subsidyInfo);
    });
   
}