import UI from './../core/UI';
const $ = require("jquery");

/**
 *  options中的参数
 *      title => 要显示的标题
 *      hook  => dom的钩子
 *      gridNum => 一行的数量
 *      map => 要添加的子元素
 *          {
 *              icon => iconfont编码，
 *              text => 子元素模块名称,
 *              val => 对应的下发的值
 *          }
 *     
 */
class GridItem extends UI {

    constructor(options) {
        super(options);
    }

    create() {
        let html = "";
        let _map = this.options.map;
        let _gridNum = this.options.gridNum;
        let _hook = this.options.hook;
        let _mapdis = this._unclickMap;


        if (this.options.value) {
            this._value = this.options.value;
        }

        if (this.options.title) {
            html += `<div class="wrap_title">` + this.options.title + `</div>`;
        }

        html += `<div class="ui_wrap flex-left">`;
        for (let i in _map) {
            html +=
                `<div class="unit-1-${_gridNum} site-box text-center list-item 
                                    ${ _map[i].value === this._value ? 'on' : '' }
                                    ${ _mapdis.indexOf(_map[i]) === -1 ? '' : 'disabled'}            
                            " 
                                                data-mode-index = "${_map[i].value}"
                                                value = "${_map[i].value}"
                                                >
                <span class="iconfont">${_map[i].icon}</span>
                <span class="mode_name">${_map[i].text}</span>
            </div>`;
            

        }
        $(_hook).append(html);
    }

    initEventFn() {
        let selector = this.selectorDom();
        $(document).on("click", selector, (e) => {
            this.fn(e);
        });
    }

    fn(e){
        let _this = $(e.currentTarget);
        let index = _this.data('mode-index');
        let item = this.options.map[Number(index)];
        let _map = this._unclickMap;
        
        if(_map.indexOf(index.toString())  === -1){
            this.selected(index, _this);
            //before
            if (this.options.beforeTap) {
                this.options.beforeTap();
            }
            //tap
            if (this.options.onTap) {
                this.options.onTap(item, index, _this);
            }
            //after
            if (this.options.afterTap) {
                this.options.afterTap();
            }
        }
    }
    selectorDom() {
        return this.options.hook + " .list-item";
    }

    selected(index, dom) {
        let selector = this.selectorDom();
        $(selector).removeClass("on");
        if (dom) {
            $(dom).addClass("on");
        } else {
            let selectedItem = `${this.selectorDom()}[value=${index}]`;
            $(selectedItem).addClass("on");
        }
    }

    get value() {
        return this._value;
    }

    set value(val) {
        this.setValueFn(val);
    }

    setValueFn(val) {
        let _map = this.options.map;
        let check = this.checkVal(val, _map);
        if (check) {
            for (let i in _map) {
                if (_map[i].value === val) {
                    this._value = val;
                    this.selected(i);
                }
            }
        } else {
            throw "error";
        }
    }
    checkVal(val, _map) {
        let a = false;
        for (let i of _map) {
            if (i["value"] === val) {
                a = true;
                break;
            }
        }
        return a;
    }

    //has Bug
    setItemDisabled(map) {
        super.setItemDisabled(map);
        //this._unclickMap = map.index;
    }

    disabled(){
        super.disabled();
        let selector = this.selectorDom();
        $(selector).addClass("disabled");
        $(document).off("click",selector);
    }

    enable(){
        super.enable();
        let selector = this.selectorDom();
        $(selector).removeClass("disabled");
        $(document).on("click",selector,(e)=>{
            this.fn(e);
        });
    }
};

UI.registerComponent('GridItem', GridItem);

export default GridItem;