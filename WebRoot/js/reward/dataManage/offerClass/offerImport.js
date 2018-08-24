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
 * 导入套餐
 */
function onSubmit() {
	
	//导入套餐
	var offerInfo = new Object();
    offerInfo["service_name"] = JsVar["data"]["service_name"];
    offerInfo["service_name_pre"] = JsVar["data"]["service_name_pre"];
    offerInfo["file_path"] = mini.get("file_path").getValue();
    offerInfo["REF_DEM_TYPE_ID"] = JsVar["data"]["REF_DEM_TYPE_ID"];
    offerInfo["upload_flag"] = "LOCAL";
    offerInfo["parse_flag"] = true;
    
    ajaxUploadFile(Globals.baseActionUrl.IMPORT_OPERATION_URL,"file_path",offerInfo,function(result){
    	result = mini.decode(result);
    	offerInfo["success"] = result.success;
    	offerInfo["errormsg"] = result.errormsg;
        closeWindow(offerInfo);
    });
   
}