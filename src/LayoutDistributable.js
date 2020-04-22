import LayoutManager from './LayoutManager.js';

class LayoutDistributable {

    constructor (context) {

        this._context = context;

        this._id            = LayoutManager.UUID();

        this._children      = [];

        this._direction     = LayoutDistributable.DIRECTION_HORIZONTAL;
        this._minSize       = {width: 70, height: 70};
        this._maxSize       = {width: 3000, height: 3000};
        this._preferredSize = {width: 300, height: 300};
        
        this._savedPreferredSize = {width: 0, height: 0};

        this._measureMinSize = this._minSize;
        this._maxGrowSize   = 0;
        this._maxShrinkSize = 0;
        this._shrinkSize    = 0;

        this._growStyle     = LayoutDistributable.GROW_FLEX;
        this._rect          = {x:0, y:0, width: this._preferredSize.width, height: this.preferredSize.height};
        this._gaps          = [];

        this._isAttached    = false;

        this._body          = null;
    }

    static get DIRECTION_HORIZONTAL()   {return 'DIRECTION_HORIZONTAL';}
    static get DIRECTION_VERTICAL()     {return 'DIRECTION_VERTICAL';}
    static get DIRECTION_STACK()        {return 'DIRECTION_STACK';}
    
    static get GROW_FIXED()             {return 'GROW_FIXED';}
    static get GROW_FLEX()              {return 'GROW_FLEX';}

    get context()               {return this._context;}
    set context(context)        {this._context = context;}
    get id()                    {return this._id;}
    set id(id)                  {this._id = id; if (this._body!=null) this._body.setAttribute('id', id); }
    get direction()             {return this._direction;}
    set direction(direction)    {this._direction = direction;}
    get children()              {return this._children;}
    get isComponent()           {return false;}
    get minSize()               {return this._minSize;}
    set minSize(size)           {this._minSize = size;}
    get maxSize()               {return this._maxSize;}
    set maxSize(size)           {this._maxSize = size;}
    get preferredSize()         {return this._preferredSize;}
    set preferredSize(size)     {this._preferredSize = size;}
    get savedPreferredSize()    {return this._savedPreferredSize;}
    get measureMinSize()        {return this._measureMinSize;}
    get isAttached()            {return this._isAttached;}
    set isAttached(attached)    {this._isAttached = attached;}
    get rect()                  {return this._rect;}
    set rect(rect)              {this._rect = rect;}
    get gaps()                  {return this._gaps;}
    get body()                  {return this._body;}
    set body(body)              {this._body = body;}
    get growStyle()             {return this._growStyle;}
    set growStyle(style)        {this._growStyle = style;}
    get isDropTarget()          {return this._isDropTarget;}
    set isDropTarget(bool)      {this._isDropTarget = bool;}

    render ()                   {}

    applyRect(rect)             {

        const target = document.getElementById(this.id);
        if (target==null) return; 
        
        target.style.left = rect.x+'px';
        target.style.top = rect.y+'px';
        target.style.width = rect.width+'px';
        target.style.height = rect.height+'px';

        this.onLayout();
    }
    
    //FIXME: Attaching to DOM tree should be done somwhere else
    addChild (child, render) {
        
        this._children.push(child);
        if ((!child.isAttached)&&(child.isComponent)) {

            if (render) {
                child.render();
                this.context.container.appendChild(child.body);
            }
            child.isAttached = true;
            child.onAttach();
        }
        return this;

    }

    removeChild (child) {

        this.context.unregisterComponent(child);
        
        let index = -1;
        for (let i=0; i<this._children.length; i++) {
            if (this._children[i].id==child.id) {
                index = i;
                break;
            }
        }

        this._children.splice (index, 1);
        
        this.onLayout();
        child.destroy();

    }

    removeChildById (id) {

        let child = this.findCellById(id);
        this.removeChild(child);
    }

    

    getParentOf (id) {
        
        for (let i=0; i<this.children.length; i++) {
            if (this.children[i].id==id) return this;
            let ret = this.children[i].getParentOf(id);
            if (ret!=null) return ret;
        }

        return null;
    }

    getParent () {

        return this.context.layoutManager.getParentOf(this.id);

    }

    detachFromModel () {

        let parent = this.getParent();
        
        if (parent==null) return;
        
        let myIndex = parent.children.indexOf(this);
        parent.children.splice(myIndex, 1);

    }

    findCellById (id) {

        if (this.id == id ) return this;

        for (let i in this.children) {
            let child = this.children[i].findCellById(id);
            if (child!=null) return child;
        }

        return null;
    }

    measure (rect) {

        this.getRecursiveMinimals();

        rect.width = rect.width < this.measureMinSize.width ? this.measureMinSize.width : rect.width;
        rect.height = rect.height < this.measureMinSize.height ? this.measureMinSize.height : rect.height;

        return rect;
    }

    getRecursiveMinimals () {
        
        let childrenMinWidth = 0; let childrenMinHeight = 0;

        this.children.forEach((c) => {

            let childWidth  = c.getRecursiveMinimals().width;
            let childHeight = c.getRecursiveMinimals().height;

            if (this.direction==LayoutDistributable.DIRECTION_HORIZONTAL) {

                childrenMinHeight = childrenMinHeight<childHeight ? childHeight : childrenMinHeight;
                childrenMinWidth+=childWidth;

            } else {

                childrenMinHeight+=childHeight;
                childrenMinWidth = childrenMinWidth<childWidth ? childWidth : childrenMinWidth;

            }
            
        });

        let gapCount = this.children.length > 0 ? this.children.length - 1 : 0;

        if (this.direction==LayoutDistributable.DIRECTION_HORIZONTAL) {
            
            childrenMinWidth+=this.context.layoutManager.gap*gapCount;

        } else {

            childrenMinHeight+=this.context.layoutManager.gap*gapCount;

        }

        let extremes = {};
        extremes['width']    = this.minSize.width<childrenMinWidth ? childrenMinWidth : this.minSize.width;
        extremes['height']   = this.minSize.height<childrenMinHeight ? childrenMinHeight : this.minSize.height;

        this._measureMinSize = extremes;

        return extremes;

    }

    distribute (rect)   {

        //FIXME: Case: two fixed cells in column, one 70,70,70 second 70,200,200 (min, max, pref)
        //Won't shrink even though there is room in second cell

        this.rect = rect;
        this.applyRect(rect); 

        switch (this.direction) {

            case LayoutDistributable.DIRECTION_HORIZONTAL:   this._distributeProperty(rect, 'width'); break;
            case LayoutDistributable.DIRECTION_VERTICAL:     this._distributeProperty(rect, 'height'); break;
            case LayoutDistributable.DIRECTION_STACK:        this._distributeStack(rect); break;

        }

    }

    distributeOffsetToLeft (index, offset, property) {

        let spaceLeft = offset;

        for (let i=index; i>-1; i--) {
    
            spaceLeft = this._distributeOffset(i, spaceLeft, property);
            if (spaceLeft==0) break;
        }

    }

    distributeOffsetToRight (index, offset, property) {
        
        let spaceLeft = offset;
        
        for (let i=index; i<this.children.length; i++) {

            spaceLeft = this._distributeOffset(i, spaceLeft, property);
            if (spaceLeft==0) break;
        }

    }

    _distributeOffset (i, spaceLeft, property) {

        let maxOffset = 0;
        let distOffset = 0;

        switch (spaceLeft<0) {
            
            case true:

            maxOffset = this.children[i].savedPreferredSize[property] - this.children[i].minSize[property];
            distOffset =  maxOffset + spaceLeft > 0 ? spaceLeft : -maxOffset;

            break;

            case false:

            maxOffset = this.children[i].maxSize[property] - this.children[i].savedPreferredSize[property];
            distOffset =  maxOffset - spaceLeft > 0 ? spaceLeft : maxOffset;

            break;

        }

        this.children[i].preferredSize[property]=this.children[i].savedPreferredSize[property]+distOffset;
        spaceLeft-=distOffset;

        return spaceLeft;
    }

    setActualToPreferred (property) {

        this.children.forEach((c) => { c.preferredSize[property] = c.rect[property]; });
        this.save();

    }

    save () {

        this._savedPreferredSize = Object.assign({}, this.preferredSize);
        this.children.forEach((c)=>{c.save();});

    }

    onAttach () {}
    onLayout () {}

    destroy() {
        
        this.children.forEach((c)=>{c.destroy();});
        
        this.context = null;
        
    }

    isOverHandler (x, y, tolerance)   {
        
        for (let i in this.gaps) {
            if (this._isInGap(x, y, this.gaps[i], tolerance)) {
                return this.gaps[i];
            }
        }

        for (let i in this.children) {
            let gap = this.children[i].isOverHandler(x, y, tolerance);
            if (gap!=null) return gap;
        }

        return null;

    }

    _isInGap (x, y, gap, tolerance) {

        switch (gap.property) {

            case 'width':
        
            if (x>=gap.x-tolerance&&x<=gap.x+gap.width+tolerance&&y>=gap.y&&y<=gap.y+gap.height) return true;
            break;

            case 'height':

            if (x>=gap.x&&x<=gap.x+gap.width&&y>=gap.y-tolerance&&y<=gap.y+gap.height+tolerance) return true;
            break;

        }

        return null;

    }

    _canGrow (cell, value, property, overrideGrowStyle) {
        
        if (!overrideGrowStyle&&cell.growStyle==LayoutDistributable.GROW_FIXED) return 0;
        return cell.maxSize[property] - value > 0 ? cell.maxSize[property] - value : 0;

    }

    _canShrink (cell, value, property, overrideGrowStyle) {

        if (!overrideGrowStyle&&cell.growStyle==LayoutDistributable.GROW_FIXED) return 0;
        return value - cell.measureMinSize[property] > 0 ? value - cell.measureMinSize[property] : 0;

    }

    _measure (space, property, overrideGrowStyle, values) {

        //Lets create temporary array of widths
        let sizes = new Array(this.children.length);

        let growSize        = 0;
        let shrinkSize      = 0;
        let preferredSize   = 0;

        for (let i=0; i<this.children.length; i++) {
        
            let _preferredSize      = this.children[i].preferredSize[property];

            let _value = (values==null) ? _preferredSize : values[i].value;
            
            let _growSize           = this._canGrow(this.children[i], _value, property, overrideGrowStyle);
            let _shrinkSize         = this._canShrink(this.children[i], _value, property, overrideGrowStyle);

            sizes[i] = {value: _value, grow: _growSize, shrink: _shrinkSize};

            preferredSize+=_preferredSize; shrinkSize+=_shrinkSize; growSize+=_growSize;
        }

        let spareSpace = space - preferredSize;

        return {sizes: sizes, growSize: growSize, shrinkSize: shrinkSize, preferredSize: preferredSize, spareSpace: spareSpace};
    }

    _fitGrow (measure, property) {

        //if spareSpace>growSize cut it down
        if (measure.spareSpace>measure.growSize) measure.spareSpace = measure.growSize;
                
        let distributedSpace = 0;

        for (let i=0; i<this.children.length; i++) {

            //calculate share
            let share   = measure.sizes[i].grow/measure.growSize;

            //let grow    = Math.floor(share*measure.spareSpace);
            let grow    = isNaN(share) ? 0 : share*measure.spareSpace;

            measure.sizes[i].value+=grow;
            distributedSpace+=grow;

        }

        return distributedSpace;
    }

    _fitShrink (measure, property) {

        let localSpareSpace = measure.spareSpace;
        //if shrinkSize+spareSpace>=0 cut down spareSpace
        if (localSpareSpace<0&&measure.shrinkSize+localSpareSpace<0) localSpareSpace = -measure.shrinkSize;
        
        let distributedSpace = 0;

        for (let i=0; i<this.children.length; i++) {
            
            //calculate share
            let share   = measure.sizes[i].shrink/measure.shrinkSize;

            //let shrink    = Math.floor(share*localSpareSpace);
            let shrink =  isNaN(share) ? 0 : share*localSpareSpace;

            measure.sizes[i].value+=shrink;
            distributedSpace+=shrink;

        }

        return distributedSpace;

    }

    _applySizes (rect, measure, property) {

        //Apply array to rect
        let left = 0; let top = 0;
        this._gaps = [];

        for (let i=0; i<this.children.length; i++) {

            let childRect = null;

            if (property=='width') {
                
                childRect = {x: left, y:0, width: measure.sizes[i].value, height: rect.height};
                left+=measure.sizes[i].value;

                if (i<this.children.length-1) {
                    this._gaps.push(LayoutManager.alterRect(rect, 
                        {x: left, y:0, width: this.context.layoutManager.gap, 
                            height: rect.height, property: property, id: this.id, index: i,
                            left: this.children[i].id, right: this.children[i+1].id, leftIndex: i, rightIndex: i+1
                        }));
                }
                
                left+=this.context.layoutManager.gap;
            } else {

                childRect = {x: 0, y: top, width: rect.width, height: measure.sizes[i].value};
                top+=measure.sizes[i].value;
                
                if (i<this.children.length-1) {
                    this._gaps.push(LayoutManager.alterRect(rect, 
                        {x: 0, y: top, width: rect.width, height: this.context.layoutManager.gap, 
                            property: property, id: this.id, index: i,
                            left: this.children[i].id, right: this.children[i+1].id, leftIndex: i, rightIndex: i+1
                        }));
                }
                
                top+=this.context.layoutManager.gap;
            
            }
            

            this.children[i].distribute(LayoutManager.alterRect(rect, childRect));

        }

    }

    _distributeProperty (rect, property) {

        //Is there something to do?
        if (this.children.length==0) return;

        //How many gaps do we have?
        let gapCount = this.children.length-1;

        //How much space do we have?
        let space = rect[property] - gapCount*this.context.layoutManager.gap;

        //Do the measure
        let measure = this._measure(space, property, false, null);

        //We have some spare space - lets try to distribute it
        if (measure.spareSpace>0) {

            this._fitGrow(measure, property);
            

        } else 
        if (measure.spareSpace<0){
        
            let distributedSpace = this._fitShrink(measure, property);
            let spaceLeft = measure.spareSpace-distributedSpace;

            if (spaceLeft<0) {

                
                //We have to dive deeper and override grow styles
                let reflowSpace = space-distributedSpace;
                let reflowMeasure = this._measure(reflowSpace, property, true, measure.sizes);

                distributedSpace = this._fitShrink(reflowMeasure, property);
                measure = reflowMeasure;
            } 

        } 

        this._applySizes(rect, measure, property);

    }

    _distributeStack (rect) {
        //TODO: Distribute stack
    }


    reclaimBody() {
        this.body = document.getElementById(this.id);
    }
}

export default LayoutDistributable;
