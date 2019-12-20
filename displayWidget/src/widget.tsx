// Copyright (c) Doris Lee
// Distributed under the terms of the Modified BSD License.

import {
  DOMWidgetModel, DOMWidgetView, ISerializers
} from '@jupyter-widgets/base';

import {
  MODULE_NAME, MODULE_VERSION
} from './version';

// Import the CSS
import '../css/widget.css'

import * as React from "react";
import * as ReactDOM from "react-dom";

export class ExampleModel extends DOMWidgetModel {
  defaults() {
    return {...super.defaults(),
      _model_name: ExampleModel.model_name,
      _model_module: ExampleModel.model_module,
      _model_module_version: ExampleModel.model_module_version,
      _view_name: ExampleModel.view_name,
      _view_module: ExampleModel.view_module,
      value : 'Hello World'
    };
  }

  static serializers: ISerializers = {
      ...DOMWidgetModel.serializers,
      // Add any extra serializers here
    }

  static model_name = 'ExampleModel';
  static model_module = MODULE_NAME;
  static model_module_version = MODULE_VERSION;
  static view_name = 'ExampleView';   // Set to null if no view
  static view_module = MODULE_NAME;   // Set to null if no view
  
}

export class ExampleView extends DOMWidgetView {
  initialize(){    
    let view = this;
    // this.options = {iopub_callbacks : true};
    class Hello extends React.Component<ExampleView,{
      value:any
    }> {
      constructor(props:any){
        super(props);
        console.log("view:",props);
        this.state = {
          value: props.model.get("value")
        }
        // This binding is necessary to make `this` work in the callback
        this.clickHandler = this.clickHandler.bind(this);
        
      }
  
      onChange(model:any){// called when the variable is changed in the view.model (trigger via componentDidMount)
        this.setState(model.changed);
        // view.touch();
      }
      componentDidMount(){ //triggered when component is mounted (i.e., when widget first rendered)
        view.listenTo(view.model,"change",this.onChange.bind(this));
        // props.listenTo(props.model,"change",this.onChange.bind(this));
      }
      componentDidUpdate(){ //Triggered after component is updated
        console.log(view.model.get("value"));
        view.model.save_changes(); // instead of touch (which leads to callback issues), we have to use save_changes
      }
  
      render(){
        console.log(this.state.value);
        // return React.createElement("h1",{},'Hello ${this.state.value}');
        // return React.createElement("h1",{},'Hello '+this.state.value);
        return <div><h1>Hello {this.state.value}</h1><button onClick={this.clickHandler}>Submit</button></div>
      }
      clickHandler(){
        console.log("view value:",view.model.get("value"))
        console.log("clicked")
        // this.state = {value:"set to something else"}
        this.setState(state => ({
          value: "something else"
        }));
        // console.log(view) // VM1302:1 Uncaught ReferenceError: view is not defined
        view.model.set('value',"Hello New");//this.state.value
        // view.touch();
        // console.log("after view value:",view.model.get("value"));
        // view.model.set('value2',"val2test");//this.state.value
      }
    }
    const $app = document.createElement("div");
    const App = React.createElement(Hello,view);
    ReactDOM.render(App,$app);
    view.el.append($app);
  }
}