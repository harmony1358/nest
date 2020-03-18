import LayoutInteractor from './LayoutInteractor.js';

class HandlerInteractor extends LayoutInteractor {

    constructor (context) {

        super(context);

        this._initialMouseDownEvent     =   null;
        this._isDraggingHandler         =   false;
        this._currentContainer          =   null;
        this._currentHandler            =   null;
        
        this._liveUpdate                =   false;
        this._hitTolerance              =   5;
        this._suggestHandlers           =   false;

    }

    get liveUpdate()                {return this._liveUpdate;}
    set liveUpdate(enabled)         {this._liveUpdate=enabled;}
    get hitTolerance()              {return this._hitTolerance;}
    set hitTolerance(tolerance)     {this._hitTolerance = tolerance;}
    get suggestHandlers()           {return this._suggestHandlers;}
    set suggestHandlers(suggest)    {this._suggestHandlers = suggest;}

    _testHandlers (e) {
        
        let handler = this._isOverHandler(e);
        
        if (handler!=null&&this._currentHandler==null) {

            this.interactionLayer.visible = true;
            //Change cursor
            switch (handler.property) {
                case 'width':   
                    this.interactionLayer.body.style.cursor = 'ew-resize'; break;
                case 'height':  this.interactionLayer.body.style.cursor = 'ns-resize'; break;
            }
            
            if (this.suggestHandlers) this.interactionLayer.drawHandler(handler);

        } else if (handler==null) {

            this.interactionLayer.visible = false;
            this.interactionLayer.body.style.cursor = 'default';
        }

        this._currentHandler = handler;
        
    }

    mouseMove (e) {

        if (this._isDraggingHandler) {
            
            let offset = {width: 0, height: 0};
            offset.width  = e.clientX - this._initialMouseDownEvent.clientX;
            offset.height = e.clientY - this._initialMouseDownEvent.clientY;

            //TODO: Snap to grid
            
            if (offset[this._currentHandler.property]<this._currentHandler.maxOffsetLeft) 
            offset[this._currentHandler.property] = this._currentHandler.maxOffsetLeft; else
            if (offset[this._currentHandler.property]>this._currentHandler.maxOffsetRight)
            offset[this._currentHandler.property] = this._currentHandler.maxOffsetRight;

            this._currentContainer.distributeOffsetToLeft(this._currentHandler.leftIndex, offset[this._currentHandler.property], this._currentHandler.property);
            this._currentContainer.distributeOffsetToRight(this._currentHandler.rightIndex, -offset[this._currentHandler.property], this._currentHandler.property);
            if (this.suggestHandlers||!this.liveUpdate) 
            this.interactionLayer.drawHandler(this._currentHandler, offset, this.hitTolerance);

            if(this.liveUpdate)
            this.layoutManager.doLayout();

            return true;
     
        } else this._testHandlers(e);

        return false;
    }

    mouseDown (e) {

        this._initialMouseDownEvent = e;
        this._currentHandler = this._isOverHandler(e);
        
        //Check if we are over the handler
        if (this._currentHandler==null) {
            this._isDraggingHandler = false;
            
            return true;
        }
        
        this._isDraggingHandler = true;
        this._onStartResizingHandler(this._currentHandler);

        return false;

    }

    mouseUp (e) {

        if (this._isDraggingHandler) {
            
            this.interactionLayer.hide();
            this.interactionLayer.clear();
            this.layoutManager.doLayout();

        }

        this._isDraggingHandler = false;
        this._initialMouseDownEvent = null;
        this._testHandlers(e);

        return this._isDraggingHandler;
    }

    _isOverHandler (e) {
        
        //FIXME: Find real container position, calc rect in LayoutManager
        let rect = this.context.layoutManager.rect;
        if (this.layoutManager.model!=null && rect!=null) return this.layoutManager.model.isOverHandler(e.clientX-rect.left, e.clientY-rect.top, this.hitTolerance);
                
    }

    _onStartResizingHandler (handler) {
        
        let left = this.layoutManager.findCellById(handler.left);
        let right = this.layoutManager.findCellById(handler.right);
        this._currentContainer = this.layoutManager.findCellById(handler.id);
        
        //Now we should set all cells in altered container with their actual sizes
        
        this._currentContainer.setActualToPreferred(handler.property);

        this._countExtremes (this._currentContainer, left, right, handler);



        this.layoutManager.doLayout();

        if (!this.liveUpdate) {
            this.interactionLayer.show();
            this.interactionLayer.drawHandler(handler, 0, this.hitTolerance);
        }
    }

    _countExtremes (of, left, right, handler) {
        
        let leftMinSize = 0; let leftMaxSize = 0; let leftCount = 0; let leftPrefSize = 0;
        let rightMinSize = 0; let rightMaxSize = 0; let rightCount = 0; let rightPrefSize = 0;
        let wasLeft = false;
        
        for (let i=0; i<of.children.length; i++) {
                let c = of.children[i];

                if (!wasLeft) {
                    leftMinSize+=c.measureMinSize[handler.property];
                    leftPrefSize+=c.preferredSize[handler.property];
                    leftMaxSize+=c.maxSize[handler.property];
                    leftCount++;
                } else {
                    rightMinSize+=c.measureMinSize[handler.property];
                    rightPrefSize+=c.preferredSize[handler.property];
                    rightMaxSize+=c.maxSize[handler.property];
                    rightCount++;
                }
            
                if (c.id == left.id) wasLeft = true;
        }

        //Add gaps
        let leftGapSize = (leftCount == 0) ? 0 : (leftCount-1) * this.context.layoutManager.gap;
        leftMinSize+=leftGapSize; leftPrefSize+=leftGapSize; leftMaxSize+=leftGapSize;
        let rightGapSize = (rightCount == 0) ? 0 : (rightCount-1) * this.context.layoutManager.gap;
        rightMinSize+=rightGapSize; rightPrefSize+=rightGapSize; rightMaxSize+=rightGapSize;
        
        let leftMin     = leftPrefSize - leftMinSize;
        let rightMin    = rightPrefSize - rightMinSize;
        let leftMax     = leftMaxSize - leftPrefSize;
        let rightMax    = rightMaxSize - rightPrefSize;
        
        handler['maxOffsetLeft'] = leftMin < rightMax ? -leftMin : -rightMax;
        handler['maxOffsetRight'] = rightMin < leftMax ? rightMin : leftMax;
    }

}

export default HandlerInteractor;
