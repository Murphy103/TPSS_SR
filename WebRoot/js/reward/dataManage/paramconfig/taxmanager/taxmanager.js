	
var nowurl  = document.location.href;
nowurl = nowurl.substring(0,nowurl.indexOf("html"));
$(function(){
	mini.parse();
	var grid = mini.get("taxmanager_datagrid");
	initTableHead(grid,"TAX_MANAGER_QUERY_PAGE",true);
//	queryDataForInput(privilege,url,"CHL_TREE");
	var url = nowurl+'ControlServlet.do?serviceName=commonServlet&methodName=getTreeSelect&service_name=CHL_TREE';
	var privilege = mini.get("PRIVILEGE");
	privilege.load(url);
	var url = nowurl+'ControlServlet.do?serviceName=commonServlet&methodName=gridValue&service_name=SEL_DETAIL_AGENT';
	var pay_agent_name = mini.get("PAY_AGENT_NAME");
	pay_agent_name.load(url);

})


function query(){
mini.parse();
var grid = mini.get("taxmanager_datagrid");
var param = {
		 "PAY_AGENT_NAME":mini.get("PAY_AGENT_NAME").getValue(),
		 "PRIVILEGE":mini.get("PRIVILEGE").getValue(),
		 "service_name":"TAX_RATE_Q"
		};
var url = nowurl+'ControlServlet.do?serviceName=commonServlet&methodName=gridValue_rows';
	grid.setUrl(url);
	grid.load(param);
}

function add() {
	mini.parse();
	var grid = mini.get("taxmanager_datagrid");
	
	mini.open({
	    url: bootPATH + "../../html/reward/dataManage/paramconfig/taxmanager/taxmanager-add.html",
	    title: "新增", width: 450, height: 450,
	    onload: function () {
	        var iframe = this.getIFrameEl();
	        var data = { action: "new"};
	        iframe.contentWindow.SetData(data);
	    },
	    ondestroy: function (action) {
	    	query();
	    }
	});

}

function modify() {
	mini.parse();
	var grid = mini.get("taxmanager_datagrid");
	var rows = grid.getSelecteds();
	if(rows.length == 1){
	mini.open({
	    url: bootPATH + "../../html/reward/dataManage/paramconfig/taxmanager/taxmanager-modify.html",
	    title: "修改", width: 450, height: 450,
	    onload: function () {
	        var iframe = this.getIFrameEl();
	        var data = { action: "modify",
	        		TAX_RATE:rows[0].TAX_RATE,
	        		TAX_RATE_ID:rows[0].TAX_RATE_ID,
	        		EFF_DATE:rows[0].EFF_DATE,
	        		EXP_DATE:rows[0].EXP_DATE,
	        		PAY_AGENT_NAME:rows[0].PAY_AGENT_NAME,
	        		PRIVILEGE:rows[0].SUB_CHNL_DESC,
	        		PAY_AGENT_NAME:rows[0].PAY_AGENT_NAME
	        }
	        iframe.contentWindow.SetData(data);
	    },
	    ondestroy: function (action) {
	        grid.reload();
	    }
	});
	}else{
		mini.alert("请选中一项");
	}

}

function del() {
	mini.parse();
	var grid = mini.get("taxmanager_datagrid");
	var rows = grid.getSelecteds();
	//console.log(rows);
    if (rows.length>0) {
    	mini.confirm("确定删除记录？", "确定？",
                function (action) {
                    if (action == "ok") {
                        var data = new Object();
                        var str = '';
                        for (var i = 0, l = rows.length; i < l; i++) {
                            var r = rows[i];
                            if(rows.length==1){
                            	str=''+r.TAX_RATE_ID;
                            }else{
	                            if(i<rows.length-1){
	                            str = ''+str+r.TAX_RATE_ID+',';
	                            }else{
	                            	if(rows.length>0){
	                            		str = ''+str+r.TAX_RATE_ID;
	                            	}
	                            }
                            }
                        }
                        data.TAX_RATE_ID = str
                        data.service_name = "TAX_RATE_D"
        		         $.jsonAjax("commonServlet", "commonDeleteData", data, function(data) {
        		        	data.service_name = "TAX_RATE_D"
        		        	mini.alert(data.data,"删除",query);
        		    	});
                    } else {
                        window.close();
                    }
                }
            );
    } else {
        mini.alert("请选中一条记录");
        }
 }


	