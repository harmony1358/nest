class LayoutInteractor {

    constructor (context) {
        this._context = context;
    }
    
    get context() {return this._context;}
    get interactionLayer() {return this.context.interactionManager.interactionLayer;}
    get interactionManager() {return this.context.interactionManager;}
    get layoutManager() {return this.context.layoutManager;}

    mouseDown (e) {return false;}

    mouseUp (e) {return false;}

    mouseMove (e) {return false;}

    mouseLeave (e) {return false;}
    
    mouseExit (e) {return false;}

}

export default LayoutInteractor;