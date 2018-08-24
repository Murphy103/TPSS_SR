var nowurl  = document.location.href;
nowurl = nowurl.substring(0,nowurl.indexOf("html"));
var JsVar = new Object();
var selectNode = new Object();
$(function(){
	mini.parse();
	JsVar["div"] = mini.get('dynamicDiv');
	JsVar["div"].hide();
	JsVar["event-tree"] = mini.get("event-tree");//事件树
	JsVar["event_model"] = mini.get("event_model");//事件类型
	JsVar["condition"] = mini.get("condition");//事件类型
	JsVar["condition-config"] = new mini.Form("#condition-config");
	JsVar["grid1"] = new mini.Form("#grid1");
	
	
	query();
	getEventModelComboboxData();
	getConditionComboboxData();
	
	JsVar["event-tree"].on("nodeselect", function (e) {
		selectNode=e.node;
		JsVar[systemVar.ACTION]='edit';
		var info={parant_id:e.node.UP_RULE_TREE_ID,
				  condition_explain:e.node.RULE_TREE_NAME,
				  event_model:e.node.EVENT_TYPE_ID,
				  condition_start:e.node.LEFT_FORMULA,
				  condition:e.node.OPT,
				  condition_end:e.node.RIGHT_FORMULA
				 };
		//初始化节点信息
		JsVar["condition-config"].setData(info);
		//初始化条件查询，展示本节点以及所有父节点
		var url=nowurl+'ControlServlet.do?serviceName=commonServlet&methodName=gridValue';
		var logName="事件类型";
		
		var param = {sqlcode:"LIST_PRICING_EVENT_TREE",
				rule_tree_id:selectNode.RULE_TREE_ID,
					 "service_name":"LIST_PRICING_EVENT_TREE"};
//		console.log(param);
		var grid = mini.get("grid1");
		grid.setUrl(url);
		grid.load(param);
		JsVar["div"].show();
    });
	
});

/**
 * 事件类型下拉
 */
function getEventModelComboboxData(){
	var url=nowurl+'ControlServlet.do?serviceName=commonServlet&methodName=combList';
	var data={sqlcode:"COM_PRICING_EVENT_TYPE",sV1:1,sV2:2};
	var logName="事件类型";
	getJsonDataByPost(url,data,logName,
			function(result){
		var jsonData=result.data;
				if(jsonData.length>0){
					netElementData=jsonData;
					JsVar["event_model"].setData(netElementData);
				}
		});
}

/**
 * 比较条件下拉
 */
function getConditionComboboxData(){
	var url=nowurl+'ControlServlet.do?serviceName=commonServlet&methodName=combList';
	var data={sqlcode:"COMPARE_CONDITION",sV1:1,sV2:2};
	var logName="比较条件下拉";
	getJsonDataByPost(url,data,logName,
			function(result){
		var jsonData=result.data;
				if(jsonData.length>0){
					netElementData=jsonData;
					JsVar["condition"].setData(netElementData);
				}
		});
}

/**
 * 加载目录树
 */
function query(){
	var url=nowurl+'ControlServlet.do?serviceName=commonServlet&methodName=getTreeData&sqlCode=PRICING_EVENT_TREE';
	var params={"sqlcode":"PRICING_EVENT_TREE",
				"rule_tree_name":mini.get("search-condition").getValue()
				};
	treeLoad(JsVar["event-tree"],"",params,url);
	
}

/**
 * 展开
 */
function spread(){
	var node=JsVar["event-tree"].getSelectedNode();
	if(node==null){
		JsVar["event-tree"].expandAll();//默认展开所有节点
	}else{
		JsVar["event-tree"].expandNode(node);
	}
}

function del(){
	var node=JsVar["event-tree"].getSelectedNode();
	if(node==null){
		showWarnMessageAlter("请选择需要删除的事件!");
	}else{
		if('Y'==node.IS_LEAF){
			var url=nowurl+'ControlServlet.do?serviceName=commonServlet&methodName=deleteData&sqlCode=PRICING_EVENT_TREE_D';
			 var allId= new Array();
			 allId.push(node.RULE_TREE_ID);
			 showConfirmMessageAlter("确定删除记录?",function ok(){
					getJsonDataByPost(url,allId,"删除事件",
			                function(result){
								if(result.success != undefined && result.success=='success'){
				                    showMessageAlter("删除事件成功!");
				                    query();
						    		JsVar["event-tree"].expandAll();
						    		JsVar["event-tree"].selectNode(selectNode);
						    		spread();
						    		JsVar["div"].hide();
								}else if(result.success != undefined && result.success=='fail'){
									showMessageAlter(result.errormsg);
								}else{
									showMessageAlter("删除失败!");
								}
								
			                },"");
				});
		}else{
			showWarnMessageAlter("该节点下还有子节点，请先删除子节点!");
		}
//		var id=node.RULE_TREE_ID;
//		selectNode=node;
//		JsVar["div"].show();
//		var newTree={parant_id:id};
//		JsVar["condition-config"].setData(newTree);
//		JsVar[systemVar.ACTION]='add';
	}
}

function add(){
	var node=JsVar["event-tree"].getSelectedNode();
	if(node==null){
		showWarnMessageAlter("请选择一个节点!");
	}else{
		var id=node.RULE_TREE_ID;
		selectNode=node;
		JsVar["div"].show();
//		mini.get("parant_id").setValue(id);
		var newTree={parant_id:id};
		JsVar["condition-config"].setData(newTree);
		JsVar[systemVar.ACTION]='add';
	}
}

function onSubmit() {
    if (JsVar[systemVar.ACTION] == systemVar.EDIT) {
        update();
    } else {
        save();
    }
}

function save(){
	JsVar["condition-config"].validate();
    if (JsVar["condition-config"].isValid() == false){
        return;
    }
    var conditionInfo = JsVar["condition-config"].getData();
    var url=nowurl+'ControlServlet.do?serviceName=commonServlet&methodName=insertData&sqlCode=PRICING_EVENT_TREE_A';
    getJsonDataByPost(url,conditionInfo,"新增事件",
            function (result){
		    	if(result.success != undefined && result.success=='success'){
		    		showMessageAlter("新增成功!");
		    		query();
		    		JsVar["event-tree"].expandAll();
		    		JsVar["event-tree"].selectNode(selectNode);
		    		spread();
//		    		JsVar["condition-config"].setData(conditionInfo);
		    		JsVar["div"].hide();
				}else if(result.success != undefined && result.success=='fail'){
					showMessageAlter(result.errormsg);
				}else{
					showMessageAlter("新增失败!");
				}
            });
}

function update(){
	JsVar["condition-config"].validate();
    if (JsVar["condition-config"].isValid() == false){
        return;
    }
    var conditionInfo = JsVar["condition-config"].getData();
    conditionInfo["RULE_TREE_ID"]=selectNode.RULE_TREE_ID;
    var url=nowurl+'ControlServlet.do?serviceName=commonServlet&methodName=updateData&sqlCode=PRICING_EVENT_TREE_U';
    getJsonDataByPost(url,conditionInfo,"修改事件",
            function (result){
		    	if(result.success != undefined && result.success=='success'){
		    		showMessageAlter("修改成功!");
		    		query();
		    		JsVar["event-tree"].expandAll();
		    		
//		    		spread();
		    		JsVar["condition-config"].setData(conditionInfo);
		    		mini.get("grid1").reload();
//		    		JsVar["div"].hide();
//		    		JsVar["event-tree"].selectNode(selectNode);
				}else if(result.success != undefined && result.success=='fail'){
					showMessageAlter(result.errormsg);
				}else{
					showMessageAlter("修改失败!");
				}
            });
}

/**
 * 节点单击事件
 */
function nodeClickEvent(){
	alert("aaaz");
}


var treeData=[
              {id: "base", text: "Base", expanded: false,
                  children: [
                      {id: "ajax", text: "Ajax"},
                      {id: "json", text: "JSON"},
                      {id: "date", text: "Date"},
                      {id: "control", text: "Control"},
                      {id: "messagebox", text: "MessageBox"},
                      {id: "window", text: "Window"}
                  ]
              }
          ]
