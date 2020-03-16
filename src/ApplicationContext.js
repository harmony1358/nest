import LayoutManager from './LayoutManager.js';
import InteractionManager from './InteractionManager.js';
import Style from '../res/style.css';

class ApplicationContext {

    constructor() {

        this._components            = [];
        this._layoutManager         = null;
        this._interactionManager    = null;
        this._containerId           = null;
        this._container             = null;
    }

    get components()            {return this._components;}
    get layoutManager()         {return this._layoutManager;}
    get interactionManager()    {return this._interactionManager;}
    get containerId()           {return this._containerId;}
    get container()             {return this._container;}

    //TODO: Create separate Stage class
    createStage () {
        
        this._components.forEach((c)=>{ let node = c.render(); this._container.appendChild(node); });
        
    }

    init (containerId) {

        this._containerId = containerId;
        this._container = document.getElementById(this.containerId);

        if (this._container==null) throw 'Cointainer not found in document DOM';

        this._container.classList.add(Style.stage);
        this._layoutManager = new LayoutManager(this);
        this._interactionManager = new InteractionManager(this);

        this.createStage();
        
        this.layoutManager.doLayout();
        this.interactionManager.init();
      
    }
}

export default ApplicationContext;