var nowurl  = document.location.href;
nowurl = nowurl.substring(0,nowurl.indexOf("html"));

function GetQueryString(name){
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}

//主页面渠道大小类
var channelCode=GetQueryString("channelCode");

var JsVar = new Object();
$(function(){
	initTableHead("agent_grid","AGENT",true);
	JsVar["grid"] = mini.get("agent_grid");
	
	var url = nowurl+'ControlServlet.do?serviceName=commonServlet&methodName=getTreeSelect&service_name=CHL_TREE';
	var channel = mini.get("channel");
	channel.load(url);
	
	if(channelCode !='' && channelCode !=null){
		mini.get("channel").setValue(channelCode);
	}
	
	queryData();
});
function queryData(){
	mini.parse();
	var param = {"PRIVILEGE":mini.get("channel").getValue(),
				 "OPERATORS_NBR":mini.get("agent_code").getValue(),
				 "OPERATORS_NAME":mini.get("agent_name").getValue(),
				 "service_name":"AGENT"};
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
	var agentCode="";
	var agentName="";
	var agentId="";
	for(var i=0;i<rows.length;i++){
		agentCode+="'"+rows[i].OPERATORS_NBR+"',";
		agentName+=rows[i].OPERATORS_NAME+",";
		agentId+=rows[i].OPERATORS_ID+",";
	}
	agentCode=agentCode.substring(0,agentCode.length-1);
	agentName=agentName.substring(0,agentName.length-1);
	agentId=agentId.substring(0,agentId.length-1);
	var data=new Object();
	data.agentCode=agentCode;
	data.agentName=agentName;
	data.agentId=agentId;
	closeWindow(data);
}

