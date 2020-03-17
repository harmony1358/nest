class LayoutManager {

    
    constructor (applicationContext) {

        if (applicationContext==null) throw 'No ApplicationContext!!!';

        this._context        = applicationContext;
        
        this._gap            = 2;

        this._width          = 0;
        this._height         = 0;

        this._model          = null;
        this._rect           = null;

    }
    
    get gap()                   {return this._gap;}
    set gap(size)               {this._gap = size;}
    get model()                 {return this._model;}
    set model(model)            {this._model = model;}
    get width()                 {return this._width;}
    get height()                {return this._height;}
    get rect()                  {return this._rect;}

    get context()       {return this._context;}

    static alterRect (parentRect, childRect) {
        
        childRect.x = childRect.x+parentRect.x;
        childRect.y = childRect.y+parentRect.y;

        return childRect;
    
    }

    static UUID () {

        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4() + '-' + new Date().getTime();

    }

    doLayout () {

        window.requestAnimationFrame(()=>{this._doLayout();});

    }

    _doLayout () {
        
        this._rect = this.context.container.getBoundingClientRect();

        this._width     = this.context.container.offsetWidth;
        this._height    = this.context.container.offsetHeight;
        
        if (this.model==null) return null;
        
        let rect = {x: 0, y: 0, width: this.width, height: this.height};

        this.model.measure(rect);
        this.model.distribute(rect);
        
    }

    getParentOf (id) {

        if (this.model==null) return null;
        return this.model.getParentOf(id);

    }

    findCellById (id) {

        if (this.model==null) return null;
        return this.model.findCellById(id);

    }

    getDropTargets (flavours) {
        
        let targets = [];
        if (this.model==null) return targets;
        this.model.getDropTargets(flavours, targets);
        return targets;
    }

}

export default LayoutManager;
