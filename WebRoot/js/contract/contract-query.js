var nowurl  = document.location.href;
nowurl = nowurl.substring(0,nowurl.indexOf("html"));
function query(){
	var param = {"sV1":$("#manu_name").val(),
				 "sV2":$("#attr_dept").val(),
				 "sV3":$("#create_per").val(),
				 "sV4":$("#account_no").val(),
				 "sV5":$("#account_name").val(),
				 "sV6":$("#acc_manager").val(),
				 "service_name":"TCSS_QUERY_DATE_PAGE"};
	console.log(param);
	//http://localhost:8080/TPSS_SR/ControlServlet.do?serviceName=commonServlet&methodName=gridValue_rows
	var url = nowurl+'ControlServlet.do?serviceName=commonServlet&methodName=gridValue_rows';
	//$("#account_grid").attr("url");
//	var url = document.getElementById("account_grid").url;
//	alert(url);
	mini.parse();
	var grid = mini.get("account_grid");
	grid.load(param);

}