var redisurl="http://192.168.128.133:18087/api/proxy/list";

var nowurl=document.location.href;
nowurl=nowurl.substring(0,nowurl.indexOf("html"));


$(document).ready(function(){
	
 });



function selectComboxInfo_bmuti( param, compId,hasFirstItem,defaultValue){

	$.jsonAjax("commonServlet","combList" ,param, function(data) {
		var list = data.data;
		$("#"+compId).html("");  
        for (var i = 0; i < list.length; i++) {  
            $("#"+compId).append("<option value='" + list[i].V1 + "'>" + list[i].V2 + "</option>");  
        }  
        
        $("#"+compId).multiselect("destroy").multiselect({  
            // 自定义参数，按自己需求定义  
            nonSelectedText : '--请选择--',   
            maxHeight : 350,   
            //buttonWidth: '190px',
            includeSelectAllOption : true,   
            numberDisplayed : 3 
        });  
		 
		$("#" + compId).append(opt.join(''));
		$("#" + compId).val(defaultValue);
	});
	   
}

//---分组下拉框--
function selectComboxInfo_bmutigroup( param, compId,hasFirstItem,defaultValue){

	$.jsonAjax("commonServlet","combList" ,param, function(data) {
		var list = data.data;
		$("#"+compId).html("");  
		var level="";
		if (list != null && list != "") {
			 level=list[0].V3;
          for (var i = 0; i < list.length; i++) {  
        	 var curlevel=list[i].V3;
        	 
        	  if(i==0)
    		  {
    		   $("#"+compId).append(" <optgroup label="+list[i].V2+">");  
    		   }
        	  else  
        	  {
        		 if(level==curlevel)
        			 {
        			    $("#"+compId).append("<option value='" + list[i].V1 + "'>" + list[i].V2 + "</option>");  
        			 }else
        			 {
        				 if(i==list.length-1)
        					 {
        					 $("#"+compId).append("<option value='" + list[i].V1 + "'>" + list[i].V2 + "</option>");
        					 $("#"+compId).append("</optgroup>");  
        					 }else
        					 {
        				    level=curlevel;
        				    $("#"+compId).append("</optgroup>");  
        				    $("#"+compId).append(" <optgroup label="+list[i].V2+">");  
        						 }
        			 }
        	   }
        }  
		}
        
        $("#"+compId).multiselect("destroy").multiselect({  
            // 自定义参数，按自己需求定义  
            nonSelectedText : '--请选择--',   
            maxHeight : 350,   
           // buttonWidth: '190px',
            includeSelectAllOption : true,   
            numberDisplayed : 3  
        });  
		 
		$("#" + compId).val(defaultValue);
	});
	   
}


function selectComboxInfo_bmutigroup_1( param, compId,hasFirstItem,defaultValue,firstLevel, callBack){

	var initValue = "";
	$.jsonAjax("commonServlet","combList" ,param, function(data) {
		var list = data.data;
		$("#"+compId).html("");  
		if (list != null && list != "") {
			 for(var i = 0; i < list.length;i++){
				 if(list[i].V3 == firstLevel){
					 var level=list[i].V1;
					 $("#"+compId).append("<optgroup label="+list[i].V2+">");
					 for(var j=0;j<list.length;j++){
						 var curlevel = list[j].V3
						 if(level == curlevel){
							 $("#"+compId).append("<option value='" + list[j].V1 + "'>" + list[j].V2 + "</option>")
							 initValue = initValue+','+list[j].V1
						 }else{
							 if(j == list.length - 1){
								 $("#"+compId).append("</optgroup>")
							 }
							 continue;
						 }
					 }
				 }else{
					 continue;
				 }
			 }
		}
        
        $("#"+compId).multiselect("destroy").multiselect({  
            // 自定义参数，按自己需求定义  
            nonSelectedText : '--请选择--',   
            maxHeight : 350,   
            buttonWidth: '200px',
            includeSelectAllOption : true,   
            numberDisplayed : 3 
        });
        if(defaultValue != null && defaultValue != ""){
        	var selects = defaultValue.split(",");
        	$("#"+compId).multiselect('select', selects);
        }
        
        if (callBack){
    		callBack(initValue);
    	}
	});

}



function selectComboxInfo( param, compId,hasFirstItem,defaultValue){


	
	$.jsonAjax("commonServlet", "combList", param, function(data) {
		
		var list = data.data;
		  
		var opt = [];
		if (hasFirstItem) {
			opt = ["<option value=''>请选择</option>"];
		}
		$("#" + compId).empty();
		if (list != null && list != "") {
			for (var k = 0; k < list.length; k++) { 
				opt.push("<option value='" + list[k].V1
						+ "'> " + list[k].V2 + "</option>");
			}
		} 
		 
		$("#" + compId).append(opt.join(''));
		$("#" + compId).val(defaultValue);
	});
	   
}

function selectComboxInfoMuti( param, compId,hasFirstItem,defaultValue){

// 	if (!isHasDom(compId)) {
//		return;
//	}
	
	$.jsonAjax("commonServlet", "combList", param, function(data) {
		var list = data.data;
		  
		var opt = [];
		if (hasFirstItem) { 
			$("<option value=''>请选择</option>").appendTo("#"+compId); 

		}
		$("#" + compId).empty();
		
		
		  
		if (list != null && list != "") {
			
			if(defaultValue !=null){
			  var arr = defaultValue.split(',');
			  
			}
			
			for (var k = 0; k < list.length; k++) { 
				var find = false;
				if (defaultValue != null) {
					var arr = defaultValue.split(',');
					var i = 0; 
					for (i = 0; i < arr.length; i++) {
						if (arr[i] == list[k].V1) {
							find = true;
							break;
						}
					}
				}
				if(find){
					$("<option selected value='" + list[k].V1 + "'> " + list[k].V2 + "</option>").appendTo("#"+compId); 
				}else{
					$("<option value='" + list[k].V1 + "'> " + list[k].V2 + "</option>").appendTo("#"+compId); 
				}
				
			}
		} 
		$("#"+compId).attr("multiple",true);  
		$("#"+compId).chosen({allow_single_deselect:true}); 
		 
	});
	   
}
 
//下拉选择事件
function doSelClick(that, inputId, hideId, callBack)
{
	debugger;
	var selObj = $(that);
	var inputObj = $("#" + inputId);
	inputObj.val(selObj.attr("attr_name"));
	$("#" + hideId).val(selObj.attr("attr_code"));
	if (callBack)
	{
		callBack(selObj.attr("attr_id"),  selObj.attr("attr_code"), selObj.attr("attr_name"), inputId);
	}
	if (inputObj.attr("data-rule"))
	{
		inputObj.isValid();
	}
	selObj.parent().parent().parent().hide();
}



/**
 * 初始化下拉组件
 * infoContent : 下拉内容数据如：[
	                       {"ID":1, "NAME":"名1"},
	                       {"ID":2, "NAME":"名2"},
	                       {"ID":3, "NAME":"名3"}]
 * inputId : 输入框ID
 * hideId : 隐藏框ID
 * callBack: 选择内容后触发的回调方法 function(json){}
 * defValue : 默认选择值
 */
function initAutoCompSel(infoContent, inputId, hideId, callBack, defValue)
{
	var inputObj = $("#"+ inputId);
	var hideObj = $("#"+ hideId);
	//如果存在默认值
	if (defValue && defValue != "")
	{
		var ii = 0;
		while (ii < infoContent.length)
		{
			if (infoContent[ii].ID == defValue)
			{
				hideObj.val(defValue);
				inputObj.val(infoContent[ii].NAME);
				break;
			}
			ii++;
		}
	}
	
	//绑定向下箭头的单击事件
	inputObj.next().click(function(event)
	{
		inputObj.click();
		inputObj.focus().click();
	});
	
	//绑定回车
	inputObj.unbind("keydown").keydown(function(event) 
	{
		if (event.keyCode == '46') 
		{ 
			event.keyCode='13'; 
		}
	});
	var type = 0;
	var tempName = "";
	var viewWidth = inputObj.width() + 10;
	//清除下拉列表缓存
	inputObj.flushCache();
	inputObj.autocomplete(infoContent,
	{
		minChars:0,
		width:viewWidth, //下拉宽度
		matchContains:true,
		scrollHeight:150, //提示的高度，溢出显示滚动条
		scroll: true,     //滚动条
		mustMatch: false,
		selectFirst: true,
		formatItem: function(row, i, max) 
		{
			if ((inputObj.val() == row.NAME) && type == 0)
			{
				tempName = row.NAME;
				hideObj.val(row.ID);
				if (callBack)
				{
					callBack(row);
				}
				type = 1;
			}
			else if (type == 0)
			{
				tempName = "";
				hideObj.val("");
			}
			if (i == max)
			{
				type = 0;
			}
			return row.NAME;
		},
		formatMatch: function(row, i, max) {
			return row.NAME;
		},
		formatResult: function(row) {
			return row.NAME;
		}
	}).result(function(event, data, formatted){
			try{
				if(undefined != data.NAME && null != data.NAME){
					tempName = data.NAME;
					hideObj.val(data.ID);
				}else{
					tempName = "";
					hideObj.val("");
				}
				if (callBack){
					callBack(data);
				}
			}catch(e){
				hideObj.val("");
			}
	});
	//失去焦点时触发的事件
	inputObj.blur(function()
	{
		var val = this.value; 
		if (val == "")
		{
			hideObj.val("");
			tempName = "";
		}
		else if (hideObj.val() == "" || val != tempName)
		{
			inputObj.val("");
			hideObj.val("");
			tempName = "";
		}
	});
	//变更事件
	inputObj.keyup(function(event)
	{
		if(event.keyCode == "8" || event.keyCode == "46")    
		{
			return false;
		}
		var val = $.trim(this.value);
		if (val != "")
		{
			var tempVal, tempInfo;
			var eq = false;
			var onlyOne = true;
			tempVal = val.toUpperCase();
			for (var k = 0; k < infoContent.length; k++)
			{
				tempInfo = infoContent[k];
				if (tempInfo.NAME.indexOf(tempVal) > -1 && tempInfo.NAME.length > tempVal.length)
				{
					onlyOne = false;
				}
				if (tempInfo.NAME == tempVal)
				{
					eq = true;
				}
			}
			if(!eq || !onlyOne)
			{
				return false;
			}
			
			//根据名称进行拆分匹配Id
			for (var j = 0; j < infoContent.length; j++)
			{
				tempInfo = infoContent[j];
				if (tempInfo.NAME == tempVal)
				{
					try{
						if(undefined != tempInfo.NAME && null != tempInfo.NAME){
							tempName = tempInfo.NAME;
							hideObj.val(tempInfo.ID);
							inputObj.val(tempInfo.NAME);
						}else{
							tempName = "";
							hideObj.val("");
							inputObj.val("");
						}
						if (callBack){
							callBack(tempInfo);
						}
					}catch(e){
						hideObj.val("");
						inputObj.val("");
					}
					break;
				}
			}
		}
	});
}

/**
 * 初始化下拉组件
 * _url : 数据请求地址
 * _extraParams : 请求参数 如：{"findPath":"2", "serviceId":"100157"}
 * inputId : 输入框ID
 * hideId : 隐藏框ID
 * callBack: 选择内容后触发的回调方法 function(json){}
 */
function initAutoCompSel2(_url, _extraParams, inputId, hideId, callBack)
{
	var signszx = false;
	var inputObj = $("#"+ inputId);
	var hideObj = $("#"+ hideId);
		
	//绑定向下箭头的单击事件
	inputObj.next().click(function(event)
	{
		inputObj.click();
		inputObj.focus().click();
	});
	
	//绑定回车
	inputObj.unbind("keydown").keydown(function(event) 
	{
		if (event.keyCode == '46') 
		{ 
			event.keyCode='13'; 
		}
	});
	var type = 0;
	var tempName = "";
	var viewWidth = inputObj.width() + 10;
	//清除下拉列表缓存
	inputObj.flushCache();
	inputObj.autocomplete(_url,
	{
		minChars : 1,
		dataType : "json",
		extraParams : _extraParams,
		cacheLength : 0,
		parse : function(data) 
		{  
            var rows = [];  
            if (data != undefined)
            {
            	for(var i=0; i<data.length; i++)
            	{    
            		rows[rows.length] = {    
            				data:data[i],              	//下拉框显示数据格式   
            				value:data[i].ID,     		//选定后实际数据格式  
            				result:data[i].NAME   	//选定后输入框显示数据格式  
            		}; 
            	}
            }
            return rows;  
        }, 
		width:viewWidth, //下拉宽度
		matchContains:true,
		scrollHeight:150, //提示的高度，溢出显示滚动条
		scroll: true,     //滚动条
		mustMatch: false,
		selectFirst: true,
		formatItem: function(row, i, max) 
		{
			signszx = true;
			if ((inputObj.val() == row.NAME) && type == 0)
			{
				tempName = row.NAME;
				hideObj.val(row.ID);
				if (callBack)
				{
					callBack(row);
				}
				type = 1;
				if (inputObj.attr("aria-required"))
				{
					inputObj.isValid();
				}
			}
			else if (type == 0)
			{
				tempName = "";
				hideObj.val("");
			}
			if (i == max)
			{
				type = 0;
			}
			return row.NAME;
		},
		formatMatch: function(row, i, max) {
			return row.NAME;
		},
		formatResult: function(row) {
			return row.NAME;
		}
	}).result(function(event, data, formatted){
		try{
			signszx = true;
			if(undefined != data.NAME && null != data.NAME){
				tempName = data.NAME;
				hideObj.val(data.ID);
			}else{
				tempName = "";
				hideObj.val("");
			}
			if (callBack){
				callBack(data);
			}
			if (inputObj.attr("aria-required"))
			{
				inputObj.isValid();
			}
		}catch(e){
			hideObj.val("");
			if (inputObj.attr("aria-required"))
			{
				inputObj.isValid();
			}
		}
	});
	//失去焦点时触发的事件
	inputObj.blur(function()
	{
		var val = this.value;
		if (val == "")
		{
			hideObj.val("");
			tempName = "";
		}
		else if (hideObj.val() == "" || val != tempName)
		{
			inputObj.val("");
			hideObj.val("");
			tempName = "";
		}
		if(signszx)
		{
			if (inputObj.attr("aria-required"))
			{
				signszx = false;
				inputObj.isValid();
			}			
		}
	});
}

/**
 * 获取当前月的第一天
 */
function getCurrentMonthFirst(){
	var myDate = new Date();
    var year = myDate.getFullYear();
    var month = myDate.getMonth()+1;
    if (month<10){
        month = "0"+month;
    }
    var firstDay = year+"-"+month+"-01";
    return firstDay;
}

//取当前日期，格式为,yyyy-mm-dd
function getNowDate()
{
	var d,s;
  	d = new Date();
  	s = d.getFullYear() + "-";   //取年份
  	var month = d.getMonth()+1;	 //取月份
    if (month<10){
        month = "0"+month;
    }
  	s = s + month + "-";		
  	var day = d.getDate();		//取日期
  	if (day<10){
  		day = "0"+day;
    }
  	s += day;         	
  	return(s);  
}

(function ($) {
	
	//获取URL参数
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        //防止不同浏览器下出现乱码
        if (r != null) return decodeURIComponent(unescape(escape(r[2]))); return null;
    };
    //获取中文参数
    $.getUrlParamCN = function (name) {
    	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    	var r = window.location.search.substr(1).match(reg);
    	if (r != null) return decodeURI(unescape(r[2])); return null;
    };
    //设置中文参数
    $.setUrlParamCN = function(nameCN){
    	return encodeURI(encodeURI(nameCN));
    };
    /**
     * 获取按钮权限信息
     * privilege_code : 模块权限编码
     */
    $.getButtonPri = function (privilege_code)
    {
    	var priData = [];
    	var _data = {"findPath":"7", 	"privilege_code": privilege_code};
    	var _url = "/BillWeb/CommonServlet";
    	doPost(_url, _data, function(json)
    	{
    		priData = json.data.dataList;
    	}, false);
    	return priData;
    };
    //获取当前系统用户信息
    $.getUserInfo = function ()
    {
    	return top.indexMenu.userInfo;
    };
   
	$.extend({
		jsonAjax:function(serviceName,methodName,data,successfn,ajaxfun) {
			if(null==serviceName||""==serviceName){
				alert("serviceName不能为空……");
				return;
			}
			if(null==methodName||""==methodName){
				alert("methodName不能为空……");
				return;
			}
			ajaxfun=(null == ajaxfun||"" == ajaxfun)?{}:ajaxfun;
			ajaxfun.async = (ajaxfun.async == null || ajaxfun.async == "" || typeof (ajaxfun.async) == "undefined") ? "true" : ajaxfun.async;
			ajaxfun.type = (ajaxfun.type == null || ajaxfun.type == "" || typeof (ajaxfun.type) == "undefined") ? "post" : ajaxfun.type;
			$.ajax({
				type : ajaxfun.type,
				async : ajaxfun.async,
				data : {
					"data" : JSON.stringify(data)
				},
				url : nowurl+"ControlServlet.do?serviceName="+serviceName+"&methodName="+methodName,
				contentType : "application/x-www-form-urlencoded; charset=utf-8",
				dataType : "json",
				success : function(d) {
					successfn(d);
				},
				error : function(e) {
					errorfn(e);
				}
			});
		}
	})
	
	 /**
	 * @see 将javascript数据类型转换为json字符串
	 * @param 待转换对象,支持object,array,string,function,number,boolean,regexp
	 * @return 返回json字符串
	*/
	$.toJSON = function (object) {
		var type = typeof object;
		if ('object' == type) {
			if (Array == object.constructor)
				type = 'array';
			else if (RegExp == object.constructor)
				type = 'regexp';
			else
				type = 'object';
		}
		switch (type) {
			case 'undefined':
			case 'unknown': 
				return;
				break;
			case 'function':
			case 'boolean':
			case 'regexp':
				return object.toString();
				break;
			case 'number':
				return isFinite(object) ? object.toString() : 'null';
				break;
			case 'string':
				return '"' + object.replace(/(\\|\")/g,"\\$1").replace(/\n|\r|\t/g,
				function () {   
					var a = arguments[0];                   
					return  (a == '\n') ? '\\n':   
							(a == '\r') ? '\\r':   
							(a == '\t') ? '\\t': ""
							}) + '"';
					break;
			case 'object':
				if (object === null) return 'null';
				var results = [];
				for (var property in object) {
					var value = $.toJSON(object[property]);
					if (value !== undefined)
						results.push($.toJSON(property) + ':' + value);
				}
				return '{' + results.join(',') + '}';
				break;
			case 'array':
				var results = [];
				for(var i = 0; i < object.length; i++) {
					var value = $.toJSON(object[i]);
					if (value !== undefined) results.push(value);
				}
				return '[' + results.join(',') + ']';
				break;
		}
	};
    
})(jQuery);


//对Date的扩展，将 Date 转化为指定格式的String 
//月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
//年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
//例子： 
//(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
//(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function dateFormat(fmt) 
{ 
	var o = { 
	 "M+" : this.getMonth()+1,                 //月份 
	 "d+" : this.getDate(),                    //日 
	 "h+" : this.getHours(),                   //小时 
	 "m+" : this.getMinutes(),                 //分 
	 "s+" : this.getSeconds(),                 //秒 
	 "q+" : Math.floor((this.getMonth()+3)/3), //季度 
	 "S"  : this.getMilliseconds()             //毫秒 
	}; 
	if(/(y+)/.test(fmt)) 
	 fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
	for(var k in o) 
	 if(new RegExp("("+ k +")").test(fmt)) 
	fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length))); 
	return fmt; 
}

/**
 * 打开适用区域选择页面
 * @param isShowCheck(是否显示checkbox)
 * @param upRegionId(节点的父id),运行商传-1,适用区域传运营商的id
 * @param callBack回调函数返回树选择的id和名称
 */
function openCommonRegionTree(isShowCheck,upRegionId,callBack,loadType){
	if(isNull(loadType)){
		var loadType="region";
	}	
	var url = "/ppmWeb/html/commonPage/commonRegionTree.html?isShowCheck="+isShowCheck+"&upRegionId="+upRegionId+"&loadType="+loadType;
	dialog = art.dialog.open(url, {title: '',width: '350px',height: '500px',
		close:function(){
			var returnId = art.dialog.data("returnId");
			var returnName = art.dialog.data("returnName");
			callBack(returnId,returnName);
			//清空数据
			artDialog.removeData("returnId");
			artDialog.removeData("returnName");
	 	},lock: true,drag: true,resize: false});
}
function isNull(str) {
	//如果str为boolean类型，将不支持后面的replace方法。
	if(typeof (str) == "boolean"){
		return false;
	}
	return (null == str || typeof (str) == "undefined" || str == "undefined" || str.replace(/(^\s*)|(\s*$)/g, "") == "");
	//return  typeof(obj) == "undefined" || obj == null || /^\s*$/.test(obj);
};

/**
*删除数组指定下标或指定对象
*Author:tangdl
*/
Array.prototype.del=function(index){
        if(isNaN(index)||index>=this.length){
            return false;
        }
        for(var i=0,n=0;i<this.length;i++){
            if(this[i]!=this[index]){
                this[n++]=this[i];
            }
        }
        this.length-=1;
};

/* @序列化表单域使其组成一个json对象 */
$.fn.serializeJson = function() {
	var serializeObj = {};
	var array = this.serializeArray();
	$(array).each(function() {
		var val = $.trim(this.value)
		if (val != '') {
			if (serializeObj[this.name]) {
				if ($.isArray(serializeObj[this.name])) {
					serializeObj[this.name].push(this.value);
				} else {
					serializeObj[this.name] = [serializeObj[this.name],
							this.value];
				}
			} else {
				serializeObj[this.name] = this.value;
			}
		}
	});
	//alert(serializeObj);
	return serializeObj;
}

/**
 * 输入框可以输入逗号隔开的ID时调用此方法对输入框进行控制，如果符合匹配的表达式，则不做处理，如果不匹配，则替换掉不匹配的地方
 * 目前有两种情况：连续出现两个及两个以上的逗号则替换成一个逗号，逗号开头或者有非数字的时候则替换为空
 * 对valueRegReplace方法的改进，支持输入"，"
 * @param {Object} obj 当前输入框对象
 */
function valueRegReplaceNew(obj){
    var reg = /^\s*\d+(?:\s*,\s*\d+)*\s*$/g;
    if(!reg.test($(obj).val())){
        $(obj).val($(obj).val().replace('，',','));
		$(obj).val($(obj).val().replace(/\,{2,}/g,','));
		$(obj).val($(obj).val().replace(/[^\d,]|^\,/g,''));
    }
}


/**
 * 调用脚本初始化下拉框方法
 * param必须包含sqlcode
 * @param param:参数,如{sqlcode:"INITSELECTFROMPARCODE",sV1:"OBJTYPE"},sqlcode为初始化调用脚本，必填；
 * @param inputId:输入控件ID
 * @param hideId:隐藏控件ID
 */
function initCompSel( param, inputId, hideId,tip,callBack,defValue){
	$.jsonAjax("commonServlet", "combList", param, function(data) {
				var list = data.data;
				var k = list.length;
			   	var info = [];
			   	if(tip == '1'){
				   	info.push({"CODE_ID":"", "CODE_NAME":"请选择","CODE_VAL":""});		
			   	}
				for(var i=0; i<k; i++){
					info.push({"CODE_ID":""+list[i].V1+"", "CODE_NAME":""+list[i].V2+"","CODE_VAL":""+list[i].V1+""});				
				}
			   initSel(info, inputId , hideId ,callBack,defValue);
		});
}



 

function updatePagerIcons(table) {
	var replacement = 
	{
		'ui-icon-seek-first' : 'ace-icon fa fa-angle-double-left bigger-140',
		'ui-icon-seek-prev' : 'ace-icon fa fa-angle-left bigger-140',
		'ui-icon-seek-next' : 'ace-icon fa fa-angle-right bigger-140',
		'ui-icon-seek-end' : 'ace-icon fa fa-angle-double-right bigger-140'
	};
	$('.ui-pg-table:not(.navtable) > tbody > tr > .ui-pg-button > .ui-icon').each(function(){
		var icon = $(this);
		var $class = $.trim(icon.attr('class').replace('ui-icon', ''));
		
		if($class in replacement) icon.attr('class', 'ui-icon '+replacement[$class]);
	})
}




/*****************************************
功能：初始化checkbox
说明：1、checkbox实现单选框功能
	 2、根据sql初始化checkbox内容
参数：p_id P标签ID
	 name checkbox的name
	 serviceName 脚本名称
	 params 脚本参数
	 callBack 点击事件回调函数
	 callBack2 初始化完毕后执行（事件绑定后）
*****************************************/
function initCheckbox(p_id,name,serviceName,params,callBack,callBack2,flag){
 	$.jsonAjax("commonServlet", "combList", params, function(data) {
		var list = data.data;
		var k = list.length;
	   	var info = [];
	   	
		for(var index =0; index < k;index++){  //ace   //cbox
	   		$("#"+p_id).append("<div class='checkbox' ><lable> <input class='cbox' type='checkbox' name="+name+" value='"+list[index].V1+"' id='"+list[index].V1+"' /><span id='"+list[index].V1+"span' class='lbl'>"+list[index].V2+"&nbsp;&nbsp;&nbsp;</span></label></div>");
	   	}
	   	$("#"+p_id).append("<input id='"+name+"ID' name='"+name+"ID' type='hidden'/>");
	   	//设置点击事件监听
	   	  if(flag)
	   		{
	   		 checkboxListening(name,callBack);
	   		}
	   if(typeof(callBack2)=='function'){
	   	 callBack2();
	   } 
   });
 	
 	
 	/*****************************************
 	功能：checkbox实现单选功能
 	说明：该功能谷歌浏览器暂不支持
 	参数：
 	*****************************************/
 	function checkboxListening(name,callBack){
 	 	$(':checkbox[name='+name+']').each(function(){ 
 					$(this).click(function(){ 
 						if($(this).is(':checked') !=undefined&&$(this).is(':checked')){ 
 							$(':checkbox[name='+name+']').removeAttr('checked'); 
 							$(this).prop("checked",'true');//jquery1.6以上版本，在谷歌浏览器不兼容attr，改为prop
 							$("#"+name+"ID").val($(this).val());
 							if(typeof(callBack)=='function'){
 								callBack();
 							}
 						}else{
 							//没选中置空
 							$(':checkbox[name='+name+']').removeAttr('checked'); 
 							$("#"+name+"ID").val("");
 							if(typeof(callBack)=='function'){
 								callBack();
 							}
 						} 
 					}); 
 				}); 
 	}
  
}


//----checkbox，增加换行，四个一行

function initCheckbox_addbr(p_id,name,serviceName,params,callBack,callBack2,flag,width){
 	$.jsonAjax("commonServlet", "combList", params, function(data) {
		var list = data.data;
		var k = list.length;
	   	var info = [];
	   	
		for(var index =0; index < k;index++){  //ace   //cbox
			
			if(index%3==0)
			 {
				$("#"+p_id).append("</br><div class='checkbox' style='width:"+width+";'><lable> <input class='cbox' type='checkbox' name="+name+" value='"+list[index].V1+"' id='"+list[index].V1+"' /><span id='"+list[index].V1+"span' class='lbl'>"+list[index].V2+"&nbsp;&nbsp;&nbsp;</span></label></div>");
			 }else
			 {
				 $("#"+p_id).append("<div class='checkbox' style='width:"+width+";' ><lable> <input class='cbox' type='checkbox' name="+name+" value='"+list[index].V1+"' id='"+list[index].V1+"' /><span id='"+list[index].V1+"span' class='lbl'>"+list[index].V2+"&nbsp;&nbsp;&nbsp;</span></label></div>");
			 }
	   		
	   	}
	   	$("#"+p_id).append("<input id='"+name+"ID' name='"+name+"ID' type='hidden'/>");
	   	//设置点击事件监听
	   	  if(flag)
	   		{
	   		 checkboxListening(name,callBack);
	   		}
	   if(typeof(callBack2)=='function'){
	   	 callBack2();
	   } 
   });
 	
 	
 	/*****************************************
 	功能：checkbox实现单选功能
 	说明：该功能谷歌浏览器暂不支持
 	参数：
 	*****************************************/
 	function checkboxListening(name,callBack){
 	 	$(':checkbox[name='+name+']').each(function(){ 
 					$(this).click(function(){ 
 						if($(this).is(':checked') !=undefined&&$(this).is(':checked')){ 
 							$(':checkbox[name='+name+']').removeAttr('checked'); 
 							$(this).prop("checked",'true');//jquery1.6以上版本，在谷歌浏览器不兼容attr，改为prop
 							$("#"+name+"ID").val($(this).val());
 							if(typeof(callBack)=='function'){
 								callBack();
 							}
 						}else{
 							//没选中置空
 							$(':checkbox[name='+name+']').removeAttr('checked'); 
 							$("#"+name+"ID").val("");
 							if(typeof(callBack)=='function'){
 								callBack();
 							}
 						} 
 					}); 
 				}); 
 	}
  
}
function checkFloat(value){
	var flag = true;
	var re = /^[0-9]+([.]{1}[0-9]{1,2})?$/;
	if(!re.test(value) || value <= 0){
		flag = false;
	}
	return flag;
}

/**
 * 获取当前登录人所有 权限码
 */
function getCurPrivilegeCode(ID) {
	var param = new Object();
	param["service_name"]="GETPRIVILEGECODE";
	
	$.ajax({
        type: "POST",
        async: false, 
        data: param,
        dataType: "json",
        url : nowurl+'ControlServlet.do?serviceName=commonServlet&methodName=getCurPrivilegeCode',
        success: function(data) {
//        	if(data.length > 0){
//        		var obj=data.data;
//           	 	$("#"+ID).val(obj);
//           	 	initBubbton();
//    		}
        	
        	var obj=data.data;
       	 	$("#"+ID).val(obj);
        },
        beforeSend: function() {
            //$.jBox.tip("正在查询数据...", 'loading');
        }

    });
	
    }

 /**
  * 判断按钮是否具有权限码
  * @param btnPrivilige
  * @param key
  * @returns {Boolean}
  */
function hasButtonPrivilige(btnPrivilige,key){
	  var btnPrivilige=$("#privilegeCode").val();
	 
	if(btnPrivilige.indexOf(key)>=0){
		return true;
	} 
		return false; 
}


/**
 * 获取下拉框的值
 * @param service_name --sql配置
 * @param flag --是否显示可选择
 * @param busi_type --字典表中类型
 * @param param --初始参数
 * @returns {Array}
 */
function getData(service_name,flag,busi_type,param){
	var dataArray = [];
	if (flag) {
		dataArray.push({id:"", text:"=请选择="});
	}
	if(param == null){
		param = new Object();
	}
	param["service_name"]=service_name;
	param["busiType"] = busi_type;
	
	$.ajax({
        type: "POST",
        async: false, 
        data: param,
        dataType: "json",
        url : nowurl+'ControlServlet.do?serviceName=commonServlet&methodName=gridValue',
        success: function(data) {
        	if(data.length > 0){
    			var line = data.length;
    			for(var i=0;i<line;i++){
    				var obj = data[i];
    				dataArray.push({id:""+obj.VALUE+"",text:""+obj.TEXT+""});
    			}
    		}
        },
        beforeSend: function() {
            //$.jBox.tip("正在查询数据...", 'loading');
        }

    });
	return dataArray;
}
/**
 * 
 * @param tag
 * @param url
 * @param service_name
 */
function queryDataForInput(tag,url,service_name){
	tag.setUrl(url+"&service_name="+service_name);
}
/**
 * 初始化表头
 * @param id
 * @param serviceName
 * @param isMul
 */
function initTableHead(id,serviceName,isMul,paramIn){
	var grid = mini.get(id);
	var columnInfos = [];
	if(isMul){
		columnInfos.push({type:"checkcolumn"});
	}
	var param = {"service_name":"REWARD_QUERY_FIELDS",
				 "service_code":serviceName};
	$.ajax({
        type: "POST",
        async: false, 
        data: param,
        dataType: "json",
        url : nowurl+'ControlServlet.do?serviceName=commonServlet&methodName=gridValue',
        success: function(data) {
        	if(data.length > 0){
    			var lines = data.length;
    			for(var i=0;i < data.length; i++){
    				var obj = data[i];
    				var info = new Object;
    				info["width"]=obj.COL_LEN;
    				info["headerAlign"]="center";
    				info["header"]=obj.COL_NAME;
    				if(obj.COL_TYPE == '4'){
    					info["name"]="action";
    					info["align"]="center";
    					info["renderer"]="onActionRenderer";
    					info["cellStyle"]="padding:0;";
    				}else{
    					info["field"]=obj.COL_CODE;
    					if(obj.IS_HREF=='Y'){
        					info["name"] = obj.URL+"||"+obj.HREF_TYPE;
        					info["renderer"]="onRenderer";
        				}
        				if(obj.COM_TYPE=='1'){
        					var edt = {type:"textbox"};
        					info["editor"] = edt;
        				}else if(obj.COM_TYPE=='21'){
        					info["type"]="comboboxcolumn";
        					var edt={type:"combobox",
        							 data:"getData('"+obj.COMBOX_SERVICE_NAME+"',false,'"+obj.COMBOX_BUSI_TYPE+"',"+paramIn+")"};
        					info["editor"]=edt;
        				}else if(obj.COM_TYPE=='22'){
        					info["type"]="comboboxcolumn";
        					var edt={type:"combobox",
        							 data:"getData('"+obj.COMBOX_SERVICE_NAME+"',false,'"+obj.COMBOX_BUSI_TYPE+"',"+paramIn+")",
        							 multiSelect:"true"};
        					info["editor"]=edt;
        				}else if(obj.COM_TYPE=='3'){//时间格式
        					var edt={type: "datepicker"};
        					if(obj.COL_TYPE == '2'){
        						edt= { type: "datepicker",format:"yyyy-MM-dd HH:mm:ss",timeFormat:"HH:mm:ss",showTime:true};
        					}
        					info["editor"]=edt;
        				}else if(obj.COM_TYPE=='4'){//待开发
        					
        				}
        				if(obj.COL_TYPE == '2'){//时间精确到时分秒
        					info["dateFormat"]="yyyy-MM-dd HH:mm:ss";
        				}
        				if(obj.COL_ALIGN == '0'){
        					info["align"]="left";
        				}else if(obj.COL_ALIGN == '1'){
        					info["align"]="center";
        				}else if(obj.COL_ALIGN == '2'){
        					info["align"]="right";
        				}else{
        					info["align"]="center";
        				}
        				
    				}
    				
    				columnInfos.push(info);
    			}
    		}
        },
        beforeSend: function() {
            //$.jBox.tip("正在查询数据...", 'loading');
        }

    });
	
	grid.set({columns:columnInfos});
	grid.load();
	
}

//计算月份差
function getMonthNumber(date1,date2){
	//默认格式为"2003-03-03",根据自己需要改格式和方法
	var dates1 = date1.split("-");
	var dates2 = date2.split("-");
	var year1 =  dates1[0];
	var year2 =  dates2[0];
	var month1 = dates1[1];
	var month2 = dates2[1];
	
	var len=(year2-year1)*12+(month2-month1);
	
	return len;

}
function getMonthNumber(date1,date2){
	//默认格式为"2003-03-03",根据自己需要改格式和方法
	var dates1 = date1.split("-");
	var dates2 = date2.split("-");
	var year1 =  dates1[0];
	var year2 =  dates2[0];
	var month1 = dates1[1];
	var month2 = dates2[1];
	
	var len=(year2-year1)*12+(month2-month1);
	
	return len;

}
//比较时间大小date1-date2
//0小于	 1等于  	   2大于
function getCompareDayNumber(date1,date2){
	//默认格式为"2003-03-03",根据自己需要改格式和方法
	var dates1 = date1.split("-");
	var dates2 = date2.split("-");
	var year1 =  dates1[0];
	var year2 =  dates2[0];
	var month1 = dates1[1];
	var month2 = dates2[1];
	var day1 = dates1[2];
	var day2 = dates2[2];
	if((year1-year2)<0){
		return 0;
	}else{
		if((year1-year2)>0){
			return 2;
		}else{
			if((month1-month2)<0){
				return 0;
			}else{
				if((month1-month2)>0){
					return 2;
				}else{
					if((day1-day2)<0){
						return 0;
					}else{
						if((day1-day2)>0){
							return 2;
						}
						else{
							return 1;
						}
					}
				}
			}
		}
	}
}


/**
 * 渲染操作按钮
 * @param e
 * @returns {String}
 */
function onRenderer(e) {
	var record = e.record,
	column = e.column,
	field = e.field,
	value = e.value;
	var url="";
	var rst="";
	if(column.name){
		var urlSpi = column.name.split("||");
		url = urlSpi[0];
		if(url.indexOf("?")!=-1){ 
			var str = url.substr(url.indexOf("?")+1); 
			var strs= str.split("&"); 
			for(var i=0;i < strs.length;i++){ 
				var val = strs[i].split("=")[1];
				if(val.indexOf("#") != -1){
					val=val.substr(val.indexOf("#")+1); 
					url = url.replace("#"+val,record[val]);
				}else if(val.indexOf("$") != -1){
					val=val.substr(val.indexOf("$")+1); 
					url = url.replace("$"+val,mini.get(val).getValue());
				}
			} 
		}
		var href_type = urlSpi[1];
		if(href_type=='1'){
			rst = '<a href="javascript:openWin(\'' + url + '\')">'+value+'</a>';
		}else if(href_type=='2'){
			rst = '<a href="javascript:jumpPage(\'' + url + '\')">'+value+'</a>';
		}else if(href_type=='3'){
			rst = '<a href="javascript:openMini(\'' + url + '\')">'+value+'</a>';
		}else if(href_type=='4'){
			rst = '<a href="' + url + value+'" target="_blank" style="padding-left:20px;padding-right:50px;">'+value+'</a>';
		}else{
			rst = '<a href="javascript:openWin(\'' + url + '\')">'+value+'</a>';
		}
	}
	
    return rst;

}

function openWin(url){
	window.open(url);
}
function jumpPage(url){
	window.location.href=url;
}

