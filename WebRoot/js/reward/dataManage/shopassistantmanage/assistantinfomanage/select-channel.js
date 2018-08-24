var nowurl  = document.location.href;
nowurl = nowurl.substring(0,nowurl.indexOf("html"));

function GetQueryString(name){
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}

//代理商id
var agentId=GetQueryString("agentId");

var JsVar = new Object();
$(function(){
	initTableHead("agent_grid","CHANNEL",true);
	JsVar["grid"] = mini.get("agent_grid");
	
	queryData();
});
function queryData(){
	mini.parse();
	var param = {"agentId":agentId,
				 "channel_nbr":mini.get("channel_code").getValue(),
				 "channel_name":mini.get("channel_name").getValue(),
				 "service_name":"CHANNEL"};
	var url=Globals.baseActionUrl.SELECT_OPERATION_URL;
	var grid = mini.get("agent_grid");
	grid.setUrl(url);
	grid.load(param);

}

function exportData(){
	var params=new Object();
    params["service_name"] = "AGENT";
	params["file_name"] = "agent";
	params["PRIVILEGE"] = mini.get("channel").getValue();
	params["OPERATORS_NBR"] = mini.get("agent_code").getValue();
	params["OPERATORS_NAME"] = mini.get("agent_name").getValue();
	
	exportExcel(params);
}

/**
 * 获取参考值下拉选数据
 */
function getReferTypeComboxData(){
	var url=Globals.baseActionUrl.COMBOBOX_URL;
	var data={sqlcode:"REFER_TYPE"};
	var logName="参考值下拉";
	getJsonDataByPost(url,data,logName,
			function(result){
		var jsonData=result.data;
				if(jsonData.length>0){
					JsVar["refer_type"].setData(jsonData);
					JsVar["refer_type"].select(0);
					queryData();
				}
		});
}

function onLoadComplete(action,data) {
    JsVar[systemVar.ACTION] = action;
    if (action == systemVar.EDIT) {
        initData(data);
    }
}

//取消
function cancel(){
	window.CloseOwnerWindow();
}

//确定
function onSubmit(){
var rows = mini.get("agent_grid").getSelecteds();
	
	if(rows.length == 0){
		showErrorMessageAlter("请至少选择一行!");
		return;
	}
	var channelCode="";
	var channelName="";
	for(var i=0;i<rows.length;i++){
		channelCode+="'"+rows[i].CHANNEL_NBR+"',";
		channelName+=rows[i].CHANNEL_NAME+",";
	}
	channelCode=channelCode.substring(0,channelCode.length-1);
	channelName=channelName.substring(0,channelName.length-1);
	var data=new Object();
	data.channelCode=channelCode;
	data.channelName=channelName;
	closeWindow(data);
}

