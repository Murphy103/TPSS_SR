var nowurl  = document.location.href;
nowurl = nowurl.substring(0,nowurl.indexOf("html"));
var JsVar = new Object();
$(function(){
	var screenheight=screen.availHeight;
	var styleElement = document.getElementById('reward_grid');
	styleElement.style.height = screenheight*0.65+'px';
	
	 mini.parse();
	initTableHead("reward_grid","REWARD_QUERY",true);
	JsVar["queryFrom"] = new mini.Form("queryFrom");
	JsVar["reward_grid"] = mini.get("reward_grid");//取得事件表格
	var url = nowurl+'ControlServlet.do?serviceName=commonServlet&methodName=getTreeSelect&service_name=CHL_TREE';
	var privilege = mini.get("PRIVILEGE");
	privilege.load(url);
	
	var date = new Date();
	var nowDay=date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();;//今天
	var firstDay=date.getFullYear()+"-"+(date.getMonth()+1)+"-1";//本月第一天
	mini.get("#EFF_DATE").setValue(firstDay+" 00:00:00");
	mini.get("#EXP_DATE").setValue(nowDay+" 00:00:00");
	
/*	//网点用户，门店名称是确定的
	if(mini.get("agent_id").getValue() !=null 
		&& mini.get("agent_id").getValue() !='' 
		&& mini.get("agent_id").getValue() !='${empee1.agent_id}'
	  ){
//		mini.get("#STORE_NAME").setValue("门店11");
		mini.get("#STORE_NAME").setValue(mini.get("agent_name").getValue());
		mini.get("#STORE_NAME").setEnabled(false);
//		mini.get("#LATN_ID").setValue(52);
		mini.get("#LATN_ID").setValue(mini.get("agent_latnid").getValue());
		mini.get("#LATN_ID").setEnabled(false);
	}*/
	
});


function queryData(){
	JsVar["queryFrom"].validate();
    if (JsVar["queryFrom"].isValid() == false){
        return;
    }
	mini.parse();
	var param = {"PRIVILEGE":mini.get("PRIVILEGE").getValue(),
				 "ORDER_ID":mini.get("ORDER_ID").getValue(),
				 "YZF_ACCT":mini.get("YZF_ACCT").getValue(),
				 "CHANNEL_NAME":mini.get("CHANNEL_NAME").getValue(),
				 "EFF_DATE":mini.get("EFF_DATE").getText(),
				 "EXP_DATE":mini.get("EXP_DATE").getText(),
				 "service_name":"SALE_REWARD_DETAIL"};
//	console.log(param);
	var url = nowurl+'ControlServlet.do?serviceName=commonServlet&methodName=gridValue_rows';
	var grid = mini.get("reward_grid");
	grid.setUrl(url);
	grid.load(param);

}

function exportData(){
	JsVar["queryFrom"].validate();
    if (JsVar["queryFrom"].isValid() == false){
        return;
    }
	mini.parse();
	
	var params = {
				"PRIVILEGE":mini.get("PRIVILEGE").getValue(),
				 "ORDER_ID":mini.get("ORDER_ID").getValue(),
				 "YZF_ACCT":mini.get("YZF_ACCT").getValue(),
				 "CHANNEL_NAME":mini.get("CHANNEL_NAME").getValue(),
				 "EFF_DATE":mini.get("EFF_DATE").getText(),
				 "EXP_DATE":mini.get("EXP_DATE").getText(),
			      "service_name":"REWARD_QUERY",
			      "file_name":"奖励查询"
			     };	
	exportExcel(params);
}
