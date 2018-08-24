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
 * 查询
 */
function query(){
	mini.parse();
	var param = {"RULE_NAME":mini.get("RULE_NAME").getValue(),
				 "service_name":"PAY_AGENT_INS_RULE_DETAIL_Q"};
	
	var url = Globals.baseActionUrl.SELECT_OPERATION_URL;
	var grid = mini.get("rewardrule_grid");
	grid.setUrl(url);
	grid.load(param);

}

/**
 * 增加奖励规则
 */
function addRule(){
var rows = mini.get("rewardrule_grid").getSelecteds();
	
	if(rows.length == 0){
		showErrorMessageAlter("请至少选择一行!");
		return;
	}
	
	var ids = "";
	var offer_names="";
	for(var i = 0;i < rows.length;i++){
		ids += rows[i].OFFER_ID + ",";
		offer_names+= rows[i].OFFER_NAME + ",";
	}
	ids = ids.substring(0,ids.length-1);
	offer_names=offer_names.substring(0,offer_names.length-1);
	var addObj=new Object();
	addObj["OFFER_ID"]=ids;
	addObj["OFFER_NAME"]=offer_names;
	addObj["success"]="success";
	addObj["errormsg"]="fail";
	closeWindow(addObj);
	
	
}