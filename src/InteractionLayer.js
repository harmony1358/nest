import Style from '../res/style.css';

class InteractionLayer {

    constructor (context) {

        this._context = context;
        this._body = null;
        this._ctx = null;
        this._rect = {width: 0, height: 0};
        this._visible = false;
        this._suggestColor = 'rgb(232, 0, 82)';
    }

    get context()       {return this._context;}
    get body()          {return this._body;}
    get ctx()           {return this._ctx;}
    get rect()          {return this._rect;}
    get visible()       {return this._visible;}
    get suggestColor()  {return this._suggestColor;}
    set suggestColor(color) {this._suggestColor = color;}

    set visible(visible) {

        if (visible) this.show(); else this.hide();

    }

    init () {

        this._body = document.createElement('CANVAS');
        this.body.classList.add(Style.interactionLayer);
        this.body.style.display = 'none';
        this._ctx = this.body.getContext('2d');

        if (this.context.container==null) throw 'InteractionLayer must be initilized after the stage is created!';

        this.context.container.parentNode.insertBefore(this.body, this.context.container.parentNode.nextSibling);
    }

    update () {

        this._checkIfInitialized();

        this._rect = this.context.container.getBoundingClientRect();
        this.body.setAttribute('width', this.rect.width+'px');
        this.body.setAttribute('height', this.rect.height+'px');

    }

    clear () {

        this._checkIfInitialized();
        this.ctx.clearRect(0, 0, this.rect.width, this.rect.height);

    }

    show() {

        if (this.visible) return;
        this._checkIfInitialized();
        this.body.style.display = 'block';
        
        this._visible = true;

    }

    hide () {

        if (!this.visible) return;
        this._checkIfInitialized();
        this.body.style.display = 'none';
        this.clear();
        
        this._visible = false;
    }

    drawHandler (handler, offset) {

        this._checkIfInitialized();

        window.requestAnimationFrame(()=>{
        
            this.clear();
            this.ctx.fillStyle = this.suggestColor;

            if (offset) {
                
                switch (handler.property) {
                    case 'width': 
                    
                    this.ctx.fillRect (handler.x+offset.width, handler.y, handler.width, handler.height); 
                    break;
                    
                    case 'height': 
                    
                    this.ctx.fillRect (handler.x, handler.y+offset.height, handler.width, handler.height);
                    break;

                }
                

            } else {

                this.ctx.fillRect (handler.x, handler.y, handler.width, handler.height);

            }
            
        
        });        

    }

    _checkIfInitialized () {
        if (this.body==null) throw 'InteractionLayer not initialized!';
    }

}

export default InteractionLayer;