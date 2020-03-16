import LayoutComponent from './LayoutComponent.js';
import Style from '../res/example.css';

class ExampleComponent extends LayoutComponent {

    constructor(context) {

        super(context);
        this._innerDiv = null;

    }

    render() {
        
        super.render();
        
        this._innerDiv = document.createElement('DIV');
        this._innerDiv.classList.add(Style.example_component);
        this._innerDiv.textContent = this.name;

        this.body.appendChild(this._innerDiv);

        return this.body;
    }

    set name(name)  {

        super.name=name; 
        if (this._innerDiv!=null) this._innerDiv.textContent = name;
    
    }

}

export default ExampleComponent;