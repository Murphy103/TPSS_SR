var JsVar = new Object();

//初始化
$(document).ready(function() {
	mini.parse();
	initTableHead("rule_grid","RULE_SELECT",true);
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
 * 查询规则
 */
function query(){
	mini.parse();
	var param = {"OFFER_NAME":mini.get("OFFER_NAME").getValue(),
				 "PAY_ACCT_ID":JsVar["data"]["PAY_ACCT_ID"],
				 "service_name":"PAY_ACCT_RULE_DETAIL"};
	
	var url = Globals.baseActionUrl.SELECT_OPERATION_URL;
	var grid = mini.get("rule_grid");
	grid.setUrl(url);
	grid.load(param);

}

/**
 * 增加规则
 */
function submit(){
	var rows = mini.get("rule_grid").getSelecteds();
	
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
	addObj["PAY_ACCT_ID"] = JsVar["data"]["PAY_ACCT_ID"];
	
	getJsonDataByPost(Globals.baseActionUrl.ACTION_OPERATION_URL,addObj,"增加套餐分类下的套餐",
	        function(result){
				addObj["success"] = result.success;
				addObj["errormsg"] = result.errormsg;
		        closeWindow(addObj);
	        });
}

