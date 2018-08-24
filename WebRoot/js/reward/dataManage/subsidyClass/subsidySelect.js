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
 * 查询补贴分类
 */
function query(){
	mini.parse();
	var param = {"PRE_RULE_NAME":mini.get("SUBSIDY_NAME").getValue(),
				 "REF_DEM_TYPE_ID":JsVar["data"]["REF_DEM_TYPE_ID"],
				 "service_name":"REF_DEM_TYPE_PRE"};
	
	var url = Globals.baseActionUrl.SELECT_OPERATION_URL;
	var grid = mini.get("pre_grid");
	grid.setUrl(url);
	grid.load(param);

}

/**
 * 增加补贴分类下的补贴
 */
function addSubsidy(){
	var rows = mini.get("pre_grid").getSelecteds();
	
	if(rows.length == 0){
		showErrorMessageAlter("请至少选择一行!");
		return;
	}
	
	var ids = new Array();
	for(var i = 0;i < rows.length;i++){
		ids[i] = rows[i].PRE_RULE_ID;
	}
	
	var addObj = new Object();
	addObj["service_name"] = JsVar["data"]["service_name"];
	addObj["oper_flag"] = 'A';
	addObj["PRE_RULE_ID"] = ids;
	addObj["REF_DEM_TYPE_ID"] = JsVar["data"]["REF_DEM_TYPE_ID"];
	
	getJsonDataByPost(Globals.baseActionUrl.ACTION_OPERATION_URL,addObj,"增加补贴分类下的补贴",
	        function(result){
				addObj["success"] = result.success;
				addObj["errormsg"] = result.errormsg;
		        closeWindow(addObj);
	        });
}

