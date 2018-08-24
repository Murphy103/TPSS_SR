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
 * 查询店员
 */
function query(){
	mini.parse();
	var param = {"DY_NAME":mini.get("DY_NAME").getValue(),
				 "REF_DEM_TYPE_ID":JsVar["data"]["REF_DEM_TYPE_ID"],
				 "service_name":"REF_DEM_TYPE_SALES"};
	
	var url = Globals.baseActionUrl.SELECT_OPERATION_URL;
	var grid = mini.get("sales_grid");
	grid.setUrl(url);
	grid.load(param);

}

/**
 * 增加店员分组下的店员
 */
function addDy(){
	var rows = mini.get("sales_grid").getSelecteds();
	
	if(rows.length == 0){
		showErrorMessageAlter("请至少选择一行!");
		return;
	}
	
	var ids = new Array();
	for(var i = 0;i < rows.length;i++){
		ids[i] = rows[i].SALES_ID;
	}
	
	var addObj = new Object();
	addObj["service_name"] = JsVar["data"]["service_name"];
	addObj["oper_flag"] = 'A';
	addObj["SALES_ID"] = ids;
	addObj["REF_DEM_TYPE_ID"] = JsVar["data"]["REF_DEM_TYPE_ID"];
	
	getJsonDataByPost(Globals.baseActionUrl.ACTION_OPERATION_URL,addObj,"增加店员分组下的店员",
	        function(result){
				addObj["success"] = result.success;
				addObj["errormsg"] = result.errormsg;
		        closeWindow(addObj);
	        });
}

