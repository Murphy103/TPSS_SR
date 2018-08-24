var nowurl  = document.location.href;
nowurl = nowurl.substring(0,nowurl.indexOf("html"));
var JsVar = new Object();
$(function(){
	var screenheight=screen.availHeight;
	var styleElement = document.getElementById('event_grid');
	styleElement.style.height = screenheight*0.65+'px';
	initTableHead("event_grid","EVENT_ALLOCATION",true);
	JsVar["eventGrid"] = mini.get("event_grid");//取得事件表格
	queryData();
});
function queryData(){
	mini.parse();
	var param = {"event_name":mini.get("event_name").getValue(),
				 "event_code":mini.get("event_code").getValue(),
				 "service_name":"PRICING_EVENT_TYPE"};
//	console.log(param);
	var url = nowurl+'ControlServlet.do?serviceName=commonServlet&methodName=gridValue_rows';
	var grid = mini.get("event_grid");
	grid.setUrl(url);
	grid.load(param);

}
/**
 * 新增
 */
function add() {
	var url=bootPATH + "../../html/reward/configManage/ruleManager/event-add.html";
	showAddDialog("新增事件",690,350,url,
	        function destroy(data){
	            if (data == systemVar.SUCCESS) {
	                JsVar["eventGrid"].reload();
	                showMessageAlter("新增事件成功");
	            }
	    });
}

/**
 * 修改
 * 只修改一条记录
 */
function modify(){
	 var grid = mini.get("event_grid");
	 var rows = grid.getSelecteds();
	 if(rows.length !=1){
		 showWarnMessageAlter("请选择一条记录"); 
		 return;
	 }else{
		 var row = grid.getSelected();//选中的行数据
		 var url=bootPATH + "../../html/reward/configManage/ruleManager/event-add.html";
		 showEditDialog("修改事件",690,350,url,
			        function destroy(data){
			            if (data == systemVar.SUCCESS) {
			                JsVar["eventGrid"].reload();
			                showMessageAlter("修改事件成功!");
			            }
			    },row);
	 }
}

/**
 * 删除
 * 可以删除多条记录
 */
function del(){
	var grid = mini.get("event_grid");
	var rows = grid.getSelecteds();
	if(rows.length ==0){
		 showWarnMessageAlter("请选择需要删除的事件!"); 
		 return;
	 }else{
		 var allId= new Array();
		 for(var i=0;i<rows.length;i++){
			 allId.push(rows[i].EVENT_TYPE_ID);
		 }
//		 alert(JSON.stringify(allId));//[{"EVENT_TYPE_ID":12},{"EVENT_TYPE_ID":999}]
		 var url=nowurl+'ControlServlet.do?serviceName=commonServlet&methodName=deleteData&flag=EVENT_CHECK&sqlCode=EVENT_ALLOCATION_D';
		 showConfirmMessageAlter("确定删除记录?",function ok(){
				getJsonDataByPost(url,allId,"删除事件",
		                function(result){
							if(result.success != undefined && result.success=='success'){
								JsVar["eventGrid"].reload();
			                    showMessageAlter("删除事件成功!");
							}else if(result.success != undefined && result.success=='fail'){
								showMessageAlter(result.errormsg);
							}else{
								showMessageAlter("删除失败!");
							}
							
		                },"");
			});
	 }
}