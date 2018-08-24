var JsVar = new Object();

//初始化
$(document).ready(function() {
	mini.parse();
	//生成datagrid的field
	initTableHead("terminal_grid","TERMINAL_QUERY",true);
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
 * 查询终端
 */
function query(){
	mini.parse();
	var param = {"MKT_NAME":mini.get("MKT_NAME").getValue(),
				 "REF_DEM_TYPE_ID":JsVar["data"]["REF_DEM_TYPE_ID"],
				 "service_name":"TERMINAL_QUERY"};
	
	var url = Globals.baseActionUrl.SELECT_OPERATION_URL;
	var grid = mini.get("terminal_grid");
	grid.setUrl(url);
	grid.load(param);

}

/**
 * 增加终端分类下的终端
 */
function addTerminal(){
	var rows = mini.get("terminal_grid").getSelecteds();
	
	if(rows.length == 0){
		showErrorMessageAlter("请至少选择一行!");
		return;
	}
	
	var ids = "";
	for(var i = 0;i < rows.length;i++){
		ids += rows[i].MKT_ID + ",";
	}
	ids = ids.substring(0,ids.length-1);
	var addObj = new Object();
	addObj["service_name"] = JsVar["data"]["service_name"];
	addObj["oper_flag"] = 'A';
	addObj["MKT_ID"] = ids;
	addObj["REF_DEM_TYPE_ID"] = JsVar["data"]["REF_DEM_TYPE_ID"];
	
	getJsonDataByPost(Globals.baseActionUrl.ACTION_OPERATION_URL,addObj,"增加终端分类下的终端",
	        function(result){
				addObj["success"] = result.success;
				addObj["errormsg"] = result.errormsg;
		        closeWindow(addObj);
	        });
}

