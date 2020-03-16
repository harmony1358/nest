import InteractionLayer from './InteractionLayer.js';
import HandlerInteractor from './HandlerInteractor.js';
import DragInteractor from './DragInteractor.js';

class InteractionManager {

    constructor (context) {

        this._context           =   context;
        this._interactionLayer  =   null;
        this._handlerInteractor =   null;
        this._dragInteractor    =   null;
        this._currentInteractor = null;
    }

    get context()                   {return this._context;}
    get interactionLayer()          {return this._interactionLayer;}
    get handlerInteractor()         {return this._handlerInteractor;}
    get dragInteractor()            {return this._dragInteractor;}
    get currentInteractor()         {return this._currentInteractor;}

    init () {

        //Add window resize listener and do layout each time it resizes
        window.addEventListener('resize', ()=>{ 
            
            this.context.layoutManager.doLayout(); 
            if (this.interactionLayer!=null) this.interactionLayer.update();

        }, {passive: true});

        if (this.context.container==null) throw 'Layout interactor must be initialized after the stage is created...';

        //Add handler related listeners
        document.addEventListener('mousemove', (e)=>{this._containerMouseMove(e);}, {passive: true});
        document.addEventListener('mousedown', (e)=>{this._containerMouseDown(e);}, {passive: true});
        document.addEventListener('mouseup', (e)=>{this._containerMouseUp(e);}, {passive: true});
        document.addEventListener('mouseleave', (e)=>{this._containerMouseUp(e);}, {passive: true});
        document.addEventListener('mouseexit', (e)=>{this._containerMouseUp(e);}, {passive: true});

        this._interactionLayer = new InteractionLayer(this.context);
        this.interactionLayer.init();
        this.interactionLayer.update();

        this._handlerInteractor = new HandlerInteractor(this.context);
        this._dragInteractor = new DragInteractor(this.context);

        this._currentInteractor = this._handlerInteractor;
    }

    _containerMouseMove (e) {
       
        //this.handlerInteractor.mouseMove(e);
        this.currentInteractor.mouseMove(e);

    }

    _containerMouseDown (e) {
        
        //this.handlerInteractor.mouseDown(e);
        this.currentInteractor.mouseDown(e);

    }

    _containerMouseUp (e) {

        //this.handlerInteractor.mouseUp(e);
        this.currentInteractor.mouseUp(e);

    }

    setInteractor(interactor) {
        this._currentInteractor = interactor;
    }

    resetInteractor () {
        this._currentInteractor = this.handlerInteractor;
    }




}

export default InteractionManager;
