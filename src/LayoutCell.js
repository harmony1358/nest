import LayoutDistributable from './LayoutDistributable.js';
class LayoutCell extends LayoutDistributable {

    constructor(context) {

        super(context);

        this._name              = 'Unnamed';

        this._acceptsFlavours   = ['LayoutComponent'];
        this._isDropTarget      = true;

    }

    get name()                  {return this._name;}
    set name(name)              {this._name = name;}

    get acceptsFlavours()       {return this._acceptsFlavours;}
  
    //Drop Target Interface
    getDropTargets (flavours, targets)   {

        if (this.isDropTarget) {

            for (let i=0; i<flavours.length; i++) {
                if (this.acceptsFlavours.indexOf(flavours[i])>-1) {

                    this._createDropTargets(flavours, targets);

                    break;
                }
            }

        }

        this.children.forEach((c)=>{

            c.getDropTargets(flavours, targets);

        });

    }

    _createDropTargets (flavours, targets) {

        for (let i=0; i<this.children.length; i++) {

            targets.push({
                flavours: this.acceptsFlavours,
                rect: this.children[i].rect,
                anchor: {x: this.children[i].rect.x+this.children[i].rect.width/2, y: this.children[i].rect.y+this.children[i].rect.height/2},
                target: this,
                before: this.children[i].id,
                bname: this.children[i].name
            });

        }

    }

    onDrop (transferrableObject, target) {

        //Cannot drop on self
        if (transferrableObject.id==target.before) return;
        
        this.setActualToPreferred();

        if (target.before) {

            let index = -1;
            for (let i=0; i<this.children.length; i++) {
                if (this.children[i].id==target.before) {
                    index = i;
                    break;
                }
            }

            this.children.splice (index, 0, transferrableObject);
            this.context.layoutManager.doLayout();

        }


    }

}

export default LayoutCell;