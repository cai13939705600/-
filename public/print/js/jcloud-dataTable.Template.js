/**
 * Created by zhanghuibin on 2016/5/17.
 * Modified by qiaolei on 2016.09.30
 * Modified by qiulun on 2016/11/04 支持多个paging显示,使用逗号分隔
 * Modified by qiulun on 2016/11/28 tr变色处理 check选中变色 增加td的title属性
 * Modified by qiaolei on 2016/12/01 在列表右上角添加分页信息
 */
$.fn.DataTableTemplate = function (settings) {
  //清除全选的checkbox状态
   var offAllCheckBox=function($table){
     $table.find("thead tr th:eq(0) :checkbox").prop('checked', false);
     //yx add 默认全选
     var attr_init_checked =  $("thead input:checkbox").attr("init_checked");
     if(attr_init_checked != undefined && attr_init_checked == "true" ){
         $table.find("thead tr th:eq(0) :checkbox").prop('checked', attr_init_checked);
     }
   };
   
 //checkbox全选取消选中变色
   var bindAllCheckBox=function($table){
     $table.on('click','thead tr th :checkbox',function() {
       var $thistable=$(this).closest("table");

       if($(this).is(':checked')) {
         $(this).prop('checked', true);
         
         $thistable.find("tbody tr").each(function(){
           var $tr=$(this);
           var $checkbox=$tr.find("td :checkbox").filter(":visible");
           if($checkbox.length>0){
               $checkbox.prop('checked', true);
               $tr.css("background-color", "#FDFBCC");
           }
          
         })
        
       } else {
         $thistable.find("tbody tr").each(function(){
           var $tr=$(this);
           $tr.find("td :checkbox").prop('checked', false);
           if(typeof($tr.data("tr_bg"))!="undefined"){
             $tr.css("background-color",  $tr.data("tr_bg"));
           }else{
             $tr.css("background-color",  "");
           }
         });
        
         $(this).prop('checked', false);
        
       }
     
     })
   };
    
    this.settings = settings || {};
    //初始化分页参数
    if (this.settings.paging) {
        if (!this.settings.currentPageIndex) {
            this.settings.currentPageIndex = 0;
        }
        if (!this.settings.pageLength) {
            this.settings.pageLength = 10;
        }
        if (!this.settings.pager) {
            this.settings.pager = {};
        }
        console.log(this.settings.pager);
        if (!this.settings.pager.resizeTrigger) {
          var resizeTriggerArr=[];
          var tablePagerResizeTrigger = this.attr("table_pager_resize_trigger");
          if (!tablePagerResizeTrigger) {
              tablePagerResizeTrigger = "#" + this.attr("id") + "_pager_resize_trigger";
              resizeTriggerArr.push(tablePagerResizeTrigger);
          }else{
            $.each(tablePagerResizeTrigger.split(","),function(i,resizeTrigger_name){
              resizeTriggerArr.push(resizeTrigger_name);
             })
          }
          this.settings.pager.resizeTrigger=resizeTriggerArr;
        }
        if (!this.settings.pager.totalNum) {
          var tableTotalNumArr=[];
            var tableTotalNum = this.attr("table_total_num");
            if (!tableTotalNum) {
                tableTotalNum = "#" + this.attr("id") + "_total_num";
                tableTotalNumArr.push(tableTotalNum);
            }else{
              $.each(tableTotalNum.split(","),function(i,tableTotalNum_name){
                tableTotalNumArr.push(tableTotalNum_name);
               })
            }
            this.settings.pager.totalNum = tableTotalNumArr;
        }
        var hostT = this;
        $.each(this.settings.pager.resizeTrigger,function(i,resizeTrigger_name){
          $(resizeTrigger_name).change(function (e) {
            hostT.rePageSize(e);
          });
          
        });
        if (!this.settings.pager.gotoTrigger) {
          var gotoTriggerArr=[];
         
            var tablePagerGotoTrigger = this.attr("table_pager_goto_trigger");
            if (!tablePagerGotoTrigger) {
                tablePagerGotoTrigger = "#" + this.attr("id") + "_pager_goto_trigger";
                gotoTriggerArr.push( tablePagerGotoTrigger);
            }else{
              $.each(tablePagerGotoTrigger.split(","),function(i,gotoTrigger_name){
                gotoTriggerArr.push(gotoTrigger_name);
               })
            }
            this.settings.pager.gotoTrigger=gotoTriggerArr;
        }
        
        $.each(this.settings.pager.gotoTrigger,function(i,gotoTrigger_name){
          $(gotoTrigger_name).click(function (e) {
            var trigger = $(e.target);
            var pageIndex = $(trigger.attr("table_pager_goto")).val() - 1;
            hostT.gotoPage(pageIndex);
          });
          
        });


        if (!this.settings.pager.count) {
          var countArr=[];
            var tablePagerCount = this.attr("table_pager_count");
            if (!tablePagerCount) {
                tablePagerCount = "#" + this.attr("id") + "_pager_count";
                countArr.push(tablePagerCount);
            }else{
              $.each(tablePagerCount.split(","),function(i,tablePagerCount_name){
                countArr.push(tablePagerCount_name);
               })
              
            }
            this.settings.pager.count = countArr;
        }

        if (!this.settings.pager.pageIndex) {
            var tablePagerIndexArr=[];
            var tablePagerIndex = this.attr("table_pager_pageIndex");
            if (!tablePagerIndex) {
                tablePagerIndex = "#" + this.attr("id") + "_pager_index";
                tablePagerIndexArr.push(tablePagerIndex)
            }else{
              $.each(tablePagerIndex.split(","),function(i,tablePagerIndex_name){
                tablePagerIndexArr.push(tablePagerIndex_name);
               })
            }
            this.settings.pager.pageIndex = tablePagerIndexArr;
        }

        if (!this.settings.pager.nav) {
            var tablePagerNavArr=[];
            var tablePagerNav = this.attr("table_pager_nav");
            if (!tablePagerNav) {
                tablePagerNav = "#" + this.attr("id") + "_pager_nav";
                tablePagerNavArr.push(tablePagerNav);
            }else{
              $.each(tablePagerNav.split(","),function(i,tablePagerNav_name){
                tablePagerNavArr.push(tablePagerNav_name);
               })
            }
            this.settings.pager.nav = tablePagerNavArr;
        }

    }
    //初始化排序参数
    if (this.settings.ordering) {
        var tHost = this;
        this.find("thead th.sortable").each(function () {
            var columnTh = $(this);
            columnTh.click(function () {
                var sortAttr = columnTh.attr("table_sort");
                if (sortAttr == null || sortAttr == "") {
                    columnTh.removeClass("asc").removeClass("desc").removeClass("sortable");
                    columnTh.unbind("click");
                    return;
                }
                var sortConfig = sortAttr.split(" ");
                tHost.settings.sortColumn = sortConfig[0];
                var sortOrder = columnTh.sortOrder;
                if (!sortOrder || sortOrder == null) {
                    if (sortConfig.length > 1) {
                        if (sortConfig[1] == "asc" || sortConfig[1] == "desc") {
                            sortOrder = sortConfig[1];
                        }
                    }
                    else {
                        sortOrder = "asc";
                    }
                }
                else {
                    if (sortOrder == "asc") {
                        sortOrder = "desc";
                    }
                    else {
                        sortOrder = "asc";
                    }
                }
                columnTh.parent().find("th").removeClass("asc").removeClass("desc");
                columnTh.addClass(sortOrder);
                tHost.settings.sortOrder = sortOrder;
                if (tHost.sortedColumn) {
                    tHost.sortedColumn.sortOrder = null;
                }
                tHost.sortedColumn = columnTh;
                columnTh.sortOrder = sortOrder;
                tHost.displayData();
            });
        })
    }
    else {
        this.find("thead th.sortable").removeClass("sortable").removeClass("desc").removeClass("asc");
    }
    this.find("thead input:checkbox").each(function () {
        $(this).attr("init_checked", this.checked);
    });
    this.tHead = this.find("thead");
    this.theadThs = [];
    var tHost = this;
    this.tHead.find("tr:first").find("th").each(function(){
      $(this).attr("title",$(this).text());//设置title
      tHost.theadThs.push($(this));
    });
    
    this.tBody = this.find("tbody");
    if (this.tBody.length <= 0) {
        alert("DataTableTemplate-没有模板行-tBody");
        return;
    }
    var tRTemplates = this.tBody.find("tr");
    if (tRTemplates.length <= 0) {
        alert("DataTableTemplate-没有模板行-tr");
        return;
    }
    var tdAll=tRTemplates.first().find("td");
    this.cellCount = tdAll.length;
    if (this.cellCount <= 0) {
        alert("DataTableTemplate-模板行没有单元格-td");
        return;
    }
    this.cellCount = tdAll.filter(":visible").length;//得到真实显示的td数
    this.tRowTemplates = [];
    for (var l = 0; l < tRTemplates.length; l++) {
        this.tRowTemplates.push(tRTemplates[l].outerHTML);
    }
    this.tBody.html("");
    // 筛选数据
    this.filterData = function (filter, pageOnly) {
        var sourceCollection;
        var resultCollection = [];
        if (typeof (pageOnly) == "undefined" || pageOnly) {
            sourceCollection = this.selectedData;
        }
        else {
            if (!this.result) {
                return resultCollection;
            }
            sourceCollection = this.result.data;
        }
        if (!sourceCollection) {
            return resultCollection;
        }
        for (var i = 0; i < sourceCollection.length; i++) {
            var dataItem = sourceCollection[i];
            if (typeof (filter) == "function") {
                if (!filter(dataItem, i)) {
                    continue;
                }
            }
            else if (typeof (filter) == "object") {
                var isMatch = true;
                for (var filterIndex in filter) {
                    var filterValue = filter[filterIndex];
                    if (filterIndex == "__index__") {
                        if (i != filterValue) {
                            continue;
                        }
                    }
                    else {
                        if (!dataItem[filterIndex] || dataItem[filterIndex] != filterValue) {
                            isMatch = false;
                            break;
                        }
                    }
                }
                if (!isMatch) {
                    continue;
                }
            }
            resultCollection.push(dataItem);
        }
        return resultCollection;
    };
    //计算分页信息
    this.calculatePage = function () {
        if (!(this.result && this.result.recordsTotal)) {
            this.settings.currentPageIndex = 0;
            this.settings.pageCount = 1;
            this.settings.totalNum = 0;
            return;
        }
        this.settings.totalNum = this.result.recordsTotal;
        this.settings.pageCount = parseInt(this.result.recordsTotal / this.settings.pageSize);
        if (this.result.recordsTotal % this.settings.pageSize) {
            this.settings.pageCount++;
        }
        if (typeof (this.settings.currentPageIndex) == "undefined") {
            this.settings.currentPageIndex = 0;
        }
        else if (this.settings.currentPageIndex > this.settings.pageCount - 1) {
            this.settings.currentPageIndex = this.settings.pageCount - 1;
        }
    };
    //显示页脚信息
    this.showPagerInfo = function () {
        var $this=this;
        $.each(this.settings.pager.count,function(i,count_name){
          $(count_name).text($this.settings.pageCount);
        });

        $.each(this.settings.pager.pageIndex,function(i,pageIndex_name){
          $(pageIndex_name).val(parseInt($this.settings.currentPageIndex) + 1);
        });

        $.each(this.settings.pager.resizeTrigger,function(i,resizeTrigger_name){
          $(resizeTrigger_name).val(parseInt($this.settings.pageSize));
        });
        

        var startPageIndex = parseInt(this.settings.currentPageIndex - this.settings.pageNavCount / 2);

        var endPageIndex = parseInt(this.settings.currentPageIndex + this.settings.pageNavCount / 2);
        if (startPageIndex < 0) {
            startPageIndex = 0;
            endPageIndex = Math.min(startPageIndex + this.settings.pageNavCount, this.settings.pageCount);
        }
        if (endPageIndex > this.settings.pageCount - 1) {
            endPageIndex = this.settings.pageCount - 1;
            startPageIndex = Math.max(endPageIndex - this.settings.pageNavCount, 0);
        }
        var navHtml = "";
        //if (startPageIndex > 0) {
            navHtml += '<a href="javascript:void(0);" class="prev" value="1">首页</a>';
        //}
        if (this.settings.pageNavCount && this.settings.pageNavCount > 0) {
            if(this.settings.currentPageIndex >1){
                navHtml += '<a href="javascript:void(0);" class="num"  value="' + (this.settings.currentPageIndex) + '"> 上一页</a>';
            }else{
                navHtml += '<a href="javascript:void(0);" class="num"  value="1"> 上一页</a>';
            }
            for (var pageIndex = startPageIndex; pageIndex <= endPageIndex; pageIndex++) {
                if (pageIndex == this.settings.currentPageIndex) {
                    navHtml += '<a href="javascript:void(0);" class="num selected"  value="' + (pageIndex + 1) + '">' + (pageIndex + 1) + '</a>';
                }
                else {
                    navHtml += '<a href="javascript:void(0);" class="num" value="' + (pageIndex + 1) + '">' + (pageIndex + 1) + '</a>';
                }
            }
            if(this.settings.currentPageIndex<this.settings.pageCount){
                navHtml += '<a href="javascript:void(0);" class="num"  value="' + (this.settings.currentPageIndex + 2) + '">下一页</a>';
            }else{
                navHtml += '<a href="javascript:void(0);" class="num"  value="' + this.settings.pageCount + '">下一页</a>';
            }
        }
        //if (endPageIndex < this.settings.pageCount - 1) {
            navHtml += '<a href="javascript:void(0);" class="next" value="' + this.settings.pageCount + '">尾页</a>';
        //}


        if(!this.settings.totalNum){
          this.settings.totalNum=0;
        }
        var navLeftHtml = '<span>总共 '+this.settings.totalNum+' 条</span>';
        
        $.each(this.settings.pager.totalNum,function(i,totalNum_name){
          $(totalNum_name).html(navLeftHtml);
        });
        
        var hostT = this;
        $.each(settings.pager.nav,function(i,nav_name){
          $(nav_name).html(navHtml).find("a").click(function (e) {
            var trigger = $(e.target);
            var pageIndex = parseInt(trigger.attr("value")) - 1;
            hostT.gotoPage(pageIndex)
          });
        });
    };
    //对数据进行排序
    this.sortData = function (data) {
        if (typeof (this.settings.sortColumn) == "undefined" || !this.settings.sortColumn) {
            return data;
        }
        var tHost = this;
        data.sort(function (x, y) {
            if (tHost.settings.sortOrder == "desc") {
                return compare(y[tHost.settings.sortColumn], x[tHost.settings.sortColumn]);
            }
            else {
                return compare(x[tHost.settings.sortColumn], y[tHost.settings.sortColumn]);
            }
        });
        //比较大小
        function compare(x, y) {
            if (typeof (x) == "undefined" || x == null) {
                if (typeof (y) == "undefined" || y == null) {
                    return 0;
                }
                else {
                    return -1;
                }
            }
            else {
                if (typeof (y) == "undefined" || y == null) {
                    return 1;
                }
            }
            if (x == y) {
                return 0;
            }
            if (x < y) {
                return -1;
            }
            return 1;
        }

        return data;
    };
    //显示数据
    this.displayData = function () {
        offAllCheckBox($("#"+this.attr("id")));
        bindAllCheckBox($("#"+this.attr("id")));
        
        this.selectedData = [];
        var start = 0;
        var end = this.result.recordsTotal - 1;
        if (this.settings.paging) {
            this.calculatePage();
            this.showPagerInfo();
            start = this.settings.currentPageIndex * this.settings.pageSize;
            end = start + parseInt(this.settings.pageSize) - 1;
            if (end > 0 && end > this.result.recordsTotal - 1) {
                end = this.result.recordsTotal - 1;
            }
        }
        if (typeof (end) == "undefined") {
            end = 0;
        }
        for (var i = start; i <= end; i++) {
            var row = this.result.data[i];
            if (!row) {
                if (this.ajax) {
                    this.ajax.load();
                    return;
                }
                else {
                    break;
                }
            }
            this.selectedData.push(row);
        }
        if (this.settings.ordering) {
            this.sortData(this.selectedData);
        }
        this.tBody.html("");
        for (var rowIndex in this.selectedData) {
            var dataRow = this.selectedData[rowIndex];
            var newRowHtml = this.tRowTemplates[rowIndex % this.tRowTemplates.length];
            var tHost = this;
            newRowHtml = newRowHtml.replace(/@\{\w+(\.\w+)*(,[^\}]+)?\}/g, function (word) {
                var filedInfo = word.substring(2, word.length - 1);
                var filedNames;
                var filedType = null;
                var filedFormat = null;
                var commaIndex = filedInfo.indexOf(",");
                if (commaIndex > 0) {
                    filedNames = filedInfo.substring(0, commaIndex).split('.');
                    var commaIndex2 = filedInfo.indexOf(",", commaIndex + 1);
                    if (commaIndex2 > 0) {
                        filedType = filedInfo.substring(commaIndex + 1, commaIndex2);
                        filedFormat = filedInfo.substring(commaIndex2 + 1);
                    }
                    else {
                        filedType = filedInfo.substring(commaIndex + 1);
                    }
                }
                else {
                    filedNames = filedInfo.split('.');
                }
                var valueOfObject;
                if (filedNames.length == 1 && filedNames[0] == "__rowIndex__") {
                    valueOfObject = tHost.result.data.indexOf(dataRow);
                } else if (filedNames.length == 1 && filedNames[0] == "__rowIndex1__") {
                    valueOfObject = tHost.result.data.indexOf(dataRow) + 1;
                } else if (filedNames.length == 1 && filedNames[0] == "__rowIndexOfPage__") {
                    valueOfObject = rowIndex;
                } else if (filedNames.length == 1 && filedNames[0] == "__rowIndexOfPage1__") {
                    valueOfObject = rowIndex + 1;
                }
                else {
                    valueOfObject = tHost.getValueOfObject(dataRow, filedNames);
                }
                if (valueOfObject == null) {
                    valueOfObject = "";
                }
                else if (typeof (valueOfObject) != "undefined" && filedType) {
                    valueOfObject = tHost.formatValue(valueOfObject, filedType.toLowerCase(), filedFormat,dataRow);
                }
                return valueOfObject;
            });
            var tRow = $(newRowHtml);
            this.tBody.append(tRow);
            dataRow.__tableRow__ = tRow;
           
            
           //绑定checkbox的点击事件、变色、全选
           var tCheckBox=tRow.find("td:eq(0) :checkbox");
           if(tCheckBox.length>0){
             tCheckBox.click(function(event) {
               event.stopPropagation();//阻止冒泡传递到tr
               var $clickcheckbox=$(this);
               var $table=$clickcheckbox.closest("table");
               var $all_checkbox=$table.find("thead tr th:eq(0) :checkbox");
               
               var $tr=$clickcheckbox.closest("tr");
               
               if($clickcheckbox.is(":visible")){
                   var isChecked=$clickcheckbox.is(':checked');
                   
                   if(tHost.settings.checksingle){
                     //单选时 清除表格样式
                     offAllCheckBox($("#"+tHost.attr("id")));
                     $table.find("tbody tr").each(function(){
                         var $cleantr=$(this);
                          if(typeof($cleantr.data("tr_bg"))!="undefined"){
                           $cleantr.css("background-color",  $cleantr.data("tr_bg"));
                         }else{
                           $cleantr.css("background-color",  "");
                         }
                         
                         $cleantr.find("td:eq(0) :checkbox").prop('checked', false);
                         
                     })
                
                   }
                   
                   if(isChecked) {
                     $clickcheckbox.prop('checked', true);
                     $tr.css("background-color", "#FDFBCC");
                   } else {
                     $all_checkbox.prop('checked', false);
                     if(typeof($tr.data("tr_bg"))!="undefined"){
                       $tr.css("background-color",  $tr.data("tr_bg"));
                     }else{
                       $tr.css("background-color",  "");
                     }
                     $clickcheckbox.prop('checked', false);
                   }
                    
                   var tr_size=$table.find("tbody tr").filter(function(){
                      var $fltr=$(this);
                      return $fltr.find(":checkbox").filter(":visible").first().length>0;
                   }).size();
                   
                   var checked_size=$table.find("tbody tr input:checked").filter(":visible").size();
                   if(tr_size==checked_size){
                     $all_checkbox.prop('checked', true);
                   }
               }
            
              })
          }
          
          //设置td点击操作变色 title 排除checkbox和操作td 
          tRow.find("td").each(function(index,data){
            var $th=tHost.theadThs[index];
            if($th){
              //设置title
              if(!$th.hasClass("opera") && !$th.hasClass("checkth")){
                $(this).attr("title",$(this).text());
              }
              if(!$th.hasClass("opera")&&!$th.hasClass("unbind")){
              //td绑定点击事件
                var $td=$(this);
                $td.click(function() {
                  var $this_tr=$(this).closest("tr");
                  var $tr_checkbox=$this_tr.find("td:eq(0) :checkbox");
                  if($tr_checkbox.length>0 &&  $tr_checkbox.is(":visible")){
                    var $table=$tr_checkbox.closest("table");
                    var isChecked=$tr_checkbox.is(':checked');
                      
                    if(tHost.settings.checksingle){
                        //单选时 清除表格样式
                     offAllCheckBox($("#"+tHost.attr("id")));
                     $table.find("tbody tr").each(function(){
                         var $cleantr=$(this);
                          if(typeof($cleantr.data("tr_bg"))!="undefined"){
                           $cleantr.css("background-color",  $cleantr.data("tr_bg"));
                         }else{
                           $cleantr.css("background-color",  "");
                         }
                         
                         $cleantr.find("td:eq(0) :checkbox").prop('checked', false);
                     })
                    }
                    
                    if(isChecked) {
                      $table.find('thead tr th :checkbox').prop('checked', false);
                      if(typeof($this_tr.data("tr_bg"))!="undefined"){
                        $this_tr.css("background-color",  $this_tr.data("tr_bg"));
                      }else{
                        $this_tr.css("background-color",  "");
                      }
                      $tr_checkbox.prop('checked', false).trigger("change");
                      
                    }else{
                      $tr_checkbox.prop('checked', true).trigger("change");
                      $this_tr.css("background-color", "#FDFBCC");
                     
                      var tr_size=$table.find("tbody tr").filter(function(){
                          var $fltr=$(this);
                          return $fltr.find(":checkbox").filter(":visible").first().length>0;
                      }).size();
                   
                      var checked_size=$table.find("tbody tr input:checked").filter(":visible").size();
                      if(tr_size==checked_size){
                        $table.find("thead tr th:eq(0) :checkbox").prop('checked', true);
                      }
                    }
                      
                  }
                    
               })
                
              }
            }
           
            
          })
          
          
           if (this.settings.createdRow) {
                this.settings.createdRow(tRow, dataRow, rowIndex);
                
                //将创建后的tr背景色存起来，以便变色还原
                if(typeof(tRow.css("background-color"))!="undefined" && 
                   tRow.css("background-color")!="rgb(255, 255, 255)" &&
                   tRow.css("background-color")!="#FFFFFF"){
                  tRow.data("tr_bg",tRow.css("background-color"));  
                }
                
            }
           
        } 
        
        if (this.settings.dataDisplayed) {
            this.settings.dataDisplayed(this.selectedData);
        }
        if (this.settings.dataDisplayedWithSortColumn) {
            this.settings.dataDisplayedWithSortColumn(this.selectedData, this.settings.sortColumn);
        }

        //qiulun fix  NoColRsizer class
        if(!$(this).hasClass("NoColRsizer")){
            if(this.result.data && this.result.data.length>0){
                $(this).colResizable({liveDrag:true,resizeMode:"overflow",partialRefresh:true,flush:true});
            }else{
                $(this).colResizeDestroy();
            }
        }
        if (this.settings.displayDataComplete) {
            this.settings.displayDataComplete();
        }
    };
    //对json对象进行多层级取值
    this.getValueOfObject = function (obj, filedNames) {
        var result = obj;
        for (var filedLevel in filedNames) {
            result = result[filedNames[filedLevel]];
            if (typeof (result) == "undefined") {
                return null;
            }
        }
        return result;
    };


    //对数据进行格式化处理
    this.formatValue = function (obj, filedType, filedFormat,dataRow) {
        switch (filedType) {
            case "date":
            {
                var date = new Date(obj);
                if (!filedFormat) {
                    return date;
                }
                return date.format(filedFormat);
            }
            case "short":
            case "int":
            case "long":
            {
                if (!filedFormat) {
                    return parseInt(obj);
                }
                return parseInt(obj, parseInt(filedFormat));
            }
            case "null_short":
            case "null_int":
            case "null_long":
            {
                var  number=parseInt(obj);
                if (!filedFormat) {
                    return isNaN(number)?'':number;
                }
                number=parseInt(obj, parseInt(filedFormat));
                return isNaN(number)?'':number;
            }
            case "float":
            case "double":
            case "number":
            {
                var number = parseFloat(obj);
                if (!filedFormat) {
                    return number;
                }
                return number.format(filedFormat);
            }
            case "null_float":
            case "null_double":
            case "null_number":
            {
                var number = parseFloat(obj);
                if (!filedFormat) {
                    return isNaN(number)?'':number;
                }
                return isNaN(number)?'':number.format(filedFormat);
            }
            case "jcloudenums":
            {
                if (jcloudEnums) {
                    var enums = this.getValueOfObject(jcloudEnums, filedFormat.split('.'));
                    if (enums) {
                        var enumValue = enums[obj];
                        if (enumValue) {
                            return enumValue;
                        }
                    }
                }
                break;
            }
            case "jclouddynamicenums":
            {
                if (jcloudDynamicEnums) {
                    var enums = this.getValueOfObject(jcloudDynamicEnums, filedFormat.split('.'));
                    if (enums) {
                        var enumValue = enums[obj];
                        if (enumValue) {
                            return enumValue;
                        }
                    }
                }
                break;
            }
            case "sensitivedata":{
                if(filedFormat){

                    if (!filedFormat) {
                        return obj;
                    }
                    if(!obj){
                        return "";
                    }
                    var param = filedFormat.split("#");
                    if(param.length>0){
                        //先兼容老版前台页面显示，后续改造完成后删除该判断 by dengtianlang 20190426
                        if(param.length<2){
                            var newVal =  parseSensitive(obj,filedFormat);

                            if(newVal){
                                var indexStart = newVal.indexOf('*');
                                var indexEnd = newVal.lastIndexOf('*');
                                return newVal.substring(0,indexStart)+"<a href='javascript:void(0);' onclick=\"showVal('"+obj+"','table',this)\">"+newVal.substring(indexStart,indexEnd+1)+"</a>"+newVal.substring(indexEnd+1,newVal.length);
                            }
                        }

                        if(!param[3]){
                            //默认使用id
                            param[3]=dataRow["id"];
                        }else {
                            param[3]=dataRow[param[3]];
                        }
                        return "<a href='javascript:void(0);' onclick=\"showVal('"+obj+"','table',this,'"+param[0]+"','"+param[1]+"','"+param[3]+"','"+param[2]+"')\">点击查看</a>";
                    }

                }
                break;

            }
            case "chnnumber": {
                if (obj) {
                    try {
                        return (obj + "").formatCHN();
                    } catch (e) {
                        return obj;
                    }
                }
                return "";
            }
            case "qrcode": {
                if (obj) {
                    try {
                        //二维码宽度
                        var codeWidth;
                        //二维码高度
                        var codeHeight;

                        if (filedFormat) {
                            var list = (filedFormat+"").split("*");
                            if(list.length==2){
                                codeHeight = parseInt(list[0]);
                                codeWidth = parseInt(list[1]);
                            }
                        }

                        return (obj + "").transformQRCode(codeWidth,codeHeight);
                    } catch (e) {
                        console.log(e);
                        return obj;
                    }
                }
                return "";
            }
            case "barcode": {
                if (obj) {
                    try {
                        //二维码宽度
                        var codeWidth = 2;
                        //二维码高度
                        var codeHeight = 60;

                        if (filedFormat) {
                            var list = (filedFormat+"").split("*");
                            if(list.length==2){
                                if(list[0]){
                                    codeHeight = parseInt(list[0]);
                                }
                                if(list[1]){
                                    codeWidth = parseInt(list[1]);
                                }
                            }
                        }
                        var barcodeData = textToBase64Barcode(obj+"",codeHeight,codeWidth);

                        return '<img src="'+barcodeData+'"/>';
                    } catch (e) {
                        console.log(e);
                        return obj;
                    }
                }
                return "";
            }
        }
        return obj;
    };
    //重设页容量
    this.rePageSize = function (e) {
        this.settings.pageSize = $(e.target).val();
        this.displayData()
    };
    //显示进度消息
    this.processingMessage = function (message) {
        if (this.settings.processing) {
            this.tBody.html("<tr><td colspan='" + this.cellCount + "'>" + message + "</td></tr>");
        }
    };
    //跳转页号
    this.gotoPage = function (pageIndex) {
        this.settings.currentPageIndex = pageIndex;
        this.displayData();
    };
    //追加数据
    this.appendData = function (dataItem) {
        if (this.result == null) {
            this.result = {
                data: [],
                recordsTotal: 0
            }
        }
        this.result.data.push(dataItem);
        this.result.recordsTotal++;
        return this;
    };
    //设置数据源
    this.setData = function (data) {
        if (data) {
            this.result = {
                data: data,
                recordsTotal: data.length
            };
        }
        else {
            this.result = null;
        }
        this.settings.currentPageIndex = 0;
    };
    //清空数据
    this.clearData = function () {
        this.result = null;
        this.settings.currentPageIndex = 0;
        return this;
    };
    //删除指定的数据或指定序号的数据
    this.removeData = function (data) {
        if (!this.result || this.result.recordsTotal <= 0) {
            return 0;
        }
        if (typeof (data) != "number") {
            var dataIndex = this.result.data.indexOf(data);
            this.result.data.splice(dataIndex, 1);
            this.result.recordsTotal--;
            return 1;
        }
        if (this.result.recordsTotal < dataIndex + 1) {
            return 0;
        }
        this.result.data.splice(data, 1);
        return 1;
    };


    if (this.settings.ajax) {//使用ajax数据源
        this.ajax = this.settings.ajax;
        this.ajax.host = this;
        //重新加载数据
        this.ajax.reload = function () {
            this.host.find("thead input:checkbox").each(function () {
                this.checked = $(this).attr("init_checked") == "true";
            });
            if (!this.host.settings.ajax.data) {
                this.host.settings.ajaxParam = null;
            } else {
                var ajaxParam = {};
                this.host.settings.ajax.data(ajaxParam);
                this.host.settings.ajaxParam = ajaxParam;
            }
            this.host.clearData();
            this.load();
        };
        //加载数据
        this.ajax.load = function () {
            var ajaxParam = this.host.settings.ajaxParam || {};
            if (this.host.settings.paging) {
                ajaxParam.pageSize = this.host.settings.pageSize;
                ajaxParam.pageIndex = this.host.settings.currentPageIndex;
            }
            this.host.processingMessage("拼命加载中...");
            $.ajax({
                host: this,
                url: this.url + "",
                dataType: "json",
                data: ajaxParam,
                type: "post",
                error: function (request, status, e) {
                    console.log(request);
                    console.log(status);
                    console.log(e);
                    if(request.responseText.indexOf("NotLogin")>-1||request.responseText.indexOf("center")>-1){
                        this.host.host.processingMessage("登录信息失效，请<a href='javascript:loginout();'>重新登录</a>");
                    }else{
                        this.host.host.processingMessage("加载数据异常，请检查权限及网络，然后刷新页面");
                        alert("加载数据异常，请检查权限及网络，然后刷新页面");
                    }
                },
                success: function (result) {
                    if(typeof (result.code) == "undefined") {
                        this.host.host.cacheResult(result);
                        this.host.host.displayData();
                    } else {
                        if (result.code == 1) {
                            this.host.host.cacheResult(result.content);
                            this.host.host.displayData();
                        } else if(result.message){
                            this.host.host.processingMessage(result.message);
                        }else {
                            this.host.host.processingMessage("查询出现异常，请重试！");
                        }
                    }
                },
                complete: function (request, status) {
                    request = null;
                }
            });
        };
        //缓存服务端数据
        this.cacheResult = function (result) {
            if (typeof (result.recordsTotal) == "undefined") {
                result.recordsTotal = result.total;
            }
            if (typeof (result.data) == "undefined") {
                result.data = result.rows;
            }
            if (!this.result || this.result == null) {
                this.result = {
                    recordsTotal: result.recordsTotal,
                    data: []
                }
            }
            if (result.recordsTotal != this.result.recordsTotal) {
                this.ajax.reload();
                return;
            }
            if (result.data) {
                if (this.settings.paging) {
                    for (var resultIndex in result.data) {
                        this.result.data[parseInt(resultIndex) + this.settings.currentPageIndex * this.settings.pageSize] = result.data[resultIndex];
                    }
                }
                else {
                    this.result.recordsTotal = result.data.length;
                    this.result.data = result.data;
                }
            }
            else {
                if (!this.settings.paging) {
                    this.result.recordsTotal = 0;
                }
            }
        };
        if (typeof (this.settings.lazyLoad) == "undefined" || !this.settings.lazyLoad) {
            //首次加载数据
            this.ajax.reload();
        }
    }
    else if (this.settings.data) {//使用现有数据源
        this.result = {
            data: this.settings.data,
            recordsTotal: this.settings.data.length
        };
        this.displayData();
    }
    return this;
};

//定义别名
$.fn.dataTableTemplate = $.fn.DataTableTemplate;
