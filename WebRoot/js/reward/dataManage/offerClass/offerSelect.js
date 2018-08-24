var JsVar = new Object();

//初始化
$(document).ready(function() {
	mini.parse();
	//生成datagrid的field
	initTableHead("offer_grid","OFFER_QUERY",true);
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
 * 查询套餐
 */
function query(){
	mini.parse();
	var param = {"OFFER_NAME":mini.get("OFFER_NAME").getValue(),
				 "REF_DEM_TYPE_ID":JsVar["data"]["REF_DEM_TYPE_ID"],
				 "service_name":"OFFER_QUERY"};
	
	var url = Globals.baseActionUrl.SELECT_OPERATION_URL;
	var grid = mini.get("offer_grid");
	grid.setUrl(url);
	grid.load(param);

}

/**
 * 增加套餐分类下的套餐
 */
function addOffer(){
	var rows = mini.get("offer_grid").getSelecteds();
	
	if(rows.length == 0){
		showErrorMessageAlter("请至少选择一行!");
		return;
	}
	
	var ids = "";
	for(var i = 0;i < rows.length;i++){
		ids += rows[i].OFFER_ID + ",";
	}
	ids = ids.substring(0,ids.length-1);
	
	var addObj = new Object();
	addObj["service_name"] = JsVar["data"]["service_name"];
	addObj["oper_flag"] = 'A';
	addObj["OFR_ID"] = ids;
	addObj["REF_DEM_TYPE_ID"] = JsVar["data"]["REF_DEM_TYPE_ID"];
	
	getJsonDataByPost(Globals.baseActionUrl.ACTION_OPERATION_URL,addObj,"增加套餐分类下的套餐",
	        function(result){
				addObj["success"] = result.success;
				addObj["errormsg"] = result.errormsg;
		        closeWindow(addObj);
	        });
}

