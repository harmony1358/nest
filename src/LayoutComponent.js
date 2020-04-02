import LayoutCell from './LayoutCell.js';
import Style from '../res/style.css';
import DragPainter from './DragPainter.js';
class LayoutComponent extends LayoutCell {

    constructor (context) {

        super(context);

        this._type = 'LayoutComponent';

        this._layoutConstraint = null;
        this._body = null;
        this._flavours = ['LayoutComponent'];   
        
        context.components.push(this);
    }

    get type()                              {return this._type;}
    get isComponent()                       {return true;}
    get flavours()                          {return this._flavours;}
    get isDropTarget()                      {return false;}
    get dragPainter()                       {return DragPainter;}

    render () {

        if (this._body==null) {
            var componentDiv    =   document.createElement('DIV');
            componentDiv.setAttribute('class', Style.component);
            componentDiv.setAttribute('id', this.id);
            this._body = componentDiv;
        }
        return this._body;

    }

    //TRANSFERRABLE OBJECT INTERFACE

    onDragTransferrableStarted() {
        console.log('onDragTransferrableStarted');
    }
    
    onDragTransferrable() {
        console.log('onDragTransferrable');
    }

    onBeforeDrop (target) {
        console.log('onBeforeDropTransferrable');
        this.detachFromModel();
    }
}

export default LayoutComponent;